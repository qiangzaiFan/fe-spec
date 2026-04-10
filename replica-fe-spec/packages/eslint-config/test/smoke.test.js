const test = require('node:test');
const assert = require('node:assert/strict');

test('all config entrypoints should export objects', () => {
  const entrypoints = [
    require('../index'),
    require('../react'),
    require('../vue'),
    require('../node'),
    require('../typescript'),
    require('../typescript/react'),
    require('../typescript/vue'),
    require('../typescript/node')
  ];

  entrypoints.forEach((config) => {
    assert.equal(typeof config, 'object');
  });
});

