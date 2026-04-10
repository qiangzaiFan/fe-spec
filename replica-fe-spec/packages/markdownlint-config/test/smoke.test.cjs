const test = require('node:test');
const assert = require('node:assert/strict');

test('markdownlint config should load as json', () => {
  const config = require('../index.json');

  assert.equal(config.default, true);
  assert.equal(config['ul-style'].style, 'dash');
});

