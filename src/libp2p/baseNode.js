const TCP = require('libp2p-tcp')
const NOISE = require("libp2p-noise");
const MPLEX = require('libp2p-mplex')
const process = require("process");
const {exec} = require('child_process');
const PeerId = require('peer-id')
const {readFromJSONFile} = require("../utility/utility");
const Base58 = require("base-58")
const protobuf = require('protobufjs');
const path = require("path");
const PeerInfo = require('peer-info')
const defaultsDeep = require("@nodeutils/defaults-deep");
const Bootstrap = require("libp2p-bootstrap");


const WALLET_PATH = `src/data/wallet2.json`
// const DEFAULT_OPTS = {
//     addresses: {
//         listen: ['/ip4/0.0.0.0/tcp/52724']
//     },
//     peerId: null,
//     modules: {
//         transport: [TCP],
//         connEncryption: [NOISE],
//         streamMuxer: [MPLEX]
//     }
// }
const DEFAULT_OPTS = {
    addresses: {
        listen: ['/ip4/0.0.0.0/tcp/52724']
    },
    modules: {
        transport: [TCP],
            streamMuxer: [MPLEX],
            connEncryption: [NOISE],
            peerDiscovery: [Bootstrap]
    },
    config: {
        peerDiscovery: {
            bootstrap: {
                interval: 60e3,
                    enabled: true,
                    list: [
                        // '/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
                        '/ip4/18.140.71.178/tcp/52724/p2p/Qmb7RDb1iUr81gfboAmoduYu5EDNfv6cc5aQK2pmVXgTZ2'
                    ]
            }
        }
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

async function getWalletData() {
    let walletFile = readFromJSONFile(WALLET_PATH)
    // const root = await protobuf.load(path.join("./src/data", 'wallet.proto'));
    // let priv = root.lookupType('walletPackage.PrivKey');
    // let pub = root.lookupType('walletPackage.PubKey');
    // return Buffer.from(walletFile.address, 'utf8').toString('hex');
    return {
        pubKey: walletFile.pubKey,
        // privKey: priv.encode(walletFile.private).finish(),
        // id: Buffer.from(walletFile.address, 'utf8').toString('hex'),
    }

}

const generatePeerID = () => {
    return new Promise(async (resolve, reject) => {
//
//         const id3 = await PeerId.createFromJSON(require('../data/wallet2.json'))
//         // const id = await PeerId.createFromJSON(require('../data/wallet2.json'))
//         const id = await PeerId.create({bits:2048,keyType: "RSA"})
//         // let peer = new PeerInfo(id2)
//         // peer.multiaddrs.add(DEFAULT_OPTS["addresses"]["listen"][0])
//         // console.log("Initialized peer from wallet")
        let config  = DEFAULT_OPTS
//         config["peerId"] = id3
        resolve(config)
    })
}


module.exports = {DEFAULT_OPTS, printAddress, stop, createPath, updateCode, restartServer, generatePeerID}
