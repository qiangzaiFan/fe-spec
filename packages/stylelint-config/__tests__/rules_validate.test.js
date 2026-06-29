const assert = require('node:assert/strict')
const path = require('node:path')
const test = require('node:test')

test('stylelint config reports violations for invalid css', async () => {
  const stylelint = await import('stylelint')
  const configPath = path.resolve(__dirname, './fixtures/index.css')
  const result = await stylelint.default.lint({
    configFile: path.join(__dirname, '../index.js'),
    files: configPath,
    fix: true
  })

  assert.equal(result.errored, false)

  const warnings = result.results?.[0]?.warnings ?? []
  assert.ok(warnings.length > 0)
  assert.equal(warnings[0].severity, 'warning')
  assert.match(warnings[0].text, /Unknown property "colr"/)
})
