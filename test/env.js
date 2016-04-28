'use strict';

let test = require('tape');
let env = require('../lib/env');

test('env: $PATH', (t) => {
    let path = env.path('hello:world', ':', 'home', '/');
    
    t.equal(path, 'hello:world:home/node_modules/.bin', 'should build PATH');
    t.end();
});

test('env: $npm_package_config', (t) => {
    let result = {
        npm_package_config_poly: 'hello'
    };
    
    let config = env.config({
        poly: 'hello'
    });
    
    t.deepEqual(config, result, 'should build npm config');
    t.end();
});

