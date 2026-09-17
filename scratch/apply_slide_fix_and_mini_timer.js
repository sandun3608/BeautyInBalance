const fs = require('fs');
const path = require('path');

const repoDir = 'c:\\Users\\etsy dream\\Desktop\\hg (1)\\hg (1)\\hg';

// 1. Fix index.html hero slides clearing bug
const indexPath = path.join(repoDir, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

indexContent = indexContent.replace(
  "container.querySelectorAll('[data-fallback]').forEach(el => el.remove());",
  "container.innerHTML = ''; // Clear hardcoded slides so uploaded DB slides display immediately"
);

fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('Fixed index.html slide loader');

// 2. Update styles.css with extra small mobile timer CSS
const stylesPath = path.join(repoDir, 'styles.css');
let stylesContent = fs.readFileSync(stylesPath, 'utf8');

const updatedCss = `
/* ==========================================================================
   STICKY FLOATING LIVE OFFER TIMER (Global Desktop & Godak Podi Mobile View)
   ========================================================================== */
#sticky-timer-widget {
  position: fixed !important;
  top: 80px !important;
  right: 20px !important;
  z-index: 999999 !important;
  background: rgba(15, 23, 42, 0.95) !important;
  backdrop-filter: blur(14px) !important;
  -webkit-backdrop-filter: blur(14px) !important;
  border: 1.5px solid rgba(220, 38, 38, 0.5) !important;
  border-radius: 14px !important;
  padding: 6px 12px !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35) !important;
  color: #ffffff !important;
  transition: all 0.3s ease !important;
  cursor: pointer !important;
}

#sticky-timer-widget .sticky-timer-content {
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-end !important;
  gap: 3px !important;
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
  background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%) !important;
  padding: 3px 6px !important;
  border-radius: 5px !important;
}

#sticky-timer-widget .s-val {
  font-size: 13px !important;
  font-weight: 900 !important;
  color: #ffffff !important;
  font-family: monospace, sans-serif !important;
}

#sticky-timer-widget .s-lbl {
  font-size: 8px !important;
  font-weight: 800 !important;
  color: #FCA5A5 !important;
  text-transform: uppercase !important;
}

#sticky-timer-widget .s-sep {
  font-size: 12px !important;
  font-weight: 900 !important;
  color: #DC2626 !important;
}

/* ── EXTRA-SMALL (GODAK PODI) MOBILE VIEW ── */
@media (max-width: 768px) {
  #sticky-timer-widget {
    top: 56px !important;
    right: 6px !important;
    padding: 3px 8px !important;
    border-radius: 20px !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
    border: 1px solid rgba(220, 38, 38, 0.4) !important;
    background: rgba(15, 23, 42, 0.92) !important;
  }
  #sticky-timer-widget .sticky-timer-content {
    flex-direction: row !important;
    align-items: center !important;
    gap: 4px !important;
  }
  #sticky-timer-widget .stk-txt {
    display: none !important; /* Hide label text on mobile to make it extra small */
  }
  #sticky-timer-widget .sticky-timer-label {
    gap: 2px !important;
    font-size: 10px !important;
  }
  #sticky-timer-widget .pulse-dot {
    width: 5px !important;
    height: 5px !important;
  }
  #sticky-timer-widget .s-unit {
    padding: 1px 4px !important;
    border-radius: 4px !important;
    background: #DC2626 !important;
  }
  #sticky-timer-widget .s-val {
    font-size: 10px !important;
    font-weight: 800 !important;
  }
  #sticky-timer-widget .s-lbl {
    font-size: 7px !important;
  }
  #sticky-timer-widget .s-sep {
    font-size: 9px !important;
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
console.log('Updated styles.css with godak podi mobile timer rules');
