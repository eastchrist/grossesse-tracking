
module.exports = function(RED) {
    "use strict";


// Configuration Node
function factory(config) {
    RED.nodes.createNode(this,config);
    this.on("input", function(msg, send, done) {
        var MReplace = "";
        MReplace = MReplace.concat('"factory" : '+ '"' + config.name + '"');
        MReplace = MReplace.concat(",");
        MReplace = MReplace.concat('"address" :'+ '"' + config.address + '"');
        MReplace = MReplace.concat(",");
        MReplace = MReplace.concat('"Areas" :');
        MReplace = MReplace.concat('{');
        MReplace = MReplace.concat('"_First_" :'+ '"First"');
        MReplace = MReplace.concat(",");
        MReplace = MReplace.concat('"_Last_" :'+ '"Last"');
        MReplace = MReplace.concat("}");
		var Minput = "";
		if (msg == null) {
		    return;
        } else {
            if (typeof msg.payload === 'object' && msg.payload !== undefined) {
                Minput = JSON.stringify(msg.payload);
                if (Minput.search('Factory') != -1) {
                    Minput = Minput.replace('Factory', 'Factory' + "," + MReplace + ",");
                } else {
                    Minput = "{" + MReplace + "}" ;
                }
            } else {
                Minput = "{" + MReplace + "}" ;
            }
        }
        Minput = JSON.parse(Minput);
        send( [{payload: Minput, topic : "Factory creation", name : config.name}] );
	});
};
function areas(config) {
    RED.nodes.createNode(this,config);
    this.outputs = config.outputs;
    this.on("input", function(msg, send, done) {
        var MReplace = "";
        MReplace = MReplace.concat('"Areas" :');
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
                if (Minput.search('"Areas":{"_First_":"First","_Last_":"Last"}') != -1) {
                    //Do nothing already fine
                } else {
                    Minput = "{" + MReplace + "}" ;
                }
            } else {
                Minput = "{" + MReplace + "}" ;
            }
        }
        Minput = JSON.parse(Minput);
        var tab = [];
        for (var m=0; m<config.outputs; m++) {
            tab.push( [{payload: Minput, topic : "Areas creation", name : config.name}] );
        }
        send(tab);
	});
};
function area(config) {
    RED.nodes.createNode(this,config);
    this.on("input", function(msg, send, done) {
        var MReplace = "";
        MReplace = MReplace.concat('"' + config.name+ '"' +": " + '{' );
        MReplace = MReplace.concat('"area_name" : '+ '"' + config.name + '"');
        MReplace = MReplace.concat(",");
        MReplace = MReplace.concat('"area_comment" : '+ '"' + config.comment + '"');
        MReplace = MReplace.concat(",");

        MReplace = MReplace.concat('"Area tanks" :');
        MReplace = MReplace.concat('{');
        MReplace = MReplace.concat('"_First_" :'+ '"First"');
        MReplace = MReplace.concat(",");
        MReplace = MReplace.concat('"_Last_" :'+ '"Last"');
        MReplace = MReplace.concat("}");
        MReplace = MReplace.concat(",");

        MReplace = MReplace.concat('"Area plcs" :');
        MReplace = MReplace.concat('{');
        MReplace = MReplace.concat('"_First_" :'+ '"First"');
        MReplace = MReplace.concat(",");
        MReplace = MReplace.concat('"_Last_" :'+ '"Last"');
        MReplace = MReplace.concat("}");
        MReplace = MReplace.concat(",");

        MReplace = MReplace.concat('"Area equips" :');
        MReplace = MReplace.concat('{');
        MReplace = MReplace.concat('"_First_" :'+ '"First"');
        MReplace = MReplace.concat(",");
        MReplace = MReplace.concat('"_Last_" :'+ '"Last"');
        MReplace = MReplace.concat("}");

        MReplace = MReplace.concat("}");

        var Minput = "";
        //var Minput_Tank = "";
        //var Minput_Plc = ""
        //var Minput_Equip = ""
        if (msg == null) {
            return;
        } else {
            if (typeof msg.payload === 'object' && msg.payload !== undefined) {
                Minput = JSON.stringify(msg.payload);
                if (Minput.search('"Areas":{"_First_":"First",') != -1) {
                    Minput = Minput.replace('"Areas":{"_First_":"First",', '"Areas":{"_First_":"First",' + MReplace + ",");
                } else {
                    Minput = "{" + MReplace + "}" ;
                }
            } else {
                Minput = "{" + MReplace + "}" ;
            }
        }
        Minput = JSON.parse(Minput);
        send([ [{payload: Minput, topic : "Area creation", name : config.name}] , [{payload: Minput, topic : "Area creation", name : config.name}] , [{payload: Minput, topic : "Area creation", name : config.name}]]);
	});
};
function tank_areas(config) {
    RED.nodes.createNode(this,config);
    this.on("input", function(msg, send, done) {
        var MReplace = "";
        MReplace = MReplace.concat('"' + config.name+ '"' +": " + '{' );
        MReplace = MReplace.concat('"area_name" : '+ '"' + config.name + '"');
        MReplace = MReplace.concat(",");
        MReplace = MReplace.concat('"tank" :');
        MReplace = MReplace.concat('{');
        MReplace = MReplace.concat('"_First_" :'+ '"First"');
        MReplace = MReplace.concat(",");
        MReplace = MReplace.concat('"_Last_" :'+ '"Last"');
        MReplace = MReplace.concat("}");
        MReplace = MReplace.concat("}");

        var Minput = ""
        if (msg == null) {
            return;
        } else {
            if (typeof msg.payload === 'object' && msg.payload !== undefined) {
                Minput = JSON.stringify(msg.payload);
                if (Minput.search('"Area tanks":{"_First_":"First",') != -1) {
                    Minput = Minput.replace('"Area tanks":{"_First_":"First",', '"Area tanks":{"_First_":"First",' + MReplace + ",");
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
            tab.push( [{payload: Minput, topic : "Tank Area creation", name : config.name}] );
        }
        send(tab);


	});
};
function tank(config) {
    RED.nodes.createNode(this,config);
    this.on("input", function(msg, send, done) {
            var MReplace = "";
            MReplace = MReplace.concat('"' + config.name+ '"' +": " + '{' );
            MReplace = MReplace.concat('"tank_name" : '+ '"' + config.name + '"');
            MReplace = MReplace.concat(",");
            MReplace = MReplace.concat('"SelectCollector" : '+ '"' + config.SelectCollector + '"');
            MReplace = MReplace.concat(",");
            MReplace = MReplace.concat('"SelectLine" : '+ '"' + config.SelectLine + '"');
            MReplace = MReplace.concat(",");
            MReplace = MReplace.concat('"InCollector" : '+ '"' + config.InCollector + '"');
            MReplace = MReplace.concat(",");
            MReplace = MReplace.concat('"OutCollector" : '+ '"' + config.OutCollector + '"');
            MReplace = MReplace.concat("}");
            var Minput = ""
            if (msg == null) {
                return;
            } else {
                if (typeof msg.payload === 'object' && msg.payload !== undefined) {
                    Minput = JSON.stringify(msg.payload);
                    if (Minput.search('"tank":{"_First_":"First",') != -1) {
                        Minput = Minput.replace('"tank":{"_First_":"First",', '"tank":{"_First_":"First",' + MReplace + ",");
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
            send( [{payload: Minput, topic : "Tank creation", name : config.name}] );
        });
};



RED.nodes.registerType("factory",factory);
RED.nodes.registerType("areas",areas);
RED.nodes.registerType("area",area);
RED.nodes.registerType("tank_areas",tank_areas);
RED.nodes.registerType("tank",tank);


};

