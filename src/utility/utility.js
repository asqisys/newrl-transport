const fs = require('fs');
const {IDENTITY_FILE_PATH} = require("../data/const");

function readFromJSONFile(path) {
    try {
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch (e) {
        return null;
    }
}

function writeJSONFile(data) {
    try {
        return (fs.writeFileSync(IDENTITY_FILE_PATH, JSON.stringify(data), 'utf8'));
    } catch (e) {
        return null;
    }
}

function connectionPrint(nodeAddress) {
    try {
        return nodeAddress.toB58String()
    } catch (e) {
        return nodeAddress.toString()
    }
}

const printAddress = (node) => {
    console.log('Node Internal Addresses:')
    node.multiaddrs.forEach((ma) => console.log(ma.toString() + "/p2p/" + node.peerId.toB58String()))
    console.log('Node External Address:')
    console.log(createPath(global.ip, node.peerId.toB58String()))
}


const createPath = (address, peerid) => {
    return "/ip4/" + address + "/tcp/52724/p2p/" + peerid;
}

function printPeerList(node) {
    console.log("Peer list: ")
    node.peerStore.peers.forEach((peer) => {
        console.log(peer.id.toB58String())
        // let addresses = node.peerStore.addressBook.getMultiaddrsForPeer(peer.id)
        // addressList.push(addresses)
    });
}


module.exports = {writeJSONFile, readFromJSONFile, connectionPrint, printAddress, createPath,printPeerList}