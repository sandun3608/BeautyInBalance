const fs = require('fs');
const path = require('path');

const repoDir = 'c:\\Users\\etsy dream\\Desktop\\hg (1)\\hg (1)\\hg';
const files = fs.readdirSync(repoDir).filter(f => f.endsWith('.html') || f.endsWith('.css') || f.endsWith('.js'));

const replacements = [
    { from: /#E75328/gi, to: '#8B0000' },
    { from: /#C63D17/gi, to: '#7A0000' },
    { from: /#B2300B/gi, to: '#590000' },
    { from: /rgba\(231,\s*83,\s*40,/gi, to: 'rgba(139, 0, 0,' }
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
        console.log(`Updated: ${file}`);
        totalChanges++;
    }
});

console.log(`Done. Updated ${totalChanges} files.`);
