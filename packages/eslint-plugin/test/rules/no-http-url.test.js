'use strict';

const rule = require('../../rules/no-http-url');
const { RuleTester } = require('eslint');

// RuleTester 是 ESLint 官方提供的规则测试工具，Jest 负责发现并执行这个测试文件。
// 运行 npm run test / pnpm test 时，Jest 会执行 *.test.js，RuleTester 会断言规则行为。
const ruleTester = new RuleTester();

ruleTester.run('no-http-url', rule, {
  // valid：这些代码不应该触发规则报错。
  valid: [
    {
      code: "var test = 'https://chenghuai.com';",
    },
  ],

  // invalid：这些代码应该触发规则报错，并且 errors 要和 context.report 的结果匹配。
  invalid: [
    {
      code: "var test = 'http://chenghuai.com';",
      // 规则没有提供 fixer，所以 output 和 code 保持一致。
      output: "var test = 'http://chenghuai.com';",
      errors: [
        {
          message: 'Recommended "http://chenghuai.com" switch to HTTPS',
        },
      ],
    },
    {
      code: "<img src='http://chenghuai.com' />",
      output: "<img src='http://chenghuai.com' />",
      parserOptions: {
        // 这条用例包含 JSX，需要显式开启 JSX parser 能力。
        ecmaFeatures: {
          jsx: true,
        },
      },
      errors: [
        {
          message: 'Recommended "http://chenghuai.com" switch to HTTPS',
        },
      ],
    },
  ],
});
