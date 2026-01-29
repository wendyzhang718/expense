'use client';

/**
 * 月份选择器组件
 */

import { formatMonth } from '@/lib/dataLoader';

interface MonthSelectorProps {
  months: string[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export default function MonthSelector({ months, selectedMonth, onMonthChange }: MonthSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="month-select" className="text-sm text-gray-400">
        选择月份:
      </label>
      <select
        id="month-select"
        value={selectedMonth}
        onChange={(e) => onMonthChange(e.target.value)}
        className="bg-gray-800 text-gray-200 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {months.map((month) => (
          <option key={month} value={month}>
            {formatMonth(month)}
          </option>
        ))}
      </select>
    </div>
  );
}
