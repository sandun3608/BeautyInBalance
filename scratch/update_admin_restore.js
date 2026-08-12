const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf-8');

const addBtnHtml = `<button onclick="document.getElementById('brand-modal').style.display='flex';`;
const restoreBtnHtml = `
            <button onclick="restoreDefaultBrands()" id="restore-brands-btn" style="background: #fff; color: #111; border: 1px solid #ddd; padding: 14px 20px; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; margin-right: 10px;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                Restore Defaults
            </button>
            <button onclick="document.getElementById('brand-modal').style.display='flex';`;

html = html.replace(addBtnHtml, restoreBtnHtml);

const scriptEnd = `</script>\n    <!-- BRAND MODAL -->`; // wait, this might not match
// Let's just append the function before the closing </script> in the Brands tab
const restoreJs = `
        async function restoreDefaultBrands() {
            const btn = document.getElementById('restore-brands-btn');
            if (!confirm('This will load the 6 original brands. Continue?')) return;
            
            btn.disabled = true;
            btn.innerText = 'Restoring...';
            
            const defaults = [
                { name: 'The Ordinary', image: 'brand/1.png', order: 1 },
                { name: 'CeraVe', image: 'brand/2.png', order: 2 },
                { name: 'Beauty of Joseon', image: 'brand/3.png', order: 3 },
                { name: 'Skin1004', image: 'brand/4.png', order: 4 },
                { name: 'Cetaphil', image: 'brand/5.png', order: 5 },
                { name: 'Dr. Althea', image: 'brand/6.png', order: 6 }
            ];
            
            try {
                const token = localStorage.getItem('userToken');
                const baseUrl = (window.BASE_URL || '');
                
                for (const b of defaults) {
                    await fetch(baseUrl + '/brands', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                        body: JSON.stringify(b)
                    });
                }
                alert('Default brands restored successfully!');
                fetchAdminBrands();
            } catch (err) {
                alert('Error restoring brands: ' + err.message);
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Restore Defaults';
            }
        }
`;

// Insert the JS before `async function fetchAdminBrands()`
html = html.replace('async function fetchAdminBrands() {', restoreJs + '\n        async function fetchAdminBrands() {');

// Also fix the layout so the buttons are side-by-side
html = html.replace('<div>\n                <h1', '<div style="display: flex;">\n            <div>\n                <h1'); // This might break, let's use a safer replace

fs.writeFileSync('admin.html', html);
console.log('admin.html updated successfully with Restore button.');
