const fs = require('fs');
const path = require('path');

const repoDir = 'c:\\Users\\etsy dream\\Desktop\\hg (1)\\hg (1)\\hg';
const prodPath = path.join(repoDir, 'product.html');
let html = fs.readFileSync(prodPath, 'utf8');

// 1. Remove extra </div> tags after sticky-timer-widget
const oldTimerDivs = `<div class="sticky-timer-widget" id="sticky-timer-widget" onclick="window.location.href='offers.html'" style="display: none; position: fixed !important; top: 82px !important; right: 20px !important; z-index: 999999 !important; background: rgba(255, 255, 255, 0.95) !important; backdrop-filter: blur(14px) !important; -webkit-backdrop-filter: blur(14px) !important; border: 1.5px solid rgba(220, 38, 38, 0.3) !important; border-radius: 16px !important; padding: 8px 14px !important; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.8) !important; color: #2D1B12 !important; cursor: pointer !important;">
    <div class="sticky-timer-content" style="display: flex !important; flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 4px !important; width: 100% !important;">
      <div class="sticky-timer-label" style="display: flex !important; align-items: center !important; justify-content: center !important; gap: 4px !important; font-size: 10px !important; font-weight: 800 !important; color: #DC2626 !important; letter-spacing: 0.1em !important; text-transform: uppercase !important; width: 100% !important; text-align: center !important;">
        <span class="pulse-dot" style="width: 7px; height: 7px; background: #EF4444; border-radius: 50%; box-shadow: 0 0 10px #EF4444; display: inline-block;"></span>⚡<span class="stk-txt">&nbsp;SALE ENDS IN:</span>
      </div>
      <div class="sticky-timer-digits" style="display: flex !important; align-items: center !important; justify-content: center !important; gap: 4px !important; flex-direction: row !important;">
        <div class="s-unit" style="display: inline-flex !important; align-items: baseline !important; gap: 2px !important; background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%) !important; padding: 4px 9px !important; border-radius: 7px !important; box-shadow: 0 3px 10px rgba(220, 38, 38, 0.35) !important;"><span class="s-val" id="stk-days" style="font-size: 14px !important; font-weight: 900 !important; color: #ffffff !important; font-family: monospace, sans-serif !important;">00</span><span class="s-lbl" style="font-size: 9px !important; font-weight: 800 !important; color: #FCA5A5 !important; text-transform: uppercase !important;">d</span></div>
        <span class="s-sep" style="font-size: 13px !important; font-weight: 900 !important; color: #DC2626 !important;">:</span>
        <div class="s-unit" style="display: inline-flex !important; align-items: baseline !important; gap: 2px !important; background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%) !important; padding: 4px 9px !important; border-radius: 7px !important; box-shadow: 0 3px 10px rgba(220, 38, 38, 0.35) !important;"><span class="s-val" id="stk-hours" style="font-size: 14px !important; font-weight: 900 !important; color: #ffffff !important; font-family: monospace, sans-serif !important;">00</span><span class="s-lbl" style="font-size: 9px !important; font-weight: 800 !important; color: #FCA5A5 !important; text-transform: uppercase !important;">h</span></div>
        <span class="s-sep" style="font-size: 13px !important; font-weight: 900 !important; color: #DC2626 !important;">:</span>
        <div class="s-unit" style="display: inline-flex !important; align-items: baseline !important; gap: 2px !important; background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%) !important; padding: 4px 9px !important; border-radius: 7px !important; box-shadow: 0 3px 10px rgba(220, 38, 38, 0.35) !important;"><span class="s-val" id="stk-mins" style="font-size: 14px !important; font-weight: 900 !important; color: #ffffff !important; font-family: monospace, sans-serif !important;">00</span><span class="s-lbl" style="font-size: 9px !important; font-weight: 800 !important; color: #FCA5A5 !important; text-transform: uppercase !important;">m</span></div>
        <span class="s-sep" style="font-size: 13px !important; font-weight: 900 !important; color: #DC2626 !important;">:</span>
        <div class="s-unit" style="display: inline-flex !important; align-items: baseline !important; gap: 2px !important; background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%) !important; padding: 4px 9px !important; border-radius: 7px !important; box-shadow: 0 3px 10px rgba(220, 38, 38, 0.35) !important;"><span class="s-val" id="stk-secs" style="font-size: 14px !important; font-weight: 900 !important; color: #ffffff !important; font-family: monospace, sans-serif !important;">00</span><span class="s-lbl" style="font-size: 9px !important; font-weight: 800 !important; color: #FCA5A5 !important; text-transform: uppercase !important;">s</span></div>
      </div>
    </div>
  </div>
  </div>
  </div>
  </div>`;

const newTimerDivs = `<div class="sticky-timer-widget" id="sticky-timer-widget" onclick="window.location.href='offers.html'" style="display: none; position: fixed !important; top: 82px !important; right: 20px !important; z-index: 999999 !important; background: rgba(255, 255, 255, 0.95) !important; backdrop-filter: blur(14px) !important; -webkit-backdrop-filter: blur(14px) !important; border: 1.5px solid rgba(220, 38, 38, 0.3) !important; border-radius: 16px !important; padding: 8px 14px !important; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.8) !important; color: #2D1B12 !important; cursor: pointer !important;">
    <div class="sticky-timer-content" style="display: flex !important; flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 4px !important; width: 100% !important;">
      <div class="sticky-timer-label" style="display: flex !important; align-items: center !important; justify-content: center !important; gap: 4px !important; font-size: 10px !important; font-weight: 800 !important; color: #DC2626 !important; letter-spacing: 0.1em !important; text-transform: uppercase !important; width: 100% !important; text-align: center !important;">
        <span class="pulse-dot" style="width: 7px; height: 7px; background: #EF4444; border-radius: 50%; box-shadow: 0 0 10px #EF4444; display: inline-block;"></span>⚡<span class="stk-txt">&nbsp;SALE ENDS IN:</span>
      </div>
      <div class="sticky-timer-digits" style="display: flex !important; align-items: center !important; justify-content: center !important; gap: 4px !important; flex-direction: row !important;">
        <div class="s-unit" style="display: inline-flex !important; align-items: baseline !important; gap: 2px !important; background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%) !important; padding: 4px 9px !important; border-radius: 7px !important; box-shadow: 0 3px 10px rgba(220, 38, 38, 0.35) !important;"><span class="s-val" id="stk-days" style="font-size: 14px !important; font-weight: 900 !important; color: #ffffff !important; font-family: monospace, sans-serif !important;">00</span><span class="s-lbl" style="font-size: 9px !important; font-weight: 800 !important; color: #FCA5A5 !important; text-transform: uppercase !important;">d</span></div>
        <span class="s-sep" style="font-size: 13px !important; font-weight: 900 !important; color: #DC2626 !important;">:</span>
        <div class="s-unit" style="display: inline-flex !important; align-items: baseline !important; gap: 2px !important; background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%) !important; padding: 4px 9px !important; border-radius: 7px !important; box-shadow: 0 3px 10px rgba(220, 38, 38, 0.35) !important;"><span class="s-val" id="stk-hours" style="font-size: 14px !important; font-weight: 900 !important; color: #ffffff !important; font-family: monospace, sans-serif !important;">00</span><span class="s-lbl" style="font-size: 9px !important; font-weight: 800 !important; color: #FCA5A5 !important; text-transform: uppercase !important;">h</span></div>
        <span class="s-sep" style="font-size: 13px !important; font-weight: 900 !important; color: #DC2626 !important;">:</span>
        <div class="s-unit" style="display: inline-flex !important; align-items: baseline !important; gap: 2px !important; background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%) !important; padding: 4px 9px !important; border-radius: 7px !important; box-shadow: 0 3px 10px rgba(220, 38, 38, 0.35) !important;"><span class="s-val" id="stk-mins" style="font-size: 14px !important; font-weight: 900 !important; color: #ffffff !important; font-family: monospace, sans-serif !important;">00</span><span class="s-lbl" style="font-size: 9px !important; font-weight: 800 !important; color: #FCA5A5 !important; text-transform: uppercase !important;">m</span></div>
        <span class="s-sep" style="font-size: 13px !important; font-weight: 900 !important; color: #DC2626 !important;">:</span>
        <div class="s-unit" style="display: inline-flex !important; align-items: baseline !important; gap: 2px !important; background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%) !important; padding: 4px 9px !important; border-radius: 7px !important; box-shadow: 0 3px 10px rgba(220, 38, 38, 0.35) !important;"><span class="s-val" id="stk-secs" style="font-size: 14px !important; font-weight: 900 !important; color: #ffffff !important; font-family: monospace, sans-serif !important;">00</span><span class="s-lbl" style="font-size: 9px !important; font-weight: 800 !important; color: #FCA5A5 !important; text-transform: uppercase !important;">s</span></div>
      </div>
    </div>
  </div>`;

if (html.includes(oldTimerDivs)) {
  html = html.replace(oldTimerDivs, newTimerDivs);
}

// 2. Safe property replacements inside renderProduct
html = html.replace(
  `\${product.cat.replace(/-/g, ' ')}`,
  `\${(product.cat || 'SKINCARE').replace(/-/g, ' ')}`
);

html = html.replace(
  `const stockLeft = (product.stock !== undefined && product.stock !== null && product.stock !== '') ? Number(product.stock) : ((product.name.length % 12) + 8);`,
  `const prodName = product.name || 'Product';\n      const stockLeft = (product.stock !== undefined && product.stock !== null && product.stock !== '') ? Number(product.stock) : ((prodName.length % 12) + 8);`
);

// 3. Fix findIndex in background DB update fetch
html = html.replace(
  `const idx = window.productsData.findIndex(p => p.id === dbProd.id);`,
  `const idx = window.productsData.findIndex(p => (p._id && String(p._id) === String(dbProd._id || dbProd.id)) || (p.id && String(p.id) === String(dbProd.id || dbProd._id)));`
);

// 4. Wrap renderProduct body in try/catch to prevent unhandled JS crashes
const renderStart = `function renderProduct(data) {`;
const safeRenderStart = `function renderProduct(data) {
      try {`;

if (html.includes(renderStart) && !html.includes('try {')) {
  html = html.replace(renderStart, safeRenderStart);
}

fs.writeFileSync(prodPath, html, 'utf8');
console.log('Fixed extra div tags and crash-proofed product.html');
