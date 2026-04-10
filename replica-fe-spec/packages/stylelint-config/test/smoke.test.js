const test = require('node:test');
const assert = require('node:assert/strict');

test('stylelint config should expose rules', () => {
  const config = require('../index');

  assert.equal(typeof config, 'object');
  assert.equal(typeof config.rules, 'object');
  assert.equal(config.rules['block-no-empty'], true);
});

