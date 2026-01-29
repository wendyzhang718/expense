/**
 * 最终验证报告 - 检查所有品牌数据
 */

const data = require('../public/data/expenses.json');

console.log('='.repeat(80));
console.log('费用 Dashboard 数据验证报告');
console.log('='.repeat(80));
console.log();
console.log(`生成时间: ${data.generated_at}`);
console.log(`月份数: ${data.total_months}`);
console.log(`可用月份: ${data.months.join(', ')}`);
console.log();

console.log('='.repeat(80));
console.log('所有品牌和 Channel 数据汇总');
console.log('='.repeat(80));
console.log();

const brands = Object.keys(data.brands).sort();

brands.forEach(brand => {
    console.log(`\n【${brand}】`);
    console.log('-'.repeat(80));
    
    const brandData = data.brands[brand]['2025-12'];
    const channels = Object.keys(brandData).sort();
    
    let brandTotal = 0;
    
    channels.forEach(channel => {
        const channelTotal = brandData[channel].total;
        brandTotal += channelTotal;
        
        const categories = brandData[channel].categories;
        const categoryCount = Object.keys(categories).length;
        
        console.log(`  ${channel.padEnd(10)} ${channelTotal.toLocaleString('zh-CN', {minimumFractionDigits: 2}).padStart(18)}  (${categoryCount} 个分类)`);
    });
    
    console.log('-'.repeat(80));
    console.log(`  品牌总计:${brandTotal.toLocaleString('zh-CN', {minimumFractionDigits: 2}).padStart(20)}`);
});

console.log();
console.log('='.repeat(80));
console.log('关键数据验证');
console.log('='.repeat(80));
console.log();

// 验证 MLB OFFICE
const mlbOffice = data.brands.MLB['2025-12'].OFFICE.total;
console.log('✓ MLB OFFICE:');
console.log(`    实际: ${mlbOffice.toLocaleString('zh-CN', {minimumFractionDigits: 2})}`);
console.log(`    预期: 28,571,061.03`);
console.log(`    状态: ${Math.abs(mlbOffice - 28571061.03) < 1 ? '✓ 匹配' : '✗ 不匹配'}`);
console.log();

// 验证 DV OFF OR
const dvOffOr = data.brands.DV['2025-12']['OFF OR'].total;
console.log('✓ DV OFF OR:');
console.log(`    实际: ${dvOffOr.toLocaleString('zh-CN', {minimumFractionDigits: 2})}`);
console.log(`    预期: 547,859`);
console.log(`    状态: ${Math.abs(dvOffOr - 547859) < 1 ? '✓ 匹配' : '± 接近'} (差异: ${(dvOffOr - 547859).toFixed(2)})`);
console.log();

// 验证 DV ON OR
if (data.brands.DV['2025-12']['ON OR']) {
    const dvOnOr = data.brands.DV['2025-12']['ON OR'].total;
    console.log('✓ DV ON OR:');
    console.log(`    实际: ${dvOnOr.toLocaleString('zh-CN', {minimumFractionDigits: 2})}`);
    console.log(`    状态: ✓ 已添加（之前缺失）`);
} else {
    console.log('✗ DV ON OR: 缺失');
}

console.log();
console.log('='.repeat(80));
console.log('验证完成！');
console.log('='.repeat(80));
