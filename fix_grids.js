const fs = require('fs');

function processFile(file, imgRegex, replacement) {
  let content = fs.readFileSync(file, 'utf8');

  // Add isOffline flag logic
  if (file.includes('index.html')) {
    content = content.replace(/renderHomeAllProducts\(\)/g, 'renderHomeAllProducts(!window.DB_FETCH_COMPLETED)');
    content = content.replace(/renderFeaturedProducts\(\)/g, 'renderFeaturedProducts(!window.DB_FETCH_COMPLETED)');
    content = content.replace(/renderShadeProducts\(activeItem\.textContent\.trim\(\)\)/g, 'renderShadeProducts(activeItem.textContent.trim(), !window.DB_FETCH_COMPLETED)');

    content = content.replace(/function renderHomeAllProducts\(\)/g, 'function renderHomeAllProducts(isOffline = false)');
    content = content.replace(/function renderFeaturedProducts\(\)/g, 'function renderFeaturedProducts(isOffline = false)');
    content = content.replace(/function renderShadeProducts\(shadeName\)/g, 'function renderShadeProducts(shadeName, isOffline = false)');
  }

  if (file.includes('shop.html')) {
    content = content.replace(/function renderShop\(\) \{/g, 'function renderShop(isOffline = false) {');
    content = content.replace(/if \(isEmpty\) renderShop\(\);/g, 'if (isEmpty) renderShop(!window.DB_FETCH_COMPLETED);');
    // Shop also fetches data on its own
    content = content.replace(/renderShop\(\);/g, 'renderShop(!window.DB_FETCH_COMPLETED);');
  }

  content = content.replace(imgRegex, replacement);

  fs.writeFileSync(file, content);
  console.log(file + ' updated');
}

const loaderHtml = "${isOffline ? `<div style='width: 100%; padding-top: 100%; position: relative; background: #f9f9f9;'><div style='position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 30px; height: 30px; border: 3px solid #f2efe9; border-top: 3px solid #c6975a; border-radius: 50%; animation: spin 1s linear infinite;'></div></div>` : `<img src=\"${img}\" alt=\"${p.name}\">`}";

processFile(
  'c:/Users/etsy dream/Desktop/hg (1)/hg (1)/hg/index.html',
  /<img src=\"\$\{img\}\" alt=\"\$\{p\.name\}\">/g,
  loaderHtml
);

const loaderHtmlShop = "${isOffline ? `<div style='width: 100%; padding-top: 100%; position: relative; background: #f9f9f9;'><div style='position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 30px; height: 30px; border: 3px solid #f2efe9; border-top: 3px solid #c6975a; border-radius: 50%; animation: spin 1s linear infinite;'></div></div>` : `<img src=\"${img}\" alt=\"${p.name}\" loading=\"lazy\">`}";

processFile(
  'c:/Users/etsy dream/Desktop/hg (1)/hg (1)/hg/shop.html',
  /<img src=\"\$\{img\}\" alt=\"\$\{p\.name\}\" loading=\"lazy\">/g,
  loaderHtmlShop
);
