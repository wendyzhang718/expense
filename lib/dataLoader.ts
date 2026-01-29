/**
 * 数据加载和处理工具
 */

import type { ExpenseData, BrandData, ChannelData, CategoryRow, ChannelButtonData } from './types';

/**
 * 加载费用数据
 */
export async function loadExpenseData(): Promise<ExpenseData> {
  try {
    const response = await fetch('/data/expenses.json', {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch data:', response.status, response.statusText);
      throw new Error(`Failed to load expense data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Data loaded successfully:', {
      months: data.months?.length,
      brands: Object.keys(data.brands || {}).length,
    });
    
    return data;
  } catch (error) {
    console.error('Error loading expense data:', error);
    throw error;
  }
}

/**
 * 获取所有品牌名称
 */
export function getBrandNames(data: ExpenseData): string[] {
  return Object.keys(data.brands).sort();
}

/**
 * 获取指定品牌和月份的所有 Channel
 */
export function getChannelsForBrand(
  data: ExpenseData,
  brand: string,
  month: string
): ChannelButtonData[] {
  const brandData = data.brands[brand];
  if (!brandData || !brandData[month]) {
    return [];
  }

  const channels = brandData[month];
  return Object.entries(channels)
    .map(([channel, channelData]) => ({
      channel,
      total: channelData.total,
    }))
    .sort((a, b) => b.total - a.total); // 按金额降序排序
}

/**
 * 获取指定品牌、月份和 Channel 的费用中分类数据
 */
export function getCategoriesForChannel(
  data: ExpenseData,
  brand: string,
  month: string,
  channel: string
): CategoryRow[] {
  const brandData = data.brands[brand];
  if (!brandData || !brandData[month] || !brandData[month][channel]) {
    return [];
  }

  const channelData = brandData[month][channel];
  const total = channelData.total;
  const categories = channelData.categories;

  return Object.entries(categories)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount); // 按金额降序排序
}

/**
 * 格式化金额为带千位分隔符的字符串
 */
export function formatAmount(amount: number): string {
  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * 格式化百分比
 */
export function formatPercentage(percentage: number): string {
  return `${percentage.toFixed(2)}%`;
}

/**
 * 格式化月份显示
 * @param month - 格式: YYYY-MM
 * @returns 格式: YYYY年MM月
 */
export function formatMonth(month: string): string {
  const [year, monthNum] = month.split('-');
  return `${year}年${monthNum}月`;
}

/**
 * 获取品牌在指定月份的总费用
 */
export function getBrandTotal(
  data: ExpenseData,
  brand: string,
  month: string
): number {
  const brandData = data.brands[brand];
  if (!brandData || !brandData[month]) {
    return 0;
  }

  const channels = brandData[month];
  return Object.values(channels).reduce((sum, channel) => sum + channel.total, 0);
}
