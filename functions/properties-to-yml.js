'use strict';

const bash = require('../bash');
const util = require('util');
const parse = util.promisify(require('properties').parse);
const YAML = require('json2yaml');

const rename = util.promisify(require('fs').rename);
const writeFile = util.promisify(require('fs').writeFile);

const options = {
    path: true,
    namespaces: true,
    sections: true,
    variables: true,
    include: true
};

async function propertiesToYml(propertiesPath) {
    if (!propertiesPath) throw new Error('properties path should not be null');

    const properties = await parse(propertiesPath, options);

    const yml = YAML.stringify(properties);
    await writeFile(propertiesPath, yml);

    return await renameToYml(propertiesPath);
}

async function renameToYml(propertiesPath) {
    let isTracked;
    try {
        isTracked = !!(await bash(`git ls-files ${propertiesPath}`));
    } catch (e) {
        isTracked = false;
    }
    const ymlPath = propertiesPath.replace(new RegExp('\.properties$'), '.yml');
    if (isTracked) {
        await bash(`git mv ${propertiesPath} ${ymlPath}`);
    } else {
        await rename(propertiesPath, ymlPath);
    }
    return ymlPath;
}

module.exports = propertiesToYml;