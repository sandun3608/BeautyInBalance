const fs = require('fs');
let content = fs.readFileSync('products.js', 'utf8');

// Replace the window.productsData initialization
const initRegex = /\/\/ Global products data used by the UI - Instant 0ms initial load\s*window\.productsData = typeof defaultProducts !== 'undefined' \? \[\.\.\.defaultProducts\] : \[\];/;

const initReplacement = `// Attempt to load from localStorage first for an even faster, more accurate instant load
let cachedProducts = null;
try {
    const cached = localStorage.getItem('koko_products_cache');
    if (cached) {
        cachedProducts = JSON.parse(cached);
    }
} catch (e) {}

// Global products data used by the UI - Instant 0ms initial load
window.productsData = (cachedProducts && cachedProducts.length > 0) ? cachedProducts : (typeof defaultProducts !== 'undefined' ? [...defaultProducts] : []);`;

content = content.replace(initRegex, initReplacement);

// Replace the save to window.productsData
const saveRegex = /window\.productsData = updatedProductsData;/;
const saveReplacement = `window.productsData = updatedProductsData;
            try { localStorage.setItem('koko_products_cache', JSON.stringify(updatedProductsData)); } catch(e) {}`;

content = content.replace(saveRegex, saveReplacement);

fs.writeFileSync('products.js', content, 'utf8');
console.log('Patch complete.');
