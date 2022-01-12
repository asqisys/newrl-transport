const Node = require('./libp2p/baseNode')
const pipe = require('it-pipe')
const concat = require('it-concat')
const libp2p = require("libp2p");
const process = require("process");
const multiAddr = require("multiaddr");
const {registerPeer, getPeers} = require("./discovery");
const fetch = require("node-fetch");
const {listener} = require("./listener");
const {createPath} = require("./libp2p/baseNode");


function dial(node, address, data) {
    return new Promise(async (resolve, reject) => {
        try {
            const {stream} = await node.dialProtocol(address, '/receive')
            pipe(
                [JSON.stringify(data)],
                stream
            )
            console.log("Sent data to : "+ address.toString())
        }
        catch (e){
            console.log("Error in dial to: "+ address.toString())
        }
    })
}

function dialInternal(node, address,data) {
    return new Promise(async (resolve, reject) => {
        try {
            const {stream} = await node.dialProtocol(address, '/update')
            pipe(
                [JSON.stringify(data)],
                stream
            )
            console.log("Sent data to : "+ address.toString())
        }
        catch (e){
            console.log("Error in dial to: "+ address.toString())
        }
    })
}

let dialToAllPeers = (node, data) => {
    getPeers().then((result) => {
        const promises = [];
        for (let i = 0; i < result.length; i++) {
            let peer = result[i]
            promises.push(dial(node, createPath(peer.address, peer.peerID), data))
        }
        Promise.all(promises)
            .then(() => {
                console.log("Dialled All")
            })
            .catch((e) => {
            });
    })

}

let updateAllPeers = (node) => {
    getPeers().then((result) => {
        const promises = [];
        for (let i = 0; i < result.length; i++) {
            let peer = result[i]
            promises.push(dialInternal(node, createPath(peer.address, peer.peerID), "update412"))
        }
        Promise.all(promises)
            .then(() => {
                console.log("Dialled All")
            })
            .catch((e) => {
            });
    })

}

module.exports = {dialToAllPeers,updateAllPeers}