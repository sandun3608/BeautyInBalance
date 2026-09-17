const fs = require('fs');
const path = require('path');

const repoDir = 'c:\\Users\\etsy dream\\Desktop\\hg (1)\\hg (1)\\hg';

// Updated HTML widget with centered header and white digit cards
const updatedWidgetHTML = `  <!-- ===== STICKY FLOATING LIVE OFFER TIMER (FIXED TOP RIGHT) ===== -->
  <div class="sticky-timer-widget" id="sticky-timer-widget" onclick="window.location.href='offers.html'" style="display: none; position: fixed !important; top: 82px !important; right: 20px !important; z-index: 999999 !important; background: rgba(15, 23, 42, 0.96) !important; backdrop-filter: blur(14px) !important; -webkit-backdrop-filter: blur(14px) !important; border: 1.5px solid rgba(220, 38, 38, 0.6) !important; border-radius: 16px !important; padding: 8px 14px !important; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4) !important; color: #ffffff !important; cursor: pointer !important;">
    <div class="sticky-timer-content" style="display: flex !important; flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 4px !important; width: 100% !important;">
      <div class="sticky-timer-label" style="display: flex !important; align-items: center !important; justify-content: center !important; gap: 4px !important; font-size: 10px !important; font-weight: 800 !important; color: #F87171 !important; letter-spacing: 0.1em !important; text-transform: uppercase !important; width: 100% !important; text-align: center !important;">
        <span class="pulse-dot" style="width: 7px; height: 7px; background: #EF4444; border-radius: 50%; box-shadow: 0 0 10px #EF4444; display: inline-block;"></span>⚡<span class="stk-txt">&nbsp;SALE ENDS IN:</span>
      </div>
      <div class="sticky-timer-digits" style="display: flex !important; align-items: center !important; justify-content: center !important; gap: 3px !important; flex-direction: row !important;">
        <div class="s-unit" style="display: inline-flex !important; align-items: baseline !important; gap: 2px !important; background: #FFFFFF !important; padding: 3px 7px !important; border-radius: 6px !important; border: 1px solid rgba(220,38,38,0.3) !important;"><span class="s-val" id="stk-days" style="font-size: 14px !important; font-weight: 900 !important; color: #DC2626 !important; font-family: monospace, sans-serif !important;">00</span><span class="s-lbl" style="font-size: 9px !important; font-weight: 800 !important; color: #6B7280 !important; text-transform: uppercase !important;">d</span></div>
        <span class="s-sep" style="font-size: 13px !important; font-weight: 900 !important; color: #FFFFFF !important;">:</span>
        <div class="s-unit" style="display: inline-flex !important; align-items: baseline !important; gap: 2px !important; background: #FFFFFF !important; padding: 3px 7px !important; border-radius: 6px !important; border: 1px solid rgba(220,38,38,0.3) !important;"><span class="s-val" id="stk-hours" style="font-size: 14px !important; font-weight: 900 !important; color: #DC2626 !important; font-family: monospace, sans-serif !important;">00</span><span class="s-lbl" style="font-size: 9px !important; font-weight: 800 !important; color: #6B7280 !important; text-transform: uppercase !important;">h</span></div>
        <span class="s-sep" style="font-size: 13px !important; font-weight: 900 !important; color: #FFFFFF !important;">:</span>
        <div class="s-unit" style="display: inline-flex !important; align-items: baseline !important; gap: 2px !important; background: #FFFFFF !important; padding: 3px 7px !important; border-radius: 6px !important; border: 1px solid rgba(220,38,38,0.3) !important;"><span class="s-val" id="stk-mins" style="font-size: 14px !important; font-weight: 900 !important; color: #DC2626 !important; font-family: monospace, sans-serif !important;">00</span><span class="s-lbl" style="font-size: 9px !important; font-weight: 800 !important; color: #6B7280 !important; text-transform: uppercase !important;">m</span></div>
        <span class="s-sep" style="font-size: 13px !important; font-weight: 900 !important; color: #FFFFFF !important;">:</span>
        <div class="s-unit" style="display: inline-flex !important; align-items: baseline !important; gap: 2px !important; background: #FFFFFF !important; padding: 3px 7px !important; border-radius: 6px !important; border: 1px solid rgba(220,38,38,0.3) !important;"><span class="s-val" id="stk-secs" style="font-size: 14px !important; font-weight: 900 !important; color: #DC2626 !important; font-family: monospace, sans-serif !important;">00</span><span class="s-lbl" style="font-size: 9px !important; font-weight: 800 !important; color: #6B7280 !important; text-transform: uppercase !important;">s</span></div>
      </div>
    </div>
  </div>`;

const targetPages = ['index.html', 'offers.html', 'product.html'];

targetPages.forEach(file => {
  const filePath = path.join(repoDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /<!-- ===== STICKY FLOATING LIVE OFFER TIMER[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g,
    updatedWidgetHTML
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated centered white timer HTML in ${file}`);
});

// Update styles.css with centered title, white card digits, and extra small mobile view
const stylesPath = path.join(repoDir, 'styles.css');
let stylesContent = fs.readFileSync(stylesPath, 'utf8');

const updatedCss = `
/* ==========================================================================
   STICKY FLOATING LIVE OFFER TIMER (Global Desktop & Centered White Digits)
   ========================================================================== */
#sticky-timer-widget {
  position: fixed !important;
  top: 80px !important;
  right: 20px !important;
  z-index: 999999 !important;
  background: rgba(15, 23, 42, 0.96) !important;
  backdrop-filter: blur(14px) !important;
  -webkit-backdrop-filter: blur(14px) !important;
  border: 1.5px solid rgba(220, 38, 38, 0.6) !important;
  border-radius: 16px !important;
  padding: 8px 14px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4) !important;
  color: #ffffff !important;
  transition: all 0.3s ease !important;
  cursor: pointer !important;
}

#sticky-timer-widget .sticky-timer-content {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  text-align: center !important;
  gap: 4px !important;
  width: 100% !important;
}

#sticky-timer-widget .sticky-timer-label {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 4px !important;
  font-size: 10px !important;
  font-weight: 800 !important;
  color: #F87171 !important;
  letter-spacing: 0.1em !important;
  text-transform: uppercase !important;
  width: 100% !important;
  text-align: center !important;
}

#sticky-timer-widget .sticky-timer-digits {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 3px !important;
}

#sticky-timer-widget .s-unit {
  display: inline-flex !important;
  align-items: baseline !important;
  gap: 2px !important;
  background: #FFFFFF !important;
  padding: 3px 7px !important;
  border-radius: 6px !important;
  border: 1px solid rgba(220, 38, 38, 0.3) !important;
}

#sticky-timer-widget .s-val {
  font-size: 14px !important;
  font-weight: 900 !important;
  color: #DC2626 !important;
  font-family: monospace, sans-serif !important;
}

#sticky-timer-widget .s-lbl {
  font-size: 9px !important;
  font-weight: 800 !important;
  color: #6B7280 !important;
  text-transform: uppercase !important;
}

#sticky-timer-widget .s-sep {
  font-size: 13px !important;
  font-weight: 900 !important;
  color: #FFFFFF !important;
}

/* ── GODAK PODI EXTRA-SMALL MOBILE VIEW ── */
@media (max-width: 768px) {
  #sticky-timer-widget {
    top: 54px !important;
    right: 5px !important;
    padding: 2px 6px !important;
    border-radius: 20px !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35) !important;
    border: 1px solid rgba(220, 38, 38, 0.4) !important;
    background: rgba(15, 23, 42, 0.94) !important;
  }
  #sticky-timer-widget .sticky-timer-content {
    flex-direction: row !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 3px !important;
  }
  #sticky-timer-widget .stk-txt {
    display: none !important; /* Hide label text on mobile to make it extra small */
  }
  #sticky-timer-widget .sticky-timer-label {
    gap: 2px !important;
    font-size: 9px !important;
    width: auto !important;
  }
  #sticky-timer-widget .pulse-dot {
    width: 4px !important;
    height: 4px !important;
  }
  #sticky-timer-widget .s-unit {
    padding: 1px 3px !important;
    border-radius: 4px !important;
    background: #FFFFFF !important;
  }
  #sticky-timer-widget .s-val {
    font-size: 10px !important;
    font-weight: 900 !important;
    color: #DC2626 !important;
  }
  #sticky-timer-widget .s-lbl {
    font-size: 7px !important;
    color: #4B5563 !important;
  }
  #sticky-timer-widget .s-sep {
    font-size: 9px !important;
    color: #FFFFFF !important;
  }
}
`;

// Clean previous timer css blocks and replace
stylesContent = stylesContent.replace(
  /\/\* =+\s*STICKY FLOATING LIVE OFFER TIMER[\s\S]*/g,
  updatedCss
);

fs.writeFileSync(stylesPath, stylesContent, 'utf8');
console.log('Updated styles.css with centered white timer digits');
