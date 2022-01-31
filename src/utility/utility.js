const fs = require('fs');
const path = require("path");

function readFromJSONFile(address) {
    return JSON.parse(fs.readFileSync(path.resolve(address), 'utf8'));
}

module.exports = {readFromJSONFile}