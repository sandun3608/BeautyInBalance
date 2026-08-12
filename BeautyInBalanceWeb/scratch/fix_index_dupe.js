const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf-8');

// Find the second <!DOCTYPE html>
const firstDoctype = content.indexOf('<!DOCTYPE html>');
const secondDoctype = content.indexOf('<!DOCTYPE html>', firstDoctype + 15);

if (secondDoctype !== -1) {
    content = content.substring(secondDoctype);
    fs.writeFileSync('index.html', content);
    console.log('✅ Duplicate header in index.html removed successfully!');
} else {
    console.log('No duplicate <!DOCTYPE html> found.');
}
