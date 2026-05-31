# fe-spec 项目复刻指南

本文档用于从零复刻当前 `fe-spec` 项目。该项目是一个前端编码规范工程化仓库，采用 `pnpm workspace` + `Lerna` 管理多个 npm 包，并使用 `VuePress` 搭建文档站。

deploy access_token

\# <your_github_personal_access_token>

## 1. 项目目标

本项目主要实现三件事：

- 使用 monorepo 管理多个前端规范包。
- 提供 `commitlint` 提交信息规范配置。
- 提供 `markdownlint` Markdown 文档规范配置。
- 使用 `VuePress` 维护规范文档站。

当前项目包含两个核心规范包：

```text
packages/
  commitlint-config/
  markdownlint-config/
```

## 1.1 新手先读这一节

如果你是第一次接触这个项目，不建议一上来就背所有配置。你可以先按这个顺序理解：

1. 这个项目不是普通单包项目，而是一个 `monorepo`。
2. `monorepo` 的意思是：一个 Git 仓库里放多个 npm 包。
3. `packages/commitlint-config` 是一个 npm 包，用来约束 Git 提交信息。
4. `packages/markdownlint-config` 是一个 npm 包，用来约束 Markdown 文档格式。
5. 根目录的 `package.json` 负责管理整个仓库的公共依赖和统一命令。
6. `pnpm-workspace.yaml` 告诉 pnpm：哪些目录属于这个 monorepo。
7. `lerna.json` 告诉 Lerna：如何批量运行子包脚本、如何发布子包。
8. `docs/` 是 VuePress 文档站目录，用来写项目说明文档。

你可以把这个项目想象成下面这样：

```text
fe-spec 仓库
  根项目：负责统一安装依赖、运行命令、管理文档站
  子包 1：commitlint-config，提供 Git 提交信息规则
  子包 2：markdownlint-config，提供 Markdown 写作规则
```

学习这个项目时，优先搞懂三个问题：

- 依赖装在哪里？
- 命令从哪里执行？
- 每个配置文件解决什么问题？

后面的文档会围绕这三个问题展开。

## 1.2 项目里每个工具的作用

| 工具 | 作用 | 在本项目中的用途 |
| --- | --- | --- |
| Node.js | JavaScript 运行环境 | 运行 pnpm、Lerna、VuePress 等工具 |
| pnpm | 包管理器 | 安装依赖，管理 workspace |
| pnpm workspace | 多包管理能力 | 识别 `packages/*` 下的多个子包 |
| Lerna | monorepo 辅助工具 | 批量执行子包脚本、发布子包 |
| commitlint | Git 提交信息检查工具 | 检查提交信息是否符合规范 |
| conventional commits | 提交信息规范 | 规定 `feat:`、`fix:`、`docs:` 等提交类型 |
| markdownlint | Markdown 检查工具 | 检查 Markdown 文档格式 |
| Husky | Git hooks 工具 | 在提交代码时自动触发 commitlint |
| VuePress | 文档站生成工具 | 把 `docs/` 下的 Markdown 变成网站 |
| Vite | 前端构建工具 | VuePress 2 使用 Vite 作为构建器 |
| sass-embedded | Sass 编译器 | 支持 VuePress/Vite 编译 Sass/SCSS 样式 |

## 1.2.1 工具和插件官网地址

下面是本项目中用到的主要工具、插件、依赖包的官网或官方文档地址。刚学习时建议优先看“文档地址”，不要只看 npm 页面，因为文档里会讲用法和配置。

| 名称 | 本项目中的包名或配置 | 官网/文档地址 | 用途 |
| --- | --- | --- | --- |
| Node.js | `node` | <https://nodejs.org/> | JavaScript 运行环境，用来运行 pnpm、Lerna、VuePress |
| npm | `npm` | <https://docs.npmjs.com/> | npm 包管理和发布平台，发布包时会用到 |
| pnpm | `pnpm` | <https://pnpm.io/> | 项目使用的包管理器 |
| pnpm workspace | `pnpm-workspace.yaml` | <https://pnpm.io/workspaces> | 管理 `packages/*` 下的多个子包 |
| Lerna | `lerna` | <https://lerna.js.org/> | monorepo 多包任务执行和发布工具 |
| Husky | `husky` | <https://typicode.github.io/husky/> | 配置 Git hooks，例如提交前检查 commit message |
| commitlint | `@commitlint/cli` | <https://commitlint.js.org/> | 校验 Git 提交信息 |
| commitlint rules | `rules` | <https://commitlint.js.org/reference/rules.html> | 查看 commitlint 每条规则的含义 |
| Conventional Commits | `feat:`、`fix:` 等提交格式 | <https://www.conventionalcommits.org/> | 约定式提交规范 |
| conventional commits parser preset | `conventional-changelog-conventionalcommits` | <https://www.npmjs.com/package/conventional-changelog-conventionalcommits> | 给 commitlint 提供 Conventional Commits 解析预设 |
| markdownlint | `markdownlint` | <https://github.com/DavidAnson/markdownlint> | Markdown 文档格式检查工具 |
| markdownlint rules | `index.json` 里的规则 | <https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md> | 查看 Markdown 规则含义 |
| VuePress | `vuepress` | <https://vuepress.vuejs.org/> | 文档站生成工具 |
| VuePress Vite bundler | `@vuepress/bundler-vite` | <https://vuepress.vuejs.org/reference/bundler/vite.html> | VuePress 使用 Vite 构建文档站 |
| VuePress default theme | `@vuepress/theme-default` | <https://vuepress.vuejs.org/reference/default-theme/> | VuePress 默认主题 |
| Vue | `vue` | <https://vuejs.org/> | VuePress 依赖 Vue 运行 |
| Vite | `vite` | <https://vite.dev/> | VuePress Vite bundler 底层使用的构建工具 |
| Sass | `sass` / `sass-embedded` | <https://sass-lang.com/documentation/> | Sass/SCSS 样式语言文档 |
| sass-embedded | `sass-embedded` | <https://sass-lang.com/documentation/js-api/> | 给 Vite/VuePress 提供 Sass/SCSS 编译能力 |

这些链接可以按学习顺序看：

1. 先看 pnpm 和 pnpm workspace，理解依赖为什么能装到根目录或子包。
2. 再看 Lerna，理解 `lerna run test` 为什么能批量跑子包脚本。
3. 再看 commitlint 和 Conventional Commits，理解提交信息规范。
4. 再看 markdownlint，理解 Markdown 文档规范。
5. 最后看 VuePress、Vue、Vite、Sass，理解文档站是怎么启动和构建的。

## 1.3 根依赖和子包依赖的区别

这个项目里有两类 `package.json`：

```text
fe-spec/package.json
packages/commitlint-config/package.json
packages/markdownlint-config/package.json
```

根目录 `pack age.json`：

- 放整个仓库共用的开发工具，例如 `lerna`、`husky`、`vuepress`。
- 放统一脚本，例如 `pnpm test`、`pnpm docs:dev`。
- 不作为 npm 包发布，所以设置了 `"private": true`。

子包 `package.json`：

- 描述每一个真正要发布或复用的 npm 包。
- 每个子包有自己的 `name`、`version`、`main`、`dependencies`。
- 后续可以单独发布到 npm。

因此，安装依赖时要分清楚：

```bash
pnpm add -D -w lerna
```

这表示把 `lerna` 安装到根项目。

```bash
pnpm --filter fe-spec-qz-commitlint-config add conventional-changelog-conventionalcommits
```

这表示只给 `commitlint-config` 这个子包安装依赖。

## 2. 环境准备

建议使用以下环境：

```bash
node -v
```

推荐：

```text
    Node.js >= 18.12
```

原因：

- 当前 `pnpm` 新版本要求至少 `Node.js 18.12`。
- `VuePress 2`、`Lerna 8` 等工具链也更适合在 Node 18+ 环境运行。

启用 `pnpm`：

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

验证：

```bash
pnpm --version
```

## 2.1 你需要先知道的命令规则

后面所有命令默认都在项目根目录执行，也就是这个目录：

```text
fe-spec/
```

如果命令需要在子包目录执行，文档会单独说明。

常见命令含义：

```bash
pnpm install
```

读取所有 `package.json` 和 `pnpm-workspace.yaml`，安装整个项目需要的依赖。

```bash
pnpm add -D -w lerna
```

把 `lerna` 安装到根目录的 `devDependencies`。

这里的 `-w` 是 `--workspace-root` 的缩写，意思是把依赖安装到 workspace 根目录。

因为这个项目是 monorepo，根目录和 `packages/*` 子包都有自己的 `package.json`。如果不加 `-w`，pnpm 会担心你误把依赖装到根目录，所以会提示确认或直接阻止。加上 `-w` 就是在明确告诉 pnpm：

```text
我就是要把 lerna 安装到当前 monorepo 的根项目里。
```

```bash
pnpm --filter 包名 add 依赖名
```

只给某一个子包安装依赖。

```bash
pnpm test
```

执行根目录 `package.json` 里的 `scripts.test`。

```bash
pnpm docs:dev
```

执行根目录 `package.json` 里的 `scripts.docs:dev`，启动文档站。

## 2.2 安装依赖时常见参数说明

`pnpm add` 常见参数：

| 参数 | 含义 | 示例 |
| --- | --- | --- |
| `-D` | 安装到 `devDependencies` | `pnpm add -D -w lerna` |
| `-w` | 安装到 workspace 根目录 | `pnpm add -D -w husky` |
| `--filter` | 指定只操作某个子包 | `pnpm --filter xxx add lodash` |
| `file:` | 从本地目录安装依赖 | `pnpm add -w commitlint-config@file:packages/commitlint-config` |

### 2.2.1 `-w` 详细解释

`-w` 的完整写法是：

```bash
--workspace-root
```

它的作用是：把依赖安装到 workspace 根目录的 `package.json`。

例如：

```bash
pnpm add -D -w lerna
```

等价于：

```bash
pnpm add -D --workspace-root lerna
```

执行后，`lerna` 会被写入根目录 `package.json`：

```json
{
  "devDependencies": {
    "lerna": "^8.2.1"
  }
}
```

为什么这里要加 `-w`：

- 当前项目有 `pnpm-workspace.yaml`，所以 pnpm 知道这是一个 workspace 项目。
- workspace 项目里，根目录通常只放工具依赖，比如 `lerna`、`husky`、`vuepress`。
- pnpm 为了防止你误操作，要求你明确声明“我要安装到根目录”。
- `-w` 就是这个明确声明。

什么时候需要加 `-w`：

```bash
pnpm add -D -w lerna
pnpm add -D -w husky
pnpm add -D -w vuepress
pnpm add -D -w @commitlint/cli
```

这些依赖都是整个项目共用的工具，所以应该安装到根目录。

什么时候不要加 `-w`，而是用 `--filter`：

```bash
pnpm --filter fe-spec-qz-commitlint-config add conventional-changelog-conventionalcommits
```

这个依赖只属于 `commitlint-config` 子包，所以应该安装到子包里。

### 2.2.2 `--filter` 详细解释

`--filter` 是 pnpm workspace 里的筛选参数，意思是：只对指定的 workspace 子包执行命令。

这个项目里有多个 `package.json`：

```text
fe-spec/package.json
packages/commitlint-config/package.json
packages/markdownlint-config/package.json
```

当你执行普通命令时，pnpm 默认是在当前目录或整个 workspace 里工作。加上 `--filter` 后，就可以告诉 pnpm：

```text
这次命令只作用到某一个子包，不要影响其他包。
```

例如：

```bash
pnpm --filter fe-spec-qz-commitlint-config add conventional-changelog-conventionalcommits
```

可以拆成下面几部分理解：

| 片段 | 含义 |
| --- | --- |
| `pnpm` | 使用 pnpm 包管理器 |
| `--filter fe-spec-qz-commitlint-config` | 只选择名为 `fe-spec-qz-commitlint-config` 的子包 |
| `add` | 给这个子包安装依赖 |
| `conventional-changelog-conventionalcommits` | 要安装的依赖名 |

执行后，依赖会写入这个文件：

```text
packages/commitlint-config/package.json
```

而不是写入根目录：

```text
fe-spec/package.json
```

再比如：

```bash
pnpm --filter fe-spec-qz-markdownlint-config add -D markdownlint@^0.37.4
```

意思是：只给 `fe-spec-qz-markdownlint-config` 这个子包安装 `markdownlint`，并写入它自己的 `devDependencies`。

`--filter` 后面跟的是子包的包名，不是目录名。也就是说，它匹配的是子包 `package.json` 里的 `name` 字段：

```json
{
  "name": "fe-spec-qz-commitlint-config"
}
```

所以如果你把子包名称改了，`--filter` 后面的名字也要一起改。

`-w` 和 `--filter` 的区别：

| 命令 | 依赖安装到哪里 | 适合安装什么 |
| --- | --- | --- |
| `pnpm add -D -w lerna` | 根目录 `package.json` | 整个项目共用的工具 |
| `pnpm --filter fe-spec-qz-commitlint-config add xxx` | 指定子包 `package.json` | 只有这个子包需要的依赖 |

简单判断：

- 如果依赖是整个仓库共用的工具，用 `-w`。
- 如果依赖只属于某个子包，用 `--filter`。

什么时候用 `-D`：

- 构建工具、测试工具、文档工具一般放 `devDependencies`。
- 例如 `lerna`、`husky`、`vuepress`、`markdownlint`。

什么时候不用 `-D`：

- 代码运行时必须依赖的包放 `dependencies`。
- 例如 `commitlint-config` 子包依赖 `conventional-changelog-conventionalcommits`。

## 3. 初始化项目

创建项目目录：

```bash
mkdir fe-spec
cd fe-spec
git init
```

创建基础目录：

```bash
mkdir packages
mkdir docs
mkdir docs/.vuepress
mkdir packages/commitlint-config
mkdir packages/commitlint-config/lib
mkdir packages/commitlint-config/__tests__
mkdir packages/markdownlint-config
mkdir packages/markdownlint-config/lib
mkdir packages/markdownlint-config/__tests__
```

最终目录结构大致如下：

```text
fe-spec/
  docs/
    .vuepress/
      config.js
    index.md
  packages/
    commitlint-config/
      __tests__/
      lib/
      index.js
      package.json
      README.md
    markdownlint-config/
      __tests__/
      lib/
      index.json
      package.json
      README.md
  .gitignore
  .markdownlint.json
  commitlint.config.js
  lerna.json
  package.json
  pnpm-workspace.yaml
  README.md
```

目录说明：

- `docs/`：文档站源码目录。
- `docs/.vuepress/`：VuePress 配置目录。
- `packages/`：所有子包都放在这里。
- `packages/commitlint-config/`：提交信息规范包。
- `packages/markdownlint-config/`：Markdown 规范包。
- `__tests__/`：子包测试目录。
- `lib/`：Lerna 初始化时常见的源码目录，当前项目里主要是示例代码。

## 4. 根目录 package.json

在根目录创建 `package.json`：

```json
{
  "name": "root",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "preinstall": "npx only-allow pnpm",
    "prepare": "husky install",
    "init": "pnpm install",
    "clean": "lerna clean && rm -rf node_modules",
    "test": "lerna run test",
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs",
    "deploy": "bash deploy.sh",
    "publish": "lerna publish"
  },
  "devDependencies": {
    "@vuepress/bundler-vite": "2.0.0-rc.20",
    "@vuepress/theme-default": "2.0.0-rc.85",
    "husky": "^9.1.7",
    "lerna": "^8.2.1",
    "markdownlint": "^0.37.4",
    "sass-embedded": "^1.86.0",
    "vue": "^3.5.13",
    "vuepress": "2.0.0-rc.20"
  },
  "dependencies": {
    "commitlint-config": "file:packages/commitlint-config"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

字段说明：

- `private: true`：根项目不发布到 npm。
- `workspaces`：声明 `packages/*` 下的目录都是子包。
- `preinstall`：强制项目只能使用 `pnpm` 安装依赖。
- `prepare`：安装依赖后初始化 `husky`。
- `test`：通过 `Lerna` 执行所有子包的测试脚本。
- `docs:dev`：本地启动 VuePress 文档站。
- `docs:build`：构建 VuePress 静态站点。
- `publish`：通过 Lerna 发布子包。

### 4.1 依赖安装命令

上面的 `package.json` 可以手写，也可以通过 `pnpm add` 命令逐步安装依赖生成。复刻项目时，推荐按下面顺序安装。

先安装根目录开发依赖：

```bash
pnpm add -D -w lerna@^8.2.1
pnpm add -D -w husky@^9.1.7
pnpm add -D -w markdownlint@^0.37.4
pnpm add -D -w vue@^3.5.13
pnpm add -D -w vuepress@2.0.0-rc.20
pnpm add -D -w @vuepress/bundler-vite@2.0.0-rc.20
pnpm add -D -w @vuepress/theme-default@2.0.0-rc.85
pnpm add -D -w sass-embedded@^1.86.0
```

命令说明：

- `pnpm add`：安装依赖。
- `-D`：安装到 `devDependencies`。
- `-w`：安装到 workspace 根目录。如果项目开启 workspace，给根项目装依赖时必须加 `-w`。
- `lerna@^8.2.1`：把 Lerna 安装到当前项目，而不是全局安装。

以这条命令为例：

```bash
pnpm add -D -w lerna@^8.2.1
```

可以拆成下面几部分理解：

| 片段 | 含义 |
| --- | --- |
| `pnpm` | 使用 pnpm 包管理器 |
| `add` | 安装一个依赖 |
| `-D` | 写入 `devDependencies` |
| `-w` | 写入 workspace 根目录的 `package.json` |
| `lerna@^8.2.1` | 安装 `lerna`，版本范围是 `^8.2.1` |

执行后，根目录 `package.json` 会增加：

```json
{
  "devDependencies": {
    "lerna": "^8.2.1"
  }
}
```

再把本地 `commitlint-config` 子包作为根项目依赖安装：

```bash
pnpm add -w commitlint-config@file:packages/commitlint-config
```

说明：

- `file:packages/commitlint-config` 表示依赖来自本地目录。
- 这样根目录的 `package.json` 会生成：

```json
{
  "dependencies": {
    "commitlint-config": "file:packages/commitlint-config"
  }
}
```

给 `commitlint-config` 子包安装自己的运行依赖：

```bash
pnpm --filter fe-spec-qz-commitlint-config add conventional-changelog-conventionalcommits@^8.0.0
```

说明：

- `--filter fe-spec-qz-commitlint-config` 表示只给这个 workspace 子包安装依赖。
- 这个命令会写入 `packages/commitlint-config/package.json` 的 `dependencies`。
- `fe-spec-qz-commitlint-config` 来自 `packages/commitlint-config/package.json` 里的 `name` 字段，不是文件夹名称。

给 `markdownlint-config` 子包安装自己的开发依赖：

```bash
pnpm --filter fe-spec-qz-markdownlint-config add -D markdownlint@^0.37.4
```

说明：

- 这个命令会写入 `packages/markdownlint-config/package.json` 的 `devDependencies`。
- `--filter fe-spec-qz-markdownlint-config` 表示只操作这个子包，不会修改根目录和其他子包的依赖。

如果你想让 `husky` 的 `commit-msg` 钩子稳定使用本地 `commitlint` 命令，建议额外安装 `@commitlint/cli`：

```bash
pnpm add -D -w @commitlint/cli
```

说明：

- 当前原项目使用的是 `npx commitlint --edit $1`，没有把 `@commitlint/cli` 明确写进根依赖。
- 复刻时更推荐安装到根项目，避免每次靠 `npx` 临时下载。

## 5. pnpm workspace 配置

创建 `pnpm-workspace.yaml`：

```yaml
packages:
  - 'packages/*'
```

说明：

- 这个文件告诉 `pnpm`：`packages` 目录下的所有一级子目录都是 workspace package。
- 后续执行 `pnpm install` 时，子包依赖会被统一安装和链接。

更具体地说，pnpm 会把下面两个目录识别成子包：

```text
packages/commitlint-config
packages/markdownlint-config
```

识别成子包后，你就可以使用下面这种命令只操作某一个包：

```bash
pnpm --filter fe-spec-qz-commitlint-config test
pnpm --filter fe-spec-qz-markdownlint-config test
```

如果没有 `pnpm-workspace.yaml`，pnpm 就不知道 `packages/*` 是一个整体，`--filter` 这类 workspace 命令也不能正常工作。

## 6. Lerna 配置

创建 `lerna.json`：

```json
{
  "version": "0.0.1-alpha.1",
  "npmClient": "pnpm",
  "command": {
    "publish": {
      "npmClient": "npm",
      "message": "chore(release): publish %s",
      "registry": "https://registry.npmjs.org"
    },
    "packages": [
      "packages/*"
    ]
  }
}
```

字段说明：

- `version`：当前 monorepo 统一版本号。
- `npmClient: pnpm`：日常安装和脚本执行使用 `pnpm`。
- `command.publish.npmClient: npm`：发布 npm 包时使用 `npm`。
- `message`：发布时自动生成的 Git 提交信息。

Lerna 在这里主要负责两件事：

1. 批量运行子包脚本。
2. 批量发布子包。

比如根目录的命令：

```json
{
  "scripts": {
    "test": "lerna run test"
  }
}
```

当你执行：

```bash
pnpm test
```

实际执行链路是：

```text
pnpm test
  -> 读取根目录 package.json 的 scripts.test
  -> 执行 lerna run test
  -> Lerna 查找 packages/* 下的每个子包
  -> 如果子包 package.json 里有 test 脚本，就执行它
```

所以，`Lerna` 不负责安装依赖，安装依赖主要由 `pnpm` 负责。`Lerna` 更像是 monorepo 的批量任务调度器。

## 7. Git 忽略文件

创建 `.gitignore`：

```gitignore
node_modules/
```

说明：

- `node_modules` 是安装产物，不应该提交到 Git。

## 8. 根目录 commitlint 配置

创建 `commitlint.config.js`：

```js
module.exports = {
  extends: ['./packages/commitlint-config/index.js'],
};
```

说明：

- 根项目的提交信息规范直接继承本地 `commitlint-config` 子包。
- 这样可以先在仓库内部开发规范包，再发布到 npm 供其他项目使用。

这段配置的含义是：

```text
当 commitlint 运行时
  -> 读取根目录 commitlint.config.js
  -> 发现 extends 指向 ./packages/commitlint-config/index.js
  -> 加载这个文件里的 rules
  -> 用这些 rules 检查 Git 提交信息
```

例如下面的提交信息可以通过：

```bash
git commit -m "feat: init project"
```

因为它满足：

- `feat` 是允许的 type。
- 冒号后面有 subject。
- type 是小写。

下面的提交信息不能通过：

```bash
git commit -m "init project"
```

因为它没有 `type: subject` 结构。

## 9. 根目录 markdownlint 配置

创建 `.markdownlint.json`：

```json
{
  "extends": "./packages/markdownlint-config/index.json"
}
```

说明：

- 根项目的 Markdown 规范继承本地 `markdownlint-config` 子包。

这段配置的含义是：

```text
当 markdownlint 检查 Markdown 文件时
  -> 读取根目录 .markdownlint.json
  -> 发现 extends 指向 ./packages/markdownlint-config/index.json
  -> 加载 index.json 里的 Markdown 规则
  -> 用这些规则检查 README.md、docs/index.md 等文件
```

这样做的好处是：

- 根项目自己可以使用这套 Markdown 规则。
- 以后这个规则包发布到 npm 后，其他项目也可以复用同一套规则。

## 10. 创建 commitlint-config 包

创建 `packages/commitlint-config/package.json`：

```json
{
  "name": "fe-spec-qz-commitlint-config",
  "version": "0.0.1-alpha.1",
  "description": "commitlint config",
  "author": "your-name <your-email@example.com>",
  "homepage": "https://github.com/your-name/fe-spec#readme",
  "license": "ISC",
  "main": "index.js",
  "directories": {
    "lib": "lib",
    "test": "__tests__"
  },
  "files": [
    "lib"
  ],
  "publishConfig": {
    "registry": "https://registry.npmjs.org"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/your-name/fe-spec.git"
  },
  "scripts": {
    "test": "node ./__tests__/commitlint-config.test.js"
  },
  "bugs": {
    "url": "https://github.com/your-name/fe-spec/issues"
  },
  "dependencies": {
    "conventional-changelog-conventionalcommits": "^8.0.0"
  }
}
```

说明：

- `name`：npm 包名，复刻时建议换成自己的包名。
- `main: index.js`：包入口文件。
- `dependencies`：使用 `conventional-changelog-conventionalcommits` 作为 commitlint 解析预设。

这个文件里几个字段要特别理解：

| 字段 | 作用 |
| --- | --- |
| `name` | npm 包名，其他项目安装时会用到 |
| `version` | 包版本号，发布 npm 时必须有 |
| `main` | 当别人 `require()` 这个包时，默认加载哪个文件 |
| `scripts.test` | 当前子包的测试命令 |
| `dependencies` | 当前包运行时需要的依赖 |
| `publishConfig.registry` | 发布到哪个 npm registry |

为什么 `main` 是 `index.js`：

```json
{
  "main": "index.js"
}
```

这表示当别人这样使用时：

```js
const config = require('fe-spec-qz-commitlint-config');
```

Node.js 实际加载的是：

```text
packages/commitlint-config/index.js
```

创建 `packages/commitlint-config/index.js`：

```js
module.exports = {
  parserPreset: 'conventional-changelog-conventionalcommits',
  rules: {
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [0],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'test', 'refactor', 'chore', 'revert']
    ],
  },
};
```

规则说明：

- `type-enum`：只允许指定的提交类型。
- `type-empty`：提交类型不能为空。
- `subject-empty`：提交描述不能为空。
- `header-max-length`：提交头最长 100 个字符。
- `scope-case`：scope 必须小写。
- `subject-full-stop`：subject 末尾不能以英文句号结尾。

规则数组的格式是 commitlint 固定格式：

```js
[级别, 何时生效, 规则值]
```

比如：

```js
'type-empty': [2, 'never']
```

含义是：

- `2`：错误级别，违反时提交失败。
- `never`：永远不允许。
- 整体意思：type 永远不能为空。

再比如：

```js
'header-max-length': [2, 'always', 100]
```

含义是：

- `2`：错误级别。
- `always`：始终检查。
- `100`：最大长度。
- 整体意思：提交信息第一行不能超过 100 个字符。

commitlint 的级别通常是：

| 级别 | 含义 |
| --- | --- |
| `0` | 关闭规则 |
| `1` | 警告 |
| `2` | 错误 |

合法提交示例：

```bash
feat: add markdownlint config
fix(core): correct commitlint rules
docs: update usage guide
chore: update dependencies
```

非法提交示例：

```bash
add config
Feat: add config
fix:
docs: update guide.
```

创建 `packages/commitlint-config/lib/commitlint-config.js`：

```js
'use strict';

module.exports = commitlintConfig;

function commitlintConfig() {
  return 'Hello from commitlintConfig';
}
```

说明：

- 这是当前项目保留的 Lerna 脚手架示例代码。
- 真正的 commitlint 规则入口是 `index.js`。
- 如果你想让项目更严谨，可以删除这个示例文件，或者把测试改成校验 `index.js` 的规则对象。

新手容易混淆的点：

```text
packages/commitlint-config/index.js
```

这是当前包真正对外导出的配置。

```text
packages/commitlint-config/lib/commitlint-config.js
```

这是脚手架生成的示例函数，在当前项目中不参与 commitlint 校验。

创建 `packages/commitlint-config/__tests__/commitlint-config.test.js`：

```js
'use strict';

const commitlintConfig = require('..');
const assert = require('assert').strict;

assert.strictEqual(commitlintConfig(), 'Hello from commitlintConfig');
console.info('commitlintConfig tests passed');
```

注意：

- 当前原项目的测试还是脚手架示例测试，和 `index.js` 真实配置不完全匹配。
- 更推荐改成测试配置对象，示例如下：

```js
'use strict';

const config = require('..');
const assert = require('assert').strict;

assert.equal(config.parserPreset, 'conventional-changelog-conventionalcommits');
assert.ok(config.rules['type-enum']);
assert.ok(config.rules['subject-empty']);

console.info('commitlint config tests passed');
```

创建 `packages/commitlint-config/README.md`：

```md
# commitlint-config

提交信息规范配置包。

## Usage

​```js
module.exports = {
  extends: ['fe-spec-qz-commitlint-config'],
};
```
```

## 11. 创建 markdownlint-config 包

创建 `packages/markdownlint-config/package.json`：

​```json
{
  "name": "fe-spec-qz-markdownlint-config",
  "version": "0.0.1-alpha.1",
  "description": "markdownlint config",
  "author": "your-name <your-email@example.com>",
  "homepage": "https://github.com/your-name/fe-spec#readme",
  "license": "ISC",
  "main": "index.json",
  "directories": {
    "lib": "lib",
    "test": "__tests__"
  },
  "files": [
    "lib"
  ],
  "publishConfig": {
    "registry": "https://registry.npmjs.org"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/your-name/fe-spec.git"
  },
  "scripts": {
    "test": "node ./__tests__/markdownlint-config.test.js"
  },
  "bugs": {
    "url": "https://github.com/your-name/fe-spec/issues"
  },
  "devDependencies": {
    "markdownlint": "^0.37.4"
  }
}
```

这里的 `main` 是：

```json
{
  "main": "index.json"
}
```

原因是 markdownlint 配置本身就是 JSON 配置，不需要写成 JS 函数。

当别人使用这个包时，最终读取的是：

```text
packages/markdownlint-config/index.json
```

创建 `packages/markdownlint-config/index.json`：

```json
{
  "$schema": "https://raw.githubusercontent.com/DavidAnson/markdownlint/main/schema/markdownlint-config-schema.json",
  "default": true,
  "ul-style": {
    "style": "dash"
  },
  "no-trailing-spaces": {
    "br_spaces": 0,
    "list_item_empty_lines": false
  },
  "list-marker-space": false,
  "line-length": false,
  "no-inline-html": false,
  "no-duplicate-header": false,
  "proper-names": {
    "names": [
      "JavaScript",
      "HTML",
      "CSS",
      "AJAX",
      "JSON",
      "DOM",
      "BOM",
      "Less",
      "Sass",
      "SCSS",
      "HTTP",
      "HTTPS",
      "WebSocket",
      "ECMAScript",
      "ECMAScript 2015",
      "ECMAScript 6",
      "ES6",
      "ES2015",
      "jQuery",
      "React",
      "React Native",
      "Bootstrap",
      "Gulp",
      "Grunt",
      "webpack",
      "Yeoman",
      "npm",
      "Babel",
      "Mocha",
      "Jasmine",
      "Node.js",
      "MySQL",
      "MongoDB",
      "Redis",
      "Nginx",
      "GitHub",
      "GitLab",
      "Chrome",
      "Firefox",
      "Safari",
      "Android",
      "iOS",
      "Windows",
      "Linux",
      "Vue",
      "Visual Studio Code"
    ],
    "code_blocks": false
  }
}
```

规则说明：

- `default: true`：默认开启 markdownlint 推荐规则。
- `ul-style.style: dash`：无序列表统一使用 `-`。
- `line-length: false`：不限制单行长度，适合中文文档。
- `no-inline-html: false`：允许在 Markdown 中写 HTML。
- `proper-names`：约束专有名词大小写，例如 `JavaScript`、`GitHub`。

几个常见规则解释：

| 规则 | 当前值 | 作用 |
| --- | --- | --- |
| `default` | `true` | 默认开启 markdownlint 推荐规则 |
| `ul-style` | `dash` | 无序列表统一使用 `-` |
| `line-length` | `false` | 不限制行长度 |
| `no-inline-html` | `false` | 允许 Markdown 中出现 HTML |
| `no-duplicate-header` | `false` | 允许重复标题 |
| `proper-names` | 对象 | 检查专有名词大小写 |

为什么关闭 `line-length`：

- 中文技术文档经常会有较长链接或较长句子。
- 如果强制限制行长度，维护成本会比较高。
- 所以这里把它关掉。

为什么允许 `no-inline-html`：

- 文档里有时需要 `<br/>`、`<img>`、`<details>` 等 HTML。
- 关闭这个规则可以让 Markdown 写法更灵活。

创建 `packages/markdownlint-config/lib/markdownlint-config.js`：

```js
'use strict';

module.exports = markdownlintConfig;

function markdownlintConfig() {
  return 'Hello from markdownlintConfig';
}
```

说明：

- 这是脚手架示例代码。
- 真正的 markdownlint 配置入口是 `index.json`。

同样要注意：

```text
packages/markdownlint-config/index.json
```

是真正生效的 Markdown 规则配置。

```text
packages/markdownlint-config/lib/markdownlint-config.js
```

只是脚手架示例函数。

创建 `packages/markdownlint-config/__tests__/markdownlint-config.test.js`：

```js
'use strict';

const markdownlintConfig = require('..');
const assert = require('assert').strict;

assert.strictEqual(markdownlintConfig(), 'Hello from markdownlintConfig');
console.info('markdownlintConfig tests passed');
```

更推荐的测试写法：

```js
'use strict';

const config = require('..');
const assert = require('assert').strict;

assert.equal(config.default, true);
assert.equal(config['ul-style'].style, 'dash');
assert.equal(config['line-length'], false);

console.info('markdownlint config tests passed');
```

创建 `packages/markdownlint-config/README.md`：

```md
# markdownlint-config

Markdown 文档规范配置包。

## Usage

​```json
{
  "extends": "fe-spec-qz-markdownlint-config"
}
```
```

## 12. 配置 VuePress 文档站

创建 `docs/.vuepress/config.js`：

​```js
import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  bundler: viteBundler({
    viteOptions: {},
    vuePluginOptions: {},
  }),
  theme: defaultTheme(),
  lang: 'zh-CN',
  title: 'fe-spec',
  description: '前端编码规范工程化项目',
})
```

说明：

- `viteBundler`：使用 Vite 作为 VuePress 构建器。
- `defaultTheme`：使用 VuePress 默认主题。
- `lang`：站点语言设置为中文。
- `title`：文档站标题。
- `description`：文档站描述。

创建 `docs/index.md`：

```md
# fe-spec

前端编码规范工程化项目。

## 能力支持

- commitlint 提交信息规范
- markdownlint 文档规范
- pnpm workspace 多包管理
- Lerna 多包测试与发布
- VuePress 文档站

## 快速开始

​```bash
pnpm install
pnpm test
pnpm docs:dev
```
```

## 13. 配置 Husky commit-msg 钩子

安装依赖后执行：

​```bash
pnpm prepare
```

创建 `.husky/commit-msg`：

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx commitlint --edit $1
```

说明：

- 每次执行 `git commit` 时，`commit-msg` 钩子会调用 `commitlint` 检查提交信息。
- 如果提交信息不符合 `packages/commitlint-config/index.js` 里的规则，提交会失败。

## 14. 安装依赖

执行：

```bash
pnpm install
```

如果你是从零复刻，并且还没有手写完整 `package.json`，也可以用前文的 `pnpm add` 命令逐个安装：

```bash
pnpm add -D -w lerna@^8.2.1 husky@^9.1.7 markdownlint@^0.37.4
pnpm add -D -w vue@^3.5.13 vuepress@2.0.0-rc.20
pnpm add -D -w @vuepress/bundler-vite@2.0.0-rc.20 @vuepress/theme-default@2.0.0-rc.85 sass-embedded@^1.86.0
pnpm add -w commitlint-config@file:packages/commitlint-config
pnpm --filter fe-spec-qz-commitlint-config add conventional-changelog-conventionalcommits@^8.0.0
pnpm --filter fe-spec-qz-markdownlint-config add -D markdownlint@^0.37.4
```

安装完成后会生成：

```text
node_modules/
pnpm-lock.yaml
```

说明：

- `node_modules` 不提交。
- `pnpm-lock.yaml` 建议提交，用于锁定依赖版本。

## 15. 运行测试

执行：

```bash
pnpm test
```

该命令会执行：

```bash
lerna run test
```

然后分别运行每个子包里的测试：

```bash
node ./__tests__/commitlint-config.test.js
node ./__tests__/markdownlint-config.test.js
```

## 16. 启动文档站

执行：

```bash
pnpm docs:dev
```

VuePress 会启动本地开发服务器。终端会输出类似：

```text
http://localhost:8080/
```

打开该地址即可查看文档站。

## 17. 构建文档站

执行：

```bash
pnpm docs:build
```

构建产物一般会输出到：

```text
docs/.vuepress/dist/
```

## 18. 发布 npm 包

发布前需要先登录 npm：

```bash
npm login
```

然后执行：

```bash
pnpm publish
```

该命令实际会调用：

```bash
lerna publish
```

发布前建议检查：

- 包名是否已经被占用。
- `package.json` 里的 `name` 是否改成自己的 npm 包名。
- `repository`、`homepage`、`bugs` 是否改成自己的 GitHub 地址。
- npm 是否已登录。
- 当前 Git 工作区是否干净。

## 19. 常用命令汇总

```bash
pnpm install
```

安装依赖。

```bash
pnpm add -D -w lerna@^8.2.1
```

把 Lerna 安装到项目根目录。

```bash
pnpm add -D -w husky@^9.1.7
```

把 Husky 安装到项目根目录。

```bash
pnpm add -D -w vuepress@2.0.0-rc.20 @vuepress/bundler-vite@2.0.0-rc.20 @vuepress/theme-default@2.0.0-rc.85 vue@^3.5.13 sass-embedded@^1.86.0
```

安装 VuePress 文档站相关依赖。

```bash
pnpm --filter fe-spec-qz-commitlint-config add conventional-changelog-conventionalcommits@^8.0.0
```

给 `commitlint-config` 子包安装提交规范解析预设。

```bash
pnpm --filter fe-spec-qz-markdownlint-config add -D markdownlint@^0.37.4
```

给 `markdownlint-config` 子包安装 Markdown 规则校验依赖。

```bash
pnpm test
```

运行所有子包测试。

```bash
pnpm docs:dev
```

启动 VuePress 文档站。

```bash
pnpm docs:build
```

构建 VuePress 文档站。

```bash
pnpm publish
```

发布所有需要发布的子包。

## 20. 当前项目需要注意的问题

当前项目里有几个复刻时需要特别注意的点：

1. `README.md` 和 `docs/.vuepress/config.js` 中存在中文乱码，复刻时请统一使用 UTF-8 编码。
2. `commitlint-config` 的真实入口是 `index.js`，但 `lib/commitlint-config.js` 是脚手架示例代码。
3. `markdownlint-config` 的真实入口是 `index.json`，但 `lib/markdownlint-config.js` 是脚手架示例代码。
4. 两个子包当前的测试文件也是脚手架示例测试，建议改成校验真实配置。
5. 根目录同时存在 `package-lock.json` 和 `pnpm-lock.yaml` 时，建议只保留 `pnpm-lock.yaml`，因为项目通过 `preinstall` 强制使用 `pnpm`。

## 21. 推荐优化方向

复刻完成后，可以继续完善：

- 新增 `eslint-config` 包。
- 新增 `stylelint-config` 包。
- 新增统一 CLI 工具，实现一键接入规范。
- 完善 VuePress 文档。
- 添加 GitHub Actions，实现自动测试和发布。
- 使用 `changesets` 或 Lerna changelog 能力生成变更日志。
- 将示例测试替换为真实配置测试。

## 22. 最小可运行检查清单

完成复刻后，依次检查：

- `pnpm install` 能成功安装依赖。
- `pnpm test` 能成功执行所有子包测试。
- `pnpm docs:dev` 能启动文档站。
- `pnpm docs:build` 能构建文档站。
- `git commit -m "feat: init project"` 能通过 commitlint 校验。
- `git commit -m "init"` 会被 commitlint 拦截。

## 23. 从零复刻的完整执行顺序

如果你不想在上面的章节之间来回翻，可以直接按这个顺序走。

第 1 步：创建项目。

```bash
mkdir fe-spec
cd fe-spec
git init
```

第 2 步：创建目录。

```bash
mkdir packages
mkdir docs
mkdir docs/.vuepress
mkdir packages/commitlint-config
mkdir packages/commitlint-config/lib
mkdir packages/commitlint-config/__tests__
mkdir packages/markdownlint-config
mkdir packages/markdownlint-config/lib
mkdir packages/markdownlint-config/__tests__
```

第 3 步：创建根目录配置文件。

需要创建：

```text
package.json
pnpm-workspace.yaml
lerna.json
.gitignore
.markdownlint.json
commitlint.config.js
README.md
```

这些文件的作用：

| 文件 | 作用 |
| --- | --- |
| `package.json` | 根项目依赖和脚本 |
| `pnpm-workspace.yaml` | 声明 workspace 子包范围 |
| `lerna.json` | Lerna 多包管理配置 |
| `.gitignore` | 忽略无需提交的文件 |
| `.markdownlint.json` | 根项目 Markdown 检查配置 |
| `commitlint.config.js` | 根项目 Git 提交信息检查配置 |
| `README.md` | 项目介绍 |

第 4 步：创建两个子包文件。

`commitlint-config` 子包需要：

```text
packages/commitlint-config/package.json
packages/commitlint-config/index.js
packages/commitlint-config/lib/commitlint-config.js
packages/commitlint-config/__tests__/commitlint-config.test.js
packages/commitlint-config/README.md
```

`markdownlint-config` 子包需要：

```text
packages/markdownlint-config/package.json
packages/markdownlint-config/index.json
packages/markdownlint-config/lib/markdownlint-config.js
packages/markdownlint-config/__tests__/markdownlint-config.test.js
packages/markdownlint-config/README.md
```

第 5 步：创建 VuePress 文档站文件。

```text
docs/.vuepress/config.js
docs/index.md
```

第 6 步：安装根目录依赖。

```bash
pnpm add -D -w lerna@^8.2.1
pnpm add -D -w husky@^9.1.7
pnpm add -D -w markdownlint@^0.37.4
pnpm add -D -w vue@^3.5.13
pnpm add -D -w vuepress@2.0.0-rc.20
pnpm add -D -w @vuepress/bundler-vite@2.0.0-rc.20
pnpm add -D -w @vuepress/theme-default@2.0.0-rc.85
pnpm add -D -w sass-embedded@^1.86.0
pnpm add -D -w @commitlint/cli
```

第 7 步：安装本地子包依赖。

```bash
pnpm add -w commitlint-config@file:packages/commitlint-config
```

这一步的作用是让根项目可以引用本地 `commitlint-config` 包。

第 8 步：给子包安装各自依赖。

```bash
pnpm --filter fe-spec-qz-commitlint-config add conventional-changelog-conventionalcommits@^8.0.0
pnpm --filter fe-spec-qz-markdownlint-config add -D markdownlint@^0.37.4
```

第 9 步：安装全部依赖并生成锁文件。

```bash
pnpm install
```

执行后会出现：

```text
node_modules/
pnpm-lock.yaml
```

第 10 步：初始化 Husky。

```bash
pnpm prepare
```

然后创建：

```text
.husky/commit-msg
```

内容为：

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx commitlint --edit $1
```

第 11 步：运行测试。

```bash
pnpm test
```

第 12 步：启动文档站。

```bash
pnpm docs:dev
```

第 13 步：构建文档站。

```bash
pnpm docs:build
```

走完这 13 步，一个最小可运行的复刻项目就完成了。

## 24. 常见问题和排查方式

### 24.1 pnpm 提示 Node 版本太低

可能报错：

```text
This version of pnpm requires at least Node.js v18.12
```

原因：

- 你当前 Node.js 版本低于 pnpm 要求。

解决：

```bash
node -v
```

如果低于 `18.12`，升级 Node.js 到 18 或 20。

### 24.2 给根目录安装依赖时报错

如果你执行：

```bash
pnpm add -D lerna
```

在 workspace 项目中可能会提示你确认是否安装到根目录。

推荐写法：

```bash
pnpm add -D -w lerna
```

原因：

- `-w` 明确告诉 pnpm：我要安装到 workspace root。

### 24.3 pnpm --filter 找不到包

如果执行：

```bash
pnpm --filter fe-spec-qz-commitlint-config add conventional-changelog-conventionalcommits
```

提示找不到包，检查两个地方：

1. `packages/commitlint-config/package.json` 里的 `name` 是否真的是 `fe-spec-qz-commitlint-config`。
2. `pnpm-workspace.yaml` 是否包含 `packages/*`。

### 24.4 pnpm test 失败

先看执行链路：

```text
pnpm test
  -> lerna run test
  -> 执行每个子包 package.json 里的 scripts.test
```

如果失败，分别检查：

- 子包 `package.json` 是否有 `scripts.test`。
- 测试文件路径是否正确。
- `require('..')` 加载的入口是否和测试内容匹配。

当前项目里测试文件是脚手架示例，但 `index.js` / `index.json` 才是真实配置。更推荐使用文档中给出的真实配置测试写法。

### 24.5 commitlint 没生效

检查：

- 是否安装了 `husky`。
- 是否执行过 `pnpm prepare`。
- 是否存在 `.husky/commit-msg` 文件。
- `commitlint.config.js` 是否正确指向 `./packages/commitlint-config/index.js`。
- 是否安装了 `@commitlint/cli`。

可以手动测试：

```bash
npx commitlint --from HEAD~1 --to HEAD --verbose
```

### 24.6 VuePress 启动失败

检查：

- 是否安装了 `vuepress`。
- 是否安装了 `vue`。
- 是否安装了 `@vuepress/bundler-vite`。
- 是否安装了 `@vuepress/theme-default`。
- `docs/.vuepress/config.js` 是否存在语法错误。

重新安装相关依赖：

```bash
pnpm add -D -w vue@^3.5.13 vuepress@2.0.0-rc.20
pnpm add -D -w @vuepress/bundler-vite@2.0.0-rc.20 @vuepress/theme-default@2.0.0-rc.85
pnpm add -D -w sass-embedded@^1.86.0
```

### 24.7 package-lock.json 和 pnpm-lock.yaml 同时存在

这个项目强制使用 pnpm，所以推荐只保留：

```text
pnpm-lock.yaml
```

不推荐同时维护：

```text
package-lock.json
pnpm-lock.yaml
```

原因：

- `package-lock.json` 是 npm 的锁文件。
- `pnpm-lock.yaml` 是 pnpm 的锁文件。
- 两个锁文件同时存在，容易让协作者误用包管理器。

## 25. 学习这个项目的建议路线

第一阶段：先跑起来。

- 目标是执行 `pnpm install`、`pnpm test`、`pnpm docs:dev`。
- 不要求马上理解每一条规则。

第二阶段：理解 monorepo。

- 看懂 `pnpm-workspace.yaml`。
- 看懂根目录 `package.json` 和子包 `package.json` 的区别。
- 看懂 `pnpm --filter`。

第三阶段：理解规范包。

- 看懂 `commitlint-config/index.js`。
- 看懂 `markdownlint-config/index.json`。
- 尝试修改一条规则并验证效果。

第四阶段：理解自动化。

- 看懂 Husky 的 `commit-msg` 钩子。
- 看懂 `lerna run test` 如何批量执行测试。

第五阶段：扩展项目。

- 新增 `eslint-config`。
- 新增 `stylelint-config`。
- 新增统一 CLI 工具。
- 完善 VuePress 文档。
