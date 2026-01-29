'use client';

/**
 * 费用 Dashboard 主页面
 */

import { useEffect, useState } from 'react';
import BrandTabs from '@/components/BrandTabs';
import MonthSelector from '@/components/MonthSelector';
import ChannelButtons from '@/components/ChannelButtons';
import ExpenseTable from '@/components/ExpenseTable';
import ExpenseChart from '@/components/ExpenseChart';
import {
  loadExpenseData,
  getBrandNames,
  getChannelsForBrand,
  getCategoriesForChannel,
  formatAmount,
  getBrandTotal,
} from '@/lib/dataLoader';
import type { ExpenseData, ChannelButtonData, CategoryRow } from '@/lib/types';

export default function Home() {
  const [data, setData] = useState<ExpenseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  const [channels, setChannels] = useState<ChannelButtonData[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);

  // 加载数据
  useEffect(() => {
    console.log('开始加载数据...');
    loadExpenseData()
      .then((loadedData) => {
        console.log('数据加载成功:', loadedData);
        setData(loadedData);
        
        // 设置默认品牌和月份
        const brands = getBrandNames(loadedData);
        if (brands.length > 0) {
          setSelectedBrand(brands[0]);
        }
        
        if (loadedData.months.length > 0) {
          // 默认选择最新月份
          setSelectedMonth(loadedData.months[loadedData.months.length - 1]);
        }
        
        setLoading(false);
      })
      .catch((err) => {
        console.error('数据加载失败:', err);
        setError(`数据加载失败: ${err.message}`);
        setLoading(false);
      });
  }, []);

  // 当品牌或月份改变时，更新 Channel 列表
  useEffect(() => {
    if (!data || !selectedBrand || !selectedMonth) return;

    const newChannels = getChannelsForBrand(data, selectedBrand, selectedMonth);
    setChannels(newChannels);
    
    // 自动选择金额最大的 Channel
    if (newChannels.length > 0) {
      setSelectedChannel(newChannels[0].channel);
    } else {
      setSelectedChannel(null);
    }
  }, [data, selectedBrand, selectedMonth]);

  // 当 Channel 改变时，更新费用中分类数据
  useEffect(() => {
    if (!data || !selectedBrand || !selectedMonth || !selectedChannel) {
      setCategories([]);
      return;
    }

    const newCategories = getCategoriesForChannel(
      data,
      selectedBrand,
      selectedMonth,
      selectedChannel
    );
    setCategories(newCategories);
  }, [data, selectedBrand, selectedMonth, selectedChannel]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <div className="text-gray-400">加载中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <div className="text-red-500 text-xl mb-4">❌ 数据加载失败</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <div className="text-sm text-gray-500 bg-gray-800 p-4 rounded-lg text-left">
            <p className="font-semibold mb-2">可能的原因：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>数据文件 /data/expenses.json 不存在</li>
              <li>文件格式错误</li>
              <li>网络连接问题</li>
            </ul>
            <p className="mt-4 font-semibold">解决方法：</p>
            <p>1. 检查浏览器控制台（F12）查看详细错误</p>
            <p>2. 确认数据文件已正确部署</p>
            <p>3. 刷新页面重试（Ctrl + Shift + R）</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const brands = getBrandNames(data);
  const brandTotal = getBrandTotal(data, selectedBrand, selectedMonth);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-100">
              费用 Dashboard
            </h1>
            <MonthSelector
              months={data.months}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
          </div>
        </div>
      </header>

      {/* Brand Tabs */}
      <div className="bg-gray-800 sticky top-[76px] z-10">
        <div className="container mx-auto px-4">
          <BrandTabs
            brands={brands}
            selectedBrand={selectedBrand}
            onBrandChange={setSelectedBrand}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* 品牌总览卡片 */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-6 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-sm mb-1">
                {selectedBrand} 总费用
              </div>
              <div className="text-3xl font-bold text-gray-100">
                {formatAmount(brandTotal)}
              </div>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        {/* Channel 选择 */}
        <div>
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            选择 Channel
          </h2>
          <ChannelButtons
            channels={channels}
            selectedChannel={selectedChannel}
            onChannelChange={setSelectedChannel}
          />
        </div>

        {/* 图表和表格 */}
        {selectedChannel && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <ExpenseChart
                categories={categories}
                selectedChannel={selectedChannel}
              />
            </div>
            <div className="lg:col-span-2">
              <ExpenseTable
                categories={categories}
                selectedChannel={selectedChannel}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>费用数据可视化仪表板 © 2026</p>
          <p className="mt-1">
            数据更新时间: {new Date(data.generated_at).toLocaleString('zh-CN')}
          </p>
        </div>
      </footer>
    </div>
  );
}
