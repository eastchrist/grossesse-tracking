module.exports = function (RED) {
    "use strict";
    var fs = require("fs-extra");
    var path = require('path');
    let DataBaseServices = require("../../services/DataBaseServices");

    function concat(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        this.on("input", function (msg, send, done) {
            var Mpayload = "";
            var Mtopic = "";
            var Mname = "";
            if (msg == null) {
                return;
            } else {
                if (typeof msg.payload === 'object' && msg.payload !== undefined) {
                    Mpayload = JSON.stringify(msg.payload);
                    Mtopic = msg.topic;
                    Mname = msg.name;
                    if (Mtopic === "" || Mname === "") {
                        node.warn(RED._("file.errors.nofilename"));
                        done();
                    } else {
                        var filename = path.join(path.dirname(require.main.filename), 'Factory', 'Nodes', Mtopic + Mname + ".json")
                        var Dir = path.dirname(filename);
                        //var Dir = path.join(path.dirname(require.main.filename),'Factory', 'Nodes');
                        try {
                            fs.ensureDirSync(Dir);
                        } catch (err) {
                            node.error(RED._("file.errors.createfail", {error: err.toString()}), msg);
                            done();
                            return;
                        }

                        var data = msg.payload;
                        if ((typeof data === "object") && (!Buffer.isBuffer(data))) {
                            data = JSON.stringify(data);
                        }
                        if (typeof data === "boolean") {
                            data = data.toString();
                        }
                        if (typeof data === "number") {
                            data = data.toString();
                        }
                        var buf = data;
                        var wstream = fs.createWriteStream(filename, {encoding: 'binary', flags: 'w', autoClose: true});
                        node.wstream = wstream;
                        wstream.on("error", function (err) {
                            node.error(RED._("file.errors.writefail", {error: err.toString()}), msg);
                            done();
                        });
                        wstream.on("open", function () {
                            wstream.end(buf, function () {
                                nodeSend(msg);
                                done();
                            });
                        })
                        send([{payload: "Data : " + data}]);
                        return;
                    }
                }
            }
        });
    }

    var tables = [
            {
                "name": "sys_users",
                "Champs": {
                    "id": {
                        "name": "id",
                        "type": "INT NOT NULL AUTO_INCREMENT"
                    },
                    "name": {
                        "name": "name",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "email": {
                        "name": "email",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "username": {
                        "name": "username",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "password": {
                        "name": "password",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "admin": {
                        "name": "admin",
                        "type": "INT"
                    },
                    "process": {
                        "name": "process",
                        "type": "INT"
                    },
                    "direction": {
                        "name": "direction",
                        "type": "INT"
                    },
                    "manager": {
                        "name": "manager",
                        "type": "INT"
                    },
                    "superOperator": {
                        "name": "superOperator",
                        "type": "INT"
                    },
                    "Operator": {
                        "name": "Operator",
                        "type": "INT"
                    },
                    "Factory": {
                        "name": "Factory",
                        "type": "VARCHAR(255) NOT NULL"
                    }
                },
                "node": null
            },
            {
                "name": "conf_factory",
                "Champs": {
                    "id": {
                        "name": "id",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "name": {
                        "name": "name",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "comment": {
                        "name": "comment",
                        "type": "TEXT NOT NULL"
                    }
                },
                "node": null
            },
            {
                "name": "conf_area",
                "Champs": {
                    "id": {
                        "name": "id",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "name": {
                        "name": "name",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "id_factory": {
                        "name": "id_factory",
                        "type": "VARCHAR(255) NOT NULL"
                    }
                },
                "node": null
            },
            {
                "name": "conf_tank_area",
                "Champs": {
                    "id": {
                        "name": "id",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "name": {
                        "name": "name",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "id_area": {
                        "name": "id_area",
                        "type": "VARCHAR(255) NOT NULL"
                    }
                },
                "node": null
            },
            {
                "name": "conf_tank",
                "Champs": {
                    "id": {
                        "name": "id",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "name": {
                        "name": "name",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "Collector": {
                        "name": "Collector",
                        "type": "BOOLEAN NOT NULL"
                    },
                    "In_Line": {
                        "name": "In_Line",
                        "type": "BOOLEAN NOT NULL"
                    },
                    "Collector_inlet": {
                        "name": "Collector_inlet",
                        "type": "DECIMAL NOT NULL"
                    },
                    "Collector_Outlet": {
                        "name": "Collector_Outlet",
                        "type": "DECIMAL NOT NULL"
                    },
                    "id_tank_area": {
                        "name": "id_tank_area",
                        "type": "VARCHAR(255) NOT NULL"
                    }
                },
                "node": null

            },
            {
                "name": "conf_server",
                "Champs": {
                    "id": {
                        "name": "id",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "": {
                        "name": "name",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "": {
                        "name": "type",
                        "type": "VARCHAR(255) NOT NULL"
                    }
                },
                "node": null
            },
            {
                "name": "conf_input_digital",
                "Champs": {
                    "id": {
                        "name": "id",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "name": {
                        "name": "name",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "type": {
                        "name": "type",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "id_plc": {
                        "name": "id_plc",
                        "type": "VARCHAR(255) NOT NULL"
                    }
                },
                "node": null
            },
            {
                "name": "conf_input_analog",
                "Champs": {
                    "id": {
                        "name": "id",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "name": {
                        "name": "name",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "type": {
                        "name": "type",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "id_plc": {
                        "name": "id_plc",
                        "type": "VARCHAR(255) NOT NULL"
                    }
                },
                "node": null
            },
            {
                "name": "conf_group_alarms",
                "Champs": {
                    "id": {
                        "name": "id",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "name": {
                        "name": "name",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "type": {
                        "name": "type",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "id_plc": {
                        "name": "id_plc",
                        "type": "VARCHAR(255) NOT NULL"
                    }
                },
                "node": null
            },
            {
                "name": "conf_alarms",
                "Champs": {
                    "id": {
                        "name": "id",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "name": {
                        "name": "name",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "type": {
                        "name": "type",
                        "type": "VARCHAR(255) NOT NULL"
                    },
                    "id_group_alarms": {
                        "name": "id_group_alarms",
                        "type": "VARCHAR(255) NOT NULL"
                    }
                },
                "node": null
            },
        ]
    ;

    function create_table_Old(n) {
        RED.nodes.createNode(this, n);
        this.mydb = n.mydb;
        this.mydbConfig = RED.nodes.getNode(this.mydb);
        this.status({});
        if (this.mydbConfig) {
            this.mydbConfig.connect();
            var node = this;
            var busy = false;
            var status = {};
            node.mydbConfig.on("state", function (info) {
                if (info === "connecting") {
                    node.status({fill: "grey", shape: "ring", text: info});
                } else if (info === "connected") {
                    node.status({fill: "green", shape: "dot", text: info});
                } else {
                    if (info === "ECONNREFUSED") {
                        info = "connection refused";
                    }
                    if (info === "PROTOCOL_CONNECTION_LOST") {
                        info = "connection lost";
                    }
                    node.status({fill: "red", shape: "ring", text: info});
                }
            });
            node.on("input", function (msg) {
                var dbname = node.mydbConfig.dbname;
                if (node.mydbConfig.connected) {
                    if (typeof msg.topic === 'string') {
                        var bind = [];
                        var topic = "SELECT table_name FROM information_schema.tables WHERE table_schema ='" + dbname + "'";
                        node.mydbConfig.connection.query(topic, bind, function (err, rows) {
                            if (err) {
                                status = {fill: "red", shape: "ring", text: "Error: " + err.code};
                                node.status(status);
                                node.error(err, msg);
                            } else {
                                //Create liste of already existing table
                                var tableExist = [];
                                rows.forEach(function (row) {
                                    tableExist.push(row.table_name)
                                })
                                //Create tables
                                tables.forEach(function (table) {
                                    if (!tableExist.includes(table.name)) {
                                        var topic = "CREATE TABLE `" + dbname + "`.`" + table.name + "` ( `id` INT NOT NULL AUTO_INCREMENT , PRIMARY KEY (`id`)) ENGINE = InnoDB";
                                        node.mydbConfig.connection.query(topic, bind, function (err, rows) {
                                            if (err) {
                                                status = {fill: "red", shape: "ring", text: "Error: " + err.code};
                                                node.status(status);
                                                node.error(err, msg);
                                            }
                                        })
                                    }
                                })

                                //Create Champs table
                                tables.forEach(function (table) {
                                    var topic = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='" + table.name + "'";
                                    node.mydbConfig.connection.query(topic, bind, function (err, rows) {
                                        if (err) {
                                            status = {fill: "red", shape: "ring", text: "Error: " + err.code};
                                            node.status(status);
                                            node.error(err, msg);
                                        } else {
                                            var champsExist = [];
                                            rows.forEach(function (row) {
                                                champsExist.push(row.column_name)
                                            })
                                            table.Champs.forEach(function (champ) {
                                                if (!champsExist.includes(champ.name)) {
                                                    var topic = "ALTER TABLE `" + table.name + "` ADD `" + champ.name + "` " + champ.type + "";
                                                    node.mydbConfig.connection.query(topic, bind, function (err, rows) {
                                                        if (err) {
                                                            status = {
                                                                fill: "red",
                                                                shape: "ring",
                                                                text: "Error: " + err.code
                                                            };
                                                            node.status(status);
                                                            node.error(err, msg);
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                })


                                msg.payload = "OK";
                                node.send(msg);
                                status = {fill: "green", shape: "dot", text: "OK"};
                                node.status(status);
                            }
                        });
                    } else {
                        if (typeof msg.topic !== 'string') {
                            node.error("msg.topic : the query is not defined as a string");
                        }
                    }
                } else {
                    node.error("Database not connected", msg);
                    status = {fill: "red", shape: "ring", text: "not yet connected"};
                }
                if (!busy) {
                    busy = true;
                    node.status(status);
                    node.tout = setTimeout(function () {
                        busy = false;
                        node.status(status);
                    }, 500);
                }
            });

            node.on('close', function () {
                if (node.tout) {
                    clearTimeout(node.tout);
                }
                node.mydbConfig.removeAllListeners();
                node.status({});
            });
        } else {
            this.error("MySQL database not configured");
        }
    };

    function create_table(n) {
        RED.nodes.createNode(this, n);
        this.mydb = n.mydb;
        this.mydbConfig = RED.nodes.getNode(this.mydb);
        this.status({});
        if (this.mydbConfig) {
            this.mydbConfig.connect();
            var node = this;
            var busy = false;
            var status = {};
            node.mydbConfig.on("state", function (info) {
                if (info === "connecting") {
                    node.status({fill: "grey", shape: "ring", text: info});
                } else if (info === "connected") {
                    node.status({fill: "green", shape: "dot", text: info});
                } else {
                    if (info === "ECONNREFUSED") {
                        info = "connection refused";
                    }
                    if (info === "PROTOCOL_CONNECTION_LOST") {
                        info = "connection lost";
                    }
                    node.status({fill: "red", shape: "ring", text: info});
                }
            });
            node.on("input", function (msg) {
                var dbname = node.mydbConfig.dbname;
                if (node.mydbConfig.connected) {
                    try {
                        DataBaseServices.findAllTables(dbname).then(async (DataBasetables) => {
                            if (!DataBasetables) {
                                status = {fill: "red", shape: "ring", text: "Error: " + err.code};
                                node.status(status);
                                node.error(err, msg);
                            }
                            if (DataBasetables) {
                                //Create liste of already existing table
                                var tableExist = [];
                                DataBasetables.forEach(function (DataBasetable) {
                                    tableExist.push(DataBasetable.table_name)
                                });
                                //Create tables
                                tables.forEach(function (table) {
                                    if (!tableExist.includes(table.name)) {
                                        var id_type = table.Champs.id.type;
                                        DataBaseServices.CreateTables(dbname, table.name, id_type).then(async (CreateTable) => {
                                            if (!CreateTable) {
                                                status = {fill: "red", shape: "ring", text: "Error: " + err.code};
                                                node.status(status);
                                                node.error(err, msg);
                                            }
                                            if (CreateTable) {

                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } catch (err) {
                        console.log(err);
                        return done(null, false, {message: err});
                    }
                    ;
                } else {
                    node.error("Database not connected", msg);
                    status = {fill: "red", shape: "ring", text: "not yet connected"};
                }
                if (!busy) {
                    busy = true;
                    node.status(status);
                    node.tout = setTimeout(function () {
                        busy = false;
                        node.status(status);
                    }, 500);
                }
            });

            node.on('close', function () {
                if (node.tout) {
                    clearTimeout(node.tout);
                }
                node.mydbConfig.removeAllListeners();
                node.status({});
            });
        } else {
            this.error("MySQL database not configured");
        }
    };

    function populate_table(n) {
        RED.nodes.createNode(this, n);
        this.mydb = n.mydb;
        this.mydbConfig = RED.nodes.getNode(this.mydb);
        this.status({});

        function recup_nodes() {
            var filename = path.join(path.dirname(require.main.filename), 'flows_DESKTOP.json');
            let rawdata = fs.readFileSync(filename);
            let datas = JSON.parse(rawdata);
            return datas;
        };

        function recup_tables() {
            var datas = [];
            tables.forEach(function (table) {
                var table_name = table.name;
                var bind = [];
                var topic = "SELECT * FROM " + "`" + table_name + "`";
                //var topic = "SELECT * FROM `conf_factory`";
                node.mydbConfig.connection.query(topic, bind, function (err, rows) {
                    if (err) {
                        status = {fill: "red", shape: "ring", text: "Error: " + err.code};
                        node.status(status);
                        node.error(err, msg);
                    } else {
                        var data = rows;
                        //datas.push( "table_name" : "rows" );
                    }
                })
            });
            return datas;
        };

        if (this.mydbConfig) {
            this.mydbConfig.connect();
            var node = this;
            var busy = false;
            var status = {};
            node.mydbConfig.on("state", function (info) {
                if (info === "connecting") {
                    node.status({fill: "grey", shape: "ring", text: info});
                } else if (info === "connected") {
                    node.status({fill: "green", shape: "dot", text: info});
                } else {
                    if (info === "ECONNREFUSED") {
                        info = "connection refused";
                    }
                    if (info === "PROTOCOL_CONNECTION_LOST") {
                        info = "connection lost";
                    }
                    node.status({fill: "red", shape: "ring", text: info});
                }
            });
            node.on("input", function (msg) {
                var dbname = node.mydbConfig.dbname;
                if (node.mydbConfig.connected) {
                    var node_list = recup_nodes();
                    var existing_tables = recup_tables(tables);
                    console.log("Lecture OK");
                } else {
                    node.error("Database not connected", msg);
                    status = {fill: "red", shape: "ring", text: "not yet connected"};
                }
                if (!busy) {
                    busy = true;
                    node.status(status);
                    node.tout = setTimeout(function () {
                        busy = false;
                        node.status(status);
                    }, 500);
                }
            });
            node.on('close', function () {
                if (node.tout) {
                    clearTimeout(node.tout);
                }
                node.mydbConfig.removeAllListeners();
                node.status({});
            });
        } else {
            this.error("MySQL database not configured");
        }
    };


    RED.nodes.registerType("concat", concat);
    RED.nodes.registerType("create_table", create_table);
    RED.nodes.registerType("populate_table", populate_table);
};