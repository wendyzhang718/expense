'use client';

/**
 * 费用明细表格组件
 */

import { formatAmount, formatPercentage } from '@/lib/dataLoader';
import type { CategoryRow } from '@/lib/types';

interface ExpenseTableProps {
  categories: CategoryRow[];
  selectedChannel: string;
}

export default function ExpenseTable({ categories, selectedChannel }: ExpenseTableProps) {
  if (categories.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-500">
        请选择一个 Channel 查看费用明细
      </div>
    );
  }

  const total = categories.reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-gray-100">
          {selectedChannel} - 费用中分类明细
        </h3>
        <div className="text-sm text-gray-400 mt-1">
          总计: <span className="text-blue-400 font-semibold">{formatAmount(total)}</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                费用中分类
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                金额
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                占比
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {categories.map((row, index) => (
              <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-200">
                  {row.category}
                </td>
                <td className="px-6 py-4 text-sm text-gray-200 text-right font-mono">
                  {formatAmount(row.amount)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${row.percentage}%` }}
                      />
                    </div>
                    <span>{formatPercentage(row.percentage)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
