# `eslint-plugin`

这个包是一个自定义 ESLint 插件示例，主要包含三类内容：

- `index.js`：插件入口，向 ESLint 暴露 rules、configs、processors。
- `rules/`：每个文件对应一条 ESLint 规则。
- `test/rules/`：每条规则对应的 Jest + RuleTester 单元测试。

## Usage

安装或在 monorepo 中引用之后，可以在 ESLint 配置里启用规则：

```js
module.exports = {
  plugins: ['eslint-plugin-qz'],
  rules: {
    'eslint-plugin-qz/no-http-url': 'warn',
    'eslint-plugin-qz/no-secret-info': 'error',
  },
};
```

如果规则带配置，写在等级后面：

```js
module.exports = {
  plugins: ['eslint-plugin-qz'],
  rules: {
    'eslint-plugin-qz/no-js-in-ts-project': [
      'warn',
      {
        whiteList: ['vite.config.js'],
        autoMerge: true,
      },
    ],
  },
};
```

## Rule Structure

一条规则通常长这样：

```js
module.exports = {
  meta: {
    type: 'problem',
    messages: {
      messageId: '错误提示，支持 "{{name}}" 这种占位符',
    },
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        if (/* 命中你的规则 */) {
          context.report({
            node,
            messageId: 'messageId',
            data: {
              name: '替换占位符的值',
            },
          });
        }
      },
    };
  },
};
```

理解它可以抓住这几个点：

- `meta` 描述规则类型、错误文案、是否可自动修复。
- `meta.schema` 描述规则配置项的结构；规则支持 options 时建议写上。
- `create(context)` 返回 AST 访问器。
- `Literal`、`Property` 等名字是 AST 节点类型。
- `context.report()` 用来告诉 ESLint：这里违反了规则。

## Practice

如果想自己练习，可以先仿照 `no-broad-semantic-versioning` 写一个最简单的规则：禁止 `package.json` 里出现某个依赖，比如禁止安装 `moment`。

思路是：

- 只检查文件名为 `package.json` 的文件。
- 找到 `dependencies` 和 `devDependencies`。
- 遍历里面的每个依赖。
- 如果依赖名等于 `moment`，就调用 `context.report()` 报错。

核心判断可以写成：

```js
if (dependencyName === 'moment') {
  context.report({
    loc: property.loc,
    messageId: 'noMoment',
    data: {
      dependencyName,
    },
  });
}
```

这个练习能帮你把“定位文件、遍历 AST、命中条件、上报错误”这条自定义规则的主线串起来。

## Jest

本包用 Jest 运行测试，命令在 `package.json` 里：

```bash
pnpm --filter eslint-plugin-qz test
```

也可以进入当前包目录后运行：

```bash
pnpm test
```

测试文件使用 ESLint 官方的 `RuleTester`：

```js
const rule = require('../../rules/no-http-url');
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester();

ruleTester.run('no-http-url', rule, {
  valid: [
    {
      code: "var url = 'https://example.com';",
    },
  ],
  invalid: [
    {
      code: "var url = 'http://example.com';",
      errors: [
        {
          message: 'Recommended "http://example.com" switch to HTTPS',
        },
      ],
    },
  ],
});
```

`valid` 表示不会报错的代码，`invalid` 表示应该报错的代码。Jest 负责执行 `.test.js` 文件，`RuleTester` 负责把代码片段交给 ESLint 规则并断言报错结果。
