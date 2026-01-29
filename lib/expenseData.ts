/**
 * 直接导入费用数据（构建时）
 * 这样可以避免运行时的网络请求问题
 */

import expenseDataJson from '@/public/data/expenses.json';
import type { ExpenseData } from './types';

export const expenseData: ExpenseData = expenseDataJson as ExpenseData;

export default expenseData;
