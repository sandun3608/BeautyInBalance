try {
   const { createCanvas } = require('canvas');
   console.log('canvas available!');
} catch (e) {
   console.log('canvas not available:', e.message);
}
