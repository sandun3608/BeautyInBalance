const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

console.log('=== WEBSITE AUDIT REPORT ===\n');

// 1. Check existing HTML files
console.log('1. EXISTING HTML PAGES:', files.length);
files.forEach(f => console.log('  - ' + f));

// 2. Check broken internal href links in all HTML files
console.log('\n2. CHECKING BROKEN LINKS IN HTML FILES:');
let totalBroken = 0;
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const hrefs = [...content.matchAll(/href=["']([^"']+\.html[^"']*)["']/g)].map(m => m[1]);
  const broken = [];
  hrefs.forEach(h => {
    const cleanPath = h.split('?')[0].split('#')[0];
    if (cleanPath && !fs.existsSync(cleanPath)) {
      broken.push(h);
    }
  });
  if (broken.length > 0) {
    console.log(`❌ [${file}] Broken links found (${broken.length}):`, Array.from(new Set(broken)));
    totalBroken += broken.length;
  } else {
    console.log(`✅ [${file}] All href links valid.`);
  }
});

// 3. Check for script files referenced
console.log('\n3. CHECKING SCRIPT & CSS REFERENCES:');
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const srcs = [...content.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css)[^"']*)["']/g)].map(m => m[1]);
  const missing = [];
  srcs.forEach(s => {
    if (s.startsWith('http')) return;
    const cleanPath = s.split('?')[0];
    if (cleanPath && !fs.existsSync(cleanPath)) {
      missing.push(s);
    }
  });
  if (missing.length > 0) {
    console.log(`❌ [${file}] Missing assets (${missing.length}):`, missing);
  } else {
    console.log(`✅ [${file}] Assets valid.`);
  }
});

// 4. Check productsData integrity in products.js
console.log('\n4. CHECKING PRODUCTS DATA INTEGRITY:');
try {
  const prodContent = fs.readFileSync('products.js', 'utf8');
  const match = prodContent.match(/const defaultProducts = (\[[\s\S]*?\]);/);
  if (match) {
    const prods = JSON.parse(match[1]);
    console.log(`Total Products: ${prods.length}`);
    const noImg = prods.filter(p => !p.img);
    const noPrice = prods.filter(p => !p.price || p.price <= 0);
    const noName = prods.filter(p => !p.name);
    console.log(`- Missing Images: ${noImg.length}`);
    console.log(`- Invalid Prices: ${noPrice.length}`);
    console.log(`- Missing Names: ${noName.length}`);
    if (noImg.length) console.log('  No Image Items:', noImg.map(p => p.name || p.id));
  }
} catch (e) {
  console.log('Error parsing products.js:', e.message);
}
