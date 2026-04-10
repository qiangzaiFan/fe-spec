const test = require('node:test');
const assert = require('node:assert/strict');

const rule = require('../rules/no-http-url');

test('no-http-url should report http literals', () => {
  const reports = [];
  const visitor = rule.create({
    report(payload) {
      reports.push(payload);
    }
  });

  visitor.Literal({ value: 'http://example.com' });

  assert.equal(reports.length, 1);
  assert.equal(reports[0].messageId, 'noHttpUrl');
});

test('no-http-url should ignore https literals', () => {
  const reports = [];
  const visitor = rule.create({
    report(payload) {
      reports.push(payload);
    }
  });

  visitor.Literal({ value: 'https://example.com' });

  assert.equal(reports.length, 0);
});

