const fs = require('fs');
const path = require('path');

const repoDir = 'c:\\Users\\etsy dream\\Desktop\\hg (1)\\hg (1)\\hg';

const timerHTML = `
  <!-- ===== STICKY FLOATING LIVE OFFER TIMER (STAYS FIXED ON SCROLL) ===== -->
  <div class="sticky-timer-widget" id="sticky-timer-widget" onclick="window.location.href='offers.html'">
    <div class="sticky-timer-content">
      <div class="sticky-timer-label">
        <span class="pulse-dot"></span>⚡<span class="stk-txt">&nbsp;SALE ENDS IN:</span>
      </div>
      <div class="sticky-timer-digits">
        <div class="s-unit"><span class="s-val" id="stk-days">00</span><span class="s-lbl">d</span></div>
        <span class="s-sep">:</span>
        <div class="s-unit"><span class="s-val" id="stk-hours">00</span><span class="s-lbl">h</span></div>
        <span class="s-sep">:</span>
        <div class="s-unit"><span class="s-val" id="stk-mins">00</span><span class="s-lbl">m</span></div>
        <span class="s-sep">:</span>
        <div class="s-unit"><span class="s-val" id="stk-secs">00</span><span class="s-lbl">s</span></div>
      </div>
    </div>
  </div>
`;

// 1. Update product.html
const prodPath = path.join(repoDir, 'product.html');
let prodContent = fs.readFileSync(prodPath, 'utf8');

if (!prodContent.includes('id="sticky-timer-widget"')) {
  prodContent = prodContent.replace('</header>', '</header>\n' + timerHTML);
}

// Add JS helper to product.html for sticky timer
const prodJsCode = `
      function initStickyTimer(endDateStr) {
        const widget = document.getElementById('sticky-timer-widget');
        if (!widget) return;
        const update = () => {
          const end = new Date(endDateStr).getTime();
          const now = new Date().getTime();
          const diff = end - now;
          if (isNaN(end) || diff <= 0) {
            widget.classList.remove('active');
            return;
          }
          widget.classList.add('active');
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);
          const setTxt = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = String(val).padStart(2, '0');
          };
          setTxt('stk-days', days);
          setTxt('stk-hours', hours);
          setTxt('stk-mins', mins);
          setTxt('stk-secs', secs);
        };
        update();
        setInterval(update, 1000);
      }
`;

if (!prodContent.includes('function initStickyTimer')) {
  prodContent = prodContent.replace(
    'window.activeFlashSale = sale;',
    'window.activeFlashSale = sale; initStickyTimer(sale.endDate);'
  );
  prodContent = prodContent.replace(
    '// Positioning logic',
    prodJsCode + '\n    // Positioning logic'
  );
}
fs.writeFileSync(prodPath, prodContent, 'utf8');
console.log('Updated product.html');

// 2. Update index.html updateCountdown function
const indexPath = path.join(repoDir, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

const targetSub = `        // Update floating sticky timer
        const setTxt = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.textContent = String(val).padStart(2, '0');
        };
        setTxt('stk-days', days);
        setTxt('stk-hours', hours);
        setTxt('stk-mins', mins);
        setTxt('stk-secs', secs);`;

if (!indexContent.includes("setTxt('stk-days'")) {
  indexContent = indexContent.replace(
    "renderDigits('fs-secs', secs);",
    "renderDigits('fs-secs', secs);\n" + targetSub
  );
  indexContent = indexContent.replace(
    "if (flashModal) flashModal.classList.remove('active');",
    "if (flashModal) flashModal.classList.remove('active');\n          const widget = document.getElementById('sticky-timer-widget'); if (widget) widget.classList.remove('active');"
  );
  indexContent = indexContent.replace(
    "const days = Math.floor(diff / (1000 * 60 * 60 * 24));",
    "const widget = document.getElementById('sticky-timer-widget'); if (widget) widget.classList.add('active');\n        const days = Math.floor(diff / (1000 * 60 * 60 * 24));"
  );
  fs.writeFileSync(indexPath, indexContent, 'utf8');
  console.log('Updated index.html');
}

console.log('Done script.');
