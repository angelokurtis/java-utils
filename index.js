#!/usr/bin/env node

'use strict';

const program = require('commander');
const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync(`${__dirname}/package.json`, 'utf8'));

const propertiesToYml = require('./functions/properties-to-yml');
const ymlToProperties = require('./functions/yml-to-properties');

program.version(packageJson.version);

program.command('properties-to-yml <properties-path>')
    .action(propertiesPath => printResult(propertiesToYml(propertiesPath)));
program.command('yml-to-properties <yml-path>')
    .action(ymlPath => printResult(ymlToProperties(ymlPath)));

program.parse(process.argv);

function printResult(promise) {
    promise
        .then(function (output) {
            if (typeof output === 'object') console.log(JSON.stringify(output, null, 2));
            else console.log(output);
        })
        .catch(function (err) {
            console.error(err)
        });
}
