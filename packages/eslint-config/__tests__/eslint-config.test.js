'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const eslintConfig = require('..');

test('exports a shareable eslint config object', () => {
  assert.equal(typeof eslintConfig, 'object');
  assert.equal(eslintConfig.parser, '@babel/eslint-parser');
  assert.ok(Array.isArray(eslintConfig.extends));
  assert.ok(eslintConfig.extends.length > 0);
});
