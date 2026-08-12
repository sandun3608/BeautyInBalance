const fs = require('fs');

const adminPath = 'admin.html';
let adminHtml = fs.readFileSync(adminPath, 'utf-8');

// Insert sidebar link
if (!adminHtml.includes('id="nav-brands"')) {
    const navSubscribers = `<li style="border-bottom: 1px solid rgba(255,255,255,0.03);"><div id="nav-subscribers" class="admin-nav-link" onclick="window.switchTab('subscribers', this)">`;
    const navBrands = `<li style="border-bottom: 1px solid rgba(255,255,255,0.03);"><div id="nav-brands" class="admin-nav-link" onclick="window.switchTab('brands', this)"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20M12 2v20M5 5l14 14M19 5L5 19"/></svg> Brands</div></li>\n            `;
    adminHtml = adminHtml.replace(navSubscribers, navBrands + navSubscribers);
}

// Insert tab container
if (!adminHtml.includes('id="tab-brands"')) {
    const tabSettings = `<div id="tab-settings" class="admin-content" style="padding-bottom: 120px;">`;
    const tabBrandsHtml = `
    <!-- BRANDS TAB -->
    <div id="tab-brands" class="admin-content" style="padding-bottom: 120px; display: none;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
            <div>
                <h1 style="font-size: 32px; font-weight: 800; margin: 0; color: var(--admin-text); letter-spacing: -0.02em;">Brand Logos</h1>
                <p style="margin: 5px 0 0 0; color: #777;">Manage the scrolling brand logos on the homepage</p>
            </div>
            <button onclick="document.getElementById('brand-modal').style.display='flex'; document.getElementById('brand-id').value='';" style="background: var(--admin-sidebar-bg, #1b1b1e); color: #fff; border: none; padding: 14px 28px; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
                Add New Brand
            </button>
        </div>

        <div style="background: #fff; padding: 25px; border-radius: 20px; box-shadow: var(--shadow-sm); border: 1px solid var(--admin-border);">
            <div id="brands-list-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
                <!-- JS will inject brands here -->
            </div>
        </div>
    </div>

    <!-- BRAND MODAL -->
    <div id="brand-modal" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 1000; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
        <div style="background: #fff; width: 100%; max-width: 500px; border-radius: 25px; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.2);">
            <div style="padding: 30px; background: #fafafa; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; font-size: 20px; font-weight: 800;">Manage Brand Logo</h2>
                <button onclick="document.getElementById('brand-modal').style.display='none'" style="background: none; border: none; cursor: pointer;"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#666" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            </div>
            <div style="padding: 30px;">
                <input type="hidden" id="brand-id">
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px;">Brand Name</label>
                    <input type="text" id="brand-name" placeholder="e.g. CeraVe" style="width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 10px; box-sizing: border-box;">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px;">Order / Priority</label>
                    <input type="number" id="brand-order" value="0" style="width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 10px; box-sizing: border-box;">
                </div>

                <div style="margin-bottom: 25px;">
                    <label style="display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px;">Brand Image</label>
                    <div id="brand-img-preview" style="width: 100px; height: 100px; background: #fafafa; border: 1px dashed #ccc; border-radius: 10px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <span style="color: #999; font-size: 12px;">No Image</span>
                    </div>
                    <input type="file" id="brand-image-file" accept="image/*" style="font-size: 13px;">
                </div>

                <button onclick="saveBrand()" id="brand-save-btn" style="width: 100%; padding: 15px; background: #111; color: #fff; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; justify-content: center; align-items: center;">Save Brand</button>
            </div>
        </div>
    </div>

    <!-- BRANDS JS LOGIC -->
    <script>
        let brandBase64 = '';
        
        document.getElementById('brand-image-file').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                brandBase64 = evt.target.result;
                document.getElementById('brand-img-preview').innerHTML = \`<img src="\${brandBase64}" style="max-width: 100%; max-height: 100%;">\`;
            };
            reader.readAsDataURL(file);
        });

        async function fetchAdminBrands() {
            try {
                const token = localStorage.getItem('userToken');
                const res = await fetch((window.BASE_URL || '') + '/brands/all', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                if (!res.ok) throw new Error('Failed to fetch brands');
                const brands = await res.json();
                
                const container = document.getElementById('brands-list-container');
                container.innerHTML = brands.length === 0 ? '<p>No brands added yet.</p>' : '';
                
                brands.forEach(b => {
                    container.innerHTML += \`
                        <div style="background: #fafafa; border: 1px solid #eee; border-radius: 15px; padding: 20px; text-align: center; position: relative;">
                            <img src="\${b.image}" style="max-width: 100px; max-height: 100px; object-fit: contain; margin-bottom: 15px;">
                            <h4 style="margin: 0 0 5px 0; font-size: 15px;">\${b.name}</h4>
                            <span style="font-size: 12px; color: #888; background: #eee; padding: 2px 8px; border-radius: 20px;">Order: \${b.order}</span>
                            
                            <div style="display: flex; gap: 10px; margin-top: 15px;">
                                <button onclick="editBrand('\${b._id}')" style="flex: 1; padding: 8px; border-radius: 8px; border: 1px solid #ddd; background: #fff; cursor: pointer;">Edit</button>
                                <button onclick="deleteBrand('\${b._id}')" style="flex: 1; padding: 8px; border-radius: 8px; border: none; background: #fee2e2; color: #dc2626; cursor: pointer;">Delete</button>
                            </div>
                        </div>
                    \`;
                });
            } catch (err) {
                console.error('Error fetching brands:', err);
            }
        }

        async function saveBrand() {
            const btn = document.getElementById('brand-save-btn');
            const id = document.getElementById('brand-id').value;
            const name = document.getElementById('brand-name').value;
            const order = document.getElementById('brand-order').value;
            
            if (!name) return alert('Brand Name is required');
            if (!id && !brandBase64) return alert('Brand Image is required for new brands');

            btn.disabled = true;
            btn.innerText = 'Saving...';

            try {
                const token = localStorage.getItem('userToken');
                const url = (window.BASE_URL || '') + (id ? '/brands/' + id : '/brands');
                const method = id ? 'PUT' : 'POST';
                
                const body = { name, order: Number(order) };
                if (brandBase64) body.image = brandBase64;

                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                    body: JSON.stringify(body)
                });
                
                if (!res.ok) throw new Error('Failed to save brand');
                
                document.getElementById('brand-modal').style.display = 'none';
                fetchAdminBrands();
                
                if (typeof showAdminNotification === 'function') showAdminNotification('Brand saved!');
                
            } catch (err) {
                alert(err.message);
            } finally {
                btn.disabled = false;
                btn.innerText = 'Save Brand';
            }
        }

        async function editBrand(id) {
            try {
                const token = localStorage.getItem('userToken');
                const res = await fetch((window.BASE_URL || '') + '/brands/all', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const brands = await res.json();
                const b = brands.find(x => x._id === id);
                if (!b) return;
                
                document.getElementById('brand-id').value = b._id;
                document.getElementById('brand-name').value = b.name;
                document.getElementById('brand-order').value = b.order || 0;
                document.getElementById('brand-img-preview').innerHTML = \`<img src="\${b.image}" style="max-width: 100%; max-height: 100%;">\`;
                brandBase64 = ''; // Reset, only send if new image chosen
                document.getElementById('brand-image-file').value = '';
                
                document.getElementById('brand-modal').style.display = 'flex';
            } catch (err) { console.error(err); }
        }

        async function deleteBrand(id) {
            if (!confirm('Are you sure you want to delete this brand?')) return;
            try {
                const token = localStorage.getItem('userToken');
                const res = await fetch((window.BASE_URL || '') + '/brands/' + id, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                if (!res.ok) throw new Error('Failed to delete');
                fetchAdminBrands();
            } catch (err) { alert(err.message); }
        }

        // Add to switchTab interception
        const origSwitchTabBrand = window.switchTab;
        window.switchTab = function(tabName, el) {
            origSwitchTabBrand(tabName, el);
            if (tabName === 'brands') fetchAdminBrands();
        };
    </script>
    `;

    adminHtml = adminHtml.replace(tabSettings, tabBrandsHtml + '\n\n' + tabSettings);
}

fs.writeFileSync(adminPath, adminHtml);
console.log('admin.html updated successfully.');
