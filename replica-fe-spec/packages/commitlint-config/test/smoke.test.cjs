const test = require('node:test');
const assert = require('node:assert/strict');

test('commitlint config should expose rules', () => {
  const config = require('../index.cjs');

  assert.equal(typeof config, 'object');
  assert.equal(Array.isArray(config.rules['type-enum'][2]), true);
});

