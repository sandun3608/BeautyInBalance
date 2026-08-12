const fs = require('fs');
const stat = fs.statSync('koko-logo.png');
console.log('koko-logo.png file size:', stat.size, 'bytes');
