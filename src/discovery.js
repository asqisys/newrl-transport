const mysql = require('mysql');

let dbconfig = {
    host: "database-1.cqo0i3u7svms.ap-southeast-1.rds.amazonaws.com",
    user: "admin",
    password: "asqiAdmin",
    database: "newrl"
};
let dbcon

function handleDisconnect() {
    dbcon = mysql.createConnection(dbconfig);
    dbcon.connect(function (err) {
        if (err) {
            console.log('Error while connecting to DB', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    dbcon.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect()

let getPeers = () => {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM peers WHERE Address!=" + "\"" + global.ip + "\" And id=120"
        dbcon.query(sql, function (err, result, fields) {
            if (err) {
                handleDisconnect();
                return []
            }
            resolve(result);
        });
    });
}

let registerPeer = (data) => {
    let sql = "INSERT INTO peers (address,peerID) VALUES (\"" + data[0] + "\",\"" + data[1] + "\") ON DUPLICATE KEY UPDATE peerID=\"" + data[1] + "\"";
    dbcon.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result.insertId);
    });
}

module.exports = {getPeers, registerPeer}