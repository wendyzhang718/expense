/**
 * 费用数据预处理脚本 (Node.js 版本)
 * 将 CSV 文件转换为 JSON 格式，按品牌、Channel 和费用中分类聚合
 */

const fs = require('fs');
const path = require('path');

// 配置路径
const DATABASE_DIR = 'D:\\cursor\\WorkPlace\\Database';
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'data', 'expenses.json');

/**
 * 解析带千位分隔符的金额字符串
 */
function parseAmount(amountStr) {
    if (!amountStr || amountStr === '') return 0;
    // 移除千位分隔符（逗号）并转换为浮点数
    const cleaned = String(amountStr).replace(/,/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
}

/**
 * 从文件名提取月份和年份
 */
function extractMonthFromFilename(filename) {
    const monthMapping = {
        'JAN': '01', 'FEB': '02', 'MAR': '03', 'APR': '04',
        'MAY': '05', 'JUN': '06', 'JUL': '07', 'AUG': '08',
        'SEP': '09', 'OCT': '10', 'NOV': '11', 'DEC': '12'
    };
    
    const pattern = /([A-Z]{3})\s+(\d{4})/i;
    const match = filename.toUpperCase().match(pattern);
    
    if (match) {
        const monthAbbr = match[1];
        const year = match[2];
        const monthNum = monthMapping[monthAbbr];
        if (monthNum) {
            return `${year}-${monthNum}`;
        }
    }
    
    return 'unknown';
}

/**
 * 解析 CSV 行
 */
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

/**
 * 处理 CSV 文件
 */
function processCSVFile(csvPath) {
    console.log(`正在处理文件: ${csvPath}`);
    
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split(/\r?\n/).filter(line => line.trim());
    
    if (lines.length < 2) {
        throw new Error('CSV 文件为空或格式不正确');
    }
    
    // 解析表头
    const headers = parseCSVLine(lines[0]);
    
    // 确保必需的列存在
    const requiredColumns = ['Brand', '费用大分类', '费用中分类', 'Channel', '报表货币值'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
        throw new Error(`CSV 文件缺少必需的列: ${missingColumns.join(', ')}`);
    }
    
    // 获取列索引
    const brandIdx = headers.indexOf('Brand');
    const channelIdx = headers.indexOf('Channel');
    const categoryIdx = headers.indexOf('费用中分类');
    const amountIdx = headers.indexOf('报表货币值');
    
    // 从文件名提取月份
    const filename = path.basename(csvPath);
    const month = extractMonthFromFilename(filename);
    
    // 按品牌分组聚合数据
    const brandsData = {};
    
    for (let i = 1; i < lines.length; i++) {
        const fields = parseCSVLine(lines[i]);
        
        const brand = fields[brandIdx];
        const channel = fields[channelIdx];
        const category = fields[categoryIdx];
        const amountStr = fields[amountIdx];
        
        // 跳过无效行
        if (!brand || !channel || !category) continue;
        
        const amount = parseAmount(amountStr);
        // 只排除金额为 0 的行，保留负数（代表冲销/退款）
        if (amount === 0) continue;
        
        // 初始化品牌
        if (!brandsData[brand]) {
            brandsData[brand] = {};
        }
        
        // 初始化 Channel
        if (!brandsData[brand][channel]) {
            brandsData[brand][channel] = {
                total: 0,
                categories: {}
            };
        }
        
        // 累加金额
        brandsData[brand][channel].total += amount;
        
        if (!brandsData[brand][channel].categories[category]) {
            brandsData[brand][channel].categories[category] = 0;
        }
        brandsData[brand][channel].categories[category] += amount;
    }
    
    // 四舍五入到两位小数
    for (const brand in brandsData) {
        for (const channel in brandsData[brand]) {
            brandsData[brand][channel].total = Math.round(brandsData[brand][channel].total * 100) / 100;
            for (const category in brandsData[brand][channel].categories) {
                brandsData[brand][channel].categories[category] = 
                    Math.round(brandsData[brand][channel].categories[category] * 100) / 100;
            }
        }
    }
    
    console.log(`  - 处理完成，共 ${Object.keys(brandsData).length} 个品牌`);
    
    return {
        month,
        brands: brandsData
    };
}

/**
 * 处理所有 CSV 文件
 */
function processAllCSVFiles() {
    console.log('='.repeat(60));
    console.log('费用数据预处理开始');
    console.log('='.repeat(60));
    
    if (!fs.existsSync(DATABASE_DIR)) {
        throw new Error(`Database 文件夹不存在: ${DATABASE_DIR}`);
    }
    
    // 查找所有 CSV 文件
    const csvFiles = fs.readdirSync(DATABASE_DIR)
        .filter(file => file.toLowerCase().endsWith('.csv'))
        .map(file => path.join(DATABASE_DIR, file));
    
    if (csvFiles.length === 0) {
        throw new Error('Database 文件夹中没有找到 CSV 文件');
    }
    
    console.log(`\n找到 ${csvFiles.length} 个 CSV 文件\n`);
    
    const allMonths = [];
    const allBrands = {};
    
    for (const csvFile of csvFiles) {
        try {
            const result = processCSVFile(csvFile);
            const month = result.month;
            
            if (!allMonths.includes(month)) {
                allMonths.push(month);
            }
            
            // 合并品牌数据
            for (const [brand, channels] of Object.entries(result.brands)) {
                if (!allBrands[brand]) {
                    allBrands[brand] = {};
                }
                
                if (!allBrands[brand][month]) {
                    allBrands[brand][month] = channels;
                } else {
                    // 如果同一月份有多个文件，合并数据
                    for (const [channel, channelData] of Object.entries(channels)) {
                        if (allBrands[brand][month][channel]) {
                            // 合并 Channel 数据
                            allBrands[brand][month][channel].total += channelData.total;
                            for (const [cat, amt] of Object.entries(channelData.categories)) {
                                if (allBrands[brand][month][channel].categories[cat]) {
                                    allBrands[brand][month][channel].categories[cat] += amt;
                                } else {
                                    allBrands[brand][month][channel].categories[cat] = amt;
                                }
                            }
                        } else {
                            allBrands[brand][month][channel] = channelData;
                        }
                    }
                }
            }
        } catch (error) {
            console.log(`  - 错误: 处理文件 ${path.basename(csvFile)} 时出错: ${error.message}`);
            continue;
        }
    }
    
    // 构建最终输出结构
    const outputData = {
        months: allMonths.sort(),
        brands: allBrands,
        generated_at: new Date().toISOString(),
        total_months: allMonths.length
    };
    
    // 确保输出目录存在
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 写入 JSON 文件
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(outputData, null, 2), 'utf-8');
    
    const stats = fs.statSync(OUTPUT_PATH);
    
    console.log('\n' + '='.repeat(60));
    console.log('处理完成！');
    console.log(`  - 月份数: ${allMonths.length}`);
    console.log(`  - 品牌数: ${Object.keys(allBrands).length}`);
    console.log(`  - 输出文件: ${OUTPUT_PATH}`);
    console.log(`  - 文件大小: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log('='.repeat(60));
}

// 主程序
try {
    processAllCSVFiles();
} catch (error) {
    console.error(`\n错误: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
}
