const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const { init, scan } = require('../src');

test('init should create config file and scripts', async () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'encode-fe-lint-init-'));
  fs.writeFileSync(
    path.join(cwd, 'package.json'),
    JSON.stringify({ name: 'fixture', private: true, scripts: {} }, null, 2)
  );

  const result = await init({ cwd });
  const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));

  assert.equal(result.configWritten, true);
  assert.equal(typeof pkg.scripts['encode-fe-lint:scan'], 'string');
  assert.equal(fs.existsSync(path.join(cwd, 'encode-fe-lint.config.cjs')), true);
});

test('scan should count files by tool family', async () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'encode-fe-lint-scan-'));
  fs.writeFileSync(
    path.join(cwd, 'package.json'),
    JSON.stringify({ name: 'fixture', private: true, scripts: {} }, null, 2)
  );
  fs.mkdirSync(path.join(cwd, 'src'));
  fs.mkdirSync(path.join(cwd, 'styles'));
  fs.writeFileSync(path.join(cwd, 'src', 'index.js'), 'console.log("hi");\n');
  fs.writeFileSync(path.join(cwd, 'styles', 'index.css'), '.app {}\n');
  fs.writeFileSync(path.join(cwd, 'README.md'), '# hello\n');

  const report = await scan({ cwd });
  const eslint = report.results.find((item) => item.tool === 'eslint');
  const stylelint = report.results.find((item) => item.tool === 'stylelint');
  const markdownlint = report.results.find((item) => item.tool === 'markdownlint');

  assert.equal(eslint.fileCount, 1);
  assert.equal(stylelint.fileCount, 1);
  assert.equal(markdownlint.fileCount, 1);
});
