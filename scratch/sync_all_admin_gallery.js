const fs = require('fs');

fetch('https://beautyinbalance.onrender.com/api/products')
  .then(res => res.json())
  .then(dbProds => {
    let content = fs.readFileSync('products.js', 'utf-8');

    const match = content.match(/const defaultProducts = \[([\s\S]*?)\];/);
    if (!match) return;

    const evalStr = 'const defaultProducts = [' + match[1] + ']; module.exports = defaultProducts;';
    fs.writeFileSync('scratch/temp_def4.js', evalStr);
    const defaults = require('./temp_def4.js');

    let updatedCount = 0;

    dbProds.forEach(dbP => {
       const pid = dbP.id || dbP._id;
       const def = defaults.find(d => d.id === pid || d.name === dbP.name);
       if (def) {
          if (dbP.img) {
             def.img = dbP.img;
             def.images = Array.isArray(dbP.images) && dbP.images.length ? dbP.images : [dbP.img];
             updatedCount++;
          }
       }
    });

    console.log(`Updated ${updatedCount} product image galleries in products.js to match MongoDB admin edits!`);
    const newDefaultsStr = 'const defaultProducts = ' + JSON.stringify(defaults, null, 2) + ';';
    const updatedContent = content.replace(/const defaultProducts = \[[\s\S]*?\];/, newDefaultsStr);
    fs.writeFileSync('products.js', updatedContent);
    console.log('✅ products.js image galleries 100% SYNCED with Admin Panel edits in MongoDB!');
  })
  .catch(err => console.error('Fetch error:', err));
