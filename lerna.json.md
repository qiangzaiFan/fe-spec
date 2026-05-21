# `lerna.json` 注释版

`lerna.json` 同样要求严格 JSON，直接写注释会影响 Lerna 解析。因此这里保留原文件可执行性，并在文档里逐项说明配置含义。

```jsonc
{
  "version": "0.0.0", // 固定版本模式下的仓库版本；0.0.0 常用于初始化阶段
  "npmClient": "pnpm", // 告诉 Lerna 使用 pnpm 执行依赖安装与脚本编排
  "packages": [
    "packages/*" // 声明 monorepo 子包所在目录
  ],
  "command": {
    "publish": {
      "npmClient": "npm", // 发布到 npm registry 时，改用 npm 完成 publish 动作
      "message": "chore(release): publish %s", // 自动生成发布提交信息模板
      "registry": "https://registry.npmjs.org" // 发布目标仓库地址
    }
  }
}
```

## 补充说明

- `packages/*` 只会匹配一级目录，所以每个子包目录最终都需要有自己的 `package.json` 才会被真正识别为可管理包。
- 当前仓库里已经有 `packages/commitlint-config` 和 `packages/markdownlint-config` 两个目录，但它们还缺少子包级别的 `package.json`。
- 如果未来要做独立版本发布，可以把 `version` 改成 `"independent"`。
