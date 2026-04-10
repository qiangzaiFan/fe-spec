# encode-fe-lint

复刻版统一 CLI 骨架。

当前版本还没有真正调用 ESLint、stylelint、markdownlint 和 Prettier，而是先把命令面、配置写入和文件扫描骨架搭起来。

## 当前支持

- `init`：写入默认配置，并给目标项目补充基础脚本
- `scan`：根据文件扩展名生成最小扫描报告
- `fix`：与 `scan` 共用骨架逻辑，先占位
- `update`：升级提示占位

## 下一步

1. 引入真实 lint 依赖
2. 把扩展名扫描替换为实际 lint 执行器
3. 补充 `commit-file-scan` 和 `commit-msg-scan`
4. 接入模板生成和冲突配置迁移

