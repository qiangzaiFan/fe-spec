const fs = require('node:fs');
const path = require('node:path');
const { CONFIG_FILE, DEFAULT_CONFIG, PKG_NAME, resolveConfigPath } = require('../utils/constants');
const { readJson, writeJson } = require('../utils/files');

function renderConfig(config) {
  return `module.exports = ${JSON.stringify(config, null, 2)};\n`;
}

async function init(options = {}) {
  const cwd = options.cwd || process.cwd();
  const pkgPath = path.join(cwd, 'package.json');
  const configPath = resolveConfigPath(cwd);
  const summary = {
    packageCreated: false,
    packageUpdated: false,
    configWritten: false,
    files: []
  };

  let pkg;
  if (fs.existsSync(pkgPath)) {
    pkg = readJson(pkgPath);
  } else {
    pkg = {
      name: path.basename(cwd),
      private: true,
      version: '0.0.0',
      scripts: {}
    };
    summary.packageCreated = true;
  }

  if (!pkg.scripts) {
    pkg.scripts = {};
  }

  pkg.scripts[`${PKG_NAME}:scan`] = `${PKG_NAME} scan`;
  pkg.scripts[`${PKG_NAME}:fix`] = `${PKG_NAME} fix`;
  pkg.scripts[`${PKG_NAME}:init`] = `${PKG_NAME} init`;
  writeJson(pkgPath, pkg);
  summary.packageUpdated = true;
  summary.files.push(pkgPath);

  const config = { ...DEFAULT_CONFIG, ...(options.config || {}) };
  fs.writeFileSync(configPath, renderConfig(config));
  summary.configWritten = true;
  summary.files.push(configPath);

  return summary;
}

module.exports = init;
module.exports.CONFIG_FILE = CONFIG_FILE;

