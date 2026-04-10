module.exports = {
  extends: [
    '../node',
    '../rules/typescript'
  ].map(require.resolve)
};

