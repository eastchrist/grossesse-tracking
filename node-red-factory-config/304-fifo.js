

module.exports = function(RED) {
"use strict";
function fifo_Def(config) {
    RED.nodes.createNode(this,config);
    var node = this;
};
function fifo(config) {
    RED.nodes.createNode(this,config);
    var node = this;
};
RED.nodes.registerType("fifo_Def",fifo_Def);
RED.nodes.registerType("fifo",fifo);
};