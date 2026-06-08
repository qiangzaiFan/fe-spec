const rule = require('../../rules/no-secret-info');
const { RuleTester } = require('eslint');

// Jest 负责运行测试文件，RuleTester 负责运行 ESLint 规则本身。
const ruleTester = new RuleTester();

ruleTester.run('no-secret-info', rule, {
  // valid：这些场景不会被认为是硬编码密钥。
  valid: [
    {
      // 值来自环境变量，不是字符串字面量，所以不会触发 Literal 检查。
      code: 'var accessKeySecret = process.env.ACCESS_KEY_SECRET;',
    },
    {
      code: 'var password = "";',
    },
    {
      code: `
    var client ={
      accessKeyToken: process.env.ACCESS_KEY_SECRET
    };
    `,
    },
  ],

  // invalid：变量名/属性名可疑，并且值是字符串字面量。
  invalid: [
    {
      code: "var accessKeySecret = 'xxxx';",
      errors: [
        {
          message: 'Detect that the "xxxx" might be a secret token, Please check!',
        },
      ],
    },
    {
      code: `
    var client ={
      accessKeyToken: 'xxxx'
    };
    `,
      errors: [
        {
          message: 'Detect that the "xxxx" might be a secret token, Please check!',
        },
      ],
    },
    {
      code: "var accessKey = 'xxxx';",
      options: [
        {
          dangerousKeys: ['key'],
          autoMerge: true,
        },
      ],
      errors: [
        {
          message: 'Detect that the "xxxx" might be a secret token, Please check!',
        },
      ],
    },
  ],
});
