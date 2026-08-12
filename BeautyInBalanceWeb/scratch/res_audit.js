const fs = require('fs');

function getDimensions(base64Str) {
  if (!base64Str || !base64Str.startsWith('data:image')) return null;
  const mimeMatch = base64Str.match(/^data:image\/(\w+);base64,/);
  if (!mimeMatch) return null;
  
  const type = mimeMatch[1];
  const buffer = Buffer.from(base64Str.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  
  try {
    if (type === 'png' && buffer.length > 24) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height, type };
    }
    if (type === 'jpeg' || type === 'jpg') {
      let i = 0;
      while (i < buffer.length - 8) {
        if (buffer[i] === 0xFF && (buffer[i+1] === 0xC0 || buffer[i+1] === 0xC2)) {
          const height = buffer.readUInt16BE(i + 5);
          const width = buffer.readUInt16BE(i + 7);
          return { width, height, type };
        }
        i++;
      }
    }
    if (type === 'webp') {
      // VP8X header check
      if (buffer.toString('ascii', 12, 16) === 'VP8X' && buffer.length >= 30) {
        const width = 1 + buffer.readUIntLE(24, 3);
        const height = 1 + buffer.readUIntLE(27, 3);
        return { width, height, type };
      }
      // VP8L (lossless) header check
      if (buffer.toString('ascii', 12, 16) === 'VP8L' && buffer.length >= 25) {
        const b0 = buffer[21], b1 = buffer[22], b2 = buffer[23], b3 = buffer[24];
        const width = 1 + (((b1 & 0x3F) << 8) | b0);
        const height = 1 + (((b3 & 0xF) << 10) | (b2 << 2) | ((b1 & 0xC0) >> 6));
        return { width, height, type };
      }
      // VP8 lossy header check
      if (buffer.toString('ascii', 12, 15) === 'VP8' && buffer.length >= 30) {
        const width = buffer.readUInt16LE(26) & 0x3FFF;
        const height = buffer.readUInt16LE(28) & 0x3FFF;
        return { width, height, type };
      }
    }
  } catch (e) {
    return null;
  }
  return null;
}

console.log('=== PRODUCT IMAGE RESOLUTION AUDIT ===\n');
const content = fs.readFileSync('products.js', 'utf8');
const match = content.match(/const defaultProducts = (\[[\s\S]*?\]);/);
if (match) {
  const data = JSON.parse(match[1]);
  console.log(`Auditing ${data.length} products...`);
  
  let highRes = 0;
  let midRes = 0;
  let lowRes = 0;
  const resList = [];
  
  data.forEach((p, idx) => {
    const dim = getDimensions(p.img);
    if (dim) {
      const resStr = `${dim.width} x ${dim.height} px`;
      if (dim.width >= 500 && dim.height >= 500) highRes++;
      else if (dim.width >= 300 && dim.height >= 300) midRes++;
      else lowRes++;
      resList.push({ name: p.name, cat: p.cat, res: resStr, w: dim.width, h: dim.height });
    } else {
      resList.push({ name: p.name, cat: p.cat, res: 'External File Path / Dynamic', w: 0, h: 0 });
    }
  });

  console.log(`\nSummary:`);
  console.log(`- High Resolution (500px+): ${highRes}`);
  console.log(`- Medium Resolution (300px - 499px): ${midRes}`);
  console.log(`- Low Resolution (< 300px): ${lowRes}`);
  
  console.log('\nSample Resolution List (First 20 items):');
  resList.slice(0, 25).forEach(item => {
    console.log(`- [${(item.cat||'').toUpperCase()}] ${item.name}: ${item.res}`);
  });
}
