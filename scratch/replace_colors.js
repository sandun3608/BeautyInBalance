const fs = require('fs');
const path = require('path');

const repoDir = 'c:\\Users\\etsy dream\\Desktop\\hg (1)\\hg (1)\\hg';
const files = fs.readdirSync(repoDir).filter(f => f.endsWith('.html') || f.endsWith('.css') || f.endsWith('.js'));

const replacements = [
    { from: /#8B0000/gi, to: '#E75328' },
    { from: /#7A0000/gi, to: '#C63D17' },
    { from: /#590000/gi, to: '#B2300B' },
    { from: /rgba\(139,\s*0,\s*0,/gi, to: 'rgba(231, 83, 40,' }
];

let totalChanges = 0;
files.forEach(file => {
    const filePath = path.join(repoDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    replacements.forEach(r => {
        if (r.from.test(content)) {
            content = content.replace(r.from, r.to);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Restored banner color in: ${file}`);
        totalChanges++;
    }
});

console.log(`Done. Updated ${totalChanges} files.`);
