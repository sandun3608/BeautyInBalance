const fs = require('fs');
let content = fs.readFileSync('products.js', 'utf8');

const idIndex = content.indexOf('"id": "Da-Moiz-Cer"');

let blockStart = idIndex;
let blockEnd = idIndex + 65000;
let block = content.substring(blockStart, blockEnd);

// Find the first base64 string (the "img" one)
const imgStart = block.indexOf('"img": "data:image/webp;base64,');
const imgEnd = block.indexOf('"', imgStart + 8); // find the closing quote
if (imgStart !== -1 && imgEnd !== -1) {
    const originalImgStr = block.substring(imgStart, imgEnd + 1);
    block = block.replace(originalImgStr, '"img": "https://i.postimg.cc/CKjbR39m/2.png"');
}

// Find the second base64 string (the "images" array one)
// Note: we can just search for "data:image/webp;base64," after imgStart
const imagesStrStart = block.indexOf('"data:image/webp;base64,');
if (imagesStrStart !== -1) {
    const imagesStrEnd = block.indexOf('"', imagesStrStart + 1);
    if (imagesStrEnd !== -1) {
        const originalImagesStr = block.substring(imagesStrStart, imagesStrEnd + 1);
        block = block.replace(originalImagesStr, '"https://i.postimg.cc/CKjbR39m/2.png"');
    }
}

content = content.substring(0, blockStart) + block + content.substring(blockEnd);
fs.writeFileSync('products.js', content, 'utf8');
console.log('Replaced perfectly');
