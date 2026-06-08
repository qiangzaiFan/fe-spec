module.exports = {
    // 使用这个推荐配置时，默认启用 eslint-plugin-qz 插件。
    plugins:['eslint-plugin-qz'],
    rules:{
        // 规则名格式：插件名/规则文件名。
        // no-http-url.js 对应 eslint-plugin-qz/no-http-url。
        'eslint-plugin-qz/no-http-url':'warn',
        'eslint-plugin-qz/no-secret-info':'error',
    }
}
