const fs = require('fs');
const process = require('process');
const axios = require('axios');

function output(out, data) {
    if (out) {
        fs.writeFile(out, data, 'utf8', function (err) {
            if (err) {
                console.log(`Couldn't write ${out}: ${err}`);
                process.exit(1);
            }
        })
    } else {
        console.log(data);
    }
}

function cat(out, path) {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.log(`Error reading ${path}: ${err}`);
            process.kill(1);
        } else {
            output(out, data);
        }
    })
}

async function webCat(out, url) {
    try {
        let res = await axios.get(url);
        output(out, res.data);
    } catch (err) {
        console.log(`Error fetching ${url}: ${err}`);
        process.kill(1);
    }
}

let path;
let out;

if (process.argv[2] === "--out") {
    out = process.argv[3];
    path = process.argv[4];
} else {
    path = process.argv[2];
}

if (path.slice(0, 4) === 'http') {
    webCat(out, path);
} else {
    cat(out, path);
}