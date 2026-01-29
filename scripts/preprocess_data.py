#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
费用数据预处理脚本
将 CSV 文件转换为 JSON 格式，按品牌、Channel 和费用中分类聚合
"""

import pandas as pd
import json
import os
import re
from pathlib import Path
from typing import Dict, Any
from datetime import datetime


def parse_amount(amount_str: str) -> float:
    """
    解析带千位分隔符的金额字符串
    例如: "8,361,993.25" -> 8361993.25
    """
    if pd.isna(amount_str):
        return 0.0
    
    # 移除千位分隔符（逗号）并转换为浮点数
    amount_str = str(amount_str).replace(',', '')
    try:
        return float(amount_str)
    except ValueError:
        return 0.0


def extract_month_from_filename(filename: str) -> str:
    """
    从文件名提取月份和年份
    例如: "DEC 2025 EXP.csv" -> "2025-12"
    """
    month_mapping = {
        'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04',
        'MAY': '05', 'JUN': '06', 'JUL': '07', 'AUG': '08',
        'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
    }
    
    # 匹配模式: "月份 年份"
    pattern = r'([A-Z]{3})\s+(\d{4})'
    match = re.search(pattern, filename.upper())
    
    if match:
        month_abbr = match.group(1)
        year = match.group(2)
        month_num = month_mapping.get(month_abbr)
        if month_num:
            return f"{year}-{month_num}"
    
    return "unknown"


def process_csv_file(csv_path: str) -> Dict[str, Any]:
    """
    处理单个 CSV 文件并返回聚合后的数据
    """
    print(f"正在处理文件: {csv_path}")
    
    # 读取 CSV 文件
    df = pd.read_csv(csv_path, encoding='utf-8-sig')
    
    # 确保必需的列存在
    required_columns = ['Brand', '费用大分类', '费用中分类', 'Channel', '报表货币值']
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        raise ValueError(f"CSV 文件缺少必需的列: {missing_columns}")
    
    # 解析金额
    df['金额'] = df['报表货币值'].apply(parse_amount)
    
    # 移除金额为 0 的行
    df = df[df['金额'] > 0]
    
    # 从文件名提取月份
    filename = os.path.basename(csv_path)
    month = extract_month_from_filename(filename)
    
    # 按品牌分组聚合数据
    brands_data = {}
    
    for brand in df['Brand'].unique():
        if pd.isna(brand):
            continue
            
        brand_df = df[df['Brand'] == brand]
        channels_data = {}
        
        # 按 Channel 分组
        for channel in brand_df['Channel'].unique():
            if pd.isna(channel):
                continue
                
            channel_df = brand_df[brand_df['Channel'] == channel]
            
            # 计算 Channel 总金额
            channel_total = channel_df['金额'].sum()
            
            # 按费用中分类聚合
            categories_data = {}
            category_groups = channel_df.groupby('费用中分类')['金额'].sum()
            
            for category, amount in category_groups.items():
                if not pd.isna(category):
                    categories_data[str(category)] = round(float(amount), 2)
            
            channels_data[str(channel)] = {
                'total': round(float(channel_total), 2),
                'categories': categories_data
            }
        
        brands_data[str(brand)] = {
            'channels': channels_data
        }
    
    print(f"  - 处理完成，共 {len(brands_data)} 个品牌")
    
    return {
        'month': month,
        'brands': brands_data
    }


def process_all_csv_files(database_dir: str, output_path: str):
    """
    处理 Database 文件夹中的所有 CSV 文件
    """
    print("=" * 60)
    print("费用数据预处理开始")
    print("=" * 60)
    
    database_path = Path(database_dir)
    if not database_path.exists():
        raise FileNotFoundError(f"Database 文件夹不存在: {database_dir}")
    
    # 查找所有 CSV 文件
    csv_files = list(database_path.glob("*.csv"))
    
    if not csv_files:
        raise FileNotFoundError(f"Database 文件夹中没有找到 CSV 文件")
    
    print(f"\n找到 {len(csv_files)} 个 CSV 文件")
    
    # 处理所有 CSV 文件
    all_months = []
    all_brands = {}
    
    for csv_file in sorted(csv_files):
        try:
            result = process_csv_file(str(csv_file))
            month = result['month']
            
            if month not in all_months:
                all_months.append(month)
            
            # 合并品牌数据
            for brand, brand_data in result['brands'].items():
                if brand not in all_brands:
                    all_brands[brand] = {}
                
                # 为每个月存储数据
                if month not in all_brands[brand]:
                    all_brands[brand][month] = brand_data['channels']
                else:
                    # 如果同一月份有多个文件，合并数据
                    for channel, channel_data in brand_data['channels'].items():
                        if channel in all_brands[brand][month]:
                            # 合并 Channel 数据
                            all_brands[brand][month][channel]['total'] += channel_data['total']
                            for cat, amt in channel_data['categories'].items():
                                if cat in all_brands[brand][month][channel]['categories']:
                                    all_brands[brand][month][channel]['categories'][cat] += amt
                                else:
                                    all_brands[brand][month][channel]['categories'][cat] = amt
                        else:
                            all_brands[brand][month][channel] = channel_data
        
        except Exception as e:
            print(f"  - 错误: 处理文件 {csv_file.name} 时出错: {e}")
            continue
    
    # 构建最终输出结构
    output_data = {
        'months': sorted(all_months),
        'brands': all_brands,
        'generated_at': datetime.now().isoformat(),
        'total_months': len(all_months)
    }
    
    # 确保输出目录存在
    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    # 写入 JSON 文件
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    print("\n" + "=" * 60)
    print(f"处理完成！")
    print(f"  - 月份数: {len(all_months)}")
    print(f"  - 品牌数: {len(all_brands)}")
    print(f"  - 输出文件: {output_path}")
    print(f"  - 文件大小: {output_file.stat().st_size / 1024:.2f} KB")
    print("=" * 60)


if __name__ == '__main__':
    # 配置路径
    DATABASE_DIR = r"D:\cursor\WorkPlace\Database"
    OUTPUT_PATH = r"d:\cursor\WorkPlace\Expense New Dashboard\public\data\expenses.json"
    
    try:
        process_all_csv_files(DATABASE_DIR, OUTPUT_PATH)
    except Exception as e:
        print(f"\n错误: {e}")
        import traceback
        traceback.print_exc()
