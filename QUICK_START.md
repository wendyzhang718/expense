# 快速开始指南

项目代码已经完全创建完毕！现在只需要完成几个简单步骤即可运行。

## ✅ 已完成的工作

- ✅ Next.js 15 项目结构已创建
- ✅ TypeScript 配置完成
- ✅ Tailwind CSS 深色主题配置完成
- ✅ 所有 React 组件已实现：
  - 品牌 Tab 切换
  - 月份选择器
  - Channel 按钮
  - 费用明细表格
  - ECharts 图表（深色主题）
- ✅ 示例数据文件已生成
- ✅ Python 数据预处理脚本已创建
- ✅ 完整的文档（README.md, DEPLOYMENT.md）

## 🚀 下一步操作（3 个步骤）

### 步骤 1: 安装依赖（5 分钟）

打开命令提示符（CMD）或 PowerShell：

```bash
# 切换到项目目录
cd "d:\cursor\WorkPlace\Expense New Dashboard"

# 如果使用 PowerShell 遇到执行策略问题，运行：
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 安装依赖
npm install

# 如果 npm install 很慢，可以使用国内镜像：
npm config set registry https://registry.npmmirror.com
npm install
```

### 步骤 2: 处理真实数据（可选，2 分钟）

如果您想使用真实的 CSV 数据：

```bash
# 确保已安装 Python 和 pandas
pip install pandas

# 运行数据预处理脚本
python scripts\preprocess_data.py
```

**注意**：项目已包含示例数据，可以直接运行查看效果。

### 步骤 3: 启动开发服务器（1 分钟）

```bash
npm run dev
```

打开浏览器访问：http://localhost:3000

## 📦 项目结构说明

```
expense-dashboard/
├── app/
│   ├── page.tsx          # 主页面 - 所有功能都在这里
│   ├── layout.tsx        # 全局布局
│   └── globals.css       # 深色主题样式
├── components/           # 所有 React 组件
│   ├── BrandTabs.tsx     # 顶部品牌 Tab
│   ├── MonthSelector.tsx # 月份选择下拉框
│   ├── ChannelButtons.tsx# Channel 选择按钮网格
│   ├── ExpenseTable.tsx  # 费用明细表格
│   └── ExpenseChart.tsx  # ECharts 柱状图
├── lib/
│   ├── types.ts          # TypeScript 类型定义
│   └── dataLoader.ts     # 数据加载和格式化工具
├── public/
│   └── data/
│       └── expenses.json # 示例数据（可用 Python 脚本生成真实数据）
└── scripts/
    └── preprocess_data.py# CSV → JSON 转换脚本
```

## 🎨 功能特性

### 已实现的功能
- ✅ 品牌切换（Tab 导航）
- ✅ 月份选择（下拉菜单）
- ✅ Channel 一级分类（可点击的卡片按钮）
- ✅ 费用中分类表格（包含金额和百分比）
- ✅ ECharts 横向柱状图（渐变色）
- ✅ 深色主题设计
- ✅ 响应式布局（支持手机和电脑）
- ✅ 金额千位分隔符格式化
- ✅ 自动选择金额最大的 Channel

### 数据流程
1. 用户选择品牌（通过 Tab）
2. 用户选择月份（通过下拉框）
3. 系统显示该品牌该月份的所有 Channel 及总金额
4. 用户点击 Channel 按钮
5. 系统显示该 Channel 下的所有费用中分类
6. 表格和图表同时展示数据

## 🔧 常见问题

### Q: npm install 失败或很慢

A: 使用国内镜像：
```bash
npm config set registry https://registry.npmmirror.com
npm install
```

### Q: Python 脚本报错

A: 确保安装了 pandas：
```bash
pip install pandas
```

### Q: 页面空白或报错

A: 检查浏览器控制台（F12），查看具体错误信息。确保：
- `public/data/expenses.json` 文件存在
- JSON 文件格式正确
- npm 依赖已成功安装

### Q: 如何使用真实数据？

A: 
1. 将 CSV 文件放入 `D:\cursor\WorkPlace\Database\`
2. 文件命名格式：`DEC 2025 EXP.csv`（月份 年份 EXP.csv）
3. 运行：`python scripts\preprocess_data.py`
4. 刷新浏览器页面

## 📱 部署到线上

详细的部署步骤请查看 `DEPLOYMENT.md` 文档，包括：
- 如何推送到 GitHub
- 如何部署到 Vercel
- 如何更新数据
- 性能优化建议

## 💡 提示

### 修改主题颜色

编辑 `app/globals.css`：
```css
:root {
  --background: #111827;  /* 修改背景色 */
  --foreground: #f9fafb;  /* 修改文字色 */
}
```

### 添加新的费用分类

数据由 Python 脚本自动从 CSV 生成，无需手动修改代码。

### 自定义图表样式

编辑 `components/ExpenseChart.tsx` 中的 ECharts 配置。

---

**祝您使用愉快！** 如有问题，请参考 README.md 或 DEPLOYMENT.md。🎉
