# TransPreview

> 在 VS Code 中预览文件并使用 AI 进行翻译。专为阅读英文文档和技术文章设计。

[![VS Code](https://img.shields.io/badge/VS_Code-1.85.0-blue.svg)](https://code.visualstudio.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

## ✨ 为什么选择 TransPreview？

### 痛点

你是否遇到过这些困扰：

- 📖 **阅读英文技术文档很吃力** - 尤其是 Claude Code、React、Vue 等 SKILL 文档
- 🌐 **频繁切换翻译工具打断思路** - 复制粘贴到浏览器翻译，再返回编辑器
- 📋 **想在 VS Code 里直接看文档** - 不想切换窗口
- 🤖 **想用 AI 翻译但不想离开编辑器**

### 解决方案

TransPreview 让你可以在 VS Code 中：
- 🔍 **一键预览** - 在编辑区旁边打开预览面板
- 🌐 **AI 翻译** - 支持多家国产 AI 服务，快速准确
- 📝 **实时同步** - 文件修改时预览自动更新
- 🎨 **主题适配** - 自动跟随 VS Code 主题颜色

## 📸 功能演示

![](https://gudong.s3.bitiful.net/weimd/1768126448645_image.png)

### 使用说明
1. 点击编辑区右上角的 **预览图标** 打开预览面板
2. 预览面板会在右侧显示文件内容
3. 点击 **Translate** 按钮进行 AI 翻译

## 🚀 快速开始

### 安装

```bash
# 方式 1: 从 VS Code Marketplace 安装 (即将上线)
code --install-extension transpreview

# 方式 2: 从 .vsix 文件安装
# 下载最新版本的 .vsix 文件后
code --install-extension transpreview-x.x.x.vsix
```

### 配置 API Key

1. 打开 VS Code 设置 (`Cmd + ,` / `Ctrl + ,`)
2. 搜索 `TransPreview`
3. 配置以下选项：
   - **TransPreview: Translator**: 选择翻译服务 (推荐 DeepSeek)
   - **TransPreview: Api Key**: 填入你的 API Key
   - **TransPreview: Auto Translate**: 是否打开预览时自动翻译

### 获取 API Key

| 服务 | 官网 | 价格 | 速度 |
|------|------|------|------|
| [DeepSeek](https://platform.deepseek.com) | deepseek.com | ¥1/百万token | ⚡⚡⚡ |
| [智谱 AI](https://open.bigmodel.cn) | open.bigmodel.cn | 便宜 | ⚡⚡⚡ |
| [通义千问](https://dashscope.aliyuncs.com) | aliyun.com | 便宜 | ⚡⚡ |
| [OpenAI](https://openai.com) | openai.com | 较贵 | ⚡⚡ |

### 使用方法

1. 打开任意文件
2. 点击编辑区右上角的 **预览图标** (mirror icon)
3. 预览面板会在右侧显示
4. 点击 **Translate** 按钮进行翻译

## 🛠️ 开发

```bash
# 克隆仓库
git clone https://github.com/maoruibin/TransPreview.git
cd TransPreview

# 安装依赖
npm install

# 编译
npm run compile

# 监听模式
npm run watch

# 按 F5 启动调试
```

## 📦 打包发布

```bash
# 安装 vsce
npm install -g @vscode/vsce

# 打包
npm run package

# 发布到 VS Code Marketplace
vsce publish
```

## 🗺️ 路线图

- [ ] 语法高亮支持
- [ ] 代码块美化
- [ ] 翻译缓存
- [ ] 多语言翻译方向智能检测
- [ ] 支持更多翻译服务
- [ ] 发布到 VS Code Marketplace

## 👨‍💻 作者

**咕咚同学** - Android 开发工程师 / 独立开发者 / inbox 笔记作者

- GitHub: [@maoruibin](https://github.com/maoruibin)

## 📮 公众号

关注我的公众号，获取更多开发技巧和工具分享：

![公众号二维码](https://gudong.s3.bitiful.net/asset/gongzhonghao.jpg)

## ☕ 打赏

如果这个项目对你有帮助，欢迎请我喝杯咖啡：

![打赏](https://doc.gudong.site/assets/img/alipay-donate.7ec06101.jpg)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

[MIT](LICENSE)

## 🙏 致谢

- [VS Code Extension API](https://code.visualstudio.com/api)
- [DeepSeek](https://deepseek.com)
- [智谱 AI](https://open.bigmodel.cn)

---

**如果你觉得这个项目有用，请给一个 ⭐ Star！**
