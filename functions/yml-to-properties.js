'use strict';

const bash = require('../bash');
const util = require('util');
const yaml = require('js-yaml');

const readFile = util.promisify(require('fs').readFile);
const rename = util.promisify(require('fs').rename);
const writeFile = util.promisify(require('fs').writeFile);


async function ymlToProperties(ymlPath) {
    if (!ymlPath) throw new Error('yml path should not be null');

    const yml = yaml.safeLoad(await readFile(ymlPath));

    const properties = parseToProperties(yml).join('\n');
    await writeFile(ymlPath, properties);

    return await renameToProperties(ymlPath);
}

function parseToProperties(yml, parentKey) {
    let properties = [];
    Object.keys(yml)
        .forEach(function (key) {
            const propertiesKey = parentKey ? `${parentKey}.${key}` : key;
            const ymlElement = yml[key];
            if (typeof ymlElement === 'object') {
                properties = properties.concat(parseToProperties(ymlElement, propertiesKey));
            } else {
                properties = properties.concat(`${propertiesKey}=${ymlElement}`);
            }
        });

    return properties;
}

async function renameToProperties(ymlPath) {
    let isTracked;
    try {
        isTracked = !!(await bash(`git ls-files ${ymlPath}`));
    } catch (e) {
        isTracked = false;
    }
    const propertiesPath = ymlPath.replace(new RegExp('\.yml$'), '.properties');
    if (isTracked) {
        await bash(`git mv ${ymlPath} ${propertiesPath}`);
    } else {
        await rename(ymlPath, ymlPath);
    }
    return propertiesPath;
}

module.exports = ymlToProperties;