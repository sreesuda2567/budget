const fs = require('fs');
const path = require('path');

function fixSyntaxError(filePath) {
    const ext = path.extname(filePath);
    if (ext === '.js' || ext === '.ts') {
        let txt = fs.readFileSync(filePath, 'utf8');
        let originalTxt = txt;
        
        // Fix the syntax error from previous bad replace
        txt = txt.replace(/\)\.getPages\(, \{ ignoreEncryption: true \}\)/g, ').getPages()');
        // And fix PDFDocument.load(copy).getPages(, { ignoreEncryption: true }) which became PDFDocument.load(copy, { ignoreEncryption: true }).getPages() 
        // Wait, the previous replace was: "PDFDocument.load($1, { ignoreEncryption: true })"
        // If it matched `copy).getPages(`, it became `PDFDocument.load(copy).getPages(, { ignoreEncryption: true })`.
        txt = txt.replace(/\.getPages\(, \{ ignoreEncryption: true \}\)/g, '.getPages()');

        if (txt !== originalTxt) {
            fs.writeFileSync(filePath, txt, 'utf8');
            console.log(`Fixed ${filePath}`);
        }
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else {
            fixSyntaxError(fullPath);
        }
    }
}

walkDir('d:/budget/temp_pdf_annotator_120/package');
console.log('Done fixing!');
