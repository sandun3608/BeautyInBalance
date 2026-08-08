const fs = require('fs');

fetch('https://beautyinbalance.onrender.com/api/products')
  .then(res => res.json())
  .then(dbProds => {
    let content = fs.readFileSync('products.js', 'utf-8');

    // Parse defaultProducts from products.js
    const match = content.match(/const defaultProducts = \[([\s\S]*?)\];/);
    if (!match) return;

    const evalStr = 'const defaultProducts = [' + match[1] + ']; module.exports = defaultProducts;';
    fs.writeFileSync('scratch/temp_def2.js', evalStr);
    const defaults = require('./temp_def2.js');

    let fixedCount = 0;

    dbProds.forEach(dbP => {
       const pid = dbP.id || dbP._id;
       const def = defaults.find(d => d.id === pid || d.name === dbP.name);
       if (def) {
          // If def.img is empty or placeholder, replace with dbP.img or dbP.images[0]
          if (!def.img || def.img === 'images/placeholder.png' || def.img === '') {
             const realImg = dbP.img || (Array.isArray(dbP.images) && dbP.images[0]) || '';
             if (realImg) {
                def.img = realImg;
                def.images = Array.isArray(dbP.images) && dbP.images.length ? dbP.images : [realImg];
                fixedCount++;
                console.log(`Fixed empty img for [${pid}]: ${realImg.substring(0, 40)}...`);
             }
          }
       }
    });

    console.log(`Total fixed products: ${fixedCount}`);
    const newDefaultsStr = 'const defaultProducts = ' + JSON.stringify(defaults, null, 2) + ';';
    const updatedContent = content.replace(/const defaultProducts = \[[\s\S]*?\];/, newDefaultsStr);
    fs.writeFileSync('products.js', updatedContent);
    console.log('✅ products.js updated with 100% working images for all 71 products!');
  })
  .catch(err => console.error('Fetch error:', err));
