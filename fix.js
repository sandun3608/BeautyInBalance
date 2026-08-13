const fs = require('fs');
let t = fs.readFileSync('products.js', 'utf8');

t = t.split('"img": "https://i.postimg.cc/CKjbR39m/2.png"\r\n    "images"').join('"img": "https://i.postimg.cc/CKjbR39m/2.png",\r\n    "images"');
t = t.split('"img": "https://i.postimg.cc/CKjbR39m/2.png"\n    "images"').join('"img": "https://i.postimg.cc/CKjbR39m/2.png",\n    "images"');

fs.writeFileSync('products.js', t);
console.log("Replaced");
