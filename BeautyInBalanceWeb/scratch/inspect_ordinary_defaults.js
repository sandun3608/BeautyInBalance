const fs = require('fs');

let content = fs.readFileSync('products.js', 'utf-8');
const match = content.match(/const defaultProducts = \[([\s\S]*?)\];/);
if (!match) return;

const evalStr = 'const defaultProducts = [' + match[1] + ']; module.exports = defaultProducts;';
fs.writeFileSync('scratch/temp_def6.js', evalStr);
const defaults = require('./temp_def6.js');

const ordProds = defaults.filter(p => p.cat === 'the-ordinary' || p.cat === 'ordinary');
console.log(`Total The Ordinary products in defaults: ${ordProds.length}`);
ordProds.forEach((p, i) => {
   console.log(`[${i}] ID: ${p.id} | Name: ${p.name}`);
   console.log(`     IMG: ${p.img ? p.img.substring(0, 70) : 'EMPTY'}`);
});
