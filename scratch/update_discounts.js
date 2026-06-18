const fs = require('fs');
const path = require('path');

async function run() {
    try {
        // 1. Update extracted_products.js
        console.log('Updating extracted_products.js...');
        const extractedProductsPath = path.join(__dirname, '../extracted_products.js');
        if (fs.existsSync(extractedProductsPath)) {
            const products = require(extractedProductsPath);
            const updated = products.map(p => ({ ...p, discount: 12 }));
            const code = `const defaultProducts = ${JSON.stringify(updated, null, 2)};\n\nmodule.exports = defaultProducts;\n`;
            fs.writeFileSync(extractedProductsPath, code, 'utf8');
            console.log('Successfully updated extracted_products.js');
        }

        // 2. Update ALL_PRODUCTS_RECOVERY.js
        console.log('Updating ALL_PRODUCTS_RECOVERY.js...');
        const recoveryProductsPath = path.join(__dirname, '../ALL_PRODUCTS_RECOVERY.js');
        if (fs.existsSync(recoveryProductsPath)) {
            delete require.cache[require.resolve(recoveryProductsPath)];
            const products = require(recoveryProductsPath);
            const updated = products.map(p => ({ ...p, discount: 12 }));
            const code = `const defaultProducts = ${JSON.stringify(updated, null, 2)};\n\nmodule.exports = defaultProducts;\n`;
            fs.writeFileSync(recoveryProductsPath, code, 'utf8');
            console.log('Successfully updated ALL_PRODUCTS_RECOVERY.js');
        }

        console.log('File updates finished successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error running updates:', error);
        process.exit(1);
    }
}

run();
