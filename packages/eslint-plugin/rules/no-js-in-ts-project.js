const path = require('path');

const RULE_NAME = 'no-js-in-ts-project';

// 匹配 .js 和 .jsx 文件。
const JS_REG = /\.jsx?$/;

// TS 项目里通常仍然会保留一些工具配置文件，它们默认放行。
const DEFAULT_WHITE_LIST = [
  'commitlint.config.js',
  'eslintrc.js',
  'prettierrc.js',
  'stylelintrc.js',
];

module.exports = {
  name: RULE_NAME,
  meta: {
    type: 'suggestion',
    fixable: null,
    messages: {
      noJSInTSProject: 'The "{{fileName}}" is not recommended in TS project',
    },
    // schema 用来声明规则 options 的结构；RuleTester / ESLint 会据此校验配置。
    schema: [
      {
        type: 'object',
        properties: {
          whiteList: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          autoMerge: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    // getFilename 能拿到当前正在被 ESLint 检查的文件路径。
    const fileName = context.getFilename();
    const extName = path.extname(fileName);
    // 规则配置来自 .eslintrc 中 rules 的第二个参数。
    // 例如：'eslint-plugin-qz/no-js-in-ts-project': ['warn', { whiteList: ['vite.config.js'] }]
    const ruleOptions = context.options[0] || {};
    let { whiteList = [], autoMerge = true } = ruleOptions;
    if (whiteList.length === 0) {
      whiteList = DEFAULT_WHITE_LIST;
    } else if (autoMerge) {
      // autoMerge 为 true 时，用户传入的白名单会和默认白名单合并。
      whiteList = [...new Set([...DEFAULT_WHITE_LIST, ...whiteList])];
    }
    const whiteListReg = new RegExp(`(${whiteList.join('|')})$`);

    // 不是白名单文件，并且扩展名是 .js/.jsx，就上报。
    if (!whiteListReg.test(fileName) && JS_REG.test(extName)) {
      context.report({
        // 这个规则是按文件名判断的，不依赖某个 AST 节点，所以手动给一个文件开头位置。
        loc: {
          start: {
            line: 0,
            column: 0,
          },
          end: {
            line: 0,
            column: 0,
          },
        },
        messageId: 'noJSInTSProject',
        data: {
          fileName,
        },
      });
    }

    // create 必须返回一个对象；这个规则已经在 create 阶段完成检查，所以这里返回空访问器。
    return {};
  },
};
