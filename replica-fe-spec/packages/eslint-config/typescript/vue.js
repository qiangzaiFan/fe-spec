module.exports = {
  extends: [
    '../vue',
    '../rules/typescript'
  ].map(require.resolve)
};

