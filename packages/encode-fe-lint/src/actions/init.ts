import inquirer from 'inquirer'
import path from 'path';
import fs from 'fs-extra';
import spawn from 'cross-spawn';
import update from './update'
import npmType from '../utils/npm-type';
import log from '../utils/log';
// conflictResolve 怎么样在安装版本的时候去解决版本冲突呢
import conflictResolve from '../utils/conflict-resolve';
import generateTemplate from '../utils/generate-template';
import { PROJECT_TYPES, PKG_NAME } from '../utils/constants';
import type { InitConfig, InitOptions, PKG } from '../types';

let step = 0;

// 下面这些步骤就是我们去调用的一个方式 chooseEslintType、chooseEnableStylelint 等
/**
 * 选择项目语言和框架
 */
const chooseEslintType = async (): Promise<string> => {
  // type 就是最后选择的 PROJECT_TYPES 中的value值
  //  type: 'list',就是 下拉选择，name 也和下面的stylelint不一样
  const { type } = await inquirer.prompt({
    type: 'list',
    name: 'type',
    message: `Step ${++step}. 请选择项目的语言（JS/TS）和框架（React/Vue）类型：`,
    choices: PROJECT_TYPES,
  });

  return type;
};


/**
 * 选择是否启用 stylelint
 * @param defaultValue
 */
const chooseEnableStylelint = async (defaultValue: boolean): Promise<boolean> => {
  //  type: 'confirm' 确认框 ， Y 和 N 的选择
  const { enable } = await inquirer.prompt({
    type: 'confirm',
    name: 'enable',
    message: `Step ${++step}. 是否需要使用 stylelint（若没有样式文件则不需要）：`,
    default: defaultValue,
  });

  return enable;
};


/**
 * 选择是否启用 markdownlint
 */
const chooseEnableMarkdownLint = async (): Promise<boolean> => {
  const { enable } = await inquirer.prompt({
    type: 'confirm',
    name: 'enable',
    message: `Step ${++step}. 是否需要使用 markdownlint（若没有 Markdown 文件则不需要）：`,
    default: true,
  });

  return enable;
};

/**
 * 选择是否启用 prettier
 */
const chooseEnablePrettier = async (): Promise<boolean> => {
  const { enable } = await inquirer.prompt({
    type: 'confirm',
    name: 'enable',
    message: `Step ${++step}. 是否需要使用 Prettier 格式化代码：`,
    default: true,
  });

  return enable;
};

// 核心就是进入问答的一个形式

export default async (options: InitOptions)=>{
  // 获取它的一个根目录，路径
  const cwd = options.cwd || process.cwd();
  // 判断它是不是一个测试的环境
  const isTest = process.env.NODE === 'test'
  // 判断传的参数是否支持我们的自动更新
  const checkVersionUpdate = options.checkVersionUpdate || false;
  // 是否需要进入初始化之后，自动安装依赖的过程， 不会强制用户先去安装依赖。提供这个能力就可以了。
  const disableNpmInstall = options.disableNpmInstall || false;
  // 存储一下当前会记录的结果
  const config: InitConfig = {
    eslintType: '',
    enableESLint: typeof options.enableESLint === 'boolean' ? options.enableESLint : true,
    enableStylelint: false,
    enableMarkdownlint: false,
    enablePrettier: false,
  };
  // 获取当前根目录下package.json的路径
  const pkgPath = path.resolve(cwd, 'package.json')
  // 如果你当前项目已经初始化过了，有了eslintConfig、eslintIgnore、stylelint 这些依赖项，
  //是不是要合并到我们的配置项里面。所以要先获取到它当前包的内容，下面会去消费它。

  let pkg:PKG = fs.readFileSync(pkgPath)

  // 判断是否进行版本的更新，默认不安装
  if(!isTest && checkVersionUpdate){
    await update(false)
  }
  // 不会主动去限制用户的配置，只要一些包配置项不启用（比如stylelint、markdown）的时候，才会判断要不要加option的配置

  // 初始化 `eslintType`
  if (options.eslintType && PROJECT_TYPES.find((choice) => choice.value === options.eslintType)) {
    config.eslintType = options.eslintType;
  } else {
    config.eslintType = await chooseEslintType();
  }

  // 初始化 `enableåStylelint`
  if (typeof options.enableStylelint === 'boolean') {
    config.enableStylelint = options.enableStylelint;
  } else {
    config.enableStylelint = await chooseEnableStylelint(!/node/.test(config.eslintType));
  }

  // 初始化 `enableMarkdownlint`
  if (typeof options.enableMarkdownlint === 'boolean') {
    config.enableMarkdownlint = options.enableMarkdownlint;
  } else {
    config.enableMarkdownlint = await chooseEnableMarkdownLint();
  }

  // 初始化 `enablePrettier`
  if (typeof options.enablePrettier === 'boolean') {
    config.enablePrettier = options.enablePrettier;
  } else {
    config.enablePrettier = await chooseEnablePrettier();
  }

  if (!isTest) {
    log.info(`Step ${++step}. 检查并处理项目中可能存在的依赖和配置冲突`);
    pkg = await conflictResolve(cwd, options.rewriteConfig);
    log.success(`Step ${step}. 已完成项目依赖和配置冲突检查处理 :D`);

    if (!disableNpmInstall) {
      log.info(`Step ${++step}. 安装依赖`);
      const npm = await npmType;
      spawn.sync(npm, ['i', '-D', PKG_NAME], { stdio: 'inherit', cwd });
      log.success(`Step ${step}. 安装依赖成功 :D`);
    }
  }

  // 更新 pkg.json
  pkg = fs.readJSONSync(pkgPath);
  // 在 `package.json` 中写入 `scripts`
  if (!pkg.scripts) {
    pkg.scripts = {};
  }
  if (!pkg.scripts[`${PKG_NAME}-scan`]) {
    pkg.scripts[`${PKG_NAME}-scan`] = `${PKG_NAME} scan`;
  }
  if (!pkg.scripts[`${PKG_NAME}-fix`]) {
    pkg.scripts[`${PKG_NAME}-fix`] = `${PKG_NAME} fix`;
  }

  // 配置 commit 卡点
  log.info(`Step ${++step}. 配置 git commit 卡点`);
  if (!pkg.husky) pkg.husky = {};
  if (!pkg.husky.hooks) pkg.husky.hooks = {};
  pkg.husky.hooks['pre-commit'] = `${PKG_NAME} commit-file-scan`;
  pkg.husky.hooks['commit-msg'] = `${PKG_NAME} commit-msg-scan`;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  log.success(`Step ${step}. 配置 git commit 卡点成功 :D`);

  log.info(`Step ${++step}. 写入配置文件`);
  generateTemplate(cwd, config);
  log.success(`Step ${step}. 写入配置文件成功 :D`);

  // 完成信息
  const logs = [`${PKG_NAME} 初始化完成 :D`].join('\r\n');
  log.success(logs);
}
