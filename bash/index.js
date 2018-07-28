'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);

const FG_BLUE = "\x1b[34m%s\x1b[0m";

async function bash(command) {
    console.log(FG_BLUE, command);
    const {stdout, stderr} = await exec(command, {maxBuffer: 1024 * 500});
    if (stderr) throw stderr;
    return ifObjectGetJSON(stdout);
}

function ifObjectGetJSON(string) {
    try {
        const object = JSON.parse(string);
        if (object && typeof object === 'object') return object;
    } catch (e) {
    }
    return string;
}

module.exports = bash;
