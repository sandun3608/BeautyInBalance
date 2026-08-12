const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// Helper to recursively find HTML files
function getHtmlFiles(dir, filesList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            // Exclude node_modules, .git, and other hidden/system folders
            if (file !== 'node_modules' && !file.startsWith('.') && file !== 'scratch') {
                getHtmlFiles(filePath, filesList);
            }
        } else if (file.endsWith('.html')) {
            filesList.push(filePath);
        }
    }
    return filesList;
}

function bumpVersions() {
    console.log(`Scanning HTML files in: ${rootDir}`);
    const htmlFiles = getHtmlFiles(rootDir);
    console.log(`Found ${htmlFiles.length} HTML files.`);

    const versionPattern = /(href|src)="([^"]+?\.(?:css|js|json))\?v=(\d+)"/g;
    let totalReplacements = 0;

    for (const filePath of htmlFiles) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Perform replacement and increment the version number
        const newContent = content.replace(versionPattern, (match, attr, assetPath, versionStr) => {
            const currentVersion = parseInt(versionStr, 10);
            const newVersion = currentVersion + 1;
            modified = true;
            totalReplacements++;
            console.log(`  [${path.basename(filePath)}] Bumping ${assetPath} version: ${currentVersion} -> ${newVersion}`);
            return `${attr}="${assetPath}?v=${newVersion}"`;
        });

        if (modified) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`✅ Saved: ${path.basename(filePath)}`);
        }
    }

    console.log(`\nCache busting complete. Total replacements made: ${totalReplacements}`);
}

bumpVersions();
