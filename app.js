#!/usr/bin/env node

var http = require('http');
var https = require('https');
var util = require("util");

var express = require("express");
let initWebRoutes = require("./routes/web");
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let connectFlash = require("connect-flash");
var passport = require('passport');
//var crypto = require("crypto");
//try {
//    bcrypt = require('bcrypt');
//} catch (e) {
//    bcrypt = require('bcryptjs');
//}

var path = require("path");
var fs = require("fs-extra");


var RED = require("./editor-api/red.js");

var server;
var app = express();
// View engine setup
app.set("view engine", "ejs");
//Set public folder
app.use("/assets", express.static("public"));

var settingsFile;
var flowFile;

process.env.NODE_RED_HOME = process.env.NODE_RED_HOME || __dirname;


if (fs.existsSync(path.join(process.env.NODE_RED_HOME, ".config.json"))) {
    // NODE_RED_HOME contains user data - use its settings.js
    settingsFile = path.join(process.env.NODE_RED_HOME, "settings.js");
} else if (process.env.HOMEPATH && fs.existsSync(path.join(process.env.HOMEPATH, ".node-red", ".config.json"))) {
    // Consider compatibility for older versions
    settingsFile = path.join(process.env.HOMEPATH, ".node-red", "settings.js");
}

try {

    var settings = require(settingsFile);
    settings.settingsFile = settingsFile;

} catch (err) {
    console.log("Error loading settings file: " + settingsFile)
    if (err.code == 'MODULE_NOT_FOUND') {
        if (err.toString().indexOf(settingsFile) === -1) {
            console.log(err.toString());
        }
    } else {
        console.log(err);
    }
    process.exit();
}

if (process.env.NODE_RED_ENABLE_PROJECTS) {
    settings.editorTheme = settings.editorTheme || {};
    settings.editorTheme.projects = settings.editorTheme.projects || {};
    settings.editorTheme.projects.enabled = !/^false$/i.test(process.env.NODE_RED_ENABLE_PROJECTS);
}

// Delay logging of (translated) messages until the RED object has been initialized
var delayedLogItems = [];

var startupHttps = settings.https;
if (typeof startupHttps === "function") {
    // Get the result of the function, because createServer doesn't accept functions as input
    startupHttps = startupHttps();
}
var httpsPromise = Promise.resolve(startupHttps);

httpsPromise.then(function (startupHttps) {
    if (startupHttps) {
        server = https.createServer(startupHttps, function (req, res) {
            app(req, res);
        });

        if (settings.httpsRefreshInterval) {
            var httpsRefreshInterval = parseFloat(settings.httpsRefreshInterval) || 12;
            if (httpsRefreshInterval > 596) {
                // Max value based on (2^31-1)ms - the max that setInterval can accept
                httpsRefreshInterval = 596;
            }
            // Check whether setSecureContext is available (Node.js 11+)
            if (server.setSecureContext) {
                // Check whether `http` is a callable function
                if (typeof settings.https === "function") {
                    delayedLogItems.push({
                        type: "info",
                        id: "server.https.refresh-interval",
                        params: {interval: httpsRefreshInterval}
                    });
                    setInterval(function () {
                        try {
                            // Get the result of the function, because createServer doesn't accept functions as input
                            Promise.resolve(settings.https()).then(function (refreshedHttps) {
                                if (refreshedHttps) {
                                    // Only update the credentials in the server when key or cert has changed
                                    if (!server.key || !server.cert || !server.key.equals(refreshedHttps.key) || !server.cert.equals(refreshedHttps.cert)) {
                                        server.setSecureContext(refreshedHttps);
                                        RED.log.info(RED.log._("server.https.settings-refreshed"));
                                    }
                                }
                            }).catch(function (err) {
                                RED.log.error(RED.log._("server.https.refresh-failed", {message: err}));
                            });
                        } catch (err) {
                            RED.log.error(RED.log._("server.https.refresh-failed", {message: err}));
                        }
                    }, httpsRefreshInterval * 60 * 60 * 1000);
                } else {
                    delayedLogItems.push({type: "warn", id: "server.https.function-required"});
                }
            } else {
                delayedLogItems.push({type: "warn", id: "server.https.nodejs-version"});
            }
        }
    } else {
        server = http.createServer(function (req, res) {
            app(req, res);
        });
    }
    server.setMaxListeners(0);

    function formatRoot(root) {
        if (root[0] != "/") {
            root = "/" + root;
        }
        if (root.slice(-1) != "/") {
            root = root + "/";
        }
        return root;
    }

    if (settings.httpRoot === false) {
        settings.httpAdminRoot = false;
        settings.httpNodeRoot = false;
    } else {
        settings.httpRoot = settings.httpRoot || "/";
        settings.disableEditor = settings.disableEditor || false;
    }

    if (settings.httpAdminRoot !== false) {
        settings.httpAdminRoot = formatRoot(settings.httpAdminRoot || settings.httpRoot || "/");
        settings.httpAdminAuth = settings.httpAdminAuth || settings.httpAuth;
    } else {
        settings.disableEditor = true;
    }

    if (settings.httpNodeRoot !== false) {
        settings.httpNodeRoot = formatRoot(settings.httpNodeRoot || settings.httpRoot || "/");
        settings.httpNodeAuth = settings.httpNodeAuth || settings.httpAuth;
    }

    if (settings.uiPort === undefined) {
        settings.uiPort = 1880;
    }

    settings.uiHost = settings.uiHost || "0.0.0.0";

    if (flowFile) {
        settings.flowFile = flowFile;
    }

    try {
        RED.init(server, settings);
    } catch (err) {
        if (err.code == "unsupported_version") {
            console.log("Unsupported version of Node.js:", process.version);
            console.log("Node-RED requires Node.js v8.9.0 or later");
        } else {
            console.log("Failed to start server:");
            if (err.stack) {
                console.log(err.stack);
            } else {
                console.log(err);
            }
        }
        process.exit(1);
    }

    function basicAuthMiddleware(user, pass) {
        var basicAuth = require('basic-auth');
        var checkPassword;
        var localCachedPassword;
        if (pass.length == "32") {
            // Assume its a legacy md5 password
            checkPassword = function (p) {
                return crypto.createHash('md5').update(p, 'utf8').digest('hex') === pass;
            }
        } else {
            checkPassword = function (p) {
                return bcrypt.compareSync(p, pass);
            }
        }

        var checkPasswordAndCache = function (p) {
            // For BasicAuth routes we know the password cannot change without
            // a restart of Node-RED. This means we can cache the provided crypted
            // version to save recalculating each time.
            if (localCachedPassword === p) {
                return true;
            }
            var result = checkPassword(p);
            if (result) {
                localCachedPassword = p;
            }
            return result;
        }

        return function (req, res, next) {
            if (req.method === 'OPTIONS') {
                return next();
            }
            var requestUser = basicAuth(req);
            if (!requestUser || requestUser.name !== user || !checkPasswordAndCache(requestUser.pass)) {
                res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
                return res.sendStatus(401);
            }
            next();
        }
    }


// Passport Config
//require('./config/passport')(passport);
// Passport Middleware
//app.use(passport.initialize());
//app.use(passport.session());


// Parser middleware
//    app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
//    app.use(bodyParser.json())

    //use cookie parser
    app.use(cookieParser('secret'));

// Express Session middleware
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 // 86400000 1 day
        }
    }));
// Enable body parser post data
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));

//Enable flash message
    app.use(connectFlash());

//Config passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

// init all web routes
    initWebRoutes(app);


// Set routes
//var pages = require("./routes/pages.js")
//var adminPages = require("./routes/admin_pages.js");
//var users = require('./routes/users.js');
//var visitors = require('./routes/visitor.js');

//app.use("/admin/pages", adminPages);
//app.use("/admin", adminPages);
//app.use('/users', users);
//app.use('/visitors', visitors);
//app.use("/", users);


    if (settings.httpAdminRoot !== false && settings.httpAdminAuth) {
        RED.log.warn(RED.log._("server.httpadminauth-deprecated"));
        app.use(settings.httpAdminRoot, basicAuthMiddleware(settings.httpAdminAuth.user, settings.httpAdminAuth.pass));
    }

    if (settings.httpAdminRoot !== false) {
        app.use(settings.httpAdminRoot, RED.httpAdmin);
    }
    if (settings.httpNodeRoot !== false && settings.httpNodeAuth) {
        app.use(settings.httpNodeRoot, basicAuthMiddleware(settings.httpNodeAuth.user, settings.httpNodeAuth.pass));
    }
    if (settings.httpNodeRoot !== false) {
        app.use(settings.httpNodeRoot, RED.httpNode);
    }
    if (settings.httpStatic) {
        settings.httpStaticAuth = settings.httpStaticAuth || settings.httpAuth;
        if (settings.httpStaticAuth) {
            app.use("/", basicAuthMiddleware(settings.httpStaticAuth.user, settings.httpStaticAuth.pass));
        }
        app.use("/", express.static(settings.httpStatic));
    }


    function getListenPath() {
        var port = settings.serverPort;
        if (port === undefined) {
            port = settings.uiPort;
        }

        var listenPath = 'http' + (settings.https ? 's' : '') + '://' +
            (settings.uiHost == '::' ? 'localhost' : (settings.uiHost == '0.0.0.0' ? '127.0.0.1' : settings.uiHost)) +
            ':' + port;
        if (settings.httpAdminRoot !== false) {
            listenPath += settings.httpAdminRoot;
        } else if (settings.httpStatic) {
            listenPath += "/";
        }
        return listenPath;
    }


    RED.start().then(function () {
        if (settings.httpAdminRoot !== false || settings.httpNodeRoot !== false || settings.httpStatic) {
            server.on('error', function (err) {
                if (err.errno === "EADDRINUSE") {
                    RED.log.error(RED.log._("server.unable-to-listen", {listenpath: getListenPath()}));
                    RED.log.error(RED.log._("server.port-in-use"));
                } else {
                    RED.log.error(RED.log._("server.uncaught-exception"));
                    if (err.stack) {
                        RED.log.error(err.stack);
                    } else {
                        RED.log.error(err);
                    }
                }
                process.exit(1);
            });

            // Log all the delayed messages, since they can be translated at this point
            delayedLogItems.forEach(function (delayedLogItem, index) {
                RED.log[delayedLogItem.type](RED.log._(delayedLogItem.id, delayedLogItem.params || {}));
            });

            server.listen(settings.uiPort, settings.uiHost, function () {
                if (settings.httpAdminRoot === false) {
                    RED.log.info(RED.log._("server.admin-ui-disabled"));
                }
                settings.serverPort = server.address().port;
                //process.title = parsedArgs.title || 'node-red';
                process.title = 'node-red';
                RED.log.info(RED.log._("server.now-running", {listenpath: getListenPath()}));
            });
        } else {
            RED.log.info(RED.log._("server.headless-mode"));
        }
    }).otherwise(function (err) {
        RED.log.error(RED.log._("server.failed-to-start"));
        if (err.stack) {
            RED.log.error(err.stack);
        } else {
            RED.log.error(err);
        }
    });

    process.on('uncaughtException', function (err) {
        util.log('[red] Uncaught Exception:');
        if (err.stack) {
            util.log(err.stack);
        } else {
            util.log(err);
        }
        process.exit(1);
    });

    var stopping = false;

    function exitWhenStopped() {
        if (!stopping) {
            stopping = true;
            RED.stop().then(function () {
                process.exit();
            });
        }
    }

    process.on('SIGINT', exitWhenStopped);
    process.on('SIGTERM', exitWhenStopped);
    process.on('SIGHUP', exitWhenStopped);
    process.on('SIGUSR2', exitWhenStopped);  // for nodemon restart
    process.on('SIGBREAK', exitWhenStopped); // for windows ctrl-break
    process.on('message', function (m) {      // for PM2 under window with --shutdown-with-message
        if (m === 'shutdown') {
            exitWhenStopped()
        }
    });

}).catch(function (err) {
    console.log("Failed to get https settings: " + err);
});
