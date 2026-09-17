const fs = require('fs');
const path = require('path');

const repoDir = 'c:\\Users\\etsy dream\\Desktop\\hg (1)\\hg (1)\\hg';

// Updated HTML widget
const updatedWidgetHTML = `  <!-- ===== STICKY FLOATING LIVE OFFER TIMER (FIXED TOP RIGHT) ===== -->
  <div class="sticky-timer-widget" id="sticky-timer-widget" onclick="window.location.href='offers.html'" style="display: none; position: fixed !important; top: 82px !important; right: 20px !important; z-index: 999999 !important; background: rgba(255, 255, 255, 0.95) !important; backdrop-filter: blur(14px) !important; -webkit-backdrop-filter: blur(14px) !important; border: 1.5px solid rgba(220, 38, 38, 0.3) !important; border-radius: 16px !important; padding: 8px 14px !important; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.8) !important; color: #2D1B12 !important; cursor: pointer !important;">
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

const targetPages = ['index.html', 'offers.html', 'product.html'];

targetPages.forEach(file => {
  const filePath = path.join(repoDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /<!-- ===== STICKY FLOATING LIVE OFFER TIMER[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g,
    updatedWidgetHTML
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated reference pill timer HTML in ${file}`);
});

// Update styles.css with White-mix Desktop Card & Red Pill Capsule Mobile Badge (Matching Reference Screenshot)
const stylesPath = path.join(repoDir, 'styles.css');
let stylesContent = fs.readFileSync(stylesPath, 'utf8');

const updatedCss = `
/* ==========================================================================
   STICKY FLOATING LIVE OFFER TIMER (White Mix Desktop & Reference Red Pill Mobile)
   ========================================================================== */
#sticky-timer-widget {
  position: fixed !important;
  top: 82px !important;
  right: 20px !important;
  z-index: 999999 !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(14px) !important;
  -webkit-backdrop-filter: blur(14px) !important;
  border: 1.5px solid rgba(220, 38, 38, 0.3) !important;
  border-radius: 16px !important;
  padding: 8px 14px !important;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.8) !important;
  color: #2D1B12 !important;
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
  color: #DC2626 !important;
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
  gap: 4px !important;
}

#sticky-timer-widget .s-unit {
  display: inline-flex !important;
  align-items: baseline !important;
  gap: 2px !important;
  background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%) !important;
  padding: 4px 9px !important;
  border-radius: 7px !important;
  box-shadow: 0 3px 10px rgba(220, 38, 38, 0.35) !important;
}

#sticky-timer-widget .s-val {
  font-size: 14px !important;
  font-weight: 900 !important;
  color: #ffffff !important;
  font-family: monospace, sans-serif !important;
}

#sticky-timer-widget .s-lbl {
  font-size: 9px !important;
  font-weight: 800 !important;
  color: #FCA5A5 !important;
  text-transform: uppercase !important;
}

#sticky-timer-widget .s-sep {
  font-size: 13px !important;
  font-weight: 900 !important;
  color: #DC2626 !important;
}

/* ── MOBILE VIEW: MATCH REFERENCE SCREENSHOT (VIBRANT FLOATING RED PILL) ── */
@media (max-width: 768px) {
  #sticky-timer-widget {
    top: 60px !important;
    right: 10px !important;
    padding: 5px 12px !important;
    border-radius: 50px !important; /* Full Pill Capsule shape like screenshot */
    background: linear-gradient(135deg, #E52E2E 0%, #B91C1C 100%) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    box-shadow: 0 6px 20px rgba(229, 46, 46, 0.5) !important;
  }
  #sticky-timer-widget .sticky-timer-content {
    flex-direction: row !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 4px !important;
  }
  #sticky-timer-widget .stk-txt {
    display: none !important; /* Hide label text on mobile to match screenshot */
  }
  #sticky-timer-widget .sticky-timer-label {
    gap: 3px !important;
    font-size: 11px !important;
    color: #FFD1D1 !important;
    width: auto !important;
  }
  #sticky-timer-widget .pulse-dot {
    display: none !important;
  }
  #sticky-timer-widget .s-unit {
    padding: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }
  #sticky-timer-widget .s-val {
    font-size: 11px !important;
    font-weight: 900 !important;
    color: #FFFFFF !important;
  }
  #sticky-timer-widget .s-lbl {
    font-size: 8px !important;
    color: #FFD1D1 !important;
  }
  #sticky-timer-widget .s-sep {
    font-size: 11px !important;
    color: #FFFFFF !important;
    opacity: 0.8 !important;
  }
}
`;

// Clean previous timer css blocks and replace
stylesContent = stylesContent.replace(
  /\/\* =+\s*STICKY FLOATING LIVE OFFER TIMER[\s\S]*/g,
  updatedCss
);

fs.writeFileSync(stylesPath, stylesContent, 'utf8');
console.log('Updated styles.css with white-mix desktop & reference screenshot red pill mobile');
