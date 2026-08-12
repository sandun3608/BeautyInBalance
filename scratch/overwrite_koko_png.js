const fs = require('fs');

const srcPath = 'C:\\Users\\etsy dream\\.gemini\\antigravity\\brain\\55a42547-0e7f-41e1-8f01-4fca9433a38f\\koko_logo_new_1786230448661.png';
const destPath = 'koko-logo.png';

if (fs.existsSync(srcPath)) {
   fs.copyFileSync(srcPath, destPath);
   console.log('✅ Overwrote koko-logo.png with HD generated image!');
} else {
   console.error('Source file not found:', srcPath);
}
