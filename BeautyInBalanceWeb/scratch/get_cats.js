const fs = require('fs');
const content = fs.readFileSync('products.js', 'utf-8');
const regex = /cat\s*:\s*['"]([^'"]+)['"]/gi;
let match;
const cats = new Set();
while ((match = regex.exec(content)) !== null) {
    cats.add(match[1].toLowerCase().trim());
}
console.log('Categories found:', Array.from(cats));
