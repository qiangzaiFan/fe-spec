const path = require('path')
const requireAll = require('require-all')

exports.configs = requireAll({
  dirname: path.resolve(__dirname,'configs')
})

exports.rules = requireAll({
  dirname:path.resolve(__dirname,'rules')
})

exports.processors = {
  '.json':{
    preprocess:(text)=>{
      return [`modules.exports = ${text}`]
    }
  }
}
