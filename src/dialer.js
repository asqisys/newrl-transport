const Node = require('./libp2p/baseNode')
const pipe = require('it-pipe')
const concat = require('it-concat')
const libp2p = require("libp2p");
const process = require("process");
const multiAddr = require("multiaddr");
const {registerPeer, getPeers} = require("./discovery");
const fetch = require("node-fetch");
const {listener} = require("./listener");
const {connectionPrint, createPath} = require("./utility/utility");


function dial(node, address, data, protocol = '/receive') {
    return new Promise(async (resolve, reject) => {
        try {
            const {stream} = await node.dialProtocol(address, protocol)
            pipe(
                [JSON.stringify(data)],
                stream
            )
            console.log("Sent data to "+ connectionPrint(address))
        }
        catch (e){
            console.log("Error in dial to: "+ connectionPrint(address))
            console.log("Stack Trace : \n "+ e.stack)
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
    const promises = [];
    if(data['operation'] === "0") {
        node.peerStore.peers.forEach(async (peer) => {
            // console.log(peer.id.toB58String())
            promises.push(dial(node, peer.id, data))
        });
    }else {
        getPeers().then((result) => {
            for (let i = 0; i < result.length; i++) {
                let peer = result[i]
            //     promises.push(dial(node, createPath(peer.address, peer.peerID), data))
                promises.push(node.ping(createPath(peer.address, peer.peerID)))
            }

        })
    }
    Promise.all(promises)
        .then(() => {
            console.log("Dialled All")
        })
        .catch((e) => {
        });

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

let sendPeerList = (node, target) =>{
    let addressList = [];
    node.peerStore.peers.forEach( (peer) => {
        let addresses = node.peerStore.addressBook.getMultiaddrsForPeer(peer.id)
        addressList.push(addresses)
    });
    dial(node, target, addressList,"/peer_communication")
    // dialToAllPeers(node,{"operation": "0"})
}

module.exports = {dialToAllPeers,updateAllPeers,sendPeerList}