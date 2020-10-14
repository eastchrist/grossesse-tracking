
module.exports = function(RED) {
    "use strict";

function equips(config) {
    RED.nodes.createNode(this,config);
    this.on("input", function(msg, send, done) {
            var MReplace = "";
            MReplace = MReplace.concat('"Area equips" :');
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
                    if (Minput.search('"Area equips":{"_First_":"First",') != -1) {
                    } else {
                        Minput = "{" + MReplace + "}" ;
                    }
                } else {
                    Minput = "{" + MReplace + "}" ;
                }
            }

            Minput = JSON.parse(Minput);
            var tab = [];
            for (var m=0; m < config.outputs; m++) {
                tab.push( [{payload: Minput, topic : "Equips creation", name : config.name}] );
            }
            send(tab);
	});
};
function Equip_Def(config) {
    RED.nodes.createNode(this,config);
    var node = this;
};
function Equip_Def_Digital(config) {
    RED.nodes.createNode(this, config);
    //this.name = config.name;
    var node = this;
};
function Equip_Def_Analog(config) {
    RED.nodes.createNode(this, config);
    //this.name = config.name;
    var node = this;
};
function Equip_Def_Alarms(config) {
    RED.nodes.createNode(this, config);
    //this.name = config.name;
    var node = this;
};
function Equip_Def_Carto(config) {
    RED.nodes.createNode(this, config);
    //this.name = config.name;
    var node = this;
};
function Equip_Def_EventList(config) {
    RED.nodes.createNode(this, config);
    //this.name = config.name;
    var node = this;
};
function Equip_Def_EventM(config) {
    RED.nodes.createNode(this, config);
    //this.name = config.name;
    var node = this;
};
function Equip_Def_EventS(config) {
    RED.nodes.createNode(this, config);
    //this.name = config.name;
    var node = this;
};

function equip_Type(config) {
        RED.nodes.createNode(this,config);
        //this.config = {
        //    name: config.name,
        //    Equip_Def_Digital: config.Equip_Def_Digital,
        //    Equip_Def_Analog: config.Equip_Def_Analog  //,
            //Equip_Def_Alarms: config.Equip_Def_Alarms,
            //Equip_Def_Carto: config.Equip_Def_Carto,
            //Equip_Def_EventList: config.Equip_Def_EventList
        //};
        var node = this;
        this.on("input", function(msg, send, done) {
            var MReplace = "";
            MReplace = MReplace.concat('"' + config.name+ '"' +": " + '{' );
            MReplace = MReplace.concat('"Equip_name" : '+ '"' + config.name + '"');
            MReplace = MReplace.concat(",");
            MReplace = MReplace.concat('"TOTO" :'+ '"TOTO"');
            MReplace = MReplace.concat("}");
            var Minput = "";
            if (msg == null) {
                return;
            } else {
                if (typeof msg.payload === 'object' && msg.payload !== undefined) {
                    Minput = JSON.stringify(msg.payload);
                    if (Minput.search('"Area equips":{"_First_":"First",') != -1) {
                        Minput = Minput.replace('"Area equips":{"_First_":"First",'  , '"Area equips":{"_First_":"First",' + MReplace + ",");
                    } else {
                        Minput = "{" + MReplace + "}" ;
                    }
                } else {
                    Minput = "{" + MReplace + "}" ;
                }
            }
            Minput = JSON.parse(Minput);
            send( [{payload: Minput, topic : "Equip creation", name : config.name }] );
        });
};


RED.nodes.registerType("equips",equips);
RED.nodes.registerType("Equip_Def",Equip_Def);
RED.nodes.registerType("Equip_Def_Digital",Equip_Def_Digital);
RED.nodes.registerType("Equip_Def_Analog",Equip_Def_Analog);
RED.nodes.registerType("Equip_Def_Alarms",Equip_Def_Alarms);
RED.nodes.registerType("Equip_Def_Carto",Equip_Def_Carto);
RED.nodes.registerType("Equip_Def_EventList",Equip_Def_EventList);
RED.nodes.registerType("Equip_Def_EventM",Equip_Def_EventM);
RED.nodes.registerType("Equip_Def_EventS",Equip_Def_EventS);


RED.nodes.registerType("equip_Type",equip_Type);

};