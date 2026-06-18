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
        } else if (file.endsWith('.html')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('d:/budget/src/app/acc3d');
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('class="modal fade"') || content.includes('class="modal fade ')) {
        const newContent = content.replace(/class=\"modal fade\"/g, 'class="modal fade" data-bs-focus="false"')
                                  .replace(/class=\"modal fade /g, 'class="modal fade" data-bs-focus="false" ');
        if (content !== newContent) {
            fs.writeFileSync(file, newContent, 'utf8');
            changedCount++;
            console.log('Updated: ' + file);
        }
    }
});
console.log('Total files updated: ' + changedCount);
