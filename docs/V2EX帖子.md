# [分享] 写了一个 VS Code 插件 TransPreview，在编辑器里直接预览和翻译英文文档

最近在学一些新的技术栈，经常要看英文文档。众所周知，很多优质的技术文档都是英文的，比如 Claude Code 的 SKILL 文档、各种开源项目的 README 等。

每次看英文文档都要：
- 复制 → 切换到浏览器/翻译软件 → 粘贴翻译 → 切回来
- 或者用浏览器翻译整个网页，但格式全乱了，代码也看不清

挺烦的，就想着能不能在 VS Code 里直接搞定。

## 做了个插件：TransPreview

简单说，就是能在 VS Code 里：
1. **一键预览** - 在编辑区旁边打开预览面板
2. **AI 翻译** - 点一下就全文翻译
3. **实时同步** - 修改文件时预览自动更新
4. **主题适配** - 跟随 VS Code 主题颜色

### 效果图

![](https://gudong.s3.bitiful.net/weimd/1768126448645_image.png)

### 翻译服务

支持国产 AI，速度快还便宜：
- DeepSeek（推荐，¥1/百万 token）
- 智谱 AI（GLM-4-flash，很快）
- 通义千问
- OpenAI（如果你有）

### 开源

GitHub：https://github.com/maoruibin/TransPreview

MIT 许可证，欢迎提 Issue 和 PR。

### 安装

目前还在打包发布到 Marketplace 的过程中，稍后应该就能搜到了。

如果想先试试，可以从源码运行：
```bash
git clone https://github.com/maoruibin/TransPreview.git
cd TransPreview
npm install
npm run compile
# 然后按 F5 启动调试
```

### 求反馈

如果觉得有用，欢迎：
- GitHub 给个 Star ⭐
- 提点建议和 Bug
- 顺便宣传一下哈哈

---

我是咕咚同学，Android 开发/独立开发者，偶尔写点有用的工具。
