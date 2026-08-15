const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const newDrawerHTML = `  <div class="mobile-drawer" id="mobile-drawer">
    <div class="m-sidebar-header">
        <div class="m-search-wrap">
            <input type="text" placeholder="Search for products" id="m-sidebar-search-input">
            <button aria-label="Search" onclick="submitMobileSearch()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg></button>
        </div>
    </div>
    
    <div class="m-sidebar-tabs">
        <button class="m-tab active" id="m-tab-btn-menu" onclick="switchMobileTab('menu')">MENU</button>
        <button class="m-tab" id="m-tab-btn-categories" onclick="switchMobileTab('categories')">CATEGORIES</button>
    </div>

    <div class="m-sidebar-body">
        <!-- MENU TAB -->
        <ul class="m-sidebar-list" id="m-tab-menu">
            <li><a href="index.html" class="blue-text">HOME</a></li>
            <li><a href="shop.html" class="blue-text">SHOP</a></li>
            <li><a href="shop.html?filter=limited">LIMITED OFFERS</a></li>
            <li><a href="about.html">ABOUT US</a></li>
            <li><a href="contact.html">CONTACT US</a></li>
            <li><a href="shop.html?filter=festival">🛍️ SHOPPING FESTIVAL</a></li>
            <li><a href="#">ORDER STATUS</a></li>
            <li><a href="#">♡ WISHLIST</a></li>
        </ul>

        <!-- CATEGORIES TAB -->
        <ul class="m-sidebar-list" id="m-tab-categories" style="display: none;">
            <li><a href="shop.html?filter=cleansers">CLEANSERS</a></li>
            <li><a href="shop.html?filter=serums">SERUMS</a></li>
            <li><a href="shop.html?filter=moisturizers">MOISTURIZERS</a></li>
            <li><a href="shop.html?filter=sunscreen">SUNSCREEN</a></li>
            <li><a href="shop.html?filter=acids">ACIDS & EXFOLIANTS</a></li>
            <li><a href="shop.html?filter=retinoids">RETINOIDS</a></li>
            <li><a href="shop.html?filter=body">BODY CARE</a></li>
            <li><a href="shop.html?filter=targeted">TARGETED CARE</a></li>
            <li><a href="shop.html?filter=hair">HAIR CARE</a></li>
        </ul>
    </div>
  </div>`;

// We want to replace <div class="mobile-drawer" id="mobile-drawer"> ... up to its final </div>
for (const file of files) {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  
  // Find start index
  const startIndex = content.indexOf('<div class="mobile-drawer" id="mobile-drawer">');
  if (startIndex === -1) {
    console.log('Skipped', file);
    continue;
  }
  
  // Find the matching closing </div>
  let count = 0;
  let endIndex = -1;
  let i = startIndex;
  while (i < content.length) {
    if (content.substr(i, 4) === '<div') {
      count++;
      i += 4;
    } else if (content.substr(i, 6) === '</div') {
      count--;
      i += 6;
      if (count === 0) {
        endIndex = i + 1; // including >
        break;
      }
    } else {
      i++;
    }
  }

  if (endIndex !== -1) {
    content = content.substring(0, startIndex) + newDrawerHTML + content.substring(endIndex);
    fs.writeFileSync(path.join(dir, file), content, 'utf8');
    console.log('Updated', file);
  } else {
    console.log('Could not find end', file);
  }
}
