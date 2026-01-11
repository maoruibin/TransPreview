# TransPreview 发布指南

> TransPreview 当前状态：已推送到 GitHub，package.json 已配置完成

## 当前项目状态 ✅

- [x] 项目名称：TransPreview
- [x] 发布者：maoruibin
- [x] 作者：咕咚同学
- [x] 仓库：https://github.com/maoruibin/TransPreview
- [x] 已推送到 GitHub
- [ ] ~~插件图标~~（已移除，可后续添加）
- [ ] 本地测试通过
- [ ] 发布到 Marketplace

---

## 发布到 VS Code Marketplace 步骤

### 步骤 1：创建 Publisher（发布者）

1. 访问 [Azure DevOps](https://dev.azure.com/)
2. 用 GitHub 账号登录
3. 点击右上角头像 → **User settings** → **Personal access tokens**
4. 点击 **+ New Token**
5. 填写信息：
   - **Name**: `VS Code Marketplace`
   - **Organization**: (任意或留空)
   - **Scopes**: 选择 **Marketplace** → **Manage**
6. 点击 **Create**，**复制**生成的 Token

### 步骤 2：创建 Publisher 名称

1. 访问 [VS Code Marketplace Publisher](https://marketplace.visualstudio.com/manage)
2. 点击 **Create publisher**
3. 填写信息：
   - **Publisher ID**: `maoruibin` (或其他，创建后不能修改)
   - **Display Name**: `咕咚同学`
   - **Description`: 简短描述
4. 点击 **Create**

### 步骤 3：登录 vsce

```bash
npx @vscode/vsce login maoruibin
# 粘贴刚才创建的 Personal Access Token
```

### 步骤 4：打包

```bash
cd /Users/gudong/code/plugin/PTvo
npx @vscode/vsce package
```

会生成 `transpreview-0.1.0.vsix` 文件。

### 步骤 5：发布

```bash
npx @vscode/vsce publish
```

成功后会显示：
```
Published transpreview v0.1.0
```

### 步骤 6：验证

访问你的扩展页面：
```
https://marketplace.visualstudio.com/items?itemName=maoruibin.transpreview
```

---

## 快速命令汇总

```bash
# 进入项目目录
cd /Users/gudong/code/plugin/PTvo

# 登录（只需一次）
npx @vscode/vsce login maoruibin

# 打包
npx @vscode/vsce package

# 发布
npx @vscode/vsce publish
```

---

## 版本更新

发布新版本时：

```bash
# 1. 修改 package.json 中的版本号
# "version": "0.1.0" → "0.2.0"

# 2. 提交到 GitHub
git add .
git commit -m "Bump version to 0.2.0"
git push

# 3. 发布
npx @vscode/vsce publish
```

---

## 常见问题

### Q: 发布失败提示 token 无效？
A: 重新创建 Personal Access Token，确保选择了 **Marketplace** → **Manage** 权限。

### Q: 如何查看已发布的扩展？
A: 访问 https://marketplace.visualstudio.com/manage

### Q: 如何更新扩展？
A: 修改版本号后重新运行 `npx @vscode/vsce publish`

---

## 发布后清单

- [ ] 在 Marketplace 上验证扩展可以搜索到
- [ ] 安装测试
- [ ] 更新 README 添加 Marketplace 安装按钮
- [ ] 写公众号文章宣传
