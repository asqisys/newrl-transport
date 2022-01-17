const fs = require('fs');

function readFromJSONFile(path) {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
}

module.exports = {readFromJSONFile}