
const handlePeerCommunication = (node, type) => {
    switch (type["ops"]) {
        case "dlpeer":
            let peerID = type["peerID"]
            break;
        default:
            console.log("No ops")
            break;

    }
}

module.exports = {handlePeerCommunication}