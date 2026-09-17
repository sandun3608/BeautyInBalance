const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'product.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace renderProduct discount check in product.html
const oldDiscountCode = `const discount = Number(product.discount || 0);`;
const newDiscountCode = `let discount = Number(product.discount || 0);
      let isFlashSaleOffer = false;
      if (window.activeFlashSale && window.activeFlashSale.enabled) {
        const pSet = new Set((window.activeFlashSale.productIds || []).map(id => String(id).trim()));
        const pIdStr = String(product.id || product._id || '');
        if (pSet.size === 0 || pSet.has(pIdStr)) {
          discount = Number(window.activeFlashSale.discountPercent || 20);
          isFlashSaleOffer = true;
        }
      }`;

if (content.includes(oldDiscountCode)) {
  content = content.replace(oldDiscountCode, newDiscountCode);
}

// Add activeFlashSale fetch before single product fetch
const oldFetchCode = `// 2. BACKGROUND FETCH FOR LATEST DB UPDATES`;
const newFetchCode = `// Fetch Flash Sale settings to check active offers
      const BASE = window.BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://beautyinbalance.onrender.com/api');
      fetch(\`\${BASE}/settings/flash_sale\`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.value && data.value.enabled) {
            const sale = data.value;
            const now = new Date();
            const start = new Date(sale.startDate);
            const end = new Date(sale.endDate);
            if (now >= start && now <= end) {
              window.activeFlashSale = sale;
              const prods = (window.productsData && window.productsData.length) ? window.productsData : (typeof defaultProducts !== 'undefined' ? defaultProducts : []);
              renderProduct(prods);
            }
          }
        }).catch(e => console.warn('Flash sale fetch in product.html failed:', e));

      // 2. BACKGROUND FETCH FOR LATEST DB UPDATES`;

if (content.includes(oldFetchCode)) {
  content = content.replace(oldFetchCode, newFetchCode);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('product.html updated successfully with Flash Sale offer integration!');
