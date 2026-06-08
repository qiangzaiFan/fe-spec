const rule = require('../../rules/no-broad-semantic-versioning');
const { RuleTester } = require('eslint');

// Jest 执行这个 test 文件；RuleTester 负责把 code 喂给 ESLint 规则并比对结果。
const ruleTester = new RuleTester();

ruleTester.run('no-broad-semantic-versioning', rule, {
  // valid 表示这些输入不会触发 no-broad-semantic-versioning。
  valid: [
    {
      // 规则内部会判断文件名是否为 package.json，所以测试时要传 filename。
      filename: 'package.json',
      // package.json 需要经过 processor 才能被 ESLint 当成 JS 解析。
      // 单元测试里没有走 processor，所以这里手动包成 module.exports = {...}。
      code: `module.exports = ${JSON.stringify({
        devDependencies: { 'eslint-plugin-encode': '^0.0.5' },
      })}`,
    },
    {
      filename: 'package.js',
      code: 'var t = 1',
    },
  ],

  // invalid 表示这些输入应该触发规则报错。
  invalid: [
    {
      filename: 'package.json',
      code: `module.exports = ${JSON.stringify({
        devDependencies: { 'eslint-plugin-encode': '*' },
      })}`,
      errors: [
        {
          message: 'The "eslint-plugin-encode" is not recommended to use "*"',
        },
      ],
    },
  ],
});
