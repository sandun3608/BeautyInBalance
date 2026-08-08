const fs = require('fs');
const content = fs.readFileSync('ALL_PRODUCTS_RECOVERY.js', 'utf-8');
const regex = /"cat"\s*:\s*"([^"]+)"/gi;
let match;
const cats = new Set();
while ((match = regex.exec(content)) !== null) {
    cats.add(match[1].trim());
}
console.log('Categories found:', Array.from(cats));
