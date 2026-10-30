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

console.log(`[Config v15] API Endpoint: ${BASE_URL} ðŸš€`);

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

// Dynamic Theme Colors sync with admin settings
(function() {
    function applyBibThemeColors(colors) {
        if (!colors) return;
        if (colors.buttonColor) {
            document.documentElement.style.setProperty('--btn-theme-color', colors.buttonColor);
        }
        if (colors.badgeColor) {
            document.documentElement.style.setProperty('--badge-theme-color', colors.badgeColor);
        }

        let style = document.getElementById('bib-dynamic-theme-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'bib-dynamic-theme-style';
            document.head.appendChild(style);
        }
        let css = '';
        if (colors.buttonColor) {
            css += `
                :root { --btn-theme-color: ${colors.buttonColor} !important; --gold: ${colors.buttonColor} !important; }
                .hap-card .btn-buy-animated,
                .btn-buy-animated,
                .look-bundle-btn,
                .product-add-to-cart,
                #add-to-cart-btn,
                .buy-now-btn,
                .lux-add-btn,
                .rec-add-btn,
                .hi-buy-btn,
                .fp-buy-it-now-btn,
                .btn-hero-light,
                .btn-place-order,
                .btn-pay-now,
                #btn-master-submit,
                .btn-checkout {
                    background: ${colors.buttonColor} !important;
                    border-color: ${colors.buttonColor} !important;
                    color: #fff !important;
                }
                .hap-card .btn-buy-animated:hover,
                .btn-buy-animated:hover,
                .lux-add-btn:hover,
                .rec-add-btn:hover,
                .look-bundle-btn:hover,
                .btn-place-order:hover,
                .btn-pay-now:hover,
                #btn-master-submit:hover {
                    opacity: 0.88 !important;
                    filter: brightness(0.92) !important;
                }
            `;
        }
        if (colors.badgeColor) {
            css += `
                :root { --badge-theme-color: ${colors.badgeColor} !important; }
                .hap-discount-badge,
                .fp-discount-badge,
                .rec-discount-badge,
                .discount-badge,
                .product-badges .hap-discount-badge,
                .product-badges .fp-discount-badge,
                .product-badges .rec-discount-badge {
                    background: ${colors.badgeColor} !important;
                    background-image: none !important;
                    color: #ffffff !important;
                }
            `;
        }
        style.innerHTML = css;
    }

    try {
        const cached = localStorage.getItem('bib_theme_colors');
        if (cached) {
            applyBibThemeColors(JSON.parse(cached));
        }
    } catch(e) {}

    const BASE = (typeof BASE_URL !== 'undefined') ? BASE_URL : (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://beautyinbalance.onrender.com/api');

    Promise.all([
        fetch(BASE + '/settings/buttonColor?cb=' + Date.now()).then(r => r.json()).catch(() => null),
        fetch(BASE + '/settings/badgeColor?cb=' + Date.now()).then(r => r.json()).catch(() => null)
    ]).then(([d1, d2]) => {
        const colors = {
            buttonColor: (d1 && d1.value) ? d1.value : null,
            badgeColor: (d2 && d2.value) ? d2.value : null
        };
        if (colors.buttonColor || colors.badgeColor) {
            try { localStorage.setItem('bib_theme_colors', JSON.stringify(colors)); } catch(e) {}
            applyBibThemeColors(colors);
        }
    }).catch(() => {});
})();