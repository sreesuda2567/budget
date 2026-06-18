const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('d:/budget/temp_pdf_annotator/package');
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('total > 50')) {
        const newContent = content.replace(/total > 50/g, 'total > 10');
        if (content !== newContent) {
            fs.writeFileSync(file, newContent, 'utf8');
            changedCount++;
            console.log('Updated: ' + file);
        }
    }
});
console.log('Total files updated: ' + changedCount);
