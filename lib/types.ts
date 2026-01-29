/**
 * 费用数据类型定义
 */

// 费用中分类数据（二级分类）
export interface CategoryData {
  [category: string]: number; // 分类名称 -> 金额
}

// Channel 数据（一级分类）
export interface ChannelData {
  total: number; // Channel 总金额
  categories: CategoryData; // 各中分类的金额
}

// 单个品牌的 Channel 数据
export interface BrandChannels {
  [channel: string]: ChannelData; // Channel 名称 -> Channel 数据
}

// 品牌数据（包含多个月份）
export interface BrandData {
  [month: string]: BrandChannels; // 月份 -> Channels
}

// 所有品牌数据
export interface BrandsData {
  [brand: string]: BrandData; // 品牌名称 -> 品牌数据
}

// 完整的费用数据结构
export interface ExpenseData {
  months: string[]; // 可用月份列表，格式：YYYY-MM
  brands: BrandsData; // 所有品牌数据
  generated_at: string; // 数据生成时间
  total_months: number; // 月份总数
}

// Channel 按钮显示数据
export interface ChannelButtonData {
  channel: string;
  total: number;
}

// 费用中分类表格行数据
export interface CategoryRow {
  category: string;
  amount: number;
  percentage: number;
}

// 图表数据点
export interface ChartDataPoint {
  name: string;
  value: number;
}
