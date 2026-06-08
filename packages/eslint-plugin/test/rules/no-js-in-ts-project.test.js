const rule = require('../../rules/no-js-in-ts-project');
const { RuleTester } = require('eslint');

// RuleTester 用来描述“哪些输入合法、哪些输入非法”。
// Jest 会自动执行这个文件，因为文件名以 .test.js 结尾。
const ruleTester = new RuleTester();

ruleTester.run('no-js-in-ts-project', rule, {
  // valid 用例：TS 文件和白名单里的 JS 配置文件都应该通过。
  valid: [
    {
      filename: 'index.ts',
      code: '',
    },
    {
      filename: '.stylelintrc.js',
      code: '',
    },
    {
      filename: 'home.ts',
      code: '',
    },
  ],

  // invalid 用例：普通 .js 文件在 TS 项目里会被规则拦截。
  invalid: [
    {
      filename: 'home.js',
      code: '',
      errors: [
        {
          message: 'The "home.js" is not recommended in TS project',
        },
      ],
    },
  ],
});
