'use client';

/**
 * 零售数据图表组件
 * 显示品牌的月度零售金额趋势
 */

import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import type { SalesData } from '@/lib/types';
import { formatAmount } from '@/lib/dataLoader';

interface SalesChartProps {
  brand: string;
}

export default function SalesChart({ brand }: SalesChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取零售数据
  useEffect(() => {
    async function fetchSalesData() {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Fetching sales data for brand: ${brand}`);
        
        const response = await fetch(`/api/sales?brand=${encodeURIComponent(brand)}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch sales data');
        }
        
        const data = await response.json();
        console.log(`Sales data loaded:`, data);
        setSalesData(data);
      } catch (err) {
        console.error('Error loading sales data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (brand) {
      fetchSalesData();
    }
  }, [brand]);

  // 渲染图表
  useEffect(() => {
    if (!chartRef.current || !salesData || salesData.data.length === 0) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const chart = chartInstanceRef.current;

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      title: {
        text: `${brand} 2025年零售金额趋势`,
        textStyle: {
          color: '#e5e7eb',
          fontSize: 18,
          fontWeight: 'bold',
        },
        left: 'center',
        top: 15,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#374151',
        textStyle: { color: '#e5e7eb' },
        formatter: (params: any) => {
          const data = params[0];
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${data.name}</div>
              <div style="color: #34d399;">零售额: ${formatAmount(data.value)}</div>
            </div>
          `;
        },
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '12%',
        top: '25%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: salesData.data.map(d => d.monthLabel),
        axisLabel: {
          color: '#9ca3af',
          fontSize: 11,
          rotate: 0,
        },
        axisLine: { 
          lineStyle: { color: '#4b5563' } 
        },
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#9ca3af',
          formatter: (value: number) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
            return value.toString();
          },
        },
        splitLine: { 
          lineStyle: { color: '#374151' } 
        },
      },
      series: [
        {
          name: '零售金额',
          type: 'bar',
          data: salesData.data.map(d => d.amount),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#10b981' },
              { offset: 1, color: '#34d399' },
            ]),
            borderRadius: [4, 4, 0, 0],
          },
          label: {
            show: true,
            position: 'top',
            color: '#9ca3af',
            fontSize: 10,
            formatter: (params: any) => {
              const val = params.value;
              if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
              if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
              return val.toString();
            },
          },
          barWidth: '50%',
        },
      ],
    };

    chart.setOption(option);

    // 响应式调整
    const handleResize = () => {
      chart.resize();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [salesData, brand]);

  // 清理图表实例
  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-4"></div>
        <div className="text-gray-400">加载零售数据...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <div className="text-red-400 text-lg mb-2">❌ 零售数据加载失败</div>
        <div className="text-gray-500 text-sm">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-sm"
        >
          重试
        </button>
      </div>
    );
  }

  if (!salesData || salesData.data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-500">
        暂无零售数据
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div ref={chartRef} style={{ width: '100%', height: '400px' }} />
      <div className="mt-4 text-center">
        <span className="text-gray-400 text-sm">2025年总零售额: </span>
        <span className="text-green-400 text-lg font-semibold">{formatAmount(salesData.total)}</span>
      </div>
    </div>
  );
}
