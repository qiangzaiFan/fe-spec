const RULE_NAME = 'no-secret-info';

// 默认认为变量名或对象属性名里包含这些词时，字符串值可能是敏感信息。
const DEFAULT_DANGEROUS_KEYS = ['secret', 'token', 'password'];

module.exports = {
  meta: {
    type: 'problem',
    fixable: null,
    messages: {
      noSecretInfo: 'Detect that the "{{secret}}" might be a secret token, Please check!',
    },
    // schema 用来声明规则 options 的结构；如果规则支持配置，最好补上它。
    schema: [
      {
        type: 'object',
        properties: {
          dangerousKeys: {
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
    // 支持通过规则配置覆盖或扩展敏感关键词。
    // 例如：['error', { dangerousKeys: ['ak', 'sk'], autoMerge: true }]
    const ruleOptions = context.options[0] || {};
    let { dangerousKeys = [], autoMerge = true } = ruleOptions;
    if (dangerousKeys.length === 0) {
      dangerousKeys = DEFAULT_DANGEROUS_KEYS;
    } else if (autoMerge) {
      // autoMerge 为 true 时，默认关键词和用户自定义关键词一起生效。
      dangerousKeys = [...new Set([...DEFAULT_DANGEROUS_KEYS, ...dangerousKeys])];
    }
    const reg = new RegExp(dangerousKeys.join('|'));

    return {
      // 只检查字面量值。比如 'xxxx' 是 Literal，process.env.SECRET 不是 Literal。
      Literal: function handleRequires(node) {
        if (
          node.value &&
          node.parent &&
          ((node.parent.type === 'VariableDeclarator' &&
            // var accessKeySecret = 'xxxx';
            // 如果变量名命中 secret/token/password，就认为右侧字符串可疑。
            node.parent.id &&
            node.parent.id.name &&
            reg.test(node.parent.id.name.toLocaleLowerCase())) ||
            (node.parent.type === 'Property' &&
              // { accessKeyToken: 'xxxx' }
              // 如果对象属性名命中 secret/token/password，也认为属性值可疑。
              node.parent.key &&
              node.parent.key.name &&
              reg.test(node.parent.key.name.toLocaleLowerCase())))
        ) {
          context.report({
            node,
            messageId: 'noSecretInfo',
            data: {
              secret: node.value,
            },
          });
        }
      },
    };
  },
};
