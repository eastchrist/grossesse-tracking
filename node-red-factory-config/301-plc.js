
module.exports = function(RED) {
    "use strict";

function Plcs(config) {
    RED.nodes.createNode(this,config);
    this.on("input", function(msg, send, done) {
            var MReplace = "";
            MReplace = MReplace.concat('"Area plcs" :');
            MReplace = MReplace.concat('{');
            MReplace = MReplace.concat('"_First_" :'+ '"First"');
            MReplace = MReplace.concat(",");
            MReplace = MReplace.concat('"_Last_" :'+ '"Last"');
            MReplace = MReplace.concat("}");

            var Minput = ""
            if (msg == null) {
                return;
            } else {
                if (typeof msg.payload === 'object' && msg.payload !== undefined) {
                    Minput = JSON.stringify(msg.payload);
                    if (Minput.search('"Area plcs":{"_First_":"First",') != -1) {
                        // Already in place do nothing
                        //Minput = "Sortie 1"
                    } else {
                        Minput = "{" + MReplace + "}" ;
                        //Minput = "Sortie 2"
                    }
                } else {
                    Minput = "{" + MReplace + "}" ;
                    //Minput = "Sortie 3"
                }
            }

            Minput = JSON.parse(Minput);
            var tab = [];
            for (var m=0; m < config.outputs; m++) {
                tab.push( [{payload: Minput, topic : "Plcs creation", name : config.name}] );
            }
            send(tab);
	});
};
function Server_Def(config) {
        RED.nodes.createNode(this,config);
        this.name = config.name || "Server";
        //this.Server_Type = config.Server_Type
        let node = this;
};
function Plc_Type(config) {
        RED.nodes.createNode(this,config);
        this.server = RED.nodes.getNode(config.Server_Def);
        //let node = this;
        this.on("input", function(msg, send, done) {
            var MReplace = "";
            MReplace = MReplace.concat('"' + config.name+ '"' +": " + '{' );
            MReplace = MReplace.concat('"Plc_name" : '+ '"' + config.name + '"');
            MReplace = MReplace.concat(",");
            MReplace = MReplace.concat('"Plc_Brand" :'+ '"' + config.Plc_Brand + '"');
            MReplace = MReplace.concat(",");
            MReplace = MReplace.concat('"Plc_Connection" :'+ '"' + config.Plc_Connection + '"');
            MReplace = MReplace.concat(",");
            MReplace = MReplace.concat('"Plc_Slot" :' + '"' + config.Plc_Slot + '"');
            MReplace = MReplace.concat(",");
            MReplace = MReplace.concat('"Plc_Rack" :' + '"' + config.Plc_Rack + '"');
            MReplace = MReplace.concat(",");
            MReplace = MReplace.concat('"Plc_Ip" :' + '"'+ config.Plc_Ip + '"');
            MReplace = MReplace.concat(",");
            if (this.server) {
                MReplace = MReplace.concat('"Plc_Server" :' + '"'+ this.server.name+ '"');
                MReplace = MReplace.concat("}");
            } else {
                MReplace = MReplace.concat('"Plc_Server" :' + '"null"');
                MReplace = MReplace.concat("}");
            }
            MReplace = MReplace.concat("");
            var Minput = "";
            if (msg == null) {
                return;
            } else {
                if (typeof msg.payload === 'object' && msg.payload !== undefined) {
                    Minput = JSON.stringify(msg.payload);
                    if (Minput.search('"Area plcs":{"_First_":"First",') != -1) {
                        Minput = Minput.replace('"Area plcs":{"_First_":"First",'  , '"Area plcs":{"_First_":"First",' + MReplace + ",");
                    } else {
                        Minput = "{" + MReplace + "}" ;
                    }
                } else {
                    Minput = "{" + MReplace + "}" ;
                }
            }
            Minput = JSON.parse(Minput);
            send( [{payload: Minput, topic : "Plc creation", name : config.name }] );
        });
};

RED.nodes.registerType("Plcs",Plcs);
RED.nodes.registerType("Server_Def",Server_Def);
RED.nodes.registerType("Plc_Type",Plc_Type);

};

