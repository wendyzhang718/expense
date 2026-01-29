/**
 * 分析 Excel 数据差异
 * Excel 显示: 28,571,061
 * CSV 实际: 64,288,037
 * 差异: 35,716,976 (约 125%)
 */

const fs = require('fs');

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

const content = fs.readFileSync(CSV_PATH, 'utf-8');
const lines = content.split(/\r?\n/).filter(line => line.trim());
const headers = parseCSVLine(lines[0]);

const brandIdx = headers.indexOf('Brand');
const channelIdx = headers.indexOf('Channel');
const categoryIdx = headers.indexOf('费用中分类');
const bigCategoryIdx = headers.indexOf('费用大分类');
const amountIdx = headers.indexOf('报表货币值');

console.log('='.repeat(80));
console.log('分析 MLB OFFICE 数据差异');
console.log('='.repeat(80));
console.log();

// 统计不同条件下的总金额
let totalAll = 0;
let totalPositiveOnly = 0;
let totalByBigCategory = {};
let totalExcludingIndirect = 0;

const records = [];

for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    
    if (fields.length <= Math.max(brandIdx, channelIdx, categoryIdx, amountIdx)) {
        continue;
    }
    
    const brand = fields[brandIdx];
    const channel = fields[channelIdx];
    const category = fields[categoryIdx];
    const bigCategory = fields[bigCategoryIdx];
    const amountStr = fields[amountIdx];
    const amount = parseAmount(amountStr);
    
    if (brand === 'MLB' && channel === 'OFFICE') {
        totalAll += amount;
        
        if (amount > 0) {
            totalPositiveOnly += amount;
        }
        
        if (!totalByBigCategory[bigCategory]) {
            totalByBigCategory[bigCategory] = 0;
        }
        totalByBigCategory[bigCategory] += amount;
        
        if (bigCategory !== '间接') {
            totalExcludingIndirect += amount;
        }
        
        records.push({
            bigCategory,
            category,
            amount
        });
    }
}

console.log('测试 1: 所有 MLB OFFICE 数据');
console.log(`  总金额: ${totalAll.toLocaleString('zh-CN', {minimumFractionDigits: 2})}`);
console.log(`  是否匹配 Dashboard (64,288,037): ${totalAll === 64288037 ? '✓ 是' : '✗ 否'}`);
console.log();

console.log('测试 2: 只计算正数金额');
console.log(`  总金额: ${totalPositiveOnly.toLocaleString('zh-CN', {minimumFractionDigits: 2})}`);
console.log(`  是否匹配 Excel (28,571,061): ${Math.abs(totalPositiveOnly - 28571061) < 100 ? '✓ 是' : '✗ 否'}`);
console.log();

console.log('测试 3: 按费用大分类统计');
console.log('-'.repeat(80));
Object.entries(totalByBigCategory).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).forEach(([cat, amt]) => {
    console.log(`  ${cat.padEnd(15)} ${amt.toLocaleString('zh-CN', {minimumFractionDigits: 2}).padStart(20)}`);
});
console.log('-'.repeat(80));
console.log();

console.log('测试 4: 排除"间接"费用大分类');
console.log(`  总金额: ${totalExcludingIndirect.toLocaleString('zh-CN', {minimumFractionDigits: 2})}`);
console.log(`  是否匹配 Excel (28,571,061): ${Math.abs(totalExcludingIndirect - 28571061) < 100 ? '✓ 是' : '✗ 否'}`);
console.log();

// 查找负数记录
const negativeRecords = records.filter(r => r.amount < 0);
console.log(`发现负数记录: ${negativeRecords.length} 条`);
if (negativeRecords.length > 0) {
    console.log('负数记录样本:');
    negativeRecords.slice(0, 5).forEach((rec, idx) => {
        console.log(`  ${idx + 1}. ${rec.bigCategory}/${rec.category}: ${rec.amount.toLocaleString('zh-CN', {minimumFractionDigits: 2})}`);
    });
    console.log();
}

console.log('='.repeat(80));
console.log('结论分析:');
console.log('='.repeat(80));
console.log();

const expectedExcel = 28571061;
const actualDashboard = 64288037;
const difference = actualDashboard - expectedExcel;

console.log(`Dashboard 显示: ${actualDashboard.toLocaleString('zh-CN')}`);
console.log(`Excel 显示: ${expectedExcel.toLocaleString('zh-CN')}`);
console.log(`差异: ${difference.toLocaleString('zh-CN')}`);
console.log();

if (Math.abs(totalExcludingIndirect - expectedExcel) < 100) {
    console.log('✓ 找到原因！');
    console.log();
    console.log('Excel 可能使用了以下筛选条件：');
    console.log('  - Brand = MLB');
    console.log('  - Channel = OFFICE');
    console.log('  - 费用大分类 ≠ "间接" (排除了间接费用)');
    console.log();
    console.log(`排除间接费用后的总金额为: ${totalExcludingIndirect.toLocaleString('zh-CN', {minimumFractionDigits: 2})}`);
} else {
    console.log('未找到确切匹配，需要进一步检查 Excel 的筛选条件。');
}
console.log('='.repeat(80));
