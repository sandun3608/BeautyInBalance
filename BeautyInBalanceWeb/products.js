const defaultProducts = [];

window.productsData = typeof defaultProducts !== 'undefined' ? [...defaultProducts] : [];

// Fetch from Database
async function fetchDatabaseProducts() {
    window.fetchDatabaseProducts = fetchDatabaseProducts;
    if (window.DB_FETCH_RUNNING) return; 
    window.DB_FETCH_RUNNING = true;

    // Use current Global URL definition with a cache buster query parameter to bypass browser/CDN caching
    const API_URL = `${window.BASE_URL || 'http://localhost:5000/api'}/products?cb=${Date.now()}`;

    try {
        console.log("Fetching from:", API_URL);
        
        // Add 5-second timeout to fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(API_URL, { 
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('API unreachable: ' + response.status);
        const dbProducts = await response.json();

        if (Array.isArray(dbProducts) && dbProducts.length > 0) {
            console.log(`✅ Loaded ${dbProducts.length} products from Database.`);
            
            // Re-map the variable names slightly if they differ between DB and Frontend
            const mappedDbProducts = dbProducts.map(p => {
                const formatImg = (str) => {
                    if (!str) return 'images/placeholder.png';
                    if (str.startsWith('data:image') || str.startsWith('http')) return str;
                    try {
                        str = decodeURIComponent(str);
                    } catch (e) {}
                    // Fix common encoding issues and handle spaces
                    let path = str.replace(/%25/g, '%').replace(/%2B/g, '+');
                    // Ensure spaces are URL-safe
                    return path.split('/').map(part => encodeURIComponent(part)).join('/');
                };

                return {
                    ...p,
                    id: p.id || p._id,
                    img: formatImg(p.img),
                    images: Array.isArray(p.images) ? p.images.map(img => formatImg(img)) : [formatImg(p.img)]
                };
            });

            // MERGE: Keep default products, but override them if DB has updated versions, and add NEW ones from DB
            const updatedProductsData = [...defaultProducts];
            mappedDbProducts.forEach(dbProd => {
                // HOTFIX: If the DB returns the old 'cleansers' category for these bodycare items, force them to 'body'
                if ((dbProd.id === 'cer-hydrating-oil' || dbProd.id === 'cer-psoriasis') && dbProd.filter === 'cleansers') {
                    dbProd.filter = 'body';
                }

                const index = updatedProductsData.findIndex(p => (p.id && (p.id === dbProd.id)) || p.name === dbProd.name);
                if (index !== -1) {
                    updatedProductsData[index] = dbProd; // Override existing
                } else {
                    updatedProductsData.unshift(dbProd); // Add as new at the top
                }
            });

            // Sort products by creation date descending (newest first), falling back to default order for items without a date
            updatedProductsData.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                if (dateA && dateB) return dateB - dateA;
                if (dateA) return -1;
                if (dateB) return 1;
                return 0;
            });

            window.productsData = updatedProductsData;
        } else {
            console.log("ℹ️ No new products in database, using defaults.");
        }

        // --- FINAL RENDERING (ALWAYS DO THIS) ---
        window.DB_FETCH_COMPLETED = true;
        const renderFuncs = [
            'renderInventory', 'renderRoundCategories', 'renderLatestArrivals', 'renderFeaturedProducts',
            'renderCategoryProducts', 'renderProduct', 'renderProducts', 
            'renderAvuruduSale', 'renderAvuruduBannerUI', 'updateRightSidebar', 'renderHomeAllProducts',
            'updateMobileNavCategories', 'updateDesktopNavCategories'
        ];
        
        renderFuncs.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                try { window[funcName](window.productsData); } catch(e) { console.error(`Render Error (${funcName}):`, e); }
            } else if (typeof window.opener !== 'undefined' && typeof window[funcName] === 'function') {
                 // Fallback for some older scripts
                 try { window[funcName](); } catch(e) {}
            }
        });

    } catch (error) {
        console.warn("⚠️ Using hardcoded products fallback.", error.message);
        
        window.productsData = [...defaultProducts];
        window.DB_FETCH_COMPLETED = true;
        // Trigger renders even on failure to ensure UI balance
        const renderFuncs = [
            'renderInventory', 'renderRoundCategories', 'renderLatestArrivals', 'renderFeaturedProducts',
            'renderCategoryProducts', 'renderProduct', 'renderProducts', 
            'renderAvuruduSale', 'renderAvuruduBannerUI', 'updateRightSidebar', 'renderHomeAllProducts',
            'updateMobileNavCategories', 'updateDesktopNavCategories'
        ];
        renderFuncs.forEach(fn => {
            if (typeof window[fn] === 'function') {
                try { window[fn](window.productsData); } catch(e) {}
            }
        });
    } finally {
        window.DB_FETCH_RUNNING = false;
    }
}

// Automatically fetch latest data when the page loads
fetchDatabaseProducts();

// Visitor Tracking
async function logVisit() {
    try {
        const url = (window.BASE_URL || (typeof BASE_URL !== 'undefined' ? BASE_URL : null));
        if (!url) return;
        
        fetch(url + '/stats/visit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page: window.location.pathname.split('/').pop() || 'index.html' })
        });
    } catch (e) {
        console.warn("LogVisit failed (likely offline or missing BASE_URL):", e);
    }
}
logVisit();

// --- SHOPPING CART LOGIC ---
// --- AVURUDU BANNER (FOR OTHER PAGES OR DYNAMIC INJECTION) ---
function renderAvuruduBannerUI() {
    const container = document.getElementById('avurudu-sale-container');
    if (!container) return; // Only run if the element exists

    // Filter products for the sale (example: first 4 Ordinary products with a discount > 0)
    const saleProducts = window.productsData.filter(p => (p.cat === 'ordinary' || p.cat === 'cerave') && p.discount > 0).slice(0, 4);
    
    // If no discounted products found yet, just take some from Ordinary
    const finalSale = saleProducts.length > 0 ? saleProducts : window.productsData.filter(p => p.cat === 'ordinary').slice(0, 4);

    container.innerHTML = `
    <div class="container overflow-hidden">
      <div class="avurudu-sale-card" style="background-image: url('new year/Happy Sinhala and Tamil New Year Wishes Instagram Post.png'); border-radius: 40px; overflow: hidden; padding: 60px 40px; position: relative;">
        <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.15); pointer-events:none;"></div>
        
        <div class="row align-items-center" style="position: relative; z-index: 2;">
          <div class="col-lg-5 mb-5 mb-lg-0 text-center text-lg-start">
            <span class="sale-badge" style="background:#d32f2f; color:#fff; padding: 10px 20px; border-radius: 50px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; display: inline-block; margin-bottom: 20px; box-shadow: 0 10px 20px rgba(211,47,47,0.3);">Avurudu Mega Sale</span>
            <h2 style="font-family: var(--font-fancy); font-size: clamp(3rem, 6vw, 4.5rem); color: #fff; line-height: 1.1; margin-bottom: 25px; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">Sinhala & Tamil <br> New Year Offer</h2>
            <p style="color: rgba(255,255,255,0.9); font-size: 1.1rem; margin-bottom: 35px; max-width: 450px;">Celebrate the season with festive glow! Exclusive 5% discount on all your skincare essentials. Limited time only.</p>
            
            <div class="offer-timer d-flex gap-3 mb-4 justify-content-center justify-content-lg-start">
              <div style="background:#fff; width:70px; height:70px; border-radius:15px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 15px 35px rgba(0,0,0,0.2);">
                <span style="font-size:24px; font-weight:800; color:#d32f2f; line-height:1;">12</span>
                <span style="font-size:10px; text-transform:uppercase; font-weight:700; color:#777; margin-top:2px;">Days</span>
              </div>
              <div style="background:#fff; width:70px; height:70px; border-radius:15px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 15px 35px rgba(0,0,0,0.2);">
                <span style="font-size:24px; font-weight:800; color:#d32f2f; line-height:1;">08</span>
                <span style="font-size:10px; text-transform:uppercase; font-weight:700; color:#777; margin-top:2px;">Hours</span>
              </div>
              <div style="background:#fff; width:70px; height:70px; border-radius:15px; display:flex; flex-direction:column; align-items:center; justify-content:center; box-shadow:0 15px 35px rgba(0,0,0,0.2);">
                <span style="font-size:24px; font-weight:800; color:#d32f2f; line-height:1;">45</span>
                <span style="font-size:10px; text-transform:uppercase; font-weight:700; color:#777; margin-top:2px;">Mins</span>
              </div>
            </div>
          </div>
          
          <div class="col-lg-7">
            <div class="row g-3">
              ${finalSale.map(prod => `
                <div class="col-6 col-md-3">
                  <div class="sale-prod-mini" style="background:#fff; border-radius:25px; padding:15px; text-align:center; height:100%; transition:0.4s; position:relative; box-shadow:0 15px 35px rgba(0,0,0,0.1);">
                    <div style="position:absolute; top:12px; right:12px; background:#d32f2f; color:#fff; font-size:10px; font-weight:800; padding:4px 8px; border-radius:8px; z-index:5; box-shadow: 0 5px 10px rgba(211,47,47,0.2);">5% OFF</div>
                    <div style="width:100%; height:120px; margin-bottom:15px; cursor:pointer;" onclick="location.href='product.html?id=${prod.id}'">
                      <img src="${prod.img}" style="width:100%; height:100%; object-fit:contain;">
                    </div>
                    <div style="font-size:12px; font-weight:800; color:#333; margin-bottom:8px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; line-height:1.3; height:32px;">${prod.name}</div>
                    <div style="font-size:14px; font-weight:800; color:#d32f2f; margin-bottom:12px;">Rs. ${prod.price.toLocaleString()}</div>
                    <button onclick="addToCart('${prod.id}')" style="background:var(--dark); color:#fff; border:none; width:100%; padding:10px; border-radius:12px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; cursor:pointer; transition:0.3s; margin:0;" 
                            onmouseover="this.style.background='var(--gold)', this.style.color='#000'" onmouseout="this.style.background='var(--dark)', this.style.color='#fff'">Buy Now</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
}

let shoppingCart = JSON.parse(localStorage.getItem('bib_cart')) || [];

function saveCart() {
    localStorage.setItem('bib_cart', JSON.stringify(shoppingCart));
    renderCart();
}

function addToCart(prodId, qty = 1) {
    const product = window.productsData.find(p => p.id === prodId || p.name === prodId);
    if (!product) {
       console.error("Product not found to add:", prodId);
       return;
    }
    
    const qtyInt = parseInt(qty);
    const existing = shoppingCart.find(item => item.id === product.id);
    
    if (existing) {
        existing.qty += qtyInt;
        existing.discount = product.discount || 0;
    } else {
        shoppingCart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            discount: product.discount || 0,
            img: product.img,
            qty: qtyInt
        });
    }
    
    saveCart();
    
    // Open the side drawer if on a page that supports it
    const cartDrawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('overlay');
    
    if (cartDrawer && overlay) {
        cartDrawer.classList.add('open'); // Fixed: CSS uses .open
        overlay.classList.add('show');    // Fixed: CSS uses .show
    } else {
        alert(product.name + ' added to your bag!');
    }
}

// Attach generic window access to addToCart for inline HTML onclicks 
window.addToCart = addToCart;

function removeFromCart(prodId) {
    shoppingCart = shoppingCart.filter(item => item.id !== prodId);
    saveCart();
}
window.removeFromCart = removeFromCart;

function updateCartQty(prodId, newQty) {
    const item = shoppingCart.find(i => i.id === prodId);
    if (item) {
        item.qty = parseInt(newQty);
        if (item.qty <= 0) removeFromCart(prodId);
    }
    saveCart();
}
window.updateCartQty = updateCartQty;

function getCartTotal() {
    return shoppingCart.reduce((total, item) => {
        const discount = Number(item.discount || 0);
        const discountedPrice = discount > 0 ? Math.round(item.price * (1 - discount / 100)) : item.price;
        return total + (discountedPrice * item.qty);
    }, 0);
}
window.getCartTotal = getCartTotal;

function renderCart() {
    // Update all cart badges across the nav bar
    const badges = document.querySelectorAll('.cart-badge');
    const totalItems = shoppingCart.reduce((sum, item) => sum + item.qty, 0);
    badges.forEach(b => {
        b.textContent = totalItems;
        b.classList.remove('pop');
        void b.offsetWidth; // Force reflow
        b.classList.add('pop');
    });
    
    // Render Sidebar Cart Drawer if it exists
    const cartDrawer = document.getElementById('cart-drawer');
    if (!cartDrawer) return; 

    // Force drawer to be a flex column
    cartDrawer.style.display = 'flex';
    cartDrawer.style.flexDirection = 'column';
    
    const cartHead = cartDrawer.querySelector('.cart-head h3');
    if (cartHead) cartHead.textContent = `Cart (${totalItems})`;
    
    let itemsContainer = document.getElementById('cart-items-container');
    if (!itemsContainer) {
        // Strip the placeholder empty UI
        const emptyState = cartDrawer.querySelector('.cart-empty');
        if (emptyState) emptyState.remove();
        
        itemsContainer = document.createElement('div');
        itemsContainer.id = 'cart-items-container';
        cartDrawer.insertBefore(itemsContainer, cartDrawer.children[1]);
    }
    // Always apply these styles to itemsContainer
    itemsContainer.style.padding = '20px';
    itemsContainer.style.flex = '1';
    itemsContainer.style.overflowY = 'auto';
    itemsContainer.style.overflowX = 'hidden';
    
    let footerBox = document.getElementById('cart-footer-box');
    if (!footerBox) {
        footerBox = document.createElement('div');
        footerBox.id = 'cart-footer-box';
        footerBox.style.padding = '20px';
        footerBox.style.borderTop = '1px solid #eee';
        footerBox.style.background = 'var(--beige-light)';
        footerBox.style.flexShrink = '0';
        footerBox.style.width = '100%';
        footerBox.style.boxSizing = 'border-box';
        cartDrawer.appendChild(footerBox);
    }
    
    // footerBox is already declared and initialized above
    
    if (shoppingCart.length === 0) {
        itemsContainer.innerHTML = '<div style="text-align:center; padding: 40px 0; color:#777;">Your cart is empty.</div>';
        if (footerBox) footerBox.style.display = 'none';
        return;
    }
    
    if (footerBox) footerBox.style.display = 'block';
    
    // Draw items
    itemsContainer.innerHTML = shoppingCart.map(item => {
        const discount = Number(item.discount || 0);
        const discountedPrice = discount > 0 ? Math.round(item.price * (1 - discount / 100)) : item.price;
        const qty = item.qty;
        
        let priceDisplayHTML = '';
        if (discount > 0) {
            const unitPriceHTML = `
                <div style="display:flex; align-items:center; gap:6px; font-family:var(--font-sans); white-space:nowrap; justify-content:flex-end;">
                    <span style="color:#2D1B12; font-size:12.5px; font-weight:600;">Rs. ${discountedPrice.toLocaleString()}</span>
                    <span style="text-decoration:line-through; color:#88888b; font-size:10.5px; font-weight:400;">Rs. ${item.price.toLocaleString()}</span>
                </div>
                <div style="margin-top:2px;"><span class="discount-badge" style="background:rgba(198, 151, 90, 0.1); color:#c6975a; border:1px solid rgba(198, 151, 90, 0.2); font-size:8px; font-weight:700; padding:1px 4px; border-radius:3px; display:inline-block; letter-spacing:0.2px; text-transform:uppercase;">${discount}% OFF</span></div>
            `;

            const lineTotalHTML = `<div style="font-size:13px; font-weight:700; color:#2D1B12; font-family:var(--font-sans);">Rs. ${(discountedPrice * qty).toLocaleString()}</div>`;
            
            if (qty > 1) {
                priceDisplayHTML = `
                    ${unitPriceHTML}
                    <div style="height:26px; display:flex; align-items:center; margin-top:6px;">${lineTotalHTML}</div>
                `;
            } else {
                priceDisplayHTML = unitPriceHTML;
            }
        } else {
            const lineTotalHTML = `<div style="font-size:13px; font-weight:700; color:#2D1B12; font-family:var(--font-sans);">Rs. ${(item.price * qty).toLocaleString()}</div>`;
            priceDisplayHTML = `
                <div style="height:26px; display:flex; align-items:center;">${lineTotalHTML}</div>
            `;
        }

        return `
        <div style="display:flex; gap:16px; margin-bottom:24px; align-items:flex-start; justify-content:space-between; width:100%; box-sizing:border-box;">
            <div style="display:flex; gap:14px; align-items:flex-start; flex-grow:1; min-width:0;">
                <div style="width:68px; height:68px; border-radius:10px; border:1px solid #eaeaea; background:#ffffff; padding:4px; box-sizing:border-box; flex-shrink:0; display:flex; align-items:center; justify-content:center;">
                    <img src="${item.img}" style="max-width:100%; max-height:100%; object-fit:contain;">
                </div>
                <div style="flex-grow:1; display:flex; flex-direction:column; gap:4px; min-width:0;">
                    <div style="font-size:13.5px; font-weight:600; font-family:var(--font-sans); color:#2D1B12; line-height:1.35; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; max-height:36px;">${item.name}</div>
                    <div style="display:inline-flex; align-items:center; gap:10px; background:#f5f5f7; border:1px solid #e2e2e5; padding:2px 8px; border-radius:6px; width:fit-content; height:26px; box-sizing:border-box; margin-top:2px;">
                        <button onclick="updateCartQty('${item.id}', ${item.qty - 1})" style="border:none; background:transparent; color:#555558; cursor:pointer; font-weight:700; font-size:11px; padding:0 4px; display:flex; align-items:center; justify-content:center; height:100%;">-</button>
                        <span style="font-family:var(--font-sans); font-size:11.5px; font-weight:700; color:#000000; min-width:12px; text-align:center;">${item.qty}</span>
                        <button onclick="updateCartQty('${item.id}', ${item.qty + 1})" style="border:none; background:transparent; color:#555558; cursor:pointer; font-weight:700; font-size:11px; padding:0 4px; display:flex; align-items:center; justify-content:center; height:100%;">+</button>
                    </div>
                </div>
            </div>
            <div style="text-align:right; display:flex; flex-direction:column; gap:12px; align-items:flex-end; flex-shrink:0; margin-top:2px; min-width:100px;">
                ${priceDisplayHTML}
            </div>
        </div>
        `;
    }).join('');
    
    const subtotal = getCartTotal();
    const shipping = window._shippingFee !== undefined ? window._shippingFee : 450; 
    
    let originalSubtotal = 0;
    shoppingCart.forEach(item => {
        originalSubtotal += item.price * item.qty;
    });
    const discountSaved = originalSubtotal - subtotal;
    
    let summaryDetailsHTML = '';
    if (discountSaved > 0) {
        summaryDetailsHTML = `
            <div style="background:#fdfaf7; border-radius:12px; border:1px solid rgba(198,151,90,0.15); padding:16px; margin-bottom:18px; font-family:var(--font-sans); display:flex; flex-direction:column; gap:10px;">
                <div style="display:flex; justify-content:space-between; font-size:13px; color:#555558; align-items:center;">
                    <span>Subtotal (Original)</span>
                    <span style="font-weight:500; color:#555558;">Rs. ${originalSubtotal.toLocaleString()}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:13px; color:#c6975a; font-weight:700; align-items:center;">
                    <span>Discount Saved</span>
                    <span>-Rs. ${discountSaved.toLocaleString()}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:13px; color:#555558; align-items:center;">
                    <span>Shipping</span>
                    <span>Rs. ${shipping.toLocaleString()}</span>
                </div>
                <div style="height:1px; background:rgba(198,151,90,0.15); margin:4px 0;"></div>
                <div style="display:flex; justify-content:space-between; font-size:14.5px; font-weight:700; color:#2D1B12; align-items:center;">
                    <span>Total to Pay</span>
                    <span style="font-size:16px; color:#2D1B12; font-weight:800;">Rs. ${(subtotal + shipping).toLocaleString()}</span>
                </div>
            </div>
        `;
    } else {
        summaryDetailsHTML = `
            <div style="background:#fdfaf7; border-radius:12px; border:1px solid rgba(0,0,0,0.04); padding:16px; margin-bottom:18px; font-family:var(--font-sans); display:flex; flex-direction:column; gap:10px;">
                <div style="display:flex; justify-content:space-between; font-size:13px; color:#555558; align-items:center;">
                    <span>Subtotal</span>
                    <span style="font-weight:700; color:#2D1B12;">Rs. ${subtotal.toLocaleString()}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:13px; color:#555558; align-items:center;">
                    <span>Shipping</span>
                    <span>Rs. ${shipping.toLocaleString()}</span>
                </div>
                <div style="height:1px; background:rgba(0,0,0,0.05); margin:4px 0;"></div>
                <div style="display:flex; justify-content:space-between; font-size:14.5px; font-weight:700; color:#2D1B12; align-items:center;">
                    <span>Total to Pay</span>
                    <span style="font-size:16px; color:#2D1B12; font-weight:800;">Rs. ${(subtotal + shipping).toLocaleString()}</span>
                </div>
            </div>
        `;
    }
    
    footerBox.innerHTML = `
        ${summaryDetailsHTML}
        <a href="checkout.html" style="display:block; text-align:center; background:var(--brown); color:#fff; padding:15px; border-radius:8px; text-decoration:none; font-family:var(--font-sans); font-weight:600; letter-spacing:0.05em; transition:0.3s; box-shadow:0 4px 12px rgba(45,27,18,0.15);" onmouseover="this.style.background='var(--gold)'" onmouseout="this.style.background='var(--brown)'">SECURE CHECKOUT &rarr;</a>
    `;

    // Also render on Standalone Cart Page if it exists
    const standaloneItems = document.getElementById('cart-items-list');
    const standaloneSummary = document.getElementById('summary-details');

    if (standaloneItems && standaloneSummary) {
        if (shoppingCart.length === 0) {
            standaloneItems.innerHTML = '<div style="text-align:center; padding: 100px 0;"><h3>Your bag is empty</h3><a href="shop.html" style="color:var(--gold); text-decoration:underline;">Continue Shopping</a></div>';
            standaloneSummary.innerHTML = '';
        } else {
            standaloneItems.innerHTML = shoppingCart.map(item => {
                const discount = Number(item.discount || 0);
                const discountedPrice = discount > 0 ? Math.round(item.price * (1 - discount / 100)) : item.price;
                const qty = item.qty;
                
                let priceDisplayHTML = '';
                if (discount > 0) {
                    const unitPriceHTML = `
                        <div style="display:flex; align-items:center; gap:6px; font-family:var(--font-sans); white-space:nowrap; justify-content:flex-end;">
                            <span style="color:#2D1B12; font-size:13.5px; font-weight:600;">Rs. ${discountedPrice.toLocaleString()}</span>
                            <span style="text-decoration:line-through; color:#88888b; font-size:10.5px; font-weight:400;">Rs. ${item.price.toLocaleString()}</span>
                        </div>
                        <div style="margin-top:2px;"><span class="discount-badge" style="background:rgba(198, 151, 90, 0.1); color:#c6975a; border:1px solid rgba(198, 151, 90, 0.2); font-size:8px; font-weight:700; padding:1px 4px; border-radius:3px; display:inline-block; letter-spacing:0.2px; text-transform:uppercase;">${discount}% OFF</span></div>
                    `;

                    const lineTotalHTML = `<div style="font-size:14px; font-weight:700; color:#2D1B12; font-family:var(--font-sans);">Rs. ${(discountedPrice * qty).toLocaleString()}</div>`;
                    
                    if (qty > 1) {
                        priceDisplayHTML = `
                            ${unitPriceHTML}
                            <div style="height:28px; display:flex; align-items:center; margin-top:6px;">${lineTotalHTML}</div>
                        `;
                    } else {
                        priceDisplayHTML = unitPriceHTML;
                    }
                } else {
                    const lineTotalHTML = `<div style="font-size:14px; font-weight:700; color:#2D1B12; font-family:var(--font-sans);">Rs. ${(item.price * qty).toLocaleString()}</div>`;
                    priceDisplayHTML = `
                        <div style="height:28px; display:flex; align-items:center;">${lineTotalHTML}</div>
                    `;
                }

                return `
                <div class="cart-item" style="display:flex; justify-content:space-between; align-items:flex-start; width:100%; border-bottom:1px solid #eaeaea; padding:20px 0;">
                    <div style="display:flex; gap:20px; align-items:flex-start; flex-grow:1; min-width:0;">
                        <div class="cart-item-img" style="background:#ffffff; border:1px solid #eef0f2; box-shadow:0 2px 8px rgba(0,0,0,0.04); border-radius:12px; padding:10px; width:80px; height:80px; display:flex; align-items:center; justify-content:center; flex-shrink:0;"><img src="${item.img}" style="max-width:100%; max-height:100%; object-fit:contain;"></div>
                        <div class="cart-item-info" style="display:flex; flex-direction:column; gap:6px; min-width:0;">
                            <div class="cart-item-name" style="font-weight:600; color:var(--dark); font-size:15px; font-family:var(--font-sans);">${item.name}</div>
                            <div class="cart-item-qty" style="display:inline-flex; align-items:center; gap:8px; background:#f5f5f7; border:1px solid #e2e2e5; padding:3px 8px; border-radius:6px; width:fit-content; height:28px; box-sizing:border-box; margin-top:2px;">
                                <span class="cart-item-qty-btn" onclick="updateCartQty('${item.id}', ${item.qty - 1})" style="cursor:pointer; font-weight:700; font-size:12px; color:#555558; padding:0 4px; display:flex; align-items:center; justify-content:center; height:100%;">-</span>
                                <span style="font-family:var(--font-sans); font-size:12px; font-weight:600; color:#000000; min-width:14px; text-align:center;">${item.qty}</span>
                                <span class="cart-item-qty-btn" onclick="updateCartQty('${item.id}', ${item.qty + 1})" style="cursor:pointer; font-weight:700; font-size:12px; color:#555558; padding:0 4px; display:flex; align-items:center; justify-content:center; height:100%; font-weight:700;">+</span>
                            </div>
                        </div>
                    </div>
                    <div class="price-container" style="text-align:right; display:flex; flex-direction:column; gap:12px; align-items:flex-end; flex-shrink:0; margin-top:2px; min-width:100px;">
                        ${priceDisplayHTML}
                    </div>
                </div>
                `;
            }).join('');

            const shipping = window._shippingFee !== undefined ? window._shippingFee : 450;
            
            let summaryHTML = '';
            if (discountSaved > 0) {
                summaryHTML = `
                    <div class="summary-row"><span>Subtotal (Original)</span><span style="opacity:0.8;">Rs. ${originalSubtotal.toLocaleString()}</span></div>
                    <div class="summary-row" style="color: #c6975a; font-weight: 600;"><span>Discount Saved</span><span>-Rs. ${discountSaved.toLocaleString()}</span></div>
                    <div class="summary-row"><span>Subtotal</span><span>Rs. ${subtotal.toLocaleString()}</span></div>
                    <div class="summary-row"><span>Delivery</span><span>Rs. ${shipping.toLocaleString()}</span></div>
                    <div class="summary-row total" style="font-weight:800; border-top:1px solid rgba(255,255,255,0.15); padding-top:15px; margin-top:15px;"><span>Total</span><span>Rs. ${(subtotal + shipping).toLocaleString()}</span></div>
                `;
            } else {
                summaryHTML = `
                    <div class="summary-row"><span>Subtotal</span><span>Rs. ${subtotal.toLocaleString()}</span></div>
                    <div class="summary-row"><span>Delivery</span><span>Rs. ${shipping.toLocaleString()}</span></div>
                    <div class="summary-row total" style="font-weight:800; border-top:1px solid rgba(255,255,255,0.15); padding-top:15px; margin-top:15px;"><span>Total</span><span>Rs. ${(subtotal + shipping).toLocaleString()}</span></div>
                `;
            }
            standaloneSummary.innerHTML = summaryHTML;
        }
    }
}
window.renderCart = renderCart;

// Fetch Global Settings (Shipping Fee)
async function loadGlobalSettings() {
    try {
        const BASE = window.BASE_URL || '/api';
        const res = await fetch(`${BASE}/settings/shippingFee?cb=${Date.now()}`);
        if (res.ok) {
            const data = await res.json();
            if (data.value !== undefined) {
                window._shippingFee = Number(data.value);
                console.log("Global shipping fee loaded:", window._shippingFee);
                // Re-render cart if it was already rendered with default
                if (typeof renderCart === 'function') renderCart();
            }
        }
    } catch (e) {
        console.warn("Failed to load global settings:", e);
    }
}

// Call initially for instant 0ms rendering
document.addEventListener('DOMContentLoaded', () => {
    loadGlobalSettings();
    if (typeof renderHomeAllProducts === 'function') renderHomeAllProducts();
    if (typeof renderFeaturedProducts === 'function') renderFeaturedProducts();
    setTimeout(renderCart, 200);
});

// --- HOME ALL PRODUCTS GRID ---
window.renderHomeAllProducts = function() {
    const grid = document.getElementById('hap-grid');
    if (!grid) return;

    // If no products available at all, show skeletons
    if (!window.productsData || window.productsData.length === 0) {
        grid.innerHTML = Array(8).fill(0).map(() => `
          <div class="skeleton-card">
            <div class="skeleton-element skeleton-img"></div>
            <div class="skeleton-element skeleton-brand" style="width: 50%; margin: 8px auto 0;"></div>
            <div class="skeleton-element skeleton-title" style="margin-top: 10px;"></div>
            <div class="skeleton-element skeleton-price" style="width: 40%; margin: 8px auto 0;"></div>
          </div>
        `).join('');
        return;
    }

    // Dynamically generate tabs
    const tabsWrapper = document.querySelector('.hap-tabs');
    if (tabsWrapper && window.productsData && window.productsData.length > 0) {
        let categories = [...new Set(window.productsData.map(p => (p.cat || 'others').toLowerCase()))];
        
        // Define exact custom order
        const customOrder = ['ordinary', 'cerave', 'vaseline', 'manee', 'cool-vita', 'celimax', 'centellian24', 'cosrx', 'dr. rashel', 'perfectil', 'la roche-posay'];
        
        categories.sort((a, b) => {
            const indexA = customOrder.indexOf(a);
            const indexB = customOrder.indexOf(b);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.localeCompare(b);
        });

        const activeTab = document.querySelector('.hap-tab.active');
        let currentFilter = activeTab ? activeTab.getAttribute('data-filter') : 'all';

        let tabsHTML = `<button class="hap-tab ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">ALL</button>`;
        
        categories.forEach(cat => {
            let displayName = cat === 'ordinary' ? 'The Ordinary' : (cat === 'cerave' ? 'CeraVe' : cat.toUpperCase());
            tabsHTML += `<button class="hap-tab ${currentFilter === cat ? 'active' : ''}" data-filter="${cat}">${displayName}</button>`;
        });

        tabsWrapper.innerHTML = tabsHTML;
    }

    // Get up to 12 or 28 products
    const displayProducts = (category) => {
        let filtered = [];
        if (!category || category === 'all') {
            // Group products by category and interleave (round-robin) so products come from every category
            const catGroups = {};
            const order = ['ordinary', 'cerave', 'vaseline', 'manee', 'cool-vita', 'celimax', 'centellian24', 'cosrx', 'dr. rashel', 'perfectil', 'la roche-posay'];
            
            (window.productsData || []).forEach(p => {
                const c = (p.cat || 'others').toLowerCase();
                if (!catGroups[c]) catGroups[c] = [];
                catGroups[c].push(p);
            });

            const catKeys = Object.keys(catGroups).sort((a, b) => {
                const indexA = order.indexOf(a);
                const indexB = order.indexOf(b);
                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;
                return a.localeCompare(b);
            });

            const maxItems = Math.max(...catKeys.map(k => catGroups[k].length), 0);
            for (let i = 0; i < maxItems; i++) {
                for (const k of catKeys) {
                    if (catGroups[k][i]) {
                        filtered.push(catGroups[k][i]);
                    }
                }
            }
        } else {
            filtered = (window.productsData || []).filter(p => (p.cat || 'others').toLowerCase() === category);
        }
        
        // Take up to 12 items for 'all', or up to 28 items for specific categories
        const limit = (!category || category === 'all') ? 12 : 28;
        const productsToShow = filtered.slice(0, limit);
        
        grid.innerHTML = productsToShow.map(prod => {
            const catLower = (prod.cat || 'others').toLowerCase();
            const brandDisplay = catLower === 'cerave' ? 'CeraVe' : (catLower === 'ordinary' ? 'The Ordinary' : catLower.toUpperCase());
            
            const discount = Number(prod.discount || 0);
            const discountBadge = discount > 0 ? `<span class="hap-discount-badge">${discount}% OFF</span>` : '';
            
            const basePrice = Number(prod.price || 0);
            const discountedPrice = discount > 0 ? Math.round(basePrice * (1 - discount / 100)) : basePrice;
            
            const priceHTML = discount > 0 
                ? `<span class="original-price">Rs. ${basePrice.toLocaleString()}</span> <span class="discounted-price">Rs. ${discountedPrice.toLocaleString()}</span>`
                : `Rs. ${basePrice.toLocaleString()}`;

            const kokoAmount = (basePrice / 3).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            const kokoInstallmentHTML = `
                <div class="koko-installment">
                    <span class="koko-or">or</span><span class="koko-pay-text">pay in 3 x Rs ${kokoAmount} with</span><span class="koko-logo-wrapper"><img src="koko-logo.png" alt="Koko" class="koko-logo-img"><svg onclick="event.stopPropagation(); window.open('https://paykoko.com/customer-education', '_blank')" class="koko-info-icon" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg></span>
                </div>
            `;

            return `
            <a href="product.html?id=${prod.id}" class="hap-card" style="text-decoration: none;">
                <div class="hap-card-img">
                    ${discountBadge}
                    <img src="${prod.img || 'images/placeholder.png'}" alt="${prod.name}">
                    <div class="hap-card-actions">
                        <span class="h-icon" onclick="event.preventDefault(); addToCart('${prod.id}')" aria-label="Add to Cart">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        </span>
                        <span class="h-icon" onclick="event.preventDefault(); shareProduct('${prod.id}')" aria-label="Share">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                        </span>
                    </div>
                </div>
                <div class="hap-card-brand">${brandDisplay}</div>
                <div class="hap-card-title">${prod.name}</div>
                <div class="hap-card-price">${priceHTML}</div>
                ${kokoInstallmentHTML}
            </a>
            `;
        }).join('');
    };

    // Initial render
    const activeTabNow = document.querySelector('.hap-tab.active');
    let initialFilter = activeTabNow ? activeTabNow.getAttribute('data-filter') : 'all';
    displayProducts(initialFilter);

    // Setup Tab Listeners
    const tabs = document.querySelectorAll('.hap-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            displayProducts(tab.getAttribute('data-filter'));
        });
    });
};

// ── DYNAMIC MOBILE NAVIGATION DRAWER CATEGORIES ──
window.updateMobileNavCategories = function(products) {
    if (!products || !products.length) return;
    
    // Find the Categories label in the mobile nav
    const labels = Array.from(document.querySelectorAll('.mobile-nav .nav-label, .drawer-content .nav-label'));
    const catLabel = labels.find(el => el.textContent.trim().toLowerCase() === 'categories');
    if (!catLabel) return;

    // Hide the main "Categories" label since we now have two accordions: "Brand" and "Category"
    catLabel.style.display = 'none';

    const parent = catLabel.parentNode;
    const siblings = Array.from(parent.children);
    const catIndex = siblings.indexOf(catLabel);
    
    // Find where the next section label starts so we know where to stop
    let nextLabelIndex = siblings.length;
    for (let i = catIndex + 1; i < siblings.length; i++) {
        if (siblings[i].classList.contains('nav-label')) {
            nextLabelIndex = i;
            break;
        }
    }

    // Remove any previously inserted accordion items from previous runs to prevent duplication
    const oldAccordionItems = Array.from(parent.querySelectorAll('.drawer-accordion-item'));
    oldAccordionItems.forEach(item => {
        if (parent.contains(item)) {
            parent.removeChild(item);
        }
    });

    // Also remove any remaining dynamic flat lists from previous runs
    for (let i = nextLabelIndex - 1; i > catIndex; i--) {
        const sib = siblings[i];
        if (sib && !sib.classList.contains('nav-label') && sib.id !== 'mb-accordion-brands' && sib.id !== 'mb-accordion-cats') {
            if (parent.contains(sib) && sib.tagName === 'LI') {
                parent.removeChild(sib);
            }
        }
    }

    // Extract unique brands (cat) and categories (filter) from our active database products
    const brands = [...new Set(products.map(p => (p.cat || '').toLowerCase().trim()).filter(Boolean))];
    const filters = [...new Set(products.map(p => (p.filter || '').toLowerCase().trim()).filter(Boolean))];

    // Mappings for beautiful client-facing titles
    const brandTitles = {
        'ordinary': 'The Ordinary',
        'cerave': 'CeraVe'
    };

    const filterTitles = {
        'cleansers': 'Cleansers',
        'serums': 'Serums & Hydration',
        'moisturizers': 'Moisturizers',
        'sunscreen': 'Sun Protection',
        'acids': 'Acids & Exfoliants',
        'retinoids': 'Retinoids',
        'body': 'Body Care',
        'targeted': 'Targeted Care',
        'eye': 'Eye Care',
        'lip': 'Lip Care',
        'hair': 'Hair Care'
    };

    // Create Brands Accordion Item
    const brandsLi = document.createElement('li');
    brandsLi.className = 'drawer-accordion-item';
    brandsLi.id = 'mb-accordion-brands';
    
    let brandsSubmenuHTML = brands.map(b => {
        const title = brandTitles[b] || (b.charAt(0).toUpperCase() + b.slice(1));
        return `<li><a href="shop.html?cat=${b}">${title}</a></li>`;
    }).join('');
    
    brandsLi.innerHTML = `
      <button type="button" class="drawer-accordion-btn">
        <span>Brand</span>
        <svg class="accordion-chevron" viewBox="0 0 10 6" width="10" height="6"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
      </button>
      <ul class="drawer-accordion-content">
        <li><a href="shop.html">Shop All Brands</a></li>
        ${brandsSubmenuHTML}
      </ul>
    `;

    // Create Categories Accordion Item
    const catsLi = document.createElement('li');
    catsLi.className = 'drawer-accordion-item';
    catsLi.id = 'mb-accordion-cats';
    
    let catsSubmenuHTML = filters.map(f => {
        const title = filterTitles[f] || (f.charAt(0).toUpperCase() + f.slice(1));
        return `<li><a href="shop.html?filter=${f}">${title}</a></li>`;
    }).join('');
    
    catsLi.innerHTML = `
      <button type="button" class="drawer-accordion-btn">
        <span>Category</span>
        <svg class="accordion-chevron" viewBox="0 0 10 6" width="10" height="6"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
      </button>
      <ul class="drawer-accordion-content">
        <li><a href="shop.html">Shop All Categories</a></li>
        ${catsSubmenuHTML}
      </ul>
    `;

    // Find the current next label (e.g. "Account") to insert right before it
    const currentNextLabel = Array.from(parent.querySelectorAll('.nav-label')).find(el => {
        return el.textContent.trim().toLowerCase() !== 'categories' && Array.from(parent.children).indexOf(el) > catIndex;
    });

    parent.insertBefore(brandsLi, currentNextLabel || null);
    parent.insertBefore(catsLi, currentNextLabel || null);

    // Setup toggle behavior
    const accordionBtns = parent.querySelectorAll('.drawer-accordion-btn');
    accordionBtns.forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            const isActive = this.classList.contains('active');
            
            // Close other accordions
            accordionBtns.forEach(otherBtn => {
                otherBtn.classList.remove('active');
                otherBtn.nextElementSibling.style.maxHeight = '0px';
            });

            if (!isActive) {
                this.classList.add('active');
                const content = this.nextElementSibling;
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        };
    });
};

// ── DYNAMIC DESKTOP NAVIGATION DROPDOWN CATEGORIES ──
window.updateDesktopNavCategories = function(products) {
    if (!products || !products.length) return;

    const shopDropMenu = Array.from(document.querySelectorAll('.nav-main .has-drop')).find(el => {
      const link = el.querySelector('a');
      return link && link.textContent.toLowerCase().includes('shop');
    })?.querySelector('.drop-menu');
    
    if (!shopDropMenu) return;

    // Extract unique active categories (filter) from active database products
    const filters = [...new Set(products.map(p => (p.filter || '').toLowerCase().trim()).filter(Boolean))];

    // Mappings for beautiful client-facing titles
    const filterTitles = {
        'cleansers': 'Cleansers',
        'serums': 'Serums & Hydration',
        'moisturizers': 'Moisturizers',
        'sunscreen': 'Sun Protection',
        'acids': 'Acids & Exfoliants',
        'retinoids': 'Retinoids',
        'body': 'Body Care',
        'targeted': 'Targeted Care',
        'eye': 'Eye Care',
        'lip': 'Lip Care',
        'hair': 'Hair Care'
    };

    let menuHTML = `<li><a href="shop.html">Shop All</a></li>`;
    filters.forEach(f => {
        const title = filterTitles[f] || (f.charAt(0).toUpperCase() + f.slice(1));
        menuHTML += `<li><a href="shop.html?filter=${f}">${title}</a></li>`;
    });

    shopDropMenu.innerHTML = menuHTML;
};

// ── LIVE SEARCH DROPDOWN ──
function highlightMatch(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

function buildSearchDropdown(inputEl, dropdownId) {
    // Remove existing dropdown
    const old = document.getElementById(dropdownId);
    if (old) old.remove();

    const query = (inputEl.value || '').trim().toLowerCase();
    if (query.length < 1) {
        closeAllSearchDropdowns();
        return;
    }

    document.body.classList.add('search-active');

    const products = window.productsData || defaultProducts;
    const matched = products.filter(p => {
        const name = (p.name || '').toLowerCase();
        const cat = (p.cat || '').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        const filterStr = (p.filter || '').toLowerCase();
        return name.includes(query) || cat.includes(query) || brand.includes(query) || filterStr.includes(query);
    });

    const dropdown = document.createElement('div');
    dropdown.className = 'search-results-dropdown';
    dropdown.id = dropdownId;

    if (matched.length === 0) {
        dropdown.innerHTML = `<div class="srd-empty">No products found for "<strong>${query}</strong>"</div>`;
    } else {
        const header = document.createElement('div');
        header.className = 'srd-header';
        header.textContent = `Results (${matched.length})`;
        dropdown.appendChild(header);

        matched.forEach(prod => {
            const item = document.createElement('a');
            item.className = 'srd-item';
            item.href = `product.html?id=${prod.id}`;

            const catName = (prod.cat || 'others').toLowerCase() === 'ordinary' ? 'The Ordinary'
                          : (prod.cat || 'others').toLowerCase() === 'cerave'   ? 'CeraVe'
                          : (prod.cat || '').toUpperCase();

            item.innerHTML = `
                <img class="srd-img" src="${prod.img || 'images/placeholder.png'}" alt="${prod.name}" onerror="this.src='images/placeholder.png'">
                <div class="srd-info">
                    <div class="srd-name">${highlightMatch(prod.name, query)}</div>
                    <div class="srd-meta">${catName}</div>
                </div>
                <div class="srd-price">Rs. ${(prod.price || 0).toLocaleString()}</div>
            `;
            dropdown.appendChild(item);
        });

        const viewAll = document.createElement('a');
        viewAll.className = 'srd-view-all';
        viewAll.href = `shop.html?q=${encodeURIComponent(query)}`;
        viewAll.textContent = `View all results →`;
        dropdown.appendChild(viewAll);
    }

    // Attach dropdown to BODY and position it absolutely based on the input's bounding rect
    // This avoids overflow:hidden clipping from any parent containers
    const rect = inputEl.getBoundingClientRect();
    dropdown.style.position = 'fixed';
    
    if (window.innerWidth <= 768) {
        const mBar = inputEl.closest('.mobile-search-bar');
        const containerRect = mBar ? mBar.getBoundingClientRect() : rect;
        dropdown.style.top = (containerRect.bottom - 2) + 'px';
        
        const mobileWidth = Math.min(window.innerWidth * 0.9, 340);
        dropdown.style.width = mobileWidth + 'px';
        dropdown.style.left = ((window.innerWidth - mobileWidth) / 2) + 'px';
    } else {
        dropdown.style.top = (rect.bottom + 12) + 'px';
        dropdown.style.left = rect.left + 'px';
        dropdown.style.width = Math.max(rect.width, 320) + 'px';
    }
    
    dropdown.style.zIndex = '999999';
    document.body.appendChild(dropdown);

    // Reposition on scroll/resize
    const reposition = () => {
        const r = inputEl.getBoundingClientRect();
        if (window.innerWidth <= 768) {
            const mBar = inputEl.closest('.mobile-search-bar');
            const containerRect = mBar ? mBar.getBoundingClientRect() : r;
            dropdown.style.top = (containerRect.bottom - 2) + 'px';
            
            const mobileWidth = Math.min(window.innerWidth * 0.9, 340);
            dropdown.style.width = mobileWidth + 'px';
            dropdown.style.left = ((window.innerWidth - mobileWidth) / 2) + 'px';
        } else {
            dropdown.style.top = (r.bottom + 12) + 'px';
            dropdown.style.left = r.left + 'px';
            dropdown.style.width = Math.max(r.width, 320) + 'px';
        }
    };
    window.addEventListener('scroll', reposition, { passive: true });
    window.addEventListener('resize', reposition, { passive: true });
    dropdown._cleanup = () => {
        window.removeEventListener('scroll', reposition);
        window.removeEventListener('resize', reposition);
    };
}

function closeAllSearchDropdowns() {
    document.querySelectorAll('.search-results-dropdown').forEach(d => {
        if (typeof d._cleanup === 'function') d._cleanup();
        d.remove();
    });
    document.body.classList.remove('search-active');
}

window.setupGlobalSearch = function() {
    const isShopPage = window.location.pathname.includes('shop.html');

    if (isShopPage) {
        // Sync URL search query to the input fields on the shop page on load
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get('q');
        if (q) {
            const searchInp = document.getElementById('search-inp');
            const mSearchInp = document.getElementById('m-search-inp-top');
            if (searchInp) searchInp.value = q;
            if (mSearchInp) mSearchInp.value = q;
        }
        // No dropdown needed on shop page — it has its own filter
        return;
    }

    // ── DESKTOP SEARCH BAR ──
    const searchInp = document.getElementById('search-inp');
    if (searchInp) {
        searchInp.addEventListener('input', () => {
            buildSearchDropdown(searchInp, 'srd-desktop');
        });
        searchInp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const q = searchInp.value.trim();
                if (q) window.location.href = `shop.html?q=${encodeURIComponent(q)}`;
            }
            if (e.key === 'Escape') closeAllSearchDropdowns();
        });
        searchInp.addEventListener('focus', () => {
            if (searchInp.value.trim().length > 0) {
                buildSearchDropdown(searchInp, 'srd-desktop');
            }
        });
    }

    // ── MOBILE SEARCH BAR ──
    const mSearchInp = document.getElementById('m-search-inp-top');
    if (mSearchInp) {
        mSearchInp.addEventListener('input', () => {
            buildSearchDropdown(mSearchInp, 'srd-mobile');
        });
        mSearchInp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const q = mSearchInp.value.trim();
                if (q) window.location.href = `shop.html?q=${encodeURIComponent(q)}`;
            }
            if (e.key === 'Escape') closeAllSearchDropdowns();
        });
        mSearchInp.addEventListener('focus', () => {
            if (mSearchInp.value.trim().length > 0) {
                buildSearchDropdown(mSearchInp, 'srd-mobile');
            }
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-results-dropdown') &&
            !e.target.closest('#search-inp') &&
            !e.target.closest('#m-search-inp-top')) {
            closeAllSearchDropdowns();
        }
    });
};

// ── DOM LOAD INITIALIZATION ──
if (typeof document !== 'undefined') {
    const runInitialization = () => {
        // Run mobile nav categories instantly with existing defaultProducts so there's no layout jump
        if (window.productsData) {
            window.updateMobileNavCategories(window.productsData);
            window.updateDesktopNavCategories(window.productsData);
        }
        // Bind search setup
        window.setupGlobalSearch();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runInitialization);
    } else {
        runInitialization();
    }
}
