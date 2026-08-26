const fs = require('fs');
const axios = require('axios');

// The ImgBB API Key provided
const IMGBB_API_KEY = '2dcc02fe5238d7cc12286e49dbf4e467';

// Input and Output files
const INPUT_FILE = 'C:\\Users\\etsy dream\\Desktop\\products_db_backup.json';
const OUTPUT_FILE = 'C:\\Users\\etsy dream\\Desktop\\products_db_migrated.json';

// ImgBB Upload Helper Function
async function uploadToImgBB(base64String) {
    try {
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
        const formData = new URLSearchParams();
        formData.append('image', base64Data);

        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const data = response.data;
        
        if (data.success) {
            return data.data.url; 
        } else {
            console.error("ImgBB Upload Failed:", data.error.message);
            return null;
        }
    } catch (err) {
        console.error("Error uploading to ImgBB:", err.message);
        return null;
    }
}

async function migrateImages() {
    console.log("Starting local JSON migration...");

    try {
        let raw = fs.readFileSync(INPUT_FILE, 'utf16le');
        if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1); // Remove BOM
        
        const data = JSON.parse(raw);
        const products = data.value;

        console.log(`Found ${products.length} products to check in JSON backup.`);
        let migratedCount = 0;

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            let isModified = false;

            // 1. Migrate main 'img' field
            if (product.img && product.img.startsWith('data:image')) {
                console.log(`[${i+1}/${products.length}] Uploading main image for ${product.name}...`);
                const imgbbUrl = await uploadToImgBB(product.img);
                if (imgbbUrl) {
                    product.img = imgbbUrl;
                    isModified = true;
                    console.log(`   ✅ Main image migrated to: ${imgbbUrl}`);
                }
            }

            // 2. Migrate 'images' array
            if (product.images && product.images.length > 0) {
                for (let j = 0; j < product.images.length; j++) {
                    if (product.images[j].startsWith('data:image')) {
                        console.log(`[${i+1}/${products.length}] Uploading array image [${j}] for ${product.name}...`);
                        const imgbbUrl = await uploadToImgBB(product.images[j]);
                        if (imgbbUrl) {
                            product.images[j] = imgbbUrl;
                            isModified = true;
                            console.log(`   ✅ Array image migrated to: ${imgbbUrl}`);
                        }
                    }
                }
            }

            if (isModified) {
                migratedCount++;
                await new Promise(resolve => setTimeout(resolve, 500)); // 0.5s delay to avoid rate limit
            }
        }

        // Save new JSON
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf8');
        console.log(`\n🎉 Migration Complete! Saved to ${OUTPUT_FILE}`);
        console.log(`Migrated ${migratedCount} products.`);

    } catch (err) {
        console.error("Migration Error:", err);
    }
}

migrateImages();
