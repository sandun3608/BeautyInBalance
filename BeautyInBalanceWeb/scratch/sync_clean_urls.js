const fs = require('fs');

fetch('https://beautyinbalance.onrender.com/api/products')
  .then(res => res.json())
  .then(dbProds => {
    let content = fs.readFileSync('products.js', 'utf-8');
    let updatedCount = 0;

    dbProds.forEach(dbP => {
      if (dbP.id && dbP.img) {
         // If dbP.img is a base64 string, look if dbP.images has a postimg or HTTP URL, or formatting
         let cleanUrl = dbP.img;
         if (cleanUrl.startsWith('data:image')) {
            if (Array.isArray(dbP.images)) {
                const httpImg = dbP.images.find(img => img.startsWith('http') && !img.startsWith('data:image'));
                if (httpImg) cleanUrl = httpImg;
            }
         }
         
         // Only replace if it's not base64
         if (!cleanUrl.startsWith('data:image')) {
             const regex = new RegExp(`(id:\\s*['"]${dbP.id}['"][\\s\\S]*?img:\\s*['"])([^'"]+)(['"])`, 'g');
             if (regex.test(content)) {
                content = content.replace(regex, `$1${cleanUrl}$3`);
                updatedCount++;
             }
         }
      }
    });

    fs.writeFileSync('products.js', content);
    console.log(`✅ Updated ${updatedCount} products in products.js with clean image URLs!`);
    console.log(`Final file size: ${fs.readFileSync('products.js', 'utf-8').length} bytes`);
  })
  .catch(err => console.error('Fetch error:', err));
