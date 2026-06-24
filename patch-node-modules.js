const fs = require('fs');
const path = require('path');

function replaceWithRegex(filePath) {
    const ext = path.extname(filePath);
    if (ext === '.js') {
        let txt = fs.readFileSync(filePath, 'utf8');
        let originalTxt = txt;
        
        // 1. pdfjsLib.getDocument({ data: buffer }) -> { data: buffer.slice(0) }
        txt = txt.replace(/\{(\s*)data:\s*buffer(\s*)\}/g, "{$1data: buffer.slice(0)$2}");
        // 2. pdfjsLib.getDocument({ data: this.basePdfBytes }) -> { data: this.basePdfBytes.slice(0) }
        txt = txt.replace(/\{(\s*)data:\s*this\.basePdfBytes(\s*)\}/g, "{$1data: this.basePdfBytes.slice(0)$2}");
        // 3. pdfjsLib.getDocument({ data: arrayBuffer }) -> { data: arrayBuffer.slice(0) }
        txt = txt.replace(/\{(\s*)data:\s*arrayBuffer(\s*)\}/g, "{$1data: arrayBuffer.slice(0)$2}");

        if (txt !== originalTxt) {
            fs.writeFileSync(filePath, txt, 'utf8');
            console.log(`Updated regex ${filePath}`);
        }
    }
}

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else {
            replaceWithRegex(fullPath);
        }
    }
}

walkDir('d:/budget/node_modules/pdf-annotator');
console.log('Done patching node_modules directly!');
