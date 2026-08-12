const fs = require('fs');

const files = ['index.html', 'product.html', 'shop.html', 'products.js'];

files.forEach(f => {
   if (fs.existsSync(f)) {
      let content = fs.readFileSync(f, 'utf-8');
      content = content.replaceAll('koko-logo.svg', 'koko-logo.png');
      fs.writeFileSync(f, content);
      console.log(`Reverted ${f} -> koko-logo.png`);
   }
});
