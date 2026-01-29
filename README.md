# 费用 Dashboard

基于 Next.js 15 的企业费用数据可视化看板，支持多品牌、多渠道的费用数据展示与分析。

## 📊 功能特性

- **多品牌支持**：MLB、DX、KIDS、DV、Supra
- **Channel 分类**：按渠道（OFFICE、ON OR、OFF OR 等）一级分类
- **费用细分**：按费用中分类二级展示
- **数据可视化**：ECharts 图表展示
- **暗色主题**：现代化 UI 设计
- **月份筛选**：支持多月份数据切换

## 🛠️ 技术栈

- **前端框架**：Next.js 15 (App Router)
- **UI 框架**：Tailwind CSS
- **图表库**：ECharts
- **语言**：TypeScript
- **数据处理**：Node.js

## 📁 项目结构

```
Expense New Dashboard/
├── app/                      # Next.js 应用页面
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 主页面
│   └── globals.css          # 全局样式
├── components/              # React 组件
│   ├── BrandTabs.tsx       # 品牌切换标签
│   ├── MonthSelector.tsx   # 月份选择器
│   ├── ChannelButtons.tsx  # Channel 按钮组
│   ├── ExpenseTable.tsx    # 费用表格
│   └── ExpenseChart.tsx    # 费用图表
├── lib/                     # 工具函数
│   ├── dataLoader.ts       # 数据加载器
│   └── types.ts            # TypeScript 类型定义
├── public/data/            # 数据文件
│   └── expenses.json       # 处理后的费用数据
├── scripts/                # 数据处理脚本
│   ├── preprocess_data.js  # 主数据预处理脚本
│   ├── verify_data.js      # 数据验证工具
│   ├── analyze_difference.js # 差异分析工具
│   └── final_verification.js # 最终验证报告
└── package.json            # 项目依赖
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 处理数据

将原始 CSV 文件放在 `D:\cursor\WorkPlace\Database\` 目录下，然后运行：

```bash
node scripts/preprocess_data.js
```

或者直接双击 `run_preprocess.bat` 文件。

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📈 数据格式

原始 CSV 文件应包含以下字段：

- `Brand`：品牌名称
- `Channel`：销售渠道
- `费用大分类`：费用大类
- `费用中分类`：费用细分类别
- `报表货币值`：金额（支持逗号分隔和负数）

数据处理脚本会自动：
- 解析 CSV 文件
- 提取月份信息
- 按品牌、Channel、费用中分类聚合数据
- 生成 JSON 格式输出

## 🔧 数据更新

每月添加新的费用文件后：

1. 将新的 CSV 文件（如 `JAN 2026 EXP.csv`）放入 `D:\cursor\WorkPlace\Database\`
2. 运行数据预处理脚本：`node scripts/preprocess_data.js`
3. 刷新浏览器查看最新数据

## 📊 数据验证

项目包含多个验证工具：

```bash
# 验证 MLB OFFICE 数据
node scripts/verify_data.js

# 分析数据差异
node scripts/analyze_difference.js

# 生成完整验证报告
node scripts/final_verification.js
```

## 🌐 部署到 Vercel

### 方式 1：通过 GitHub（推荐）

1. 推送代码到 GitHub
2. 访问 [Vercel](https://vercel.com)
3. 导入 GitHub 仓库
4. Vercel 会自动检测 Next.js 项目并部署

### 方式 2：Vercel CLI

```bash
npm i -g vercel
vercel
```

## ⚙️ 配置说明

### 数据源路径配置

如需修改数据源路径，编辑 `scripts/preprocess_data.js`：

```javascript
const DATABASE_DIR = 'D:\\cursor\\WorkPlace\\Database';
const OUTPUT_PATH = path.join(__dirname, '../public/data/expenses.json');
```

### 月份提取规则

脚本会自动从文件名中提取月份：
- `DEC 2025 EXP.csv` → 2025-12
- `JAN 2026 EXP.csv` → 2026-01

## 🐛 故障排查

### 数据不匹配

如果发现数据与 Excel 不一致：

1. 运行验证脚本检查原始数据
2. 确认 CSV 文件编码为 UTF-8
3. 检查是否包含负数（冲销/退款）
4. 重新运行预处理脚本

### 构建错误

```bash
# 清除缓存并重新构建
rm -rf .next
npm run build
```

## 📝 开发说明

### 添加新品牌

1. 确保 CSV 文件中的 `Brand` 列包含新品牌名称
2. 重新运行数据预处理脚本
3. 新品牌会自动出现在 Dashboard 中

### 自定义主题

编辑 `tailwind.config.ts` 修改颜色主题：

```typescript
theme: {
  extend: {
    colors: {
      // 自定义颜色
    }
  }
}
```

## 📄 许可证

MIT License

## 👤 作者

Wendy Zhang

---

**最后更新**：2026-01-29
**版本**：1.0.0
