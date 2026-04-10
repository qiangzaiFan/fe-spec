const path = require('node:path');

const PKG_NAME = 'encode-fe-lint';
const CONFIG_FILE = `${PKG_NAME}.config.cjs`;

const DEFAULT_CONFIG = {
  enableESLint: true,
  enableStylelint: true,
  enableMarkdownlint: true,
  enablePrettier: true
};

const DEFAULT_IGNORES = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  'coverage',
  'lib',
  'es'
]);

const EXTENSIONS = {
  eslint: new Set(['.js', '.jsx', '.ts', '.tsx', '.vue']),
  stylelint: new Set(['.css', '.scss', '.less']),
  markdownlint: new Set(['.md'])
};

module.exports = {
  CONFIG_FILE,
  DEFAULT_CONFIG,
  DEFAULT_IGNORES,
  EXTENSIONS,
  PKG_NAME,
  resolveConfigPath(cwd) {
    return path.join(cwd, CONFIG_FILE);
  }
};

