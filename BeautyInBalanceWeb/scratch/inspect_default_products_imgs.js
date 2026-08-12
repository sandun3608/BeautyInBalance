const fs = require('fs');

let content = fs.readFileSync('products.js', 'utf-8');
const match = content.match(/const defaultProducts = \[([\s\S]*?)\];/);
if (!match) return;

const evalStr = 'const defaultProducts = [' + match[1] + ']; module.exports = defaultProducts;';
fs.writeFileSync('scratch/temp_def5.js', evalStr);
const defaults = require('./temp_def5.js');

console.log('=== FIRST 10 PRODUCTS IN products.js ===');
defaults.slice(0, 10).forEach((p, i) => {
    console.log(`[${i}] ID: ${p.id} | Name: ${p.name}`);
    console.log(`    IMG: ${p.img ? p.img.substring(0, 50) : 'EMPTY'}`);
});

fetch('https://beautyinbalance.onrender.com/api/products')
  .then(res => res.json())
  .then(dbProds => {
     console.log('\n=== FIRST 10 PRODUCTS IN MONGODB ===');
     dbProds.slice(0, 10).forEach((p, i) => {
        const pid = p.id || p._id;
        console.log(`[${i}] ID: ${pid} | Name: ${p.name}`);
        console.log(`    IMG: ${p.img ? p.img.substring(0, 50) : 'EMPTY'}`);
     });
  });
