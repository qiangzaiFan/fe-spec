const fs = require('node:fs');
const path = require('node:path');
const { DEFAULT_IGNORES } = require('./constants');

function readJson(filepath) {
  return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function writeJson(filepath, value) {
  fs.writeFileSync(filepath, JSON.stringify(value, null, 2));
}

function walkFiles(rootDir, options = {}) {
  const ignores = options.ignores || DEFAULT_IGNORES;
  const files = [];

  if (!fs.existsSync(rootDir)) {
    return files;
  }

  function visit(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      if (ignores.has(entry.name)) {
        continue;
      }

      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        visit(fullPath);
        continue;
      }

      files.push(fullPath);
    }
  }

  visit(rootDir);
  return files;
}

module.exports = {
  readJson,
  walkFiles,
  writeJson
};

