# fe-spec-replica

`fe-spec` 的复刻版仓库骨架。

这个目录不会改动原始源码，而是提供一套可以继续演进的 `monorepo` 起点，方便你按阶段补齐配置包、ESLint 插件和统一 CLI。

## 目标

- 保留原项目的多包拆分方式
- 先搭出最小可维护骨架，再逐步补齐真实 lint 规则
- 让 `encode-fe-lint` 先具备可运行的最小行为，后续再替换成真正的 lint 执行链

## 包结构

- `packages/eslint-config`：ESLint 规则入口骨架
- `packages/stylelint-config`：Stylelint 配置骨架
- `packages/commitlint-config`：Commitlint 配置骨架
- `packages/markdownlint-config`：Markdownlint 配置骨架
- `packages/eslint-plugin`：自定义 ESLint 规则骨架
- `packages/encode-fe-lint`：统一 CLI 与 Node API 骨架

## 当前状态

- 已有 `pnpm workspace + lerna` 根配置
- 每个包都带了最小入口文件
- 每个包都带了基础测试脚本
- `encode-fe-lint` 已实现最小版 `init / scan / fix / update` 命令

## 建议实现顺序

1. 先完善 `stylelint-config`、`commitlint-config`、`markdownlint-config`
2. 再补 `eslint-config` 的 JS/TS/React/Vue/Node 分层
3. 然后扩展 `eslint-plugin`
4. 最后把 `encode-fe-lint` 的扫描链路替换为真实的 ESLint、stylelint、markdownlint、Prettier 调用

## 快速开始

```bash
cd replica-fe-spec
pnpm install
pnpm test
pnpm --filter encode-fe-lint exec node src/cli.js scan
```

## 后续建议

- 发布前把包名按你的命名体系统一调整
- 若你准备现代化复刻，优先把 Husky 方案改成 `.husky/` 目录模式
- 当 CLI 进入可用阶段后，再补文档站与 CI 发布

