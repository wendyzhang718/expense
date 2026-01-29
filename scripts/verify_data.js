/**
 * 数据验证脚本 - 诊断 MLB OFFICE 金额差异
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH = 'D:\\cursor\\WorkPlace\\Database\\DEC 2025 EXP.csv';

function parseAmount(amountStr) {
    if (!amountStr || amountStr === '') return 0;
    const cleaned = String(amountStr).replace(/,/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
}

function parseCSVLine(line) {
    const fields = [];
    let field = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            fields.push(field.trim());
            field = '';
        } else {
            field += char;
        }
    }
    fields.push(field.trim());
    
    return fields;
}

console.log('='.repeat(70));
console.log('CSV 数据验证 - MLB OFFICE 金额诊断');
console.log('='.repeat(70));
console.log();

const content = fs.readFileSync(CSV_PATH, 'utf-8');
const lines = content.split(/\r?\n/).filter(line => line.trim());

console.log(`总行数: ${lines.length}`);
console.log();

// 解析表头
const headers = parseCSVLine(lines[0]);
console.log('CSV 列标题:');
headers.forEach((h, i) => console.log(`  [${i}] ${h}`));
console.log();

const brandIdx = headers.indexOf('Brand');
const channelIdx = headers.indexOf('Channel');
const categoryIdx = headers.indexOf('费用中分类');
const amountIdx = headers.indexOf('报表货币值');

console.log('关键列索引:');
console.log(`  Brand: ${brandIdx}`);
console.log(`  Channel: ${channelIdx}`);
console.log(`  费用中分类: ${categoryIdx}`);
console.log(`  报表货币值: ${amountIdx}`);
console.log();

// 统计 MLB OFFICE 数据
let mlbOfficeTotal = 0;
let mlbOfficeCount = 0;
const mlbOfficeRecords = [];
const mlbOfficeCategories = {};

console.log('开始扫描 MLB OFFICE 数据...');
console.log();

for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    
    if (fields.length <= Math.max(brandIdx, channelIdx, categoryIdx, amountIdx)) {
        continue;
    }
    
    const brand = fields[brandIdx];
    const channel = fields[channelIdx];
    const category = fields[categoryIdx];
    const amountStr = fields[amountIdx];
    
    if (brand === 'MLB' && channel === 'OFFICE') {
        const amount = parseAmount(amountStr);
        
        if (amount > 0) {
            mlbOfficeTotal += amount;
            mlbOfficeCount++;
            
            mlbOfficeRecords.push({
                rowNum: i + 1,
                category,
                amount,
                amountStr
            });
            
            if (!mlbOfficeCategories[category]) {
                mlbOfficeCategories[category] = 0;
            }
            mlbOfficeCategories[category] += amount;
        }
    }
}

console.log('='.repeat(70));
console.log('MLB OFFICE 数据统计结果');
console.log('='.repeat(70));
console.log();
console.log(`记录条数: ${mlbOfficeCount}`);
console.log(`总金额: ${mlbOfficeTotal.toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`);
console.log();

console.log('按费用中分类汇总:');
console.log('-'.repeat(70));
const sortedCategories = Object.entries(mlbOfficeCategories).sort((a, b) => b[1] - a[1]);
sortedCategories.forEach(([cat, amt]) => {
    console.log(`  ${cat.padEnd(20)} ${amt.toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2}).padStart(20)}`);
});
console.log('-'.repeat(70));

console.log();
console.log('前 10 条记录样本:');
console.log('-'.repeat(70));
mlbOfficeRecords.slice(0, 10).forEach((rec, idx) => {
    console.log(`${idx + 1}. 行${rec.rowNum}: ${rec.category.padEnd(15)} ${rec.amountStr.padStart(15)} = ${rec.amount.toLocaleString('zh-CN', {minimumFractionDigits: 2})}`);
});
console.log('-'.repeat(70));
console.log();

// 检查是否有重复行
console.log('检查重复数据...');
const lineSet = new Set();
let duplicateCount = 0;
for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (lineSet.has(line)) {
        duplicateCount++;
        if (duplicateCount <= 5) {
            console.log(`  发现重复行 ${i + 1}: ${line.substring(0, 80)}...`);
        }
    } else {
        lineSet.add(line);
    }
}
console.log(`总重复行数: ${duplicateCount}`);
console.log();

console.log('='.repeat(70));
console.log('结论:');
console.log('='.repeat(70));
console.log(`MLB OFFICE 实际总金额应为: ${mlbOfficeTotal.toLocaleString('zh-CN', {minimumFractionDigits: 2})}`);
console.log(`当前 Dashboard 显示: 64,288,037.00`);
console.log(`差异: ${(64288037 - mlbOfficeTotal).toLocaleString('zh-CN', {minimumFractionDigits: 2})}`);
console.log('='.repeat(70));
