'use strict';

const test = require('supertape');
const replace = require('../lib/replace');

test('replace: one npm run ', (t) => {
    const result = replace('npm run one', (type, str) => {
        t.equal(type, 'npm', 'type should be npm');
        return str;
    });
    
    t.equal(result, 'one', 'should get script name');
    t.end();
});

test('replace: npm tst', (t) => {
    const result = replace('npm tst', (type, str) => {
        t.equal(type, 'npm', 'type should be npm');
        return str;
    });
    
    t.equal(result, 'test', 'should determine reserved: tst');
    
    t.end();
});

test('replace: npm t', (t) => {
    const result = replace('npm t', (type, str) => {
        t.equal(type, 'npm', 'type should be npm');
        return str;
    });
    
    t.equal(result, 'test', 'should determine reserved: t');
    
    t.end();
});

test('replace: npm version', (t) => {
    const result = replace('npm version', (type, str) => {
        t.equal(type, 'npm', 'type should be npm');
        return str;
    });
    
    t.equal(result, 'npm version', 'should leave unchanged "npm version"');
    
    t.end();
});

test('replace: npm publish', (t) => {
    const result = replace('npm publish', (type, str) => {
        t.equal(type, 'npm', 'type should be npm');
        return str;
    });
    
    t.equal(result, 'npm publish', 'should leave unchanged "npm publish"');
    
    t.end();
});

test('replace: a few npm runs', (t) => {
    const cmd = replace('npm run one && npm run two', (type, str) => {
        t.equal(type, 'npm', 'type should be npm');
        return str;
    });
    
    t.equal(cmd, 'one && two', 'should cut npm run from all expressions');
    
    t.end();
});

