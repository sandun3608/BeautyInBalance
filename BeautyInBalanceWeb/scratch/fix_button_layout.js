const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf-8');

const oldHtml = `
            <button onclick="restoreDefaultBrands()" id="restore-brands-btn" style="background: #fff; color: #111; border: 1px solid #ddd; padding: 14px 20px; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; margin-right: 10px;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                Restore Defaults
            </button>
            <button onclick="document.getElementById('brand-modal').style.display='flex'; document.getElementById('brand-id').value=''; document.getElementById('brand-link').value=''; document.getElementById('brand-name').value=''; document.getElementById('brand-order').value='0';" style="background: var(--admin-sidebar-bg, #1b1b1e); color: #fff; border: none; padding: 14px 28px; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
                Add New Brand
            </button>
`;

const newHtml = `
            <div style="display: flex; gap: 10px;">
                <button onclick="restoreDefaultBrands()" id="restore-brands-btn" style="background: #fff; color: #111; border: 1px solid #ddd; padding: 14px 20px; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    Restore Defaults
                </button>
                <button onclick="document.getElementById('brand-modal').style.display='flex'; document.getElementById('brand-id').value=''; document.getElementById('brand-link').value=''; document.getElementById('brand-name').value=''; document.getElementById('brand-order').value='0';" style="background: var(--admin-sidebar-bg, #1b1b1e); color: #fff; border: none; padding: 14px 28px; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
                    Add New Brand
                </button>
            </div>
`;
html = html.replace(oldHtml.trim(), newHtml.trim());
fs.writeFileSync('admin.html', html);
