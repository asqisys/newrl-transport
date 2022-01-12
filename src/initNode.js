const libp2p = require("libp2p");
const Node = require("./libp2p/baseNode");
const {registerPeer} = require("./discovery");
const process = require("process");
const {listener, internalListener} = require("./listener");
let extIP = require('ext-ip')();


function listen(node) {
    Node.printAddress(node)
    listener(node);
    internalListener(node)
}


async function initPeer()  {

    const node = await libp2p.create(Node.DEFAULT_OPTS)
    await node.start()
    extIP.get().then(ip => {
        global.ip = ip.toString()
        registerPeer([ip.toString(), node.peerId.toB58String()])
    }).catch(err => {
        console.error(err);
    });

    listen(node);

    return node;
}

module.exports = {initPeer}