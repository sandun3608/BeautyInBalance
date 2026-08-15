const fs = require('fs');
let content = fs.readFileSync('products.js', 'utf8');

// The file contains objects with "img": "data:image/..." and "hoverImg": "data:image/..."
// We want to replace these with "img": "", "hoverImg": "" or remove them.
// A regex to match "img": "data:image... " taking into account they might span lines is tricky if they are just strings, but they are base64 strings without newlines inside the string usually.

// Let's use a robust regex to replace "img": "data:..." and "hoverImg": "data:..."
let newContent = content.replace(/"img"\s*:\s*"data:image[^"]+"/g, '"img": ""');
newContent = newContent.replace(/"hoverImg"\s*:\s*"data:image[^"]+"/g, '"hoverImg": ""');

fs.writeFileSync('products.js', newContent, 'utf8');
console.log('Original length:', content.length);
console.log('New length:', newContent.length);
