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

if (visas.length >= 2) {
  const v0 = visas[0].replace(/\s+/g, '');
  const v1 = visas[1].replace(/\s+/g, '');
  console.log('Normalized identical?', v0 === v1);
  if (v0 !== v1) {
    for (let i = 0; i < Math.max(v0.length, v1.length); i++) {
      if (v0[i] !== v1[i]) {
        console.log(`Diff at index ${i}:`);
        console.log(`Visa 0: ${v0.substring(i, i + 30)}`);
        console.log(`Visa 1: ${v1.substring(i, i + 30)}`);
        break;
      }
    }
  }
}
