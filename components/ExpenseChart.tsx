'use client';

/**
 * ECharts 图表组件（深色主题）
 */

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { CategoryRow } from '@/lib/types';
import { formatAmount } from '@/lib/dataLoader';

interface ExpenseChartProps {
  categories: CategoryRow[];
  selectedChannel: string;
}

export default function ExpenseChart({ categories, selectedChannel }: ExpenseChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || categories.length === 0) return;

    // 初始化或获取图表实例
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    const chart = chartInstanceRef.current;

    // 准备数据
    const chartData = categories.map((cat) => ({
      name: cat.category,
      value: cat.amount,
    }));

    // 配置图表选项
    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#374151',
        textStyle: {
          color: '#e5e7eb',
        },
        formatter: (params: any) => {
          const data = params[0];
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${data.name}</div>
              <div style="color: #60a5fa;">金额: ${formatAmount(data.value)}</div>
            </div>
          `;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          color: '#9ca3af',
          formatter: (value: number) => {
            if (value >= 1000000) {
              return `${(value / 1000000).toFixed(1)}M`;
            } else if (value >= 1000) {
              return `${(value / 1000).toFixed(0)}K`;
            }
            return value.toString();
          },
        },
        splitLine: {
          lineStyle: {
            color: '#374151',
          },
        },
      },
      yAxis: {
        type: 'category',
        data: chartData.map((d) => d.name),
        axisLabel: {
          color: '#d1d5db',
          fontSize: 12,
        },
        axisLine: {
          lineStyle: {
            color: '#4b5563',
          },
        },
      },
      series: [
        {
          name: '金额',
          type: 'bar',
          data: chartData.map((d) => d.value),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#3b82f6' },
              { offset: 1, color: '#60a5fa' },
            ]),
            borderRadius: [0, 4, 4, 0],
          },
          label: {
            show: true,
            position: 'right',
            color: '#9ca3af',
            fontSize: 11,
            formatter: (params: any) => formatAmount(params.value),
          },
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
  }, [categories]);

  // 清理图表实例
  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  if (categories.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-500">
        请选择一个 Channel 查看图表
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">
        {selectedChannel} - 费用分布图
      </h3>
      <div ref={chartRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
}
