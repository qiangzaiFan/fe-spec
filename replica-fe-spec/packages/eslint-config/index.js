module.exports = {
  extends: [
    './rules/base'
  ].map(require.resolve),
  env: {
    es2021: true,
    browser: true
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  root: true
};

