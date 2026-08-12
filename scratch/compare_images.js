const fs = require('fs');
const defaults = require('./test_defaults.js');

fetch('https://beautyinbalance.onrender.com/api/products')
  .then(res => res.json())
  .then(dbProds => {
     dbProds.forEach(dbP => {
        const def = defaults.find(d => d.id === dbP.id || d.name === dbP.name);
        if (def && def.img !== dbP.img) {
            console.log(`MISMATCH [${dbP.id}]:`);
            console.log(`   default: ${def.img}`);
            console.log(`   db     : ${dbP.img}`);
        }
     });
  });
