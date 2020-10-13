

var fs = require("fs");
var path = require('path');


var runtime = require("@node-red/runtime");
var redUtil = require("@node-red/util");

var api = require("@node-red/editor-api");

var server = null;
var apiEnabled = false;

function checkVersion(userSettings) {

    var semver = require('semver');
    if (!semver.satisfies(process.version,">=8.9.0")) {
        userSettings.UNSUPPORTED_VERSION = process.version;
    }

}

module.exports = {
    init: function(httpServer, userSettings) {

        if (!userSettings) {
            userSettings = httpServer;
            httpServer = null;
        }

        if (!userSettings.SKIP_BUILD_CHECK) {
            checkVersion(userSettings);
        }

        if (!userSettings.coreNodesDir) {
            userSettings.coreNodesDir = path.dirname(require.resolve("@node-red/nodes"))
        }




        redUtil.init(userSettings);

        //console.log("CCA userSettings");
        //console.log(userSettings);


        //if (userSettings.httpAdminRoot !== false) {

        // Initialise the runtime
        runtime.init(userSettings,httpServer,api);


        // Initialise the editor-api
        api.init(userSettings,httpServer,runtime.storage,runtime);
        // Attach the runtime admin app to the api admin app
        api.httpAdmin.use(runtime.httpAdmin);

        apiEnabled = true;
        server = httpServer;
        /*
        } else {
            runtime.init(userSettings, httpServer);
            apiEnabled = false;
            if (httpServer) {
                server = httpServer;
            } else {
                server = null;
            }
        }
        */
        return;
    },
    start: function() {
        return runtime.start().then(function() {
            if (apiEnabled) {
                return api.start();
            }
        });

    },

    stop: function() {
        return runtime.stop().then(function() {
            if (apiEnabled) {
                return api.stop();
            }
        })
    },
    log: redUtil.log,
    util: redUtil.util,
    get nodes() { return runtime._.nodes },
    events: runtime.events,
    get settings() { return runtime._.settings },
    get version() { return runtime._.version },
    get httpAdmin() { return api.httpAdmin },
    get httpNode() { return runtime.httpNode },
    get server() { return server },
    runtime: runtime,
    auth: api.auth
};
