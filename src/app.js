const express = require('express')
const bodyParser = require('body-parser')
const {initPeer} = require("./initNode");
const {dialToAllPeers, updateAllPeers} = require("./dialer");

const app = express()
const port = 8095

global.ip = "127.0.0.1"

app.use(express.json())

initPeer().then((node) => {
    global.peer = node
})

app.get('/', (req, res) => {
    res.send(200)
});

app.listen(port, () => {
    console.log(`P2P network running at http://localhost:${port}`)
})

app.post('/send', (req, res) => {
    let data = req.body
    //ToDO Add logger
    dialToAllPeers(global.peer, data)
    res.send('200')

});

app.get('/update', (req, res) => {
    updateAllPeers(global.peer)
    res.send('200')

});

app.get("/system/reboot", (req, res)=>{

})