const fs = require('fs');
const pipe = require("it-pipe");
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

const discoverPeersFromList = (node, list) => {
        let addressList = list[0]
        console.log(addressList);
        // addressList.split(',').map(async (address) => {
        //     let latency = await node.ping(address)
        //     console.log("Ping" + address + " Latency " + latency)
        // });
}

module.exports = {writeJSONFile, readFromJSONFile, connectionPrint, printAddress, createPath, discoverPeersFromList}