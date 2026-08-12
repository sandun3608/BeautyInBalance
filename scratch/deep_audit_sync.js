const fs = require('fs');

fetch('https://beautyinbalance.onrender.com/api/products')
  .then(res => res.json())
  .then(dbProds => {
    let content = fs.readFileSync('products.js', 'utf-8');
    console.log(`MongoDB Total Products: ${dbProds.length}`);

    // Parse defaultProducts array from products.js
    const match = content.match(/const defaultProducts = \[([\s\S]*?)\];/);
    if (!match) {
        console.error('Could not find defaultProducts array in products.js');
        return;
    }

    const evalStr = 'const defaultProducts = [' + match[1] + ']; module.exports = defaultProducts;';
    fs.writeFileSync('scratch/temp_defaults.js', evalStr);
    const defaults = require('./temp_defaults.js');

    let diffCount = 0;
    let newProductsAdded = 0;

    dbProds.forEach(dbP => {
       const pid = dbP.id || dbP._id;
       const defIndex = defaults.findIndex(d => d.id === pid || d.name === dbP.name);

       // Clean image formatting function
       const cleanImg = (str) => {
          if (!str) return 'images/placeholder.png';
          if (str.startsWith('data:image')) return '';
          return str;
       };

       const dbImg = cleanImg(dbP.img);
       const dbImages = Array.isArray(dbP.images) ? dbP.images.map(cleanImg).filter(Boolean) : [dbImg];

       const cleanedDbP = {
          id: pid,
          name: dbP.name,
          price: Number(dbP.price || 0),
          discount: Number(dbP.discount || 0),
          stock: (dbP.stock !== undefined && dbP.stock !== null) ? Number(dbP.stock) : 10,
          cat: dbP.cat || dbP.category || 'others',
          filter: dbP.filter || 'all',
          img: dbImg || (dbImages[0] || ''),
          images: dbImages.length ? dbImages : [(dbImg || '')],
          desc: dbP.desc || '',
          benefits: Array.isArray(dbP.benefits) ? dbP.benefits : [],
          howToUse: dbP.howToUse || '',
          authenticity: dbP.authenticity || '100% Genuine Direct Import.'
       };

       if (defIndex !== -1) {
          // Compare with existing default product
          const curDef = defaults[defIndex];
          let itemDiffs = [];

          if (curDef.name !== cleanedDbP.name) itemDiffs.push(`name: "${curDef.name}" -> "${cleanedDbP.name}"`);
          if (curDef.price !== cleanedDbP.price) itemDiffs.push(`price: ${curDef.price} -> ${cleanedDbP.price}`);
          if (curDef.discount !== cleanedDbP.discount) itemDiffs.push(`discount: ${curDef.discount} -> ${cleanedDbP.discount}`);
          if (curDef.cat !== cleanedDbP.cat) itemDiffs.push(`cat: ${curDef.cat} -> ${cleanedDbP.cat}`);
          if (curDef.filter !== cleanedDbP.filter) itemDiffs.push(`filter: ${curDef.filter} -> ${cleanedDbP.filter}`);
          if (cleanedDbP.img && curDef.img !== cleanedDbP.img) itemDiffs.push(`img: changed`);

          if (itemDiffs.length > 0) {
             diffCount++;
             console.log(`[DIFF - ${pid}]`, itemDiffs.join(' | '));
             defaults[defIndex] = { ...curDef, ...cleanedDbP };
             // If img was empty or base64, preserve curDef.img if curDef.img was valid local path
             if (!cleanedDbP.img && curDef.img) {
                 defaults[defIndex].img = curDef.img;
                 defaults[defIndex].images = curDef.images || [curDef.img];
             }
          }
       } else {
          // New product in DB not in defaultProducts
          newProductsAdded++;
          console.log(`[NEW PRODUCT] ${pid}: ${cleanedDbP.name}`);
          defaults.push(cleanedDbP);
       }
    });

    console.log(`Audit Summary: ${diffCount} differences updated, ${newProductsAdded} new products added to defaults.`);

    // Reconstruct products.js with 100% synced defaultProducts
    const newDefaultsStr = 'const defaultProducts = ' + JSON.stringify(defaults, null, 2) + ';';
    const updatedContent = content.replace(/const defaultProducts = \[[\s\S]*?\];/, newDefaultsStr);
    fs.writeFileSync('products.js', updatedContent);
    console.log('✅ products.js is now 100% SYNCED with MongoDB database!');
  })
  .catch(err => console.error('Audit Error:', err));
