const fs = require('fs');
let content = fs.readFileSync('products.js', 'utf8');

// Replace any string starting with data:image with an empty string
// Handles double quotes
let newContent = content.replace(/"data:image[^"]+"/g, '""');
// Handles single quotes
newContent = newContent.replace(/'data:image[^']+'/g, "''");

fs.writeFileSync('products.js', newContent, 'utf8');
console.log('Final length:', newContent.length);
