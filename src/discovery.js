const mysql = require('mysql');

let con = mysql.createConnection({
    host: "database-1.cqo0i3u7svms.ap-southeast-1.rds.amazonaws.com",
    user: "admin",
    password: "asqiAdmin",
    database: "newrl"
});
con.connect(function (err) {
    if (err) throw err

});
let getPeers = () => {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM peers WHERE Address!="+"\""+global.ip+"\""
        con.query(sql, function (err, result, fields) {
            if (err) return [];
            resolve(result);
        });
    });
}

let registerPeer = (data) => {
    let sql = "INSERT INTO peers (address,peerID) VALUES (\"" + data[0] + "\",\"" + data[1] + "\") ON DUPLICATE KEY UPDATE peerID=\"" + data[1] + "\"";
    con.query(sql, function (err, result) {
        if (err) throw err;
        return result.insertId;
    });
}

module.exports = {getPeers, registerPeer}