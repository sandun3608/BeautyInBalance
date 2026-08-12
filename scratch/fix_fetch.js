const fs = require('fs');
let lines = fs.readFileSync('products.js', 'utf8').split('\n');

console.log('Line 1654:', lines[1653]);
console.log('Line 1690:', lines[1689]);

const newCode = `            // Re-map the variable names slightly if they differ between DB and Frontend
            const mappedDbProducts = dbProducts.map(p => {
                const formatImg = (str) => {
                    if (!str) return 'images/placeholder.png';
                    if (str.startsWith('data:image') || str.startsWith('http')) return str;
                    try {
                        str = decodeURIComponent(str);
                    } catch (e) {}
                    let path = str.replace(/%25/g, '%').replace(/%2B/g, '+');
                    return path.split('/').map(part => encodeURIComponent(part)).join('/');
                };

                const mainImg = p.img || (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null);

                return {
                    ...p,
                    id: p.id || p._id,
                    img: formatImg(mainImg),
                    images: Array.isArray(p.images) && p.images.length > 0 ? p.images.map(img => formatImg(img)) : [formatImg(mainImg)]
                };
            });

            // MERGE: Keep default products, but override them if DB has updated versions, and add NEW ones from DB
            const updatedProductsData = [...defaultProducts];
            mappedDbProducts.forEach(dbProd => {
                if ((dbProd.id === 'cer-hydrating-oil' || dbProd.id === 'cer-psoriasis') && dbProd.filter === 'cleansers') {
                    dbProd.filter = 'body';
                }

                const index = updatedProductsData.findIndex(p => (p.id && (p.id === dbProd.id)) || p.name === dbProd.name);
                if (index !== -1) {
                    if ((!dbProd.img || dbProd.img === 'images/placeholder.png') && updatedProductsData[index].img && updatedProductsData[index].img.startsWith('data:image')) {
                        dbProd.img = updatedProductsData[index].img;
                    }
                    if ((!dbProd.images || !dbProd.images[0] || dbProd.images[0] === 'images/placeholder.png') && updatedProductsData[index].images && updatedProductsData[index].images[0] && updatedProductsData[index].images[0].startsWith('data:image')) {
                        dbProd.images = updatedProductsData[index].images;
                    }
                    updatedProductsData[index] = dbProd;
                } else {
                    updatedProductsData.unshift(dbProd);
                }
            });`.split('\n');

// Replace lines 1653 to 1688 (0-indexed)
lines.splice(1653, 36, ...newCode);

fs.writeFileSync('products.js', lines.join('\n'));
console.log('Successfully updated lines 1654-1689 in products.js!');
