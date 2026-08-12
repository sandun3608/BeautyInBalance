const fs = require('fs');

let content = fs.readFileSync('products.js', 'utf-8');
const originalSize = content.length;

// Replace all huge base64 strings with empty or placeholder image URLs
content = content.replace(/['"]data:image\/[^'"]+['"]/g, "'images/placeholder.png'");

fs.writeFileSync('products.js', content);
console.log(`Original size: ${originalSize} bytes`);
console.log(`New size: ${fs.readFileSync('products.js', 'utf-8').length} bytes`);
