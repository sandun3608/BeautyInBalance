const fs = require('fs');
const path = require('path');

const repoDir = 'c:\\Users\\etsy dream\\Desktop\\hg (1)\\hg (1)\\hg';

const newWidgetHTML = `  <!-- ===== STICKY FLOATING LIVE OFFER TIMER (FIXED TOP RIGHT) ===== -->
  <div class="sticky-timer-widget" id="sticky-timer-widget" onclick="window.location.href='offers.html'" style="display: none; position: fixed !important; top: 85px !important; right: 20px !important; z-index: 999999 !important; background: rgba(17, 24, 39, 0.95) !important; backdrop-filter: blur(12px) !important; -webkit-backdrop-filter: blur(12px) !important; border: 1.5px solid rgba(220, 38, 38, 0.6) !important; border-radius: 16px !important; padding: 8px 14px !important; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4) !important; color: #ffffff !important; cursor: pointer !important;">
    <div class="sticky-timer-content" style="display: flex !important; flex-direction: column !important; align-items: flex-end !important; gap: 4px !important;">
      <div class="sticky-timer-label" style="display: flex !important; align-items: center !important; gap: 5px !important; font-size: 10px !important; font-weight: 800 !important; color: #F87171 !important; letter-spacing: 0.1em !important; text-transform: uppercase !important;">
        <span class="pulse-dot" style="width: 7px; height: 7px; background: #EF4444; border-radius: 50%; box-shadow: 0 0 10px #EF4444; display: inline-block;"></span>⚡<span class="stk-txt">&nbsp;SALE ENDS IN:</span>
      </div>
      <div class="sticky-timer-digits" style="display: flex !important; align-items: center !important; gap: 3px !important; flex-direction: row !important;">
        <div class="s-unit" style="display: inline-flex !important; align-items: baseline !important; gap: 2px !important; background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%) !important; padding: 3px 7px !important; border-radius: 6px !important;"><span class="s-val" id="stk-days" style="font-size: 14px !important; font-weight: 900 !important; color: #fff !important; font-family: monospace, sans-serif !important;">00</span><span class="s-lbl" style="font-size: 9px !important; font-weight: 800 !important; color: #FCA5A5 !important; text-transform: uppercase !important;">d</span></div>
        <span class="s-sep" style="font-size: 13px !important; font-weight: 900 !important; color: #DC2626 !important;">:</span>
        <div class="s-unit" style="display: inline-flex !important; align-items: baseline !important; gap: 2px !important; background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%) !important; padding: 3px 7px !important; border-radius: 6px !important;"><span class="s-val" id="stk-hours" style="font-size: 14px !important; font-weight: 900 !important; color: #fff !important; font-family: monospace, sans-serif !important;">00</span><span class="s-lbl" style="font-size: 9px !important; font-weight: 800 !important; color: #FCA5A5 !important; text-transform: uppercase !important;">h</span></div>
        <span class="s-sep" style="font-size: 13px !important; font-weight: 900 !important; color: #DC2626 !important;">:</span>
        <div class="s-unit" style="display: inline-flex !important; align-items: baseline !important; gap: 2px !important; background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%) !important; padding: 3px 7px !important; border-radius: 6px !important;"><span class="s-val" id="stk-mins" style="font-size: 14px !important; font-weight: 900 !important; color: #fff !important; font-family: monospace, sans-serif !important;">00</span><span class="s-lbl" style="font-size: 9px !important; font-weight: 800 !important; color: #FCA5A5 !important; text-transform: uppercase !important;">m</span></div>
        <span class="s-sep" style="font-size: 13px !important; font-weight: 900 !important; color: #DC2626 !important;">:</span>
        <div class="s-unit" style="display: inline-flex !important; align-items: baseline !important; gap: 2px !important; background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%) !important; padding: 3px 7px !important; border-radius: 6px !important;"><span class="s-val" id="stk-secs" style="font-size: 14px !important; font-weight: 900 !important; color: #fff !important; font-family: monospace, sans-serif !important;">00</span><span class="s-lbl" style="font-size: 9px !important; font-weight: 800 !important; color: #FCA5A5 !important; text-transform: uppercase !important;">s</span></div>
      </div>
    </div>
  </div>`;

const targetPages = ['index.html', 'offers.html', 'product.html'];

targetPages.forEach(file => {
  const filePath = path.join(repoDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace existing widget
  if (content.includes('id="sticky-timer-widget"')) {
    content = content.replace(
      /<!-- ===== STICKY FLOATING LIVE OFFER TIMER[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g,
      newWidgetHTML
    );
  } else {
    content = content.replace('</header>', '</header>\n' + newWidgetHTML);
  }

  // Update JS to set style.display = 'flex' / 'none'
  content = content.replace(/widget\.classList\.add\('active'\);/g, "widget.style.display = 'flex'; widget.classList.add('active');");
  content = content.replace(/widget\.classList\.remove\('active'\);/g, "widget.style.display = 'none'; widget.classList.remove('active');");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed widget HTML & JS in ${file}`);
});

// Update styles.css with !important mobile rules
const stylesPath = path.join(repoDir, 'styles.css');
let stylesContent = fs.readFileSync(stylesPath, 'utf8');

const updatedCss = `
/* ==========================================================================
   STICKY FLOATING LIVE OFFER TIMER (Global Desktop & Short Mobile View)
   ========================================================================== */
#sticky-timer-widget {
  position: fixed !important;
  top: 80px !important;
  right: 20px !important;
  z-index: 999999 !important;
  background: rgba(17, 24, 39, 0.95) !important;
  backdrop-filter: blur(14px) !important;
  -webkit-backdrop-filter: blur(14px) !important;
  border: 1.5px solid rgba(220, 38, 38, 0.5) !important;
  border-radius: 18px !important;
  padding: 8px 14px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35) !important;
  color: #ffffff !important;
  transition: all 0.3s ease !important;
  cursor: pointer !important;
}

#sticky-timer-widget .sticky-timer-content {
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-end !important;
  gap: 4px !important;
}

#sticky-timer-widget .sticky-timer-digits {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  gap: 3px !important;
}

#sticky-timer-widget .s-unit {
  display: inline-flex !important;
  align-items: baseline !important;
  gap: 2px !important;
}

/* ── ULTRA-COMPACT SHORT MOBILE VIEW ── */
@media (max-width: 768px) {
  #sticky-timer-widget {
    top: 60px !important;
    right: 8px !important;
    padding: 4px 8px !important;
    border-radius: 24px !important;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4) !important;
  }
  #sticky-timer-widget .sticky-timer-content {
    flex-direction: row !important;
    align-items: center !important;
    gap: 5px !important;
  }
  #sticky-timer-widget .stk-txt {
    display: none !important; /* Hide 'SALE ENDS IN:' text on mobile to make it super short! */
  }
  #sticky-timer-widget .sticky-timer-label {
    gap: 3px !important;
    font-size: 11px !important;
  }
  #sticky-timer-widget .s-unit {
    padding: 2px 4px !important;
    border-radius: 5px !important;
  }
  #sticky-timer-widget .s-val {
    font-size: 11px !important;
  }
  #sticky-timer-widget .s-lbl {
    font-size: 8px !important;
  }
  #sticky-timer-widget .s-sep {
    font-size: 10px !important;
  }
}
`;

if (stylesContent.includes('/* STICKY FLOATING LIVE OFFER TIMER')) {
  stylesContent = stylesContent.replace(
    /\/\* =+\s*STICKY FLOATING LIVE OFFER TIMER[\s\S]*/g,
    updatedCss
  );
} else {
  stylesContent += '\n' + updatedCss;
}

fs.writeFileSync(stylesPath, stylesContent, 'utf8');
console.log('Fixed styles.css');
