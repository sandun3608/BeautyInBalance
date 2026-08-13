const fs = require('fs');
let content = fs.readFileSync('products.js', 'utf8');

// The file might use CRLF or LF, so we will use replace with regex for exact matching

content = content.replace(
    /if\s*\(Array\.isArray\(dbProducts\)\s*&&\s*dbProducts\.length\s*>\s*0\)\s*\{/g,
    `if (Array.isArray(dbProducts)) {`
);

content = content.replace(
    /const\s+updatedProductsData\s*=\s*\[\.\.\.defaultProducts\];[\s\S]*?mappedDbProducts\.forEach\(dbProd\s*=>\s*\{/g,
    `const updatedProductsData = mappedDbProducts.map(dbProd => {`
);

content = content.replace(
    /updatedProductsData\[index\]\s*=\s*dbProd;\s*\/\/\s*Override\s*existing\s*\}\s*else\s*\{\s*updatedProductsData\.unshift\(dbProd\);\s*\/\/\s*Add\s*as\s*new\s*at\s*the\s*top\s*\}/g,
    `}`
);

content = content.replace(
    /\}\);\s*\/\/\s*Sort\s*products\s*by\s*creation/g,
    `return dbProd;
            });

            // Sort products by creation`
);

content = content.replace(
    /console\.log\("ℹ️ No new products in database, using defaults\."\);/g,
    `console.log("ℹ️ Database returned invalid format, using defaults.");`
);

fs.writeFileSync('products.js', content, 'utf8');
console.log('Script completed.');
