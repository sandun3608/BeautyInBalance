const fs = require('fs');
let content = fs.readFileSync('products.js', 'utf8');

const idIndex = content.indexOf('"id": "Da-Moiz-Cer"');
if (idIndex === -1) {
  console.log('Product not found');
  process.exit(1);
}

// Get the block corresponding to the product
let blockStart = idIndex;
let blockEnd = content.indexOf('}', blockStart); // this might just find the end of the object... but there are nested objects or arrays.
// A simpler way: we know it's within the next 20000 chars (since the base64 string is large)
// Wait, the base64 string itself is around 30kb or so.
blockEnd = blockStart + 65000;

let block = content.substring(blockStart, blockEnd);

const imgRegex = /"img":\s*"data:image\/[^"]+"/;
const imagesRegex = /"images":\s*\[\s*"data:image\/[^"]+"\s*\]/;

if (!imgRegex.test(block) || !imagesRegex.test(block)) {
    console.log('Could not find img or images base64 strings to replace');
    process.exit(1);
}

block = block.replace(imgRegex, '"img": "https://i.postimg.cc/CKjbR39m/2.png"');
block = block.replace(imagesRegex, '"images": [\n      "https://i.postimg.cc/CKjbR39m/2.png"\n    ]');

content = content.substring(0, blockStart) + block + content.substring(blockEnd);
fs.writeFileSync('products.js', content, 'utf8');
console.log('Successfully replaced CeraVe images');
