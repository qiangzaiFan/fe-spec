import path = require('path');
import fs = require('fs');

const pkg: Record<string, any> = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8'),
);

/**
 * 包名
 */
export const PKG_NAME: string = pkg.name;

/**
 * 包版本号
 */
export const PKG_VERSION:string = pkg.version;

export enum UNICODE {
  success = '\u2714', // ✔
  failure = '\u2716', // ✖
}

/**
 * 项目类型
 */
export const PROJECT_TYPES: Array<{ name: string; value: string }> = [
  {
    name: '未使用 React、Vue、Node.js 的项目（JavaScript）',
    value: 'index',
  },
  {
    name: '未使用 React、Vue、Node.js 的项目（TypeScript）',
    value: 'typescript',
  },
  {
    name: 'React 项目（JavaScript）',
    value: 'react',
  },
  {
    name: 'React 项目（TypeScript）',
    value: 'typescript/react',
  },
  {
    name: 'Rax 项目（JavaScript）',
    value: 'rax',
  },
  {
    name: 'Rax 项目（TypeScript）',
    value: 'typescript/rax',
  },
  {
    name: 'Vue 项目（JavaScript）',
    value: 'vue',
  },
  {
    name: 'Vue 项目（TypeScript）',
    value: 'typescript/vue',
  },
  {
    name: 'Node.js 项目（JavaScript）',
    value: 'node',
  },
  {
    name: 'Node.js 项目（TypeScript）',
    value: 'typescript/node',
  },
  {
    name: '使用 ES5 及之前版本 JavaScript 的老项目',
    value: 'es5',
  },
];

export const ESLINT_IGNORE_PATTERN = [
  'build/',
  'coverage/',
  'dist/',
  'es/',
  'lib/',
  'node_modules/',
  '**/*.min.js',
  '**/*-min.js',
  '**/*.bundle.js',
];

export const STYLELINT_FILE_EXT = ['.css', '.less', '.scss', '.sass', '.vue'];

export const STYLELINT_IGNORE_PATTERN = ['node_modules/', 'build/', 'coverage/', 'dist/', 'es/', 'lib/'];

export const MARKDOWN_LINT_IGNORE_PATTERN = ['node_modules/', 'build/', 'coverage/', 'dist/', 'es/', 'lib/'];
