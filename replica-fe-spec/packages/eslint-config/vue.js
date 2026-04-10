module.exports = {
  extends: [
    './index',
    './rules/vue'
  ].map(require.resolve)
};

