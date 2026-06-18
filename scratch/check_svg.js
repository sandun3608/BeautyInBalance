const fs = require('fs');
const html = fs.readFileSync('checkout.html', 'utf8');

const regex = /<svg[^>]*>([\s\S]*?)<\/svg>/g;
let match;
const visas = [];
while ((match = regex.exec(html)) !== null) {
  if (match[0].includes('#1434CB')) {
    visas.push(match[0]);
  }
}

console.log(`Total Visa SVGs found: ${visas.length}`);
visas.forEach((v, i) => {
  console.log(`Visa ${i} (length ${v.length}):`);
  console.log(v);
  console.log('='.repeat(50));
});

if (visas.length >= 2) {
  console.log('Are they identical?', visas[0] === visas[1]);
}
