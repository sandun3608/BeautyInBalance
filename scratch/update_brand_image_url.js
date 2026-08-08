const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf-8');

// 1. Add URL input field to HTML
const htmlTarget = `<label style="display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px;">Brand Image</label>
                      <div id="brand-img-preview"`;
const htmlReplacement = `<label style="display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px;">Brand Image (File OR Link)</label>
                      <input type="text" id="brand-image-url" placeholder="Paste image link here (e.g. from postimg.cc)" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 13px; margin-bottom: 10px; box-sizing: border-box;">
                      <div id="brand-img-preview"`;
html = html.replace(htmlTarget, htmlReplacement);

// 2. Modify reset logic in "Add New Brand" button
const btnTarget = `document.getElementById('brand-order').value='0';"`;
const btnReplacement = `document.getElementById('brand-order').value='0'; document.getElementById('brand-image-url').value=''; document.getElementById('brand-img-preview').innerHTML='<span style=\\'color: #999; font-size: 12px;\\'>No Image</span>';"`;
html = html.replace(btnTarget, btnReplacement);

// 3. Update saveBrand() JS
const jsTarget = `const link = document.getElementById('brand-link').value;
              
              if (!name) return alert('Brand Name is required');
              if (!id && !brandBase64) return alert('Brand Image is required for new brands');
  
              btn.disabled = true;
              btn.innerText = 'Saving...';
  
              try {
                  const token = localStorage.getItem('userToken');
                  const url = (window.BASE_URL || '') + (id ? '/brands/' + id : '/brands');
                  const method = id ? 'PUT' : 'POST';
                  
                  const body = { name, order: Number(order), link };
                  if (brandBase64) body.imageUrl = brandBase64;`;

const jsReplacement = `const link = document.getElementById('brand-link').value;
              const imgUrlInput = document.getElementById('brand-image-url').value.trim();
              
              if (!name) return alert('Brand Name is required');
              if (!id && !brandBase64 && !imgUrlInput) return alert('Brand Image or URL is required for new brands');
  
              btn.disabled = true;
              btn.innerText = 'Saving...';
  
              try {
                  const token = localStorage.getItem('userToken');
                  const url = (window.BASE_URL || '') + (id ? '/brands/' + id : '/brands');
                  const method = id ? 'PUT' : 'POST';
                  
                  const body = { name, order: Number(order), link };
                  if (brandBase64) body.imageUrl = brandBase64;
                  else if (imgUrlInput) body.imageUrl = imgUrlInput;`;

html = html.replace(jsTarget, jsReplacement);

// 4. Populate image URL input when editing
const editTarget = `document.getElementById('brand-name').value = b.name;
          document.getElementById('brand-order').value = b.order;
          document.getElementById('brand-link').value = b.link || '';`;

const editReplacement = `document.getElementById('brand-name').value = b.name;
          document.getElementById('brand-order').value = b.order;
          document.getElementById('brand-link').value = b.link || '';
          document.getElementById('brand-image-url').value = (b.imageUrl && b.imageUrl.startsWith('http')) ? b.imageUrl : '';`;

html = html.replace(editTarget, editReplacement);

// Add event listener to image URL field to update preview
const previewUpdateTarget = `reader.readAsDataURL(file);
          });`;

const previewUpdateReplacement = `reader.readAsDataURL(file);
          });
          
          document.getElementById('brand-image-url').addEventListener('input', function(e) {
              const url = e.target.value.trim();
              if (url) {
                  document.getElementById('brand-img-preview').innerHTML = \`<img src="\${url}" style="max-width: 100%; max-height: 100%;">\`;
              } else {
                  if (!brandBase64) document.getElementById('brand-img-preview').innerHTML = \`<span style="color: #999; font-size: 12px;">No Image</span>\`;
              }
          });`;

html = html.replace(previewUpdateTarget, previewUpdateReplacement);

fs.writeFileSync('admin.html', html);
console.log('Updated admin.html to support Brand Image URLs');
