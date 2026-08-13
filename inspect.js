const fs = require('fs');
const txt = fs.readFileSync('products.js','utf8');
const idx = txt.indexOf('"id": "Da-Moiz-Cer"');
console.log(txt.substring(idx, idx+300));
