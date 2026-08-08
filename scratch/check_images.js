const fs = require('fs');
const content = fs.readFileSync('products.js', 'utf-8');

// Extract defaultProducts array text
const match = content.match(/const defaultProducts = \[([\s\S]*?)\];/);
if (match) {
    const evalStr = 'const defaultProducts = [' + match[1] + ']; module.exports = defaultProducts;';
    fs.writeFileSync('scratch/test_defaults.js', evalStr);
    const defaults = require('./test_defaults.js');
    console.log('Total default products:', defaults.length);
    defaults.forEach(p => {
        if (!p.img || p.img.includes('placeholder')) {
            console.log('Missing/Placeholder img:', p.id, p.name);
        }
        if (p.id === 'cer-am-spf30') {
            console.log('cer-am-spf30 img:', p.img);
        }
    });
}
