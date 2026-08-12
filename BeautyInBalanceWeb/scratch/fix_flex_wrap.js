const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf-8');

const target = `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
              <div>
                  <h1 style="font-size: 32px; font-weight: 800; margin: 0; color: var(--admin-text); letter-spacing: -0.02em;">Brand Logos</h1>`;

const replacement = `<div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 40px;">
              <div>
                  <h1 style="font-size: 32px; font-weight: 800; margin: 0; color: var(--admin-text); letter-spacing: -0.02em;">Brand Logos</h1>`;

html = html.replace(target, replacement);
fs.writeFileSync('admin.html', html);
