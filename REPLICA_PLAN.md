# fe-spec 复刻学习与实现路线

## 1. 项目定位

- 这是一个前端规范工程化 `monorepo`，核心目标是把零散规范工具收敛成一套统一产物。
- 核心产物有 6 个 npm 包：
  - `eslint-config-encode`
  - `stylelint-config-encode`
  - `commitlint-config-encode`
  - `markdownlint-config-encode`
  - `eslint-plugin-encode`
  - `encode-fe-lint`（CLI + Node API，聚合前面 5 个包）

## 2. 仓库结构和职责

根目录关键文件：

- `fe-spec/package.json`：工作区根脚本，文档构建、测试、发包。
- `fe-spec/pnpm-workspace.yaml`：workspace 配置。
- `fe-spec/lerna.json`：lerna 发布配置。
- `fe-spec/docs/.vuepress/config.ts`：文档站导航和站点配置。
- `fe-spec/.github/workflows/deploy.yml`：文档自动部署。

子包职责：

- `packages/eslint-config`：多场景 ESLint 规则集合（JS/TS/React/Vue/Node/Essential）。
- `packages/stylelint-config`：样式规范规则集合。
- `packages/commitlint-config`：commit message 规范。
- `packages/markdownlint-config`：Markdown 规范。
- `packages/eslint-plugin`：自定义 ESLint 规则。
- `packages/encode-fe-lint`：统一命令入口，支持 `init/scan/fix/commit-file-scan/commit-msg-scan/update`。

## 3. 关键调用链（先吃透这 3 条）

### 3.1 init 链路

- 入口：`packages/encode-fe-lint/src/cli.ts`
- 执行：`actions/init.ts`
- 关键步骤：
  - 交互式收集项目类型与开关
  - `utils/conflict-resolve.ts` 清理冲突依赖与历史配置
  - 改写目标项目 `package.json` 的 scripts 和 husky hooks
  - `utils/generate-template.ts` 生成配置模板

### 3.2 scan/fix 链路

- 入口：`actions/scan.ts`
- 子执行器：
  - ESLint：`lints/eslint/*`
  - stylelint：`lints/stylelint/*`
  - markdownlint：`lints/markdownlint/*`
  - Prettier（仅 fix 时）：`lints/prettier/*`
- 聚合输出：`utils/print-report.ts`

### 3.3 文档与发布链路

- 文档开发/构建：根脚本 `docs:dev` / `docs:build`
- 文档部署：`.github/workflows/deploy.yml`
- npm 发布：根脚本 `publish`（lerna）

## 4. 复刻建议顺序（从易到难）

1. `stylelint-config` + 测试
2. `commitlint-config` + `markdownlint-config`
3. `eslint-config`（先 JS 基础，再 React/Vue/TS）
4. `eslint-plugin`（先 1 条自定义规则，再扩展）
5. `encode-fe-lint` CLI（先 `scan/fix`，后 `init/commit hooks/update`）
6. `docs + CI + 发布`

## 5. 分阶段实操计划（可直接执行）

### Phase A：搭骨架（1 天）

目标：

- 新建你的复刻仓库，完成 `pnpm + workspace + lerna` 基础结构。

产出：

- 根目录 `package.json`、`pnpm-workspace.yaml`、`lerna.json`
- `packages/*` 6 个子包目录

验收：

- `pnpm -r run test` 能遍历到各包（即使部分暂为空实现）。

### Phase B：先做 3 个轻量配置包（1-2 天）

目标：

- 完成 `stylelint-config`、`commitlint-config`、`markdownlint-config` 三包。

产出：

- 三个包都能单独被外部项目 `extends` 使用。
- 至少各有 1 个自动化测试。

验收：

- 本地示例项目引用后可成功 lint/commit 检查。

### Phase C：做 eslint-config（3-5 天）

目标：

- 完成 `index/react/vue/node/typescript` 多入口配置。

产出：

- JS、TS、React、Vue、Node 规则分层组织。
- `essential` 版本（将部分风格规则降级为 warn）。

验收：

- 基于 fixtures 的配置验证测试通过。

### Phase D：做 eslint-plugin（1-2 天）

目标：

- 实现自定义规则体系和 recommended preset。

建议第一条规则：

- `no-http-url`（实现简单，能快速打通测试闭环）。

验收：

- `RuleTester` 测试覆盖 valid/invalid 场景。

### Phase E：做 encode-fe-lint CLI（4-6 天）

目标：

- 实现最小可用 CLI + Node API。

实现顺序：

1. `scan`（聚合 eslint/stylelint/markdownlint）
2. `fix`（加入 prettier 自动修复）
3. `init`（模板生成 + package.json 注入）
4. `commit-file-scan` / `commit-msg-scan`
5. `update`（版本检查）

验收：

- 对一个示例仓库可完成：
  - `init` 生成配置
  - `scan` 输出问题
  - `fix` 自动修复一部分问题
  - git 提交时触发卡口

### Phase F：文档站与自动部署（1-2 天）

目标：

- 用 VuePress 复刻文档结构并接入 GitHub Pages 部署。

验收：

- push 到主分支后自动构建并发布站点。

## 6. 复刻时需要提前规避的坑

- 当前仓库 `encode-fe-lint` 测试里有 `exec` 命令断言，但 CLI 源码里没有 `exec` 子命令，复刻时需统一（要么删测试，要么补命令）。
- `eslint-plugin-encode/package.json` 的 `main` 指向 `src/index.js`，但仓库里是 `index.js`；复刻时请修正入口路径。
- `encode-fe-lint` 使用的是旧版 husky hooks 写法（写入 `package.json` 的 `husky.hooks`），如果你用 husky v8+，建议改为 `.husky/*` 脚本模式。
- `pnpm` 未安装时 CLI 会回退到 `npm`，复刻时建议保留这个兼容策略。
- `stylelint` 报告里 `stylelint-scss` 规则文档链接匹配写成了 `@scss/`，建议修正为 `scss/` 前缀匹配。

## 7. 学习源码的最短路径（阅读顺序）

1. `packages/encode-fe-lint/src/cli.ts`
2. `packages/encode-fe-lint/src/actions/init.ts`
3. `packages/encode-fe-lint/src/actions/scan.ts`
4. `packages/encode-fe-lint/src/lints/*`
5. `packages/eslint-config/index.js` + `rules/*`
6. `packages/eslint-plugin/rules/*`
7. `docs/.vuepress/config.ts`

## 8. 你的下一步（今天就能开始）

1. 新建一个空仓库，先只复刻 Phase A + Phase B。
2. 我可以下一步直接给你生成这个“复刻仓库”的初始代码骨架（含 workspace、6 包 package.json、基础测试脚手架）。
3. 然后我们按 Phase C 开始逐包补实现，我会按提交粒度带你完成。

## 9. 可复制操作步骤（命令版）

> 下方命令默认在 macOS/Linux 的 `zsh/bash` 执行。  
> 将 `my-fe-spec-clone` 替换成你的仓库名。

### 9.1 初始化复刻仓库（Phase A）

```bash
# 1) 新建仓库目录
mkdir -p ~/workspace/my-fe-spec-clone
cd ~/workspace/my-fe-spec-clone

# 2) 初始化 git
git init

# 3) 安装 pnpm（若已安装可跳过）
corepack enable
corepack prepare pnpm@8.6.0 --activate

# 4) 初始化根 package.json
cat > package.json <<'EOF'
{
  "name": "my-fe-spec-clone",
  "private": true,
  "scripts": {
    "preinstall": "npx only-allow pnpm",
    "test": "pnpm -r run test",
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  },
  "devDependencies": {
    "lerna": "^6.6.2",
    "pnpm": "^8.6.0",
    "typescript": "^5.0.4"
  }
}
EOF

# 5) 初始化 workspace 与 lerna
cat > pnpm-workspace.yaml <<'EOF'
packages:
  - 'packages/*'
EOF

cat > lerna.json <<'EOF'
{
  "version": "0.0.0",
  "npmClient": "pnpm",
  "useWorkspaces": true
}
EOF

# 6) 创建 6 个包目录
mkdir -p packages/{eslint-config,stylelint-config,commitlint-config,markdownlint-config,eslint-plugin,encode-fe-lint}
```

### 9.2 先做 3 个轻量包（Phase B）

```bash
# stylelint-config
cat > packages/stylelint-config/package.json <<'EOF'
{
  "name": "stylelint-config-encode",
  "version": "0.0.1",
  "main": "index.js",
  "peerDependencies": {
    "stylelint": ">=14.0.0",
    "stylelint-scss": ">=4.0.0"
  },
  "scripts": {
    "test": "echo 'todo: stylelint-config tests'"
  }
}
EOF

cat > packages/stylelint-config/index.js <<'EOF'
module.exports = {
  extends: [],
  plugins: ['stylelint-scss'],
  rules: {
    'scss/at-rule-no-unknown': true
  }
};
EOF

# commitlint-config
cat > packages/commitlint-config/package.json <<'EOF'
{
  "name": "commitlint-config-encode",
  "version": "0.0.1",
  "main": "index.js",
  "dependencies": {
    "conventional-changelog-conventionalcommits": "^4.5.0"
  },
  "scripts": {
    "test": "echo 'todo: commitlint-config tests'"
  }
}
EOF

cat > packages/commitlint-config/index.js <<'EOF'
module.exports = {
  parserPreset: 'conventional-changelog-conventionalcommits',
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'test', 'refactor', 'chore', 'revert']]
  }
};
EOF

# markdownlint-config
cat > packages/markdownlint-config/package.json <<'EOF'
{
  "name": "markdownlint-config-encode",
  "version": "0.0.1",
  "main": "index.json",
  "peerDependencies": {
    "markdownlint": "^0.28.1"
  },
  "scripts": {
    "test": "echo 'todo: markdownlint-config tests'"
  }
}
EOF

cat > packages/markdownlint-config/index.json <<'EOF'
{
  "default": true,
  "line-length": false,
  "no-inline-html": false
}
EOF
```

### 9.3 增加 eslint-config 与 eslint-plugin 骨架（Phase C/D）

```bash
# eslint-config
cat > packages/eslint-config/package.json <<'EOF'
{
  "name": "eslint-config-encode",
  "version": "0.0.1",
  "main": "index.js",
  "scripts": {
    "test": "echo 'todo: eslint-config tests'"
  }
}
EOF

cat > packages/eslint-config/index.js <<'EOF'
module.exports = {
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
  rules: {
    semi: ['error', 'always']
  }
};
EOF

# eslint-plugin
cat > packages/eslint-plugin/package.json <<'EOF'
{
  "name": "eslint-plugin-encode",
  "version": "0.0.1",
  "main": "index.js",
  "scripts": {
    "test": "echo 'todo: eslint-plugin tests'"
  }
}
EOF

cat > packages/eslint-plugin/index.js <<'EOF'
module.exports = {
  rules: {
    'no-http-url': {
      meta: {
        type: 'suggestion',
        messages: { noHttpUrl: 'Recommended "{{url}}" switch to HTTPS' }
      },
      create(context) {
        return {
          Literal(node) {
            if (typeof node.value === 'string' && node.value.startsWith('http:')) {
              context.report({ node, messageId: 'noHttpUrl', data: { url: node.value } });
            }
          }
        };
      }
    }
  }
};
EOF
```

### 9.4 增加 encode-fe-lint CLI 最小可用版（Phase E）

```bash
cat > packages/encode-fe-lint/package.json <<'EOF'
{
  "name": "encode-fe-lint",
  "version": "0.0.1",
  "bin": "./bin/cli.js",
  "main": "./index.js",
  "scripts": {
    "test": "node ./bin/cli.js --help"
  },
  "dependencies": {
    "commander": "^6.2.1"
  }
}
EOF

mkdir -p packages/encode-fe-lint/bin

cat > packages/encode-fe-lint/bin/cli.js <<'EOF'
#!/usr/bin/env node
const { program } = require('commander');

program
  .name('encode-fe-lint')
  .version('0.0.1');

program.command('scan').action(() => {
  console.log('todo: run eslint/stylelint/markdownlint');
});

program.command('fix').action(() => {
  console.log('todo: run prettier + lint autofix');
});

program.parse(process.argv);
EOF

chmod +x packages/encode-fe-lint/bin/cli.js
```

### 9.5 安装与联调

```bash
# 安装全部依赖
pnpm install

# 跑一遍所有包测试脚本
pnpm -r run test

# 本地调用 CLI（workspace 内）
node packages/encode-fe-lint/bin/cli.js --help
node packages/encode-fe-lint/bin/cli.js scan
```

### 9.6 首次提交

```bash
git add .
git commit -m "chore: init fe-spec clone skeleton"
```
