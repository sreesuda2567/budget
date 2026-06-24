const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    const ext = path.extname(filePath);
    if (ext === '.js' || ext === '.ts') {
        let txt = fs.readFileSync(filePath, 'utf8');
        let originalTxt = txt;
        // Match PDFDocument.load(arg) and replace with PDFDocument.load(arg, { ignoreEncryption: true })
        // Be careful not to replace if it already has ignoreEncryption: true
        txt = txt.replace(/PDFDocument\.load\(([^,]+)\)/g, "PDFDocument.load($1, { ignoreEncryption: true })");
        if (txt !== originalTxt) {
            fs.writeFileSync(filePath, txt, 'utf8');
            console.log(`Patched ${filePath}`);
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
            replaceInFile(fullPath);
        }
    }
}

walkDir('d:/budget/temp_pdf_annotator_120/package');
console.log('Done!');
