const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

const oldJs = `html += \\\`<div class="brand-item"><img src="\\\${b.image}" alt="\\\${b.name}"></div>\\\`;`;
const newJs = `
                  if (b.link) {
                      html += \\\`<div class="brand-item"><a href="\\\${b.link}"><img src="\\\${b.image}" alt="\\\${b.name}"></a></div>\\\`;
                  } else {
                      html += \\\`<div class="brand-item"><img src="\\\${b.image}" alt="\\\${b.name}"></div>\\\`;
                  }
`;
html = html.replace(oldJs, newJs);

fs.writeFileSync('index.html', html);
console.log('index.html updated successfully with link logic.');
