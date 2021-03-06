const pipe = require("it-pipe");
const concat = require("it-concat");
const fetch = require('node-fetch');
const {updateCode} = require("./libp2p/baseNode");

function sendToApplication(payload) {
    fetch('http://localhost:8090/receive', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: payload
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err);
    });
}

function listener(node) {
    node.handle('/receive', async ({stream}) => {
        const result = await pipe(
            stream,
            concat
        )
        console.log("Received data, sending to application")
        sendToApplication(result.toString())
    })
}

function internalListener(node) {
    node.handle('/update', async ({stream}) => {
        const result = await pipe(
            stream,
            concat
        )
        console.log("Received data: "+ result.toString())
        // if(result.toString() === "update412"){
            updateCode()
        // }
    })
}


module.exports = {listener,internalListener}