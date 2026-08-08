const fs = require('fs');

let content = fs.readFileSync('products.js', 'utf-8');

// Match individual product objects and set img = images[0]
const result = content.replace(/{\s*id:\s*['"]([^'"]+)['"][\s\S]*?}/g, (block) => {
   const imgMatch = block.match(/images:\s*\[['"]([^'"]+)['"]/);
   if (imgMatch && imgMatch[1]) {
      const correctImg = imgMatch[1];
      // Replace img property in this block with correctImg
      return block.replace(/img:\s*['"][^'"]*['"]/, `img: '${correctImg}'`);
   }
   return block;
});

fs.writeFileSync('products.js', result);
console.log('✅ All product img properties perfectly synced to their exact images[0] path!');
