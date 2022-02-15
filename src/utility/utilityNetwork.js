const {sendPeerList} = require("../dialer");
const {createFromB58String} = require("peer-id");
const {createPath, printPeerList} = require("./utility");



const handlePeerCommunication = async (node, type) => {
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
                try {
                    console.log("latency" + await node.ping(peer))
                }
                catch (e) {
                    switch (e.code) {
                        case "ERR_DIALED_SELF":
                            console.log("self dial skipped")
                            break;
                        default:
                            console.log(e.message)
                            break;
                    }
                }
                finally {
                    printPeerList(node)
                }
            }
            break;
        default:
            console.log("No ops")
            break;

    }
    Promise.all(promises)
        .then(() => {
            printPeerList(node);
        })
        .catch((e) => {
        });
}

module.exports = {handlePeerCommunication}