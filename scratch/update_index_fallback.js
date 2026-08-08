const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

const oldCatch = `        } catch (err) {
          console.error('Brands fetch error:', err);
        }`;
const newCatch = `        } catch (err) {
          console.error('Brands fetch error:', err);
          // Fallback if API fails or is still deploying
          const track = document.getElementById('brands-track-container');
          if (track) {
              const defaultHtml = \`
                <div class="brand-item"><img src="brand/1.png" alt="The Ordinary"></div>
                <div class="brand-item"><img src="brand/2.png" alt="CeraVe"></div>
                <div class="brand-item"><img src="brand/3.png" alt="Beauty of Joseon"></div>
                <div class="brand-item"><img src="brand/4.png" alt="Skin1004"></div>
                <div class="brand-item"><img src="brand/5.png" alt="Cetaphil"></div>
                <div class="brand-item"><img src="brand/6.png" alt="Dr. Althea"></div>
              \`;
              track.innerHTML = defaultHtml + defaultHtml;
          }
        }`;
html = html.replace(oldCatch, newCatch);

fs.writeFileSync('index.html', html);
console.log('index.html updated successfully with fallback logic.');
