const fs = require('fs');

let content = fs.readFileSync('products.js', 'utf-8');

// Replace any img: 'images/placeholder.png' with the item's images[0] value
const regex = /{\s*id:\s*['"]([^'"]+)['"][\s\S]*?images:\s*\[['"]([^'"]+)['"]\][\s\S]*?img:\s*['"]images\/placeholder\.png['"]/g;

let fixedCount = 0;
content = content.replace(regex, (match, id, firstImg) => {
    fixedCount++;
    return match.replace("img: 'images/placeholder.png'", `img: '${firstImg}'`);
});

fs.writeFileSync('products.js', content);
console.log(`✅ Fixed ${fixedCount} products in products.js using valid images[0] paths!`);
