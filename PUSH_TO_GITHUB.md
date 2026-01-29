# 推送到 GitHub 详细步骤

## 📋 前提条件

您需要先安装 Git 才能推送代码到 GitHub。

## 🔧 步骤 1：安装 Git

### 方法 A：下载安装包（推荐）

1. 访问 Git 官网：https://git-scm.com/download/win
2. 下载 "64-bit Git for Windows Setup"
3. 双击安装包，按以下选项安装：
   - ✅ 使用默认编辑器（推荐 Notepad++）
   - ✅ 选择 "Git from the command line and also from 3rd-party software"
   - ✅ 使用 OpenSSL library
   - ✅ Checkout Windows-style, commit Unix-style
   - ✅ 使用 MinTTY terminal
   - ✅ 其他选项保持默认

4. 安装完成后，**重启 Cursor IDE**

### 方法 B：使用 Chocolatey（如果已安装）

```powershell
choco install git -y
```

### 验证安装

打开 PowerShell 或 CMD，输入：

```bash
git --version
```

如果显示版本号（如 `git version 2.43.0`），说明安装成功。

---

## 🚀 步骤 2：配置 Git（首次使用）

```bash
# 设置用户名（替换为您的 GitHub 用户名）
git config --global user.name "wendyzhang718"

# 设置邮箱（替换为您的 GitHub 邮箱）
git config --global user.email "your-email@example.com"
```

---

## 📤 步骤 3：推送代码到 GitHub

### 在项目目录下执行以下命令：

```bash
# 1. 进入项目目录
cd "d:\cursor\WorkPlace\Expense New Dashboard"

# 2. 初始化 Git 仓库
git init

# 3. 添加所有文件
git add .

# 4. 创建第一个提交
git commit -m "初始提交：费用 Dashboard 完成，数据已修复"

# 5. 重命名分支为 main（GitHub 默认分支）
git branch -M main

# 6. 添加远程仓库
git remote add origin https://github.com/wendyzhang718/expense.git

# 7. 推送到 GitHub
git push -u origin main
```

### 如果需要输入 GitHub 凭据：

- **用户名**：wendyzhang718
- **密码**：使用 Personal Access Token（不是 GitHub 密码）

#### 创建 Personal Access Token：

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 点击 "Generate token"
5. **复制 Token**（只显示一次）
6. 在推送时将 Token 作为密码输入

---

## 🎯 步骤 4：验证推送成功

访问您的 GitHub 仓库：

https://github.com/wendyzhang718/expense

您应该能看到以下文件：

```
✅ app/
✅ components/
✅ lib/
✅ public/
✅ scripts/
✅ package.json
✅ README.md
✅ .gitignore
```

---

## 🔄 未来更新代码

当您修改代码后，使用以下命令推送更新：

```bash
# 1. 添加修改的文件
git add .

# 2. 创建提交
git commit -m "描述您的修改"

# 3. 推送到 GitHub
git push
```

---

## 🆘 常见问题

### ❌ 问题 1：git 命令未找到

**原因**：Git 未正确安装或未添加到 PATH

**解决**：
1. 重新安装 Git
2. 安装时选择 "Add Git to PATH"
3. 重启终端或 Cursor

### ❌ 问题 2：推送被拒绝（rejected）

**原因**：远程仓库有冲突

**解决**：

```bash
git pull origin main --rebase
git push origin main
```

### ❌ 问题 3：身份验证失败

**原因**：GitHub 不再支持密码登录

**解决**：使用 Personal Access Token（见上方说明）

---

## 🎉 下一步：部署到 Vercel

推送成功后，继续 Vercel 部署！

---

**需要帮助？** 请告诉我您遇到的具体问题！
