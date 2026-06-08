const RULE_NAME = 'no-http-url';

module.exports = {
  name: RULE_NAME,
  meta: {
    // suggestion 表示这是一个代码质量建议，不一定是运行时错误。
    type: 'suggestion',
    // 当前规则只报错，不自动修复，所以 fixable 为 null。
    fixable: null,
    // messages 里定义可复用的错误文案，context.report 通过 messageId 引用。
    messages: {
      noHttpUrl: 'Recommended "{{url}}" switch to HTTPS',
    },
  },
  create(context) {
    // create 返回“访问器”：ESLint 遍历 AST 时，遇到对应节点就调用这里的函数。
    return {
      // Literal 表示字面量，例如字符串、数字、布尔值。
      // 这里专门检查字符串字面量是否以 http: 开头。
      Literal: function handleRequires(node) {
        if (node.value && typeof node.value === 'string' && node.value.indexOf('http:') === 0) {
          context.report({
            // node 用来告诉 ESLint 错误出现在 AST 的哪个节点上。
            node,
            messageId: 'noHttpUrl',
            data: {
              // data 会替换 meta.messages 里的 "{{url}}" 占位符。
              url: node.value,
            },
          });
        }
      },
    };
  },
};
