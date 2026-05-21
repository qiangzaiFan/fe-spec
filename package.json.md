# `package.json` 注释版

`package.json` 必须保持严格 JSON 格式，不能直接加入 `//` 或 `/* */` 注释，否则 `npm` / `pnpm` 会解析失败。下面用注释版示意说明当前每个关键字段的作用。

```jsonc
{
  "name": "fe-spec", // 根工作区名称，主要用于仓库标识，不代表会被单独发布
  "version": "1.0.0", // 当前根包版本，monorepo 根通常只做元信息使用
  "description": "", // 包描述，目前仍为空
  "main": "index.js", // CommonJS 默认入口；当前仓库并没有实际使用到它
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1" // npm init 生成的占位脚本，尚未替换成真实任务
  },
  "keywords": [], // npm 搜索关键词，目前未配置
  "author": "", // 作者信息，目前未配置
  "license": "ISC", // 开源协议
  "packageManager": "pnpm@10.33.4", // 锁定团队推荐使用的包管理器与版本
  "repository": {
    "type": "git", // 代码托管类型
    "url": "git+https://github.com/qiangzaiFan/fe-spec.git" // 仓库地址
  },
  "type": "commonjs", // 声明当前仓库默认使用 CommonJS 模块规范
  "bugs": {
    "url": "https://github.com/qiangzaiFan/fe-spec/issues" // 缺陷反馈地址
  },
  "homepage": "https://github.com/qiangzaiFan/fe-spec#readme", // 项目首页
  "devDependencies": {
    "husky": "^9.1.7", // Git hooks 管理工具
    "lerna": "^9.0.7", // monorepo 包管理与发布编排工具
    "markdownlint-cli": "^0.48.0" // Markdown 规范检查命令行工具
  },
  "dependencies": {
    "conventional-changelog-cli": "^5.0.0" // 基于规范化提交生成 CHANGELOG 的工具
  }
}
```

## 补充说明

- 当前 CI 工作流引用了 `pnpm run init` 和 `pnpm run docs:build`，但这两个脚本还没有出现在根 `scripts` 中，后续需要补齐。
- 如果这个仓库继续按 monorepo 演进，通常还会继续增加 `lint`、`release`、`changeset` 或文档构建脚本。
