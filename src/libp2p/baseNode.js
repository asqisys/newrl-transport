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
const {exec} = require('child_process');
const Bootstrap = require("libp2p-bootstrap");
const {readFromJSONFile, writeJSONFile} = require("../utility/utility");
const PeerId = require("peer-id");
const {bootstrapList, IDENTITY_FILE_PATH} = require("../data/const");
const DEFAULT_OPTS = {
    addresses: {
        listen: ['/ip4/0.0.0.0/tcp/52724']
    },
    modules: {
        transport: [TCP],
        connEncryption: [NOISE],
        streamMuxer: [MPLEX],
        peerDiscovery: [Bootstrap]
    },
    config: {
        peerDiscovery: {
            autoDial: true,
            [Bootstrap.tag]: {
                list: bootstrapList,
                interval: 2000,
                enabled: true
            }
        }
    }
}

const stop = async (node) => {
    await node.stop()
    console.log('libp2p has stopped')
    process.exit(0)
}

const updateCode = () => {
    console.log("Updater Running @#$")
    exec('git pull', (err, stdout, stderr) => {
        console.log("Updating CodeBase")
    });
    exec('npm install', () => {
        console.log("Installing Dependencies")
    })
    restartServer()
}

const restartServer = () => {
    setTimeout(function () {
        // When NodeJS exits
        process.on("exit", function () {

            require("child_process").spawn(process.argv.shift(), process.argv, {
                cwd: process.cwd(),
                detached: true,
                stdio: "inherit"
            });
        });
        process.exit();
    }, 1000);
}

async function createPeerIdentity() {
    let identityJson = await PeerId.create({bits: 1024, keyType: 'RSA'})
    writeJSONFile(identityJson.toJSON())
    return identityJson;
}

const generatePeerID = () => {
    return new Promise(async (resolve, reject) => {
        let nodeConfig = DEFAULT_OPTS
        let identityJson = readFromJSONFile(IDENTITY_FILE_PATH)
        if(identityJson)
            nodeConfig["peerId"] = await PeerId.createFromJSON(identityJson)
        else{
            nodeConfig["peerId"] = await createPeerIdentity();
        }
        resolve(nodeConfig)
    })
}


module.exports = {DEFAULT_OPTS, stop, updateCode, restartServer, generatePeerID}
