const fs = require('fs');
const code = `
// Normalize products to ensure 'img' property is always set correctly from 'images' array if missing.
if (typeof defaultProducts !== 'undefined' && Array.isArray(defaultProducts)) {
    defaultProducts.forEach(p => {
        if (!p.img && p.images && p.images.length > 0) {
            p.img = p.images[0];
        }
    });
}
`;
fs.appendFileSync('products.js', code);
console.log('Appended successfully');
