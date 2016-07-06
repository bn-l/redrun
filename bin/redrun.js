#!/usr/bin/env node

'use strict';

const path = require('path');
const tryCatch = require('try-catch');
const squad = require('squad');
const readjson = require('readjson');

const mapsome = require('mapsome');

const cliParse = require('../lib/cli-parse');
const cwd = process.cwd();
const argv = process.argv.slice(2);
const first = argv[0];

const Directory = storage();
const Info = storage();

const tryOrExit = squad(exitIfError, tryCatch);

let arg;
let ErrorCode = 1;

if (!first|| /^(-v|--version|-h|--help)$/.test(first))
    arg = cliParse(argv, {});
else
    arg = cliParse(argv,  traverseForInfo(cwd).scripts);

if (arg.name !== 'run') {
    console.log(arg.output);
} else {
    if (!arg.quiet)
        console.log(`> ${arg.cmd}`);
    
    if (arg.calm)
        ErrorCode = 0;
     
    execute(arg.cmd);
}

function execute(cmd) {
    const execSync = require('child_process').execSync;
    
    tryOrExit(() => {
        execSync(cmd, {
            stdio: 'inherit',
            env: getEnv(),
            cwd: Directory()
        });
    });
}

function getEnv() {
    const env = require('../lib/env');
    const path = require('path');
    
    const dir = Directory();
    const config = Info().config;
    const assign = Object.assign;
    
    const PATH = env.path(process.env.PATH, path.delimiter, dir, path.sep);
    
    const envVars = assign(process.env, env.config(config), {
        PATH: PATH
    });
    
    return envVars;
}

function exitIfError(error) {
    if (error) {
        console.error(error.message);
        process.exit(ErrorCode);
    }
    
    return error;
}

function getInfo(dir) {
    let info;
    const infoPath = path.join(dir, 'package.json');
    
    const error = tryCatch(() => {
        info = readjson.sync(infoPath);
        
        Info(info);
        Directory(dir);
    });
    
    notEntryError(error);
    
    return info;
}

function traverseForInfo(cwd) {
    const parentDirs = require('parent-dirs')(cwd);
    const result = mapsome((dir) => getInfo(dir), parentDirs);
    
    exitIfEntryError(result);
    
    return result;
}

function notEntryError(error) {
    if (error && error.code !== 'ENOENT')
        return error;
}

function exitIfEntryError(data) {
    if (!data) {
        const infoPath = path.join(cwd, 'package.json');
        const error = Error(`Cannot find module \'${infoPath}\'`);
        exitIfError(error);
    }
}

function storage() {
    let value;
    return (data) => {
        if (data)
            value = data;
        else
            return value;
    };
}

