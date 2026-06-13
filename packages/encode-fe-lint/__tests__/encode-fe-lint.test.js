'use strict';

const encodeFeLint = require('..');
const assert = require('assert').strict;

assert.strictEqual(encodeFeLint(), 'Hello from encodeFeLint');
console.info('encodeFeLint tests passed');
