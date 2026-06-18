const fs = require('fs');
const path = require('path');

async function run() {
    try {
        const sourcePath = 'C:\\Users\\etsy dream\\.gemini\\antigravity\\brain\\01536d42-f9c4-4006-b1ea-50c64af365dd\\.system_generated\\steps\\270\\content.md';
        if (!fs.existsSync(sourcePath)) {
            console.error('Source file not found at:', sourcePath);
            process.exit(1);
        }

        const content = fs.readFileSync(sourcePath, 'utf8');
        
        // Find where the JSON starts. It's after the "---" line.
        const marker = '\n---\n\n';
        const index = content.indexOf(marker);
        if (index === -1) {
            console.error('Could not find the JSON marker in the content file.');
            process.exit(1);
        }

        const jsonStr = content.substring(index + marker.length).trim();
        
        // Let's validate it is a valid JSON
        console.log('Parsing JSON...');
        const products = JSON.parse(jsonStr);
        console.log(`Successfully parsed ${products.length} products!`);

        // Update extracted_products.js
        console.log('Writing to extracted_products.js...');
        const target1 = path.join(__dirname, '../extracted_products.js');
        const code1 = `const defaultProducts = ${JSON.stringify(products, null, 2)};\n\nmodule.exports = defaultProducts;\n`;
        fs.writeFileSync(target1, code1, 'utf8');
        console.log('Successfully updated extracted_products.js');

        // Update ALL_PRODUCTS_RECOVERY.js
        console.log('Writing to ALL_PRODUCTS_RECOVERY.js...');
        const target2 = path.join(__dirname, '../ALL_PRODUCTS_RECOVERY.js');
        fs.writeFileSync(target2, code1, 'utf8');
        console.log('Successfully updated ALL_PRODUCTS_RECOVERY.js');

        console.log('Backup files successfully created!');
        process.exit(0);
    } catch (err) {
        console.error('Error during backup extraction:', err);
        process.exit(1);
    }
}

run();
