const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf-8');

// Add link input to modal
const inputHtml = `
                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px;">Order / Priority</label>
                    <input type="number" id="brand-order" value="0" style="width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 10px; box-sizing: border-box;">
                </div>`;
const newInputHtml = inputHtml + `
                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px;">Brand Link (Optional)</label>
                    <input type="text" id="brand-link" placeholder="e.g. shop.html?brand=cerave" style="width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 10px; box-sizing: border-box;">
                </div>`;
html = html.replace(inputHtml, newInputHtml);

// Update saveBrand JS
const saveJs = `const order = document.getElementById('brand-order').value;`;
const newSaveJs = saveJs + `\n            const link = document.getElementById('brand-link').value;`;
html = html.replace(saveJs, newSaveJs);

const bodyJs = `const body = { name, order: Number(order) };`;
const newBodyJs = `const body = { name, order: Number(order), link };`;
html = html.replace(bodyJs, newBodyJs);

// Update editBrand JS
const editJs = `document.getElementById('brand-order').value = b.order || 0;`;
const newEditJs = editJs + `\n                document.getElementById('brand-link').value = b.link || '';`;
html = html.replace(editJs, newEditJs);

// Ensure modal reset on "Add New Brand" clears the link too
const addBtnJs = `document.getElementById('brand-id').value='';`;
const newAddBtnJs = addBtnJs + ` document.getElementById('brand-link').value=''; document.getElementById('brand-name').value=''; document.getElementById('brand-order').value='0';`;
html = html.replace(addBtnJs, newAddBtnJs);

fs.writeFileSync('admin.html', html);
console.log('admin.html updated successfully with link fields.');
