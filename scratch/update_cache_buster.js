const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const files = fs.readdirSync(rootDir);
files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(rootDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('products.js')) {
            const updated = content.replace(/products\.js(\?v=\d+)?/g, 'products.js?v=300');
            if (updated !== content) {
                fs.writeFileSync(filePath, updated, 'utf8');
                console.log(`Updated cache buster in ${file}`);
            }
        }
    }
});
