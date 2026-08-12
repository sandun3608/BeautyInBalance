const fs = require('fs');

const files = ['index.html', 'product.html', 'shop.html', 'products.js'];

files.forEach(f => {
   if (fs.existsSync(f)) {
      let content = fs.readFileSync(f, 'utf-8');
      content = content.replaceAll('koko-logo.png', 'koko-logo.svg');
      fs.writeFileSync(f, content);
      console.log(`Updated ${f} -> koko-logo.svg`);
   }
});
