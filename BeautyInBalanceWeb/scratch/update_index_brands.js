const fs = require('fs');

const indexPath = 'index.html';
let indexHtml = fs.readFileSync(indexPath, 'utf-8');

// Replace the hardcoded brands with a dynamic container and a script
const startTag = '<div class="brands-track">';
const endTag = '</div>\n      </div>\n    </section>';

const startIndex = indexHtml.indexOf(startTag);
if (startIndex !== -1) {
    // Find the end index
    let tempIndex = indexHtml.indexOf('</section>', startIndex);
    
    if (tempIndex !== -1) {
        const originalSection = indexHtml.substring(startIndex, tempIndex + 10);
        
        const newSection = `
        <div class="brands-track" id="brands-track-container">
            <!-- JS WILL INJECT BRANDS HERE -->
        </div>
      </div>
    </section>

    <!-- FETCH DYNAMIC BRANDS -->
    <script>
      (async function() {
        try {
          const track = document.getElementById('brands-track-container');
          if (!track) return;
          
          const BASE = window.BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');
          const res = await fetch(BASE + '/brands');
          
          if (!res.ok) throw new Error('Failed to fetch brands');
          const brands = await res.json();
          
          if (brands && brands.length > 0) {
              let html = '';
              // Create the HTML for one set
              brands.forEach(b => {
                  html += \`<div class="brand-item"><img src="\${b.image}" alt="\${b.name}"></div>\`;
              });
              
              // Duplicate it for the seamless scrolling effect
              track.innerHTML = html + html;
          } else {
              // Fallback to defaults if DB is empty
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
        } catch (err) {
          console.error('Brands fetch error:', err);
        }
      })();
    </script>
        `;
        
        // Use replace but be careful since there are two sections (purity style etc). Let's just replace the first one.
        // Wait, looking at the previous grep result, there are multiple matches because I think my tool output was duplicated?
        // Let's use regex to replace all instances of the brands track.
        indexHtml = indexHtml.replace(originalSection, newSection.trim());
        fs.writeFileSync(indexPath, indexHtml);
        console.log('index.html updated successfully.');
    }
}
