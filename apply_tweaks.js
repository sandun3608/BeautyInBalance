const fs = require('fs');
const path = require('path');
const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (const file of files) {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  let original = content;
  
  // Remove LIMITED OFFERS
  content = content.replace(/<li><a href="shop\.html\?filter=limited">LIMITED OFFERS<\/a><\/li>\s*/g, '');
  
  // Update SHOPPING FESTIVAL
  content = content.replace(
    '<li><a href="shop.html?filter=festival">🛍️ SHOPPING FESTIVAL</a></li>',
    '<li><a href="shop.html?filter=offers">🛍️ SHOPPING FESTIVAL</a></li>'
  );
  
  // Update WISHLIST
  content = content.replace(
    '<li><a href="#">♡ WISHLIST</a></li>',
    '<li><a href="cart.html">♡ WISHLIST</a></li>'
  );
  
  if (content !== original) {
    fs.writeFileSync(path.join(dir, file), content, 'utf8');
    console.log('Updated HTML:', file);
  }
}

let css = fs.readFileSync('styles.css', 'utf8');
css = css.replace(/border-radius:\s*0\s+45px\s+45px\s+0;?/g, 'border-radius: 0;');
css = css.replace(/border-radius:\s*0\s+30px\s+30px\s+0\s*!important;?/g, 'border-radius: 0 !important;');
fs.writeFileSync('styles.css', css, 'utf8');
console.log('Updated CSS');
