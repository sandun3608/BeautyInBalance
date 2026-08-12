const defaultProducts = [];

window.productsData = [...defaultProducts];

// Fetch from Database
async function fetchDatabaseProducts() {
    window.fetchDatabaseProducts = fetchDatabaseProducts;
    if (window.DB_FETCH_RUNNING) return; 
    window.DB_FETCH_RUNNING = true;

    // Use current Global URL definition
    const API_URL = `${window.BASE_URL || 'http://localhost:5000/api'}/products`;

    try {
        console.log("Fetching from:", API_URL);
        
        // Add 5-second timeout to fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(API_URL, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('API unreachable: ' + response.status);
        const dbProducts = await response.json();

        if (Array.isArray(dbProducts) && dbProducts.length > 0) {
            console.log(`✅ Loaded ${dbProducts.length} products from Database.`);
            
            // Re-map the variable names slightly if they differ between DB and Frontend
            const mappedDbProducts = dbProducts.map(p => {
                const formatImg = (str) => {
                    if (!str) return 'images/placeholder.png';
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

            window.productsData = updatedProductsData;
        } else {
            console.log("ℹ️ No new products in database, using defaults.");
        }

        // --- FINAL RENDERING (ALWAYS DO THIS) ---
        window.DB_FETCH_COMPLETED = true;
        const renderFuncs = [
            'renderInventory', 'renderRoundCategories', 'renderLatestArrivals', 'renderFeaturedProducts',
            'renderCategoryProducts', 'renderProduct', 'renderProducts', 
            'renderAvuruduSale', 'renderAvuruduBannerUI', 'updateRightSidebar', 'renderHomeAllProducts'
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
        
        window.DB_FETCH_COMPLETED = true;
        // Trigger renders even on failure to ensure UI balance
        const renderFuncs = [
            'renderInventory', 'renderRoundCategories', 'renderLatestArrivals', 'renderFeaturedProducts',
            'renderCategoryProducts', 'renderProduct', 'renderProducts', 
            'renderAvuruduSale', 'renderAvuruduBannerUI', 'updateRightSidebar', 'renderHomeAllProducts'
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
    } else {
        shoppingCart.push({
            id: product.id,
            name: product.name,
            price: product.price,
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
    return shoppingCart.reduce((total, item) => total + (item.price * item.qty), 0);
}
window.getCartTotal = getCartTotal;

function renderCart() {
    // Update all cart badges across the nav bar
    const badges = document.querySelectorAll('.cart-badge');
    const totalItems = shoppingCart.reduce((sum, item) => sum + item.qty, 0);
    badges.forEach(b => b.textContent = totalItems);
    
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
    itemsContainer.innerHTML = shoppingCart.map(item => `
        <div style="display:flex; gap:15px; margin-bottom:20px; align-items:center;">
            <img src="${item.img}" style="width:70px; height:70px; object-fit:contain; background:#f9f9f9; border-radius:8px; border: 1px solid #eee;">
            <div style="flex-grow:1;">
                <div style="font-size:14px; font-weight:600; font-family:var(--font-sans); color:var(--dark);">${item.name}</div>
                <div style="color:var(--gold); font-size:13px; font-weight:700; margin-top:5px;">Rs. ${(item.price * item.qty).toLocaleString()}</div>
            </div>
            <div style="display:flex; flex-direction:column; align-items:center; gap:5px;">
                <button onclick="updateCartQty('${item.id}', ${item.qty + 1})" style="border:none; background:#eee; color:#333; cursor:pointer; width:24px; height:24px; border-radius:4px;">+</button>
                <span style="font-size:13px; font-weight:600;">${item.qty}</span>
                <button onclick="updateCartQty('${item.id}', ${item.qty - 1})" style="border:none; background:#eee; color:#333; cursor:pointer; width:24px; height:24px; border-radius:4px;">-</button>
            </div>
        </div>
    `).join('');
    
    const subtotal = getCartTotal();
    const shipping = 350; 
    
    footerBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:14px; font-family:var(--font-sans);">
            <span style="color:#666;">Subtotal</span>
            <span style="font-weight:600; color:var(--dark);">Rs. ${subtotal.toLocaleString()}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-size:14px; font-family:var(--font-sans);">
            <span style="color:#666;">Shipping</span>
            <span style="font-weight:600; color:var(--brown);">Rs. 350</span>
        </div>
        <a href="checkout.html" style="display:block; text-align:center; background:var(--brown); color:#fff; padding:15px; border-radius:8px; text-decoration:none; font-family:var(--font-sans); font-weight:600; letter-spacing:0.05em; transition:0.3s;" onmouseover="this.style.background='var(--gold)'" onmouseout="this.style.background='var(--brown)'">SECURE CHECKOUT &rarr;</a>
    `;

    // Also render on Standalone Cart Page if it exists
    const standaloneItems = document.getElementById('cart-items-list');
    const standaloneSummary = document.getElementById('summary-details');

    if (standaloneItems && standaloneSummary) {
        if (shoppingCart.length === 0) {
            standaloneItems.innerHTML = '<div style="text-align:center; padding: 100px 0;"><h3>Your bag is empty</h3><a href="shop.html" style="color:var(--gold); text-decoration:underline;">Continue Shopping</a></div>';
            standaloneSummary.innerHTML = '';
        } else {
            standaloneItems.innerHTML = shoppingCart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-img"><img src="${item.img}"></div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">Rs. ${item.price.toLocaleString()}</div>
                        <div class="cart-item-qty">
                            <span class="cart-item-qty-btn" onclick="updateCartQty('${item.id}', ${item.qty - 1})">-</span>
                            <span>${item.qty}</span>
                            <span class="cart-item-qty-btn" onclick="updateCartQty('${item.id}', ${item.qty + 1})">+</span>
                        </div>
                    </div>
                </div>
            `).join('');

            standaloneSummary.innerHTML = `
                <div class="summary-row"><span>Subtotal</span><span>Rs. ${subtotal.toLocaleString()}</span></div>
                <div class="summary-row"><span>Delivery</span><span>Rs. 350</span></div>
                <div class="summary-row total" style="font-weight:800; border-top:1px solid #eee; padding-top:15px; margin-top:15px;"><span>Total</span><span>Rs. ${(subtotal + 350).toLocaleString()}</span></div>
            `;
        }
    }
}
window.renderCart = renderCart;

// Call initially
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(renderCart, 200);
});

// --- HOME ALL PRODUCTS GRID ---
window.renderHomeAllProducts = function() {
    const grid = document.getElementById('hap-grid');
    if (!grid) return;

    // Get up to 28 products
    const displayProducts = (category) => {
        let filtered = window.productsData;
        if (category && category !== 'all') {
            filtered = filtered.filter(p => p.cat === category);
        }
        
        // Take up to 28 items (7 rows of 4)
        const productsToShow = filtered.slice(0, 28);
        
        grid.innerHTML = productsToShow.map(prod => `
            <a href="product.html?id=${prod.id}" class="hap-card">
                <div class="hap-card-img">
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
                <div class="hap-card-brand">${prod.cat === 'cerave' ? 'CeraVe' : 'The Ordinary'}</div>
                <div class="hap-card-title">${prod.name}</div>
                <div class="hap-card-price">Rs. ${(prod.price || 0).toLocaleString()}</div>
                <button class="hap-card-btn btn-buy-animated" onclick="event.preventDefault(); addToCart('${prod.id}'); window.location.href='checkout.html';">Buy It Now</button>
            </a>
        `).join('');
    };

    // Initial render
    displayProducts('all');

    // Setup Tab Listeners
    const tabs = document.querySelectorAll('.hap-tab:not(.coming-soon)');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            displayProducts(tab.getAttribute('data-filter'));
        });
    });
};
