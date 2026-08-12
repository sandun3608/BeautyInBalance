const fs = require('fs');

fetch('https://beautyinbalance.onrender.com/api/products')
  .then(res => res.json())
  .then(dbProds => {
    let content = fs.readFileSync('products.js', 'utf-8');

    const match = content.match(/const defaultProducts = \[([\s\S]*?)\];/);
    if (!match) return;

    const evalStr = 'const defaultProducts = [' + match[1] + ']; module.exports = defaultProducts;';
    fs.writeFileSync('scratch/temp_def7.js', evalStr);
    const defaults = require('./temp_def7.js');

    const sortedDefaults = [];

    // 1. Add products in exact MongoDB order
    dbProds.forEach(dbP => {
       const pid = dbP.id || dbP._id;
       const def = defaults.find(d => d.id === pid || d.name === dbP.name);
       if (def) {
          sortedDefaults.push(def);
       }
    });

    // 2. Add any remaining defaults not in dbProds
    defaults.forEach(def => {
       if (!sortedDefaults.some(s => s.id === def.id || s.name === def.name)) {
          sortedDefaults.push(def);
       }
    });

    console.log(`Sorted ${sortedDefaults.length} products in defaultProducts to match MongoDB order!`);
    console.log('Top 4 The Ordinary products in sorted defaults:');
    sortedDefaults.filter(p => p.cat === 'the-ordinary' || p.cat === 'ordinary').slice(0, 4).forEach((p, i) => {
        console.log(`  [${i}] ${p.id}: ${p.name}`);
    });

    const newDefaultsStr = 'const defaultProducts = ' + JSON.stringify(sortedDefaults, null, 2) + ';';
    const updatedContent = content.replace(/const defaultProducts = \[[\s\S]*?\];/, newDefaultsStr);
    fs.writeFileSync('products.js', updatedContent);
    console.log('✅ products.js order is now 100% IDENTICAL to MongoDB array order!');
  })
  .catch(err => console.error('Fetch error:', err));
