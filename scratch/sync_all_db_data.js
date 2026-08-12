const fs = require('fs');

fetch('https://beautyinbalance.onrender.com/api/products')
  .then(res => res.json())
  .then(dbProds => {
    let content = fs.readFileSync('products.js', 'utf-8');
    let priceUpdates = 0;
    let discountUpdates = 0;

    dbProds.forEach(dbP => {
      const pid = dbP.id || dbP._id;
      if (!pid) return;

      // 1. Sync price
      if (dbP.price !== undefined) {
         const pRegex = new RegExp(`(id:\\s*['"]${pid}['"][\\s\\S]*?price:\\s*)(\\d+)`, 'g');
         content = content.replace(pRegex, (m, prefix, oldPrice) => {
            if (Number(oldPrice) !== Number(dbP.price)) {
               priceUpdates++;
               console.log(`[${pid}] Price updated: ${oldPrice} -> ${dbP.price}`);
            }
            return `${prefix}${dbP.price}`;
         });
      }

      // 2. Sync discount
      if (dbP.discount !== undefined) {
         const dRegex = new RegExp(`(id:\\s*['"]${pid}['"][\\s\\S]*?discount:\\s*)(\\d+)`, 'g');
         content = content.replace(dRegex, (m, prefix, oldDisc) => {
            if (Number(oldDisc) !== Number(dbP.discount)) {
               discountUpdates++;
               console.log(`[${pid}] Discount updated: ${oldDisc} -> ${dbP.discount}`);
            }
            return `${prefix}${dbP.discount}`;
         });
      }
    });

    fs.writeFileSync('products.js', content);
    console.log(`✅ Synced products.js with MongoDB! (${priceUpdates} prices updated, ${discountUpdates} discounts updated)`);
  })
  .catch(err => console.error('Fetch error:', err));
