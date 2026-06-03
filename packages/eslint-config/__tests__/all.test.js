'use strict';

const nodeTest = require('node:test');

Object.assign(globalThis, {
  after: nodeTest.after,
  afterEach: nodeTest.afterEach,
  before: nodeTest.before,
  beforeEach: nodeTest.beforeEach,
  describe: nodeTest.describe,
  it: nodeTest.it,
});

require('./eslint-config.test');
require('./use-babel-eslint.test');
require('./validate-js-configs.test');
require('./validate-ts-configs.test');
