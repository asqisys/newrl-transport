const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const Multiplex = require('libp2p-mplex')
const SECIO = require('libp2p-secio')
const defaultsDeep = require('@nodeutils/defaults-deep')
const {NOISE} = require("libp2p-noise");
const MPLEX = require('libp2p-mplex')
const libp2p = require("libp2p");
const process = require("process");
const pipe = require("it-pipe");
const concat = require("it-concat");
const { exec } = require('child_process');
const DEFAULT_OPTS = {
    addresses: {
        // To signal the addresses we want to be available, we use
        // the multiaddr format, a self describable address
        listen: ['/ip4/0.0.0.0/tcp/52724']
    },
    modules: {
        transport: [TCP],
        connEncryption: [NOISE],
        streamMuxer: [MPLEX]
    }
}

const printAddress = (node) => {
    console.log('Node Internal Addresses:')
    node.multiaddrs.forEach((ma) => console.log(ma.toString()+"/p2p/"+node.peerId.toB58String()))
    console.log('Node External Address:')
    console.log(createPath(global.ip,node.peerId.toB58String()))
}

const createPath = (address,peerid) => {
    return "/ip4/"+ address+"/tcp/52724/p2p/"+peerid;
}

const stop = async (node) => {
    await node.stop()
    console.log('libp2p has stopped')
    process.exit(0)
}

const updateCode = ()=>{
    console.log("Updater Running @#$")
    exec('git pull', (err, stdout, stderr) => {
        console.log("Updating CodeBase")
    });
    exec('npm install',()=>{
        console.log("Installing Dependencies")
    })
    restartServer()
}

const restartServer = ()=>{
    setTimeout(function () {
        // When NodeJS exits
        process.on("exit", function () {

            require("child_process").spawn(process.argv.shift(), process.argv, {
                cwd: process.cwd(),
                detached : true,
                stdio: "inherit"
            });
        });
        process.exit();
    }, 1000);
}

module.exports = {DEFAULT_OPTS,printAddress,stop,createPath,updateCode,restartServer}
