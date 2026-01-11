# 发布指南

## 准备工作

### 1. 修改 package.json

将以下占位符替换为实际值：

```json
{
  "publisher": "YOUR_PUBLISHER_NAME",  // 改为你的发布者名称
  "author": {
    "name": "Your Name",                // 改为你的名字
    "email": "your.email@example.com"   // 改为你的邮箱
  },
  "repository": {
    "url": "https://github.com/YOUR_USERNAME/PTvo.git"  // 改为你的仓库地址
  }
}
```

### 2. 创建插件图标

准备一个 128x128 像素的 PNG 图标，命名为 `icon.png`，放在项目根目录。

### 3. 修复 npm 权限问题（如果遇到）

```bash
sudo chown -R 501:20 ~/.npm
```

## 打包步骤

### 方式一：使用 npx（推荐）

```bash
# 直接打包
npx @vscode/vsce package

# 或者添加到 package.json 后运行
npm run package
```

### 方式二：全局安装 vsce

```bash
# 全局安装
npm install -g @vscode/vsce

# 打包
vsce package

# 或
npm run package
```

打包成功后会生成 `ptvo-x.x.x.vsix` 文件。

## 测试安装

```bash
# 安装打包好的插件
code --install-extension ptvo-x.x.x.vsix

# 卸载
code --uninstall-extension YOUR_PUBLISHER_NAME.ptvo
```

## 发布到 VS Code Marketplace

### 1. 创建发布者账号

1. 访问 [VS Code Marketplace](https://marketplace.visualstudio.com/)
2. 点击 "Sign in" 使用 GitHub/Microsoft 账号登录
3. 创建 "Publisher"（发布者）
4. 记录下你的 Publisher Name

### 2. 创建 Personal Access Token

1. 在 Azure DevOps 创建 PAT：https://dev.azure.com/
2. 创建完成后，在终端运行：

```bash
vsce login YOUR_PUBLISHER_NAME
# 粘贴你的 PAT
```

### 3. 发布

```bash
# 发布到市场
vsce publish

# 发布指定版本
vsce publish minor
vsce publish patch
vsce publish major
```

## 开源到 GitHub

### 1. 初始化 Git 仓库

```bash
git init
git add .
git commit -m "Initial commit: PTvo - Preview & Translate extension"
```

### 2. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 创建新仓库 `PTvo`
3. 按照提示推送代码：

```bash
git remote add origin https://github.com/YOUR_USERNAME/PTvo.git
git branch -M main
git push -u origin main
```

### 3. 添加 GitHub Topics

在仓库页面添加以下标签：
- `vscode`
- `vscode-extension`
- `translation`
- `preview`
- `ai`
- `deepseek`
- `documentation`

## 版本管理

使用语义化版本号：

- `0.1.0` → `0.2.0`：新增功能 (minor)
- `0.1.0` → `0.1.1`：Bug 修复 (patch)
- `0.1.0` → `1.0.0`：重大更新 (major)

## 检查清单

发布前检查：

- [ ] package.json 中的占位符已替换
- [ ] README.md 已完善
- [ ] LICENSE 文件已添加
- [ ] icon.png 已准备
- [ ] 本地测试通过
- [ ] 版本号已更新
- [ ] CHANGELOG.md 已更新（可选）
