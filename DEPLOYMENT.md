# 部署指南

本文档提供详细的部署步骤，包括环境配置、数据处理、GitHub 推送和 Vercel 部署。

## 前提条件

请确保您的系统已安装以下工具：

### 1. Node.js 和 npm
- 访问 https://nodejs.org/ 下载并安装 Node.js 18+ 版本
- npm 会随 Node.js 一起安装
- 验证安装：
  ```bash
  node --version
  npm --version
  ```

### 2. Python 3.x
- 访问 https://www.python.org/ 下载并安装 Python 3.8+ 版本
- 安装 pandas 库：
  ```bash
  pip install pandas
  ```
- 验证安装：
  ```bash
  python --version
  pip list | findstr pandas
  ```

### 3. Git
- 访问 https://git-scm.com/ 下载并安装 Git
- 验证安装：
  ```bash
  git --version
  ```

## 步骤 1: 数据预处理

### 1.1 准备 CSV 数据文件

确保 CSV 文件位于 `D:\cursor\WorkPlace\Database` 文件夹中，文件命名格式：
```
DEC 2025 EXP.csv  （月份 年份 EXP.csv）
JAN 2026 EXP.csv
```

### 1.2 运行 Python 预处理脚本

```bash
cd "d:\cursor\WorkPlace\Expense New Dashboard"
python scripts\preprocess_data.py
```

脚本会生成 `public\data\expenses.json` 文件。

**注意事项**：
- 如果遇到编码问题，确保 CSV 文件使用 UTF-8 编码
- 如果数据量很大，处理可能需要几分钟时间
- 生成的 JSON 文件大小应该比 CSV 小很多

## 步骤 2: 安装依赖和本地测试

### 2.1 解决 PowerShell 执行策略问题

如果遇到 "禁止运行脚本" 的错误，运行：
```powershell
# 以管理员身份打开 PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

或者使用 CMD 代替 PowerShell：
```cmd
cd /d "d:\cursor\WorkPlace\Expense New Dashboard"
npm install
```

### 2.2 安装 npm 依赖

```bash
npm install
```

这会安装所有必需的包，包括：
- Next.js 15
- React 19
- ECharts
- Tailwind CSS
- TypeScript

### 2.3 本地运行测试

```bash
npm run dev
```

打开浏览器访问 http://localhost:3000 查看应用。

**测试检查清单**：
- [ ] 品牌 Tab 是否正常显示和切换
- [ ] 月份选择器是否工作
- [ ] Channel 按钮是否显示正确的金额
- [ ] 点击 Channel 后是否显示费用明细表格
- [ ] 图表是否正确渲染
- [ ] 深色主题是否正确应用
- [ ] 移动端响应式布局是否正常

## 步骤 3: 初始化 Git 仓库

### 3.1 初始化本地仓库

```bash
cd "d:\cursor\WorkPlace\Expense New Dashboard"
git init
git add .
git commit -m "Initial commit: Expense Dashboard with Next.js, ECharts and dark theme"
```

### 3.2 检查要提交的文件

确保以下文件**不要**提交到 Git：
- `*.csv` 文件（敏感数据）
- `Database/` 文件夹
- `node_modules/`
- `.next/`
- `.env` 文件

`.gitignore` 文件已经配置好，会自动忽略这些文件。

## 步骤 4: 创建 GitHub 仓库并推送

### 4.1 在 GitHub 上创建新仓库

1. 访问 https://github.com/new
2. 仓库名称：`expense-dashboard`（或您喜欢的名称）
3. 可见性：Private（推荐，因为包含业务数据）
4. 不要初始化 README、.gitignore 或 license
5. 点击 "Create repository"

### 4.2 连接远程仓库并推送

```bash
# 替换 <YOUR_USERNAME> 为您的 GitHub 用户名
git remote add origin https://github.com/<YOUR_USERNAME>/expense-dashboard.git
git branch -M main
git push -u origin main
```

如果需要输入凭据，建议使用 Personal Access Token (PAT)：
1. GitHub 设置 → Developer settings → Personal access tokens
2. 生成新 token，勾选 `repo` 权限
3. 使用 token 作为密码

## 步骤 5: 部署到 Vercel

### 5.1 创建 Vercel 账号

1. 访问 https://vercel.com/signup
2. 选择 "Continue with GitHub" 登录
3. 授权 Vercel 访问您的 GitHub 账号

### 5.2 导入项目

1. 在 Vercel Dashboard，点击 "Add New..."
2. 选择 "Project"
3. 从列表中选择 `expense-dashboard` 仓库
4. 点击 "Import"

### 5.3 配置项目设置

Vercel 会自动检测 Next.js 项目，默认配置通常就可以：
- **Framework Preset**: Next.js
- **Root Directory**: `./`
- **Build Command**: `next build`
- **Output Directory**: `.next`

点击 "Deploy"。

### 5.4 等待部署完成

- 首次部署通常需要 2-3 分钟
- 部署完成后，Vercel 会提供一个 URL，例如：
  ```
  https://expense-dashboard-xxx.vercel.app
  ```
- 访问这个 URL 查看您的线上应用

### 5.5 配置自定义域名（可选）

1. 在 Vercel 项目设置中，点击 "Domains"
2. 添加您的自定义域名
3. 按照提示配置 DNS 记录

## 步骤 6: 数据更新流程

当有新月份的数据需要更新时：

### 6.1 处理新数据

```bash
# 1. 将新的 CSV 文件放入 Database 文件夹
# 例如：JAN 2026 EXP.csv

# 2. 运行预处理脚本
python scripts\preprocess_data.py

# 3. 本地测试
npm run dev
```

### 6.2 提交并推送更新

```bash
git add public/data/expenses.json
git commit -m "Update expense data: January 2026"
git push origin main
```

### 6.3 自动部署

Vercel 会自动检测到 GitHub 的更新并重新部署，无需手动操作。
- 部署通常在 1-2 分钟内完成
- 可以在 Vercel Dashboard 查看部署状态

## 常见问题解决

### Q1: npm install 很慢或卡住

**解决方案**：
```bash
# 使用国内镜像
npm config set registry https://registry.npmmirror.com
npm install
```

### Q2: Python 脚本报错 "ModuleNotFoundError: No module named 'pandas'"

**解决方案**：
```bash
pip install pandas
```

### Q3: Git push 被拒绝

**解决方案**：
```bash
# 确保远程仓库 URL 正确
git remote -v

# 如果需要修改
git remote set-url origin https://github.com/<YOUR_USERNAME>/expense-dashboard.git
```

### Q4: Vercel 部署失败

**常见原因**：
- 检查 `package.json` 中的依赖版本是否正确
- 确保 `public/data/expenses.json` 文件存在
- 查看 Vercel 部署日志中的具体错误信息

### Q5: 页面显示 "Failed to load expense data"

**解决方案**：
- 确保 `public/data/expenses.json` 文件存在且格式正确
- 检查 JSON 文件是否被 `.gitignore` 误忽略
- 重新运行 Python 预处理脚本

## 性能优化建议

### 1. 数据文件大小

如果 JSON 文件过大（> 5MB），考虑：
- 按品牌分割成多个 JSON 文件
- 使用数据压缩
- 实现按需加载（lazy loading）

### 2. 图片优化

使用 Next.js Image 组件：
```tsx
import Image from 'next/image';
```

### 3. 缓存策略

在 `next.config.ts` 中配置缓存：
```typescript
const nextConfig = {
  headers: async () => [
    {
      source: '/data/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, must-revalidate',
        },
      ],
    },
  ],
};
```

## 安全注意事项

1. **不要提交敏感数据**：
   - 原始 CSV 文件可能包含敏感信息
   - 确保 `.gitignore` 正确配置

2. **环境变量**：
   如果需要 API 密钥，使用环境变量：
   ```bash
   # Vercel 项目设置 → Environment Variables
   API_KEY=your_secret_key
   ```

3. **访问控制**：
   如果需要密码保护，考虑使用：
   - Vercel Password Protection（团队版功能）
   - 自定义认证中间件

## 技术支持

如果遇到问题：
1. 查看项目 README.md
2. 检查 Vercel 部署日志
3. 查看浏览器控制台错误信息
4. 参考 Next.js 官方文档：https://nextjs.org/docs

---

祝您部署顺利！🚀
