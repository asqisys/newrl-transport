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
    console.log('Node is listening on:')
    node.multiaddrs.forEach((ma) => console.log(`${ma.toString()}/p2p/${node.peerId.toB58String()}`))
}

const createPath = (address,peerid) => {
    return "/ip4/"+ address+"/tcp/52724/p2p/"+peerid;
}

const stop = async (node) => {
    await node.stop()
    console.log('libp2p has stopped')
    process.exit(0)
}


module.exports = {DEFAULT_OPTS,printAddress,stop,createPath}
