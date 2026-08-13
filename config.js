const getApiUrl = () => {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  return 'https://beautyinbalance.onrender.com';
};

const GLOBAL_API_URL = getApiUrl();
const BASE_URL = GLOBAL_API_URL + '/api';

window.GLOBAL_API_URL = GLOBAL_API_URL;
window.BASE_URL = BASE_URL;

console.log(`[Config v15] API Endpoint: ${BASE_URL} 🚀`);

// Wake up the free-tier Render backend early in the background
if (GLOBAL_API_URL.includes('onrender')) {
    fetch(GLOBAL_API_URL + '/api/products/sample', { method: 'GET', mode: 'no-cors' }).catch(() => {});
}

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
