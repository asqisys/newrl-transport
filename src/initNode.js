const libp2p = require("libp2p");
// const Node = require("./libp2p/baseNode");
const {registerPeer} = require("./discovery");
const process = require("process");
const {listener, internalListener, peerListener} = require("./listener");
const {generatePeerID} = require("./libp2p/baseNode");
const {printAddress} = require("./utility/utility");
const {sendPeerList} = require("./dialer");
let extIP = require('ext-ip')();


function listen(node) {
    listener(node);
    internalListener(node)
    peerListener(node)
}


function attachLibp2pEvents(node) {
    node.connectionManager.on('peer:connect', (connection) => {
        console.log('Connection established to:', connection.remotePeer.toB58String())
        console.log('Sending peer list to :', connection.remotePeer.toB58String())
        sendPeerList(node,connection.remotePeer);
    });

    // node.peerStore.on('peer', (peerId) => {
    //     console.log('Peer added:', peerId.toB58String())	// Emitted when a peer has been found
    // })

    node.on('peer:discovery', (peerId) => {
        console.log('Discovered:', peerId.toB58String())
    })
}

async function initPeer()  {
    let config =  await generatePeerID();
    let node = await libp2p.create(config)
    attachLibp2pEvents(node);

    await node.start()
    extIP.get().then(ip => {
        global.ip = ip.toString()
        registerPeer([ip.toString(), node.peerId.toB58String()])
        printAddress(node)
    }).catch(err => {
        console.error(err);
    });

    listen(node);

    return node;
}

module.exports = {initPeer}