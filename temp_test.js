
    document.addEventListener('DOMContentLoaded', async () => {
      // Setup mobile drawer & cart triggers
      const hamOpen = document.getElementById('ham-open');
      const mobileDrawer = document.getElementById('mobile-drawer');
      const cartOpen = document.getElementById('cart-open');
      const cartClose = document.getElementById('cart-close');
      const cartDrawer = document.getElementById('cart-drawer');
      const overlay = document.getElementById('overlay');

      const closeAllDrawers = () => {
        if (mobileDrawer) mobileDrawer.classList.remove('open');
        if (cartDrawer) cartDrawer.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
      };

      if (hamOpen) hamOpen.addEventListener('click', () => {
        if (mobileDrawer) mobileDrawer.classList.add('open');
        if (overlay) overlay.classList.add('show');
      });

      if (cartOpen) cartOpen.addEventListener('click', () => {
        if (cartDrawer) cartDrawer.classList.add('open');
        if (overlay) overlay.classList.add('show');
      });

      if (cartClose) cartClose.addEventListener('click', closeAllDrawers);
      if (overlay) overlay.addEventListener('click', closeAllDrawers);

      window.addEventListener('scroll', () => {
        const header = document.getElementById('site-header');
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
      });

      // API and Products Logic
      const getApiBaseUrl = () => (window.BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://beautyinbalance.onrender.com/api'));

      let countdownInterval = null;

      function renderDigits(elementId, value) {
        const el = document.getElementById(elementId);
        if (!el) return;
        const str = String(value).padStart(2, '0');
        const d1 = str.charAt(0);
        const d2 = str.charAt(1);
        el.innerHTML = `<div class="countdown-card-digit">${d1}</div><div class="countdown-card-digit">${d2}</div>`;
      }

      function updateCountdown(endDateStr) {
        let end = new Date(endDateStr).getTime();
        const now = new Date().getTime();
        let diff = end - now;

        const widget = document.getElementById('sticky-timer-widget');

        if (isNaN(end) || diff <= 0) {
          end = now + (24 * 60 * 60 * 1000);
          diff = end - now;
        }

        if (widget) { widget.style.display = 'none'; widget.classList.remove('active'); }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        renderDigits('off-days', days);
        renderDigits('off-hours', hours);
        renderDigits('off-mins', mins);
        renderDigits('off-secs', secs);

        const setTxt = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.textContent = String(val).padStart(2, '0');
        };
        setTxt('stk-days', days);
        setTxt('stk-hours', hours);
        setTxt('stk-mins', mins);
        setTxt('stk-secs', secs);
      }

      function getInstantProducts() {
        if (window.productsData && Array.isArray(window.productsData) && window.productsData.length > 0) {
          return window.productsData;
        }
        if (typeof defaultProducts !== 'undefined' && Array.isArray(defaultProducts) && defaultProducts.length > 0) {
          return defaultProducts;
        }
        try {
          const cached = localStorage.getItem('koko_products_cache');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
          }
        } catch(e) {}
        return [];
      }

      let allProducts = getInstantProducts();
      let activeSale = null;

      try {
        const cachedSale = localStorage.getItem('bib_active_sale');
        if (cachedSale) {
          const parsed = JSON.parse(cachedSale);
          if (parsed && parsed.enabled !== false) activeSale = parsed;
        }
      } catch (e) {}

      function renderOffersUI() {
        let defaultDiscount = 20;
        let displayProducts = [];
        let offerProductIds = new Set();
        let hasFlashSaleSelected = false;

        if (activeSale && activeSale.enabled !== false) {
          if (activeSale.title) {
            const titleEl = document.getElementById('offers-page-title');
            if (titleEl) titleEl.textContent = activeSale.title;
          }
          if (activeSale.subtitle) {
            const subEl = document.getElementById('offers-page-subtitle');
            if (subEl) subEl.textContent = activeSale.subtitle;
          }
          defaultDiscount = activeSale.discountPercent || 20;

          let endDate = activeSale.endDate;
          if (!endDate || new Date(endDate).getTime() <= Date.now()) {
            endDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
          }

          if (countdownInterval) clearInterval(countdownInterval);
          updateCountdown(endDate);
          countdownInterval = setInterval(() => updateCountdown(endDate), 1000);

          (activeSale.productIds || []).forEach(id => {
            if (id) offerProductIds.add(String(id).trim().toLowerCase());
          });
          if (offerProductIds.size > 0) hasFlashSaleSelected = true;
        } else {
          const defaultEnd = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
          if (countdownInterval) clearInterval(countdownInterval);
          updateCountdown(defaultEnd);
          countdownInterval = setInterval(() => updateCountdown(defaultEnd), 1000);
        }

        if (allProducts && allProducts.length > 0) {
          displayProducts = allProducts.filter(p => {
            const p1 = String(p._id || '').trim().toLowerCase();
            const p2 = String(p.id || '').trim().toLowerCase();
            const p3 = String(p.name || '').trim().toLowerCase();
            
            const isSelectedInFlashSale = (p1 && offerProductIds.has(p1)) || (p2 && offerProductIds.has(p2)) || (p3 && offerProductIds.has(p3));
            const hasIndividualDiscount = (Number(p.discount || 0) > 0) || Boolean(p.isOffer) || Boolean(p.offer) || Boolean(p.onSale);

            return isSelectedInFlashSale || hasIndividualDiscount;
          });
        }

        // Fallback: If no flash sale selection and no individual discounted products found, show top products
        if (!hasFlashSaleSelected && displayProducts.length === 0 && allProducts && allProducts.length > 0) {
          displayProducts = allProducts.slice(0, 16);
        }

        const countEl = document.getElementById('offers-count');
        if (countEl) countEl.textContent = displayProducts.length;

        const grid = document.getElementById('offers-grid');
        if (grid) {
          if (displayProducts.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #888;"><h3>No offer products currently available.</h3></div>`;
          } else {
            grid.innerHTML = displayProducts.map(p => {
              const pid = String(p._id || p.id || '');
              const prodDiscount = Number(p.discount || 0) > 0 ? Number(p.discount) : defaultDiscount;
              const origPrice = Number(p.price || 0);
              const salePrice = Math.round(origPrice * (1 - prodDiscount / 100));
              const imgUrl = p.img || (p.images && p.images.length > 0 ? p.images[0] : (p.image || p.imageUrl || 'favicon.png'));
              const title = p.name || p.title || 'Untitled Product';
              const brand = p.cat || p.brand || p.category || 'Beauty in Balance';
              const savings = origPrice - salePrice;

              return `
                <div class="offer-card">
                  <div class="offer-badge">⚡ ${prodDiscount}% OFF</div>
                  <div class="offer-card-img" onclick="window.location.href='product.html?id=${pid}'">
                    <img src="${imgUrl}" alt="${title}" onerror="this.onerror=null; this.src='favicon.png';">
                  </div>
                  <div class="offer-card-body">
                    <div class="offer-card-brand">${brand}</div>
                    <div class="offer-card-title" onclick="window.location.href='product.html?id=${pid}'">${title}</div>
                    <div class="offer-price-row">
                      <span class="offer-sale-price">Rs. ${salePrice.toLocaleString()}</span>
                      <span class="offer-old-price">Rs. ${origPrice.toLocaleString()}</span>
                      ${savings > 0 ? `<span class="offer-save-badge">Save Rs. ${savings.toLocaleString()}</span>` : ''}
                    </div>
                    <div class="offer-actions-row">
                      <button class="offer-add-btn" onclick="event.stopPropagation(); addToCartOffer('${pid}', ${prodDiscount})">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        Add to Bag
                      </button>
                      <button class="offer-buy-btn" onclick="event.stopPropagation(); buyNowOffer('${pid}', ${prodDiscount})">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M13 10V2L4 14h7v8l9-12h-7z"/></svg>
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('');
          }
        }
      }

      // Initial render
      renderOffersUI();

      // Async fetch active sale & database products
      (async () => {
        try {
          const res = await fetch(`${getApiBaseUrl()}/settings/flash_sale?t=${Date.now()}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.value) {
              if (data.value.enabled !== false) {
                activeSale = data.value;
                try { localStorage.setItem('bib_active_sale', JSON.stringify(activeSale)); } catch(e) {}
              } else {
                activeSale = null;
                try { localStorage.removeItem('bib_active_sale'); } catch(e) {}
              }
              renderOffersUI();
            }
          }
        } catch (err) {}

        try {
          const pRes = await fetch(`${getApiBaseUrl()}/products?t=${Date.now()}`);
          if (pRes.ok) {
            const pData = await pRes.json();
            const fetched = Array.isArray(pData) ? pData : (pData.products || pData.data || []);
            if (Array.isArray(fetched) && fetched.length > 0) {
              allProducts = fetched;
              renderOffersUI();
            }
          }
        } catch (e) {}
      })();

      function addToCartOffer(id, discount = 20) {
        let pool = (allProducts && allProducts.length > 0) ? allProducts : ((window.productsData && window.productsData.length > 0) ? window.productsData : (typeof defaultProducts !== 'undefined' ? defaultProducts : []));
        const product = pool.find(p => String(p._id || p.id || '') === String(id));
        if (!product) return;

        const pId = String(product._id || product.id);
        const imgUrl = product.img || (product.images && product.images[0]) || 'favicon.png';

        let localCart = JSON.parse(localStorage.getItem('bib_cart') || '[]');
        const existing = localCart.find(item => String(item.id) === pId);

        if (existing) {
          existing.qty += 1;
          existing.discount = discount;
        } else {
          localCart.push({
            id: pId,
            name: product.name,
            price: Number(product.price || 0),
            discount: discount,
            img: imgUrl,
            qty: 1
          });
        }
        localStorage.setItem('bib_cart', JSON.stringify(localCart));

        if (typeof window.renderCart === 'function') window.renderCart();

        const cartDrawer = document.getElementById('cart-drawer');
        const overlay = document.getElementById('overlay');
        if (cartDrawer && overlay) {
          cartDrawer.classList.add('open');
          overlay.classList.add('show');
        } else {
          alert(`${product.name} added to bag!`);
        }
      }

    function buyNowOffer(id, discount = 20) {
      addToCartOffer(id, discount);
      window.location.href = 'checkout.html';
    }
  