const path = require('node:path');
const { EXTENSIONS, DEFAULT_CONFIG, resolveConfigPath } = require('../utils/constants');
const { walkFiles } = require('../utils/files');

function loadConfig(cwd) {
  const configPath = resolveConfigPath(cwd);
  try {
    return require(configPath);
  } catch {
    return DEFAULT_CONFIG;
  }
}

function countMatches(files, extensions) {
  return files.filter((file) => extensions.has(path.extname(file))).length;
}

async function scan(options = {}) {
  const cwd = options.cwd || process.cwd();
  const include = options.include || cwd;
  const includeRoot = path.isAbsolute(include) ? include : path.join(cwd, include);
  const config = options.config || loadConfig(cwd);
  const files = walkFiles(includeRoot);
  const results = [];

  if (config.enableESLint !== false) {
    results.push({
      tool: 'eslint',
      fileCount: countMatches(files, EXTENSIONS.eslint),
      fix: Boolean(options.fix)
    });
  }

  if (config.enableStylelint !== false) {
    results.push({
      tool: 'stylelint',
      fileCount: countMatches(files, EXTENSIONS.stylelint),
      fix: Boolean(options.fix)
    });
  }

  if (config.enableMarkdownlint !== false) {
    results.push({
      tool: 'markdownlint',
      fileCount: countMatches(files, EXTENSIONS.markdownlint),
      fix: Boolean(options.fix)
    });
  }

  return {
    cwd,
    include: includeRoot,
    results,
    errorCount: 0,
    warningCount: 0,
    runErrors: []
  };
}

module.exports = scan;

