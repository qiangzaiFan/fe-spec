const path = require('path')
const requireAll = require('require-all')

// ESLint 插件的入口文件：ESLint 加载插件时，会读取这里导出的 configs / rules / processors。
// require-all 会把 configs 目录下的每个配置文件自动 require 进来。
exports.configs = requireAll({
  dirname: path.resolve(__dirname,'configs')
})

// 这里会把 rules 目录下的每个规则文件自动注册成插件规则。
// 例如 rules/no-http-url.js 会变成 eslint-plugin-qz/no-http-url。
exports.rules = requireAll({
  dirname:path.resolve(__dirname,'rules')
})

// processor 用来告诉 ESLint：遇到某类非 JS 文件时，先把内容转换成 JS 再交给 parser。
// package.json 本身不是 JS，这里把 JSON 包成一个赋值表达式，方便规则用普通 AST 节点分析。
exports.processors = {
  '.json':{
    preprocess:(text)=>{
      return [`modules.exports = ${text}`]
    }
  }
}
