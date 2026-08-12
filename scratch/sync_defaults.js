const fs = require('fs');

fetch('https://beautyinbalance.onrender.com/api/products')
  .then(res => res.json())
  .then(dbProds => {
    let content = fs.readFileSync('products.js', 'utf-8');
    
    dbProds.forEach(dbP => {
      // Find matching item in products.js by id
      if (dbP.id && dbP.img) {
         // Replace img property for this product id in products.js
         const regex = new RegExp(`(id:\\s*['"]${dbP.id}['"][\\s\\S]*?img:\\s*['"])([^'"]+)(['"])`, 'g');
         if (regex.test(content)) {
            content = content.replace(regex, `$1${dbP.img}$3`);
            console.log(`Updated img for ${dbP.id} -> ${dbP.img}`);
         }
      }
    });

    fs.writeFileSync('products.js', content);
    console.log('✅ products.js defaultProducts successfully synced with DB!');
  })
  .catch(err => console.error('Fetch error:', err));
