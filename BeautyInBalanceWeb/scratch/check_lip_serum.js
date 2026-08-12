const fs = require('fs');

fetch('https://beautyinbalance.onrender.com/api/products/ord-pha-lip-serum-15')
  .then(res => res.json())
  .then(p => {
    console.log('MongoDB ord-pha-lip-serum-15 data:');
    console.log('  img:', p.img ? p.img.substring(0, 40) : 'null');
    console.log('  images:', p.images ? p.images.map(i => i.substring(0, 30)) : []);
  });
