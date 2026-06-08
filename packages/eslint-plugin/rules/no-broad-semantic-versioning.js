// 不要在 package.json 里使用过宽泛的语义化版本号。
// 例如 "*"、"4.x"、">1.0.0" 都可能让安装结果不稳定。
const path = require('path');

const RULE_NAME = 'no-broad-semantic-versioning';

module.exports = {
  name: RULE_NAME,
  meta: {
    type: 'problem',
    fixable: null,
    messages: {
      noBroadSemanticVersioning:
        'The "{{dependencyName}}" is not recommended to use "{{versioning}}"',
    },
  },

  create(context) {
    // 这个规则只关心 package.json，其他文件直接返回空访问器，等于不做检查。
    if (path.basename(context.getFilename()) !== 'package.json') {
      return {};
    }

    return {
      // package.json 会先被 processor 转成类似 `module.exports = {...}` 的 JS，
      // 所以 dependencies / devDependencies 都会作为 Property 节点出现。
      Property: function handleRequires(node) {
        if (
          node.key &&
          node.key.value &&
          // 只检查依赖声明区域，不检查 scripts、name、version 等其他字段。
          (node.key.value === 'dependencies' || node.key.value === 'devDependencies') &&
          node.value &&
          node.value.properties
        ) {
          // node.value.properties 就是 dependencies 对象里的每一个依赖。
          node.value.properties.forEach((property) => {
            if (property.key && property.key.value) {
              const dependencyName = property.key.value;
              const dependencyVersion = property.value.value;
              if (
                // "*" 表示任意版本。
                dependencyVersion.indexOf('*') > -1 ||
                // "x" 常见于 "1.x"、"x.x" 这种宽泛版本。
                dependencyVersion.indexOf('x') > -1 ||
                // ">" 表示只限制最低版本，上限不确定。
                dependencyVersion.indexOf('>') > -1
              ) {
                context.report({
                  // 使用 loc 可以把错误定位到当前依赖这一整段，而不是某个更小的节点。
                  loc: property.loc,
                  messageId: 'noBroadSemanticVersioning',
                  data: {
                    dependencyName,
                    versioning: dependencyVersion,
                  },
                });
              }
            }
          });
        }
      },
    };
  },
};
