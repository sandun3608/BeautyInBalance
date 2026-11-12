var getApiUrl = () => {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  return 'https://beautyinbalance.onrender.com';
};

var GLOBAL_API_URL = getApiUrl();
var BASE_URL = GLOBAL_API_URL + '/api';

window.GLOBAL_API_URL = GLOBAL_API_URL;
window.BASE_URL = BASE_URL;

console.log(`[Config v18] API Endpoint: ${BASE_URL}`);

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
        if (colors.buttonHoverColor) {
            document.documentElement.style.setProperty('--btn-theme-hover', colors.buttonHoverColor);
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
                :root { 
                    --btn-theme-color: ${colors.buttonColor} !important; 
                    --gold: ${colors.buttonColor} !important; 
                }
                .hap-card .btn-buy-animated,
                .btn-buy-animated,
                .btn-dark,
                .btn-hero,
                .hap-footer .btn-dark,
                .look-bundle-btn,
                .product-add-to-cart,
                #add-to-cart-btn,
                .buy-now-btn,
                .product-page-buy-btn,
                .lux-add-btn,
                .rec-add-btn,
                .hi-buy-btn,
                .fp-buy-it-now-btn,
                .btn-hero-light,
                .btn-place-order,
                .btn-pay-now,
                #btn-master-submit,
                .btn-checkout,
                .shop-card-btn,
                .offer-add-cart-btn,
                .offer-buy-btn {
                    background: ${colors.buttonColor} !important;
                    border-color: ${colors.buttonColor} !important;
                    color: #fff !important;
                }
            `;
        }
        
        // Hover and Active (Click) states
        const hoverColor = colors.buttonHoverColor || (colors.buttonColor ? colors.buttonColor : null);
        if (hoverColor) {
            css += `
                :root { --btn-theme-hover: ${hoverColor} !important; }
                .hap-card .btn-buy-animated:hover,
                .btn-buy-animated:hover,
                .btn-dark:hover,
                .btn-hero:hover,
                .hap-footer .btn-dark:hover,
                .btn-dark:active,
                .btn-hero:active,
                .lux-add-btn:hover,
                .rec-add-btn:hover,
                .look-bundle-btn:hover,
                .btn-place-order:hover,
                .btn-pay-now:hover,
                #btn-master-submit:hover,
                .product-add-to-cart:hover,
                .buy-now-btn:hover,
                .product-page-buy-btn:hover,
                .product-page-buy-btn:active,
                .hi-buy-btn:hover,
                .fp-buy-it-now-btn:hover,
                .btn-checkout:hover,
                .btn-hero-light:hover,
                .hap-card .btn-buy-animated:active,
                .btn-buy-animated:active,
                .lux-add-btn:active,
                .rec-add-btn:active,
                .look-bundle-btn:active,
                .btn-place-order:active,
                .btn-pay-now:active,
                #btn-master-submit:active,
                .shop-card-btn:hover,
                .shop-card-btn:active,
                .offer-add-cart-btn:hover,
                .offer-buy-btn:hover,
                .offer-add-cart-btn:active,
                .offer-buy-btn:active {
                    background: ${hoverColor} !important;
                    border-color: ${hoverColor} !important;
                    color: #fff !important;
                    opacity: 1 !important;
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
                .offer-badge,
                .shop-discount-pill,
                .p-price-tag .discount-pill,
                .td-deal-triangle::before,
                .product-badges .hap-discount-badge,
                .product-badges .fp-discount-badge,
                .product-badges .rec-discount-badge {
                    background: ${colors.badgeColor} !important;
                    background-image: none !important;
                    color: #ffffff !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
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
        fetch(BASE + '/settings/buttonHoverColor?cb=' + Date.now()).then(r => r.json()).catch(() => null),
        fetch(BASE + '/settings/badgeColor?cb=' + Date.now()).then(r => r.json()).catch(() => null)
    ]).then(([d1, d2, d3]) => {
        const colors = {
            buttonColor: (d1 && d1.value) ? d1.value : null,
            buttonHoverColor: (d2 && d2.value) ? d2.value : null,
            badgeColor: (d3 && d3.value) ? d3.value : null
        };
        if (colors.buttonColor || colors.buttonHoverColor || colors.badgeColor) {
            try { localStorage.setItem('bib_theme_colors', JSON.stringify(colors)); } catch(e) {}
            applyBibThemeColors(colors);
        }
    }).catch(() => {});
})();

// Global Flash Sale & Offers Visibility Controller
(function() {
    var FLASH_SALE_CACHE_KEY = 'bib_active_sale';
    var expiryTimer = null;
    var inflightPromise = null;

    function isAdminPage() {
        try {
            return /(?:^|\/)admin(?:\.html)?$/i.test(window.location.pathname || '');
        } catch (e) {
            return false;
        }
    }

    function isOfferHref(href) {
        if (!href) return false;
        var clean = String(href).trim();
        return /(?:^|\/)offers(?:\.html)?(?:[?#]|$)/i.test(clean);
    }

    window.isBibFlashSaleActive = function(sale) {
        if (!sale || typeof sale !== 'object') return false;
        if (sale.enabled === false) return false;
        if (!sale.endDate) return false;
        var endMs = new Date(sale.endDate).getTime();
        if (isNaN(endMs) || Date.now() > endMs) return false;
        return Array.isArray(sale.productIds) && sale.productIds.length > 0;
    };

    window.getBibCachedFlashSale = function() {
        try {
            var raw = localStorage.getItem(FLASH_SALE_CACHE_KEY);
            if (!raw) return null;
            var parsed = JSON.parse(raw);
            if (window.isBibFlashSaleActive(parsed)) return parsed;
            localStorage.removeItem(FLASH_SALE_CACHE_KEY);
        } catch (e) {}
        return null;
    };

    function scheduleExpiryCheck(sale) {
        if (expiryTimer) {
            clearTimeout(expiryTimer);
            expiryTimer = null;
        }
        if (!window.isBibFlashSaleActive(sale)) return;
        var remaining = new Date(sale.endDate).getTime() - Date.now();
        if (remaining <= 0) {
            try { localStorage.removeItem(FLASH_SALE_CACHE_KEY); } catch (e) {}
            window.syncBibOffersVisibility(null);
            return;
        }
        var delay = Math.min(remaining + 250, 2147483647);
        expiryTimer = setTimeout(function() {
            if (window.isBibFlashSaleActive(sale)) {
                scheduleExpiryCheck(sale);
            } else {
                try { localStorage.removeItem(FLASH_SALE_CACHE_KEY); } catch (e) {}
                window.syncBibOffersVisibility(null);
            }
        }, delay);
    }

    function applyOfferDomState(isActive) {
        if (!document.body) return;
        var items = document.querySelectorAll('.nav-offer-item');
        items.forEach(function(el) {
            el.style.display = isActive ? '' : 'none';
        });

        var anchors = document.querySelectorAll('.nav-main a, .m-sidebar-list a, .footer-col a');
        anchors.forEach(function(a) {
            if (!isOfferHref(a.getAttribute('href'))) return;
            var host = a.closest('li') || a;
            host.style.display = isActive ? '' : 'none';
        });

        if (!isActive) {
            var sticky = document.getElementById('sticky-timer-widget');
            if (sticky) sticky.style.display = 'none';
            var modal = document.getElementById('flash-sale-modal-overlay');
            if (modal) modal.style.display = 'none';
        }

        var ctaBtn = document.getElementById('td-cta-btn');
        if (ctaBtn) {
            if (!ctaBtn.dataset.origHref) {
                var currentHref = ctaBtn.getAttribute('href') || '';
                ctaBtn.dataset.origHref = currentHref || 'offers.html';
            }
            if (isActive) {
                ctaBtn.setAttribute('href', ctaBtn.dataset.origHref);
            } else if (isOfferHref(ctaBtn.dataset.origHref) || isOfferHref(ctaBtn.getAttribute('href'))) {
                ctaBtn.setAttribute('href', 'shop.html');
            }
        }
    }

    window.syncBibOffersVisibility = function(sale) {
        var isActive = window.isBibFlashSaleActive(sale);
        window.activeFlashSale = isActive ? sale : null;

        if (isAdminPage()) {
            return isActive;
        }

        document.documentElement.classList.toggle('bib-offers-active', isActive);
        scheduleExpiryCheck(isActive ? sale : null);
        applyOfferDomState(isActive);

        try {
            window.dispatchEvent(new CustomEvent('bib:flash-sale-updated', {
                detail: { active: isActive, sale: isActive ? sale : null }
            }));
        } catch (e) {}

        return isActive;
    };

    window.fetchBibFlashSale = function(forceRefresh) {
        if (inflightPromise && !forceRefresh) {
            return inflightPromise;
        }

        var req = (async function() {
            try {
                var res = await fetch(BASE_URL + '/settings/flash_sale?t=' + Date.now(), { cache: 'no-store' });
                if (res.ok) {
                    var data = await res.json();
                    var rawSale = (data && data.value) ? data.value : null;
                    if (window.isBibFlashSaleActive(rawSale)) {
                        try { localStorage.setItem(FLASH_SALE_CACHE_KEY, JSON.stringify(rawSale)); } catch (e) {}
                        window.syncBibOffersVisibility(rawSale);
                        return { ok: true, active: true, sale: rawSale, rawSale: rawSale };
                    }
                    try { localStorage.removeItem(FLASH_SALE_CACHE_KEY); } catch (e) {}
                    window.syncBibOffersVisibility(null);
                    return { ok: true, active: false, sale: null, rawSale: rawSale };
                }
            } catch (e) {}

            var cached = window.getBibCachedFlashSale();
            window.syncBibOffersVisibility(cached);
            return { ok: false, active: !!cached, sale: cached, rawSale: null };
        })();

        inflightPromise = req;
        req.finally(function() {
            if (inflightPromise === req) inflightPromise = null;
        });
        return req;
    };

    if (!isAdminPage()) {
        var initialCached = window.getBibCachedFlashSale();
        window.syncBibOffersVisibility(initialCached);
        document.addEventListener('DOMContentLoaded', function() {
            window.syncBibOffersVisibility(window.activeFlashSale || window.getBibCachedFlashSale());
        });
        window.fetchBibFlashSale(false);
    }
})();
