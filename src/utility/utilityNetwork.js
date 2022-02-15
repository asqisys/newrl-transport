const {sendPeerList} = require("../dialer");
const {createFromB58String} = require("peer-id");
const {createPath, printPeerList} = require("./utility");


function pingPeer(node, peer) {
    return new Promise(async (resolve, reject) => {
        try {
            return console.log("latency" + await node.ping(peer))
        } catch (e) {
            switch (e.code) {
                case "ERR_DIALED_SELF":
                    console.log("Self dial skipped")
                    return "Error"
                    break;
                default:
                    console.log(e.message)
                    return "Generic error"
                    break;
            }
        }
    })
}

const handlePeerCommunication = (node, type) => {
    let promises = [];
    switch (type["ops"]) {
        case "dlpeer":
            let peer = createFromB58String(type["peerID"])
            sendPeerList(node, peer)
            break;
        case "dlpeer2":
            let addressList = type["list"][0]
            for (let i = 0; i < addressList.length; i++) {
                let peer = addressList[i]
                promises.push(pingPeer(node, peer));
            }
            break;
        default:
            console.log("No ops")
            break;

    }
    Promise.allSettled(promises)
        .then((result) => {
            console.log(result.map(promise => promise.status));
            printPeerList(node);
        })
        .catch((e) => {
            console.log("errors caught"+ e)
        });
}

module.exports = {handlePeerCommunication}