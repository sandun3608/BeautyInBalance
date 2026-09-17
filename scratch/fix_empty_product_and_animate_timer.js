const fs = require('fs');
const path = require('path');

const repoDir = 'c:\\Users\\etsy dream\\Desktop\\hg (1)\\hg (1)\\hg';

// 1. Fix empty product loading bug in product.html
const prodPath = path.join(repoDir, 'product.html');
let prodContent = fs.readFileSync(prodPath, 'utf8');

// Replace line 955 matching logic to support _id, id, and name flexibly
const oldFind = "const product = data.find(p => p.id === prodId || p.name === prodId);";
const newFind = `const targetId = String(prodId || '').trim();
      const product = data.find(p => {
        if (!p) return false;
        const p1 = String(p._id || '').trim();
        const p2 = String(p.id || '').trim();
        const pName = String(p.name || '').trim();
        return (p1 && p1 === targetId) || (p2 && p2 === targetId) || (pName && pName.toLowerCase() === targetId.toLowerCase());
      });`;

if (prodContent.includes(oldFind)) {
  prodContent = prodContent.replace(oldFind, newFind);
} else if (!prodContent.includes('const targetId')) {
  prodContent = prodContent.replace(
    "if (!data || !data.length) return;",
    "if (!data || !data.length) return;\n      " + newFind
  );
}

// Add fallback if product still not found so it NEVER renders a completely blank page
prodContent = prodContent.replace(
  "if (!product) return;",
  `if (!product) {
        document.getElementById('pd-frame').innerHTML = \`
          <div style="text-align:center; padding: 100px 20px;">
            <h2 style="font-family: 'DM Sans', sans-serif; font-size: 26px; font-weight:700; margin-bottom: 16px; color:#222;">Product Not Found</h2>
            <p style="color: #666; font-size: 14px; margin-bottom: 25px;">The requested product could not be loaded or may be unavailable.</p>
            <a href="shop.html" style="display:inline-block; padding: 12px 28px; background: #DC2626; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 13px;">Back to Shop</a>
          </div>
        \`;
        return;
      }`
);

fs.writeFileSync(prodPath, prodContent, 'utf8');
console.log('Fixed product.html matching logic and blank page fallback');

// 2. Update styles.css with animations & high-end color matching
const stylesPath = path.join(repoDir, 'styles.css');
let stylesContent = fs.readFileSync(stylesPath, 'utf8');

const updatedCss = `
/* ==========================================================================
   STICKY FLOATING LIVE OFFER TIMER (Animations & Harmonious Color System)
   ========================================================================== */
@keyframes floatWidget {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0px); }
}

@keyframes pulseGlow {
  0% { box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(220, 38, 38, 0.3); }
  50% { box-shadow: 0 14px 35px rgba(220, 38, 38, 0.22), 0 0 0 1.5px rgba(220, 38, 38, 0.5); }
  100% { box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(220, 38, 38, 0.3); }
}

@keyframes colonBlink {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

#sticky-timer-widget {
  position: fixed !important;
  top: 82px !important;
  right: 20px !important;
  z-index: 999999 !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  border: 1.5px solid rgba(220, 38, 38, 0.35) !important;
  border-radius: 16px !important;
  padding: 8px 14px !important;
  color: #2D1B12 !important;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) !important;
  cursor: pointer !important;
  animation: floatWidget 4s ease-in-out infinite, pulseGlow 3s infinite !important;
}

#sticky-timer-widget:hover {
  transform: translateY(-5px) scale(1.02) !important;
  border-color: rgba(220, 38, 38, 0.6) !important;
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

#sticky-timer-widget .pulse-dot {
  width: 7px !important;
  height: 7px !important;
  background: #EF4444 !important;
  border-radius: 50% !important;
  box-shadow: 0 0 10px #EF4444 !important;
  animation: pulseDot 1.5s infinite !important;
  display: inline-block !important;
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
  background: linear-gradient(135deg, #EF4444 0%, #B91C1C 100%) !important;
  padding: 4px 9px !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.35) !important;
  transition: transform 0.2s ease !important;
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
  animation: colonBlink 1s infinite !important;
}

/* ── MOBILE VIEW: FLOATING ANIMATED RED PILL CAPSULE (MATCHING SCREENSHOT) ── */
@media (max-width: 768px) {
  #sticky-timer-widget {
    top: 60px !important;
    right: 10px !important;
    padding: 5px 12px !important;
    border-radius: 50px !important;
    background: linear-gradient(135deg, #EF4444 0%, #B91C1C 100%) !important;
    border: 1px solid rgba(255, 255, 255, 0.35) !important;
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5) !important;
    animation: pulseGlow 2.5s infinite !important;
  }
  #sticky-timer-widget .sticky-timer-content {
    flex-direction: row !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 4px !important;
  }
  #sticky-timer-widget .stk-txt {
    display: none !important;
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
    opacity: 0.9 !important;
    animation: colonBlink 1s infinite !important;
  }
}
`;

stylesContent = stylesContent.replace(
  /\/\* =+\s*STICKY FLOATING LIVE OFFER TIMER[\s\S]*/g,
  updatedCss
);

fs.writeFileSync(stylesPath, stylesContent, 'utf8');
console.log('Updated styles.css with animations and matching color system');
