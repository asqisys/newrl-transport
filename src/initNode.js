const libp2p = require("libp2p");
const Node = require("./libp2p/baseNode");
const {registerPeer} = require("./discovery");
const process = require("process");
const {listener, internalListener} = require("./listener");
const {generatePeerID} = require("./libp2p/baseNode");
let extIP = require('ext-ip')();
const defaultsDeep = require('@nodeutils/defaults-deep')


function listen(node) {
    listener(node);
    internalListener(node)
}


async function initPeer()  {
    let config = await generatePeerID();
    const node = await libp2p.create(config)

    node.on('peer:connect', (connection) => {
        console.log('Connection established to:', connection.remotePeer.toB58String())	// Emitted when a peer has been found
    })

    node.on('peer:discovery', (peerId) => {
        // No need to dial, autoDial is on
        console.log('Discovered:', peerId.toB58String())
    })

    await node.start()


    extIP.get().then(ip => {
        global.ip = ip.toString()
        registerPeer([ip.toString(), node.peerId.toB58String()])
        Node.printAddress(node)
    }).catch(err => {
        console.error(err);
    });
    listen(node);
    return node;
}

module.exports = {initPeer}