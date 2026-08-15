const fs = require('fs');
const cssContent = `
/* ===== NEW MOBILE SIDEBAR ===== */
.mobile-drawer {
    /* Keep existing overlay/drawer styles like position: fixed */
    background: #fff;
    display: flex;
    flex-direction: column;
}
.m-sidebar-header {
    padding: 15px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
}
.m-search-wrap {
    display: flex;
    align-items: center;
    background: #f7f7f7;
    border-radius: 4px;
    padding: 8px 12px;
}
.m-search-wrap input {
    border: none;
    background: transparent;
    flex: 1;
    font-size: 14px;
    outline: none;
    color: #333;
}
.m-search-wrap button {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
}
.m-search-wrap svg {
    width: 20px;
    height: 20px;
}
.m-sidebar-tabs {
    display: flex;
    border-bottom: 1px solid #ddd;
    background: #f5f5f5;
}
.m-tab {
    flex: 1;
    text-align: center;
    padding: 15px 0;
    background: transparent;
    border: none;
    font-size: 13px;
    font-weight: 500;
    color: #888;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    letter-spacing: 0.05em;
}
.m-tab.active {
    color: #000;
    border-bottom: 2px solid #2e71d3;
    background: #fff;
}
.m-sidebar-body {
    flex: 1;
    overflow-y: auto;
}
.m-sidebar-list {
    list-style: none;
    padding: 0;
    margin: 0;
}
.m-sidebar-list li {
    border-bottom: 1px solid #f0f0f0;
}
.m-sidebar-list a {
    display: block;
    padding: 16px 20px;
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    color: #333;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}
.m-sidebar-list a.blue-text {
    color: #2e71d3 !important;
}
`;

fs.appendFileSync('styles.css', cssContent, 'utf8');

const jsContent = `
// Mobile Sidebar Tab Logic
function switchMobileTab(tab) {
    const menuTab = document.getElementById('m-tab-menu');
    const catTab = document.getElementById('m-tab-categories');
    const btnMenu = document.getElementById('m-tab-btn-menu');
    const btnCat = document.getElementById('m-tab-btn-categories');
    
    if (tab === 'menu') {
        menuTab.style.display = 'block';
        catTab.style.display = 'none';
        btnMenu.classList.add('active');
        btnCat.classList.remove('active');
    } else {
        menuTab.style.display = 'none';
        catTab.style.display = 'block';
        btnMenu.classList.remove('active');
        btnCat.classList.add('active');
    }
}

function submitMobileSearch() {
    const q = document.getElementById('m-sidebar-search-input').value;
    if (q) {
        window.location.href = 'shop.html?search=' + encodeURIComponent(q);
    }
}
`;

fs.appendFileSync('config.js', jsContent, 'utf8');

console.log('Appended CSS and JS');
