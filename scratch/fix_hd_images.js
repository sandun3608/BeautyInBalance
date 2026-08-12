const fs = require('fs');

let content = fs.readFileSync('products.js', 'utf-8');

// Parse defaultProducts from products.js
const match = content.match(/const defaultProducts = \[([\s\S]*?)\];/);
if (!match) return;

const evalStr = 'const defaultProducts = [' + match[1] + ']; module.exports = defaultProducts;';
fs.writeFileSync('scratch/temp_def3.js', evalStr);
const defaults = require('./temp_def3.js');

let upgradedCount = 0;

defaults.forEach(p => {
    // If p.images contains an HTTP URL or local PNG path that is NOT base64, use it as p.img!
    if (Array.isArray(p.images) && p.images.length > 0) {
        const hdPath = p.images.find(src => src && !src.startsWith('data:image') && (src.includes('.png') || src.includes('.jpg') || src.includes('http')));
        if (hdPath && p.img !== hdPath) {
            p.img = hdPath;
            upgradedCount++;
            console.log(`[${p.id}] Upgraded to HD path: ${hdPath}`);
        }
    }
});

console.log(`Total HD upgrades: ${upgradedCount}`);
const newDefaultsStr = 'const defaultProducts = ' + JSON.stringify(defaults, null, 2) + ';';
const updatedContent = content.replace(/const defaultProducts = \[[\s\S]*?\];/, newDefaultsStr);
fs.writeFileSync('products.js', updatedContent);
console.log('✅ products.js updated with crisp HD image paths!');
