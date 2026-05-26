import { viteBundler } from '@vuepress/bundler-vite';
import { defaultTheme } from '@vuepress/theme-default';
import { defineUserConfig } from 'vuepress';

export default defineUserConfig({
  lang: 'zh-CN',
  title: '印客学院',
  description: '前端编码规范工程化',
  base: '/fe-spec/',
  bundler: viteBundler(),
  head: [
    ['link', { rel: 'icon', href: '/img/logo.png' }],
    ['meta', { name: 'keywords', content: '前端编码规范工程化' }],
  ],
  theme: defaultTheme({
    logo: '/img/logo.png',
    repo: 'encode-studio-fe/fe-spec',
    docsDir: 'docs',
    contributors: false,
    lastUpdated: false,
    themePlugins: {
      copyCode: {
        showInMobile: false,
      },
      mediumZoom: true,
    },
    navbar: [
      { text: '首页', link: '/index.md' },
      {
        text: '编码规范',
        children: [
          { text: 'HTML 编码规范', link: '/coding/html.md' },
          { text: 'CSS 编码规范', link: '/coding/css.md' },
          { text: 'JavaScript 编码规范', link: '/coding/javascript.md' },
          { text: 'Typescript 编码规范', link: '/coding/typescript.md' },
          { text: 'Node 编码规范', link: '/coding/node.md' },
        ],
      },
      {
        text: '工程规范',
        children: [
          { text: 'Git 规范', link: '/engineering/git.md' },
          { text: '文档规范', link: '/engineering/doc.md' },
          { text: 'CHANGELOG 规范', link: '/engineering/changelog.md' },
          { text: 'GitHub Pages 发布', link: '/engineering/github-pages.md' },
        ],
      },
      {
        text: 'NPM包',
        children: [
          { text: 'eslint-config-encode', link: '/npm/eslint.md' },
          { text: 'stylelint-config-encode', link: '/npm/stylelint.md' },
          { text: 'commitlint-config-encode', link: '/npm/commitlint.md' },
          { text: 'markdownlint-config-encode', link: '/npm/markdownlint.md' },
          { text: 'eslint-plugin-encode', link: '/npm/eslint-plugin.md' },
        ],
      },
      {
        text: '脚手架',
        children: [{ text: 'encode-fe-lint', link: '/cli/encode-fe-lint.md' }],
      },
    ],
    sidebar: [
      {
        text: '编码规范',
        children: [
          '/coding/html.md',
          '/coding/css.md',
          '/coding/javascript.md',
          '/coding/typescript.md',
          '/coding/node.md',
        ],
      },
      {
        text: '工程规范',
        children: [
          '/engineering/git.md',
          '/engineering/doc.md',
          '/engineering/changelog.md',
          '/engineering/github-pages.md',
        ],
      },
      {
        text: 'NPM包',
        children: [
          '/npm/eslint.md',
          '/npm/stylelint.md',
          '/npm/commitlint.md',
          '/npm/markdownlint.md',
          '/npm/eslint-plugin.md',
        ],
      },
      {
        text: '脚手架',
        children: ['/cli/encode-fe-lint.md'],
      },
    ],
  }),
});
