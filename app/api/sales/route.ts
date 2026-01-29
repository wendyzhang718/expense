/**
 * 零售数据 API 路由
 * 从 Snowflake 查询品牌的月度零售数据
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflakeClient';

// 品牌代码映射：Dashboard 品牌 -> Snowflake brd_cd
const BRAND_CODE_MAP: Record<string, string> = {
  'MLB': 'M',
  'KIDS': 'I',
  'DX': 'X',
  'DV': 'V',
  'Supra': 'W',
};

interface SnowflakeRow {
  MONTH: string;
  TOTAL_AMOUNT: number;
  TOTAL_TAG_AMOUNT: number;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const brand = searchParams.get('brand');
    
    // 验证品牌参数
    if (!brand || !BRAND_CODE_MAP[brand]) {
      return NextResponse.json(
        { error: 'Invalid brand parameter. Valid brands: MLB, KIDS, DX, DV, Supra' },
        { status: 400 }
      );
    }

    const brandCode = BRAND_CODE_MAP[brand];
    
    console.log(`Fetching sales data for brand: ${brand} (code: ${brandCode})`);
    
    // SQL 查询：聚合 2025 年每月零售金额
    const query = `
      SELECT 
        DATE_TRUNC('MONTH', sale_dt) as month,
        SUM(sale_amt) as total_amount,
        SUM(tag_amt) as total_tag_amount
      FROM chn.dw_sale
      WHERE UPPER(brd_cd) = '${brandCode}'
        AND YEAR(sale_dt) = 2025
      GROUP BY DATE_TRUNC('MONTH', sale_dt)
      ORDER BY month
    `;

    const rows = await executeQuery<SnowflakeRow>(query);
    
    console.log(`Query returned ${rows.length} months of data`);

    // 格式化响应数据
    const data = rows.map(row => {
      const monthStr = row.MONTH.substring(0, 7); // "2025-01"
      const monthNum = monthStr.substring(5, 7);  // "01"
      
      return {
        month: monthStr,
        monthLabel: `25.${monthNum}`,
        amount: row.TOTAL_AMOUNT || 0,
        tagAmount: row.TOTAL_TAG_AMOUNT || 0,
      };
    });

    const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);

    return NextResponse.json({
      brand,
      data,
      total: totalAmount,
    });
    
  } catch (error) {
    console.error('Sales API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch sales data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
