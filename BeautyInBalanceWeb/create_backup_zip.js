const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoPath = 'c:/Users/etsy dream/Desktop/hg (1)/hg (1)/hg/BeautyInBalanceWeb';
const backupFile = path.join(repoPath, 'full_products_backup.js');
const outputFolder = path.join(repoPath, 'ProductsBackup');

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

// Read and parse the backup file
let jsCode = fs.readFileSync(backupFile, 'utf8');
let jsonStart = jsCode.indexOf('[');
let jsonEnd = jsCode.lastIndexOf(']');
let jsonStr = jsCode.substring(jsonStart, jsonEnd + 1);

let products = [];
try {
  products = JSON.parse(jsonStr);
} catch (e) {
  products = eval('(' + jsonStr + ')');
}

let successCount = 0;

products.forEach((p, idx) => {
  let imgs = [];
  if (p.images && Array.isArray(p.images)) imgs.push(...p.images);
  if (p.img) imgs.push(p.img);
  imgs = [...new Set(imgs)];

  imgs.forEach((img, i) => {
    if (!img) return;
    
    if (img.startsWith('data:image/')) {
      // It's a base64 image
      const matches = img.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches) {
        const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const fileName = `product_${p.id || idx}_image_${i}.${ext}`;
        fs.writeFileSync(path.join(outputFolder, fileName), buffer);
        successCount++;
      }
    } else {
      // It's a file path
      let decodedImg = img;
      try { decodedImg = decodeURIComponent(img); } catch(e){}
      
      const srcPath = path.join(repoPath, decodedImg);
      const destPath = path.join(outputFolder, decodedImg.replace(/\//g, '_'));
      
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        successCount++;
      } else {
        const srcPath2 = path.join(repoPath, img);
        if (fs.existsSync(srcPath2)) {
          fs.copyFileSync(srcPath2, path.join(outputFolder, img.replace(/\//g, '_')));
          successCount++;
        }
      }
    }
  });
});

fs.copyFileSync(backupFile, path.join(outputFolder, 'full_products_backup.js'));

// Zip the folder using PowerShell
execSync(`powershell -Command "Compress-Archive -Path '${outputFolder}/*' -DestinationPath '${repoPath}/ProductsBackup.zip' -Force"`);

console.log('Successfully created ProductsBackup.zip with ' + successCount + ' images and the backup file.');
