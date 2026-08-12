const fs = require('fs');
let lines = fs.readFileSync('products.js', 'utf8').split('\n');

console.log('Line 2056:', lines[2055]);

const replacement = [
    '        const categories = [...new Set(window.productsData.map(p => p.cat).filter(c => c))];',
    '        ',
    '        const priorityOrder = [\'ordinary\', \'cerave\', \'vaseline\'];',
    '        categories.sort((a, b) => {',
    '            const indexA = priorityOrder.indexOf(a.toLowerCase());',
    '            const indexB = priorityOrder.indexOf(b.toLowerCase());',
    '            if (indexA !== -1 && indexB !== -1) return indexA - indexB;',
    '            if (indexA !== -1) return -1;',
    '            if (indexB !== -1) return 1;',
    '            return a.localeCompare(b);',
    '        });',
    '        let tabsHtml = \'<button class="hap-tab active" data-filter="all">ALL</button>\';'
];

lines.splice(2055, 2, ...replacement);
fs.writeFileSync('products.js', lines.join('\n'));
console.log('Successfully updated category tabs sorting in products.js!');
