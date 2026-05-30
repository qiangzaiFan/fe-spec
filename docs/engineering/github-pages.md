---
title: GitHub Pages 发布
categories:
  - 工程规范
tags:
  - 工程规范
author:
  name: 澄怀
  link: https://github.com/encode-studio-fe-web/fe-spec
---

# GitHub Pages 发布

## 前言

本文介绍如何使用 `GitHub Actions` 和内置的 `github.token` 将当前仓库中的 `VuePress` 文档站自动发布到 `GitHub Pages`。

当前仓库的既定发布参数如下：

- 发布分支：`fukeMain`
- Pages 分支：`gh-pages`
- 站点 `base`：`/fe-spec/`
- 构建命令：`pnpm run docs:build`
- 线上地址：`https://qiangzaifan.github.io/fe-spec/`

## 1. 前置条件

在开始发布之前，请先确认以下条件已满足：

1. 仓库代码已经推送到 `GitHub`，目标仓库为 `qiangzaiFan/fe-spec`。
2. 当前登录的 `GitHub` 账号具有该仓库的管理权限。
3. 本地已经安装 `Node.js` 和 `pnpm`，并且可以在项目根目录执行 `pnpm install`。
4. 本地执行 `pnpm run docs:build` 可以成功生成静态文件。

如果本地构建失败，建议先修复构建问题，再继续进行自动发布配置。

## 2. 推荐认证方式：github.token

当前仓库推荐使用 `github.token` 作为发布认证方式。

`github.token` 是 GitHub Actions 在每次工作流运行时自动生成的临时令牌。它不需要手动创建，也不需要保存到仓库 Secret 中。只要在工作流中声明写权限，就可以把构建产物推送到当前仓库的 `gh-pages` 分支。

工作流中需要配置：

```yaml
permissions:
  contents: write
```

部署步骤中使用：

```yaml
token: ${{ github.token }}
```

推荐使用 `github.token` 的原因：

1. 不需要手动维护 `ACCESS_TOKEN` Secret。
2. 令牌只在当前工作流运行期间有效，泄露风险更低。
3. 权限由仓库和工作流的 `permissions` 控制，更适合当前仓库推送到自身 `gh-pages` 分支的场景。

## 3. 可选认证方式：Personal Access Token

如果需要跨仓库发布，或者需要使用某个固定账号的权限，也可以使用 `Personal Access Token`。当前仓库不需要优先使用这种方式。

### 3.1. 进入令牌创建页面

依次打开：

`GitHub -> 头像 -> Settings -> Developer settings -> Personal access tokens -> Fine-grained tokens`

然后点击 `Generate new token`。

### 3.2. 填写基本信息

建议按如下方式填写：

- Token name：`fe-spec-pages-deploy`
- Description：`Deploy VuePress site to GitHub Pages`
- Expiration：根据团队安全要求设置有效期
- Resource owner：选择当前拥有仓库 `qiangzaiFan/fe-spec` 的账号
- 不要把真实 token 写进代码、注释或文档

### 3.3. 选择仓库范围

在 `Repository access` 中选择：

- `Only select repositories`

然后只勾选目标仓库：

- `qiangzaiFan/fe-spec`

### 3.4. 配置权限

在 `Repository permissions` 中，至少为 `Contents` 授予写权限：

- `Contents`：`Read and write`

这个权限用于把构建好的静态文件推送到 `gh-pages` 分支。

### 3.5. 保存 Token

点击页面底部的 `Generate token` 后，复制生成的 Token 并立即保存。

> 注意：该 Token 只会完整显示一次。如果关闭页面后丢失，只能重新生成。

### 3.6. 配置仓库 Secret

创建好 Token 之后，需要把它保存到仓库的 `GitHub Actions Secrets` 中。

依次打开：

`GitHub -> 仓库 -> Settings -> Secrets and variables -> Actions`

点击 `New repository secret`，然后填写：

- Name：`ACCESS_TOKEN`
- Secret：粘贴上一步创建的 `Personal Access Token`

创建完成后，工作流可以改成读取它：

```yaml
token: ${{ secrets.ACCESS_TOKEN }}
```

如果使用旧版 action 参数，也可能看到下面这种写法：

```yaml
ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
```

## 4. 配置 GitHub Pages

依次打开：

`GitHub -> 仓库 -> Settings -> Pages`

将发布来源设置为：

- Source：`Deploy from a branch`
- Branch：`gh-pages`
- Folder：`/ (root)`

保存后，`GitHub Pages` 会从 `gh-pages` 分支根目录读取构建产物。

## 5. 调整工作流配置

当前仓库使用 `.github/workflows/deploy.yml` 作为文档站自动发布工作流。

为了与当前仓库实际环境保持一致，需要确保该工作流满足以下要求：

1. 监听分支为 `fukeMain`
2. `Node.js` 版本为 `20.19.0`
3. 构建命令为 `pnpm run docs:build`
4. 发布目录为 `docs/.vuepress/dist`
5. 发布认证使用 `github.token`

工作流核心配置示例如下：

```yaml
name: Build and Deploy

on:
  push:
    branches:
      - fukeMain
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.19.0

      - name: Setup pnpm
        run: npm install -g pnpm@10.33.4

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build docs
        run: pnpm run docs:build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          branch: gh-pages
          folder: docs/.vuepress/dist
          token: ${{ github.token }}
```

## 6. 触发发布

完成以上配置后，按以下步骤触发自动发布：

1. 在本地完成文档修改。
2. 提交代码并推送到 `fukeMain`：

   ```bash
   git add .
   git commit -m "docs: add GitHub Pages deploy guide"
   git push origin fukeMain
   ```

3. 打开仓库的 `Actions` 页面，查看 `Build and Deploy` 工作流。
4. 等待工作流执行成功。
5. 成功后访问：

   `https://qiangzaifan.github.io/fe-spec/`

首次启用 `GitHub Pages` 时，站点可能需要等待几分钟后才能正常访问。

## 7. 发布验证

工作流执行成功后，建议检查以下内容：

1. `gh-pages` 分支是否生成了最新静态文件。
2. 站点首页是否可以正常打开。
3. 导航、侧边栏和页面跳转是否正常。
4. 图片、样式和脚本资源是否正常加载。
5. 页面地址是否带有 `/fe-spec/` 子路径。

如果资源无法加载，优先检查站点 `base` 是否仍然是 `/fe-spec/`。

## 8. 常见问题

### 8.1. 为什么推荐使用 `github.token`

`github.token` 是 GitHub Actions 为当前工作流自动注入的临时 token。当前仓库只是把当前仓库的构建产物推送到当前仓库的 `gh-pages` 分支，因此内置 token 已经够用。

使用它时只需要保证工作流有写权限：

```yaml
permissions:
  contents: write
```

相比 `Personal Access Token`，`github.token` 不需要手动创建、不需要配置 Secret，也不会因为个人 token 过期、撤销、权限变更而导致部署失败。

### 8.2. 为什么之前的 Personal Access Token 会失效

之前使用的是 `secrets.ACCESS_TOKEN`，它依赖一个手动创建的 `Personal Access Token`。这种方式可能因为以下原因失效：

1. 仓库中没有配置名为 `ACCESS_TOKEN` 的 Secret，或者名称拼写不一致。
2. Token 已经过期、被手动撤销，或者因为泄露风险被重新生成。
3. Fine-grained token 没有给 `qiangzaiFan/fe-spec` 仓库授权。
4. Token 没有 `Contents: Read and write` 权限，无法推送 `gh-pages`。
5. 真实 token 曾经被写进 workflow 注释或文档，触发 GitHub Push Protection。发生这种情况后，应该立即撤销旧 token，重新生成新的 token。

如果仍要使用 PAT，需要确认：

- Secret 创建在当前仓库下。
- 名称严格等于 `ACCESS_TOKEN`。
- Token 对当前仓库有 `Contents: Read and write` 权限。
- 真实 token 没有出现在任何代码、注释、文档或提交历史中。

### 8.3. Token 权限不足

如果工作流可以构建成功，但推送 `gh-pages` 分支失败，通常是因为 Token 没有 `Contents: Read and write` 权限。

如果使用 `github.token`，请确认工作流中存在：

```yaml
permissions:
  contents: write
```

如果使用 PAT，请重新生成 `Fine-grained PAT`，并确认仓库权限配置正确。

### 8.4. Pages 分支设置错误

如果 `Actions` 已经成功执行，但线上站点没有更新，请检查 `Settings -> Pages` 中是否仍然选择了：

- Branch：`gh-pages`
- Folder：`/ (root)`

### 8.5. Node 版本过低

当前项目要求的 `Node.js` 版本为 `>=20.19.0`。

如果工作流仍在使用 `Node 18` 或更低版本，可能会出现依赖安装失败或构建失败的问题。因此工作流应固定为 `Node 20.x`。

### 8.6. 资源路径 404

如果首页能打开，但样式或图片全部 404，通常说明站点 `base` 与仓库名不一致。

当前仓库必须保持：

```ts
base: '/fe-spec/'
```

## 9. 本地预检查

为了减少 CI 失败概率，建议每次发布前先在本地执行：

```bash
pnpm install
pnpm run docs:build
```

如果本地构建成功，再推送到 `fukeMain`，可以显著减少自动发布阶段的排查成本。
