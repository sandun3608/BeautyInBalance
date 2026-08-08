const fs = require('fs');

fetch('https://beautyinbalance.onrender.com/api/products/tho-sulf-pow')
  .then(res => res.json())
  .then(p => {
     console.log('tho-sulf-pow in DB:');
     console.log('  id:', p.id || p._id);
     console.log('  name:', p.name);
     console.log('  img startsWith:', p.img ? p.img.substring(0, 30) : 'null');
     console.log('  images count:', Array.isArray(p.images) ? p.images.length : 0);
     if (Array.isArray(p.images)) {
         p.images.forEach((img, i) => console.log(`    images[${i}] startsWith:`, img.substring(0, 30)));
     }
  });
