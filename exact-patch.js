const fs = require('fs');
const path = require('path');

function replaceExact(filePath) {
    const ext = path.extname(filePath);
    if (ext === '.js' || ext === '.ts') {
        let txt = fs.readFileSync(filePath, 'utf8');
        let originalTxt = txt;
        
        // Exact replacements to avoid Regex issues
        const replacements = [
            ['PDFDocument.load(this.basePdfBytes)', 'PDFDocument.load(this.basePdfBytes, { ignoreEncryption: true })'],
            ['PDFDocument.load(copy)', 'PDFDocument.load(copy, { ignoreEncryption: true })'],
            ['PDFDocument.load(buffer)', 'PDFDocument.load(buffer, { ignoreEncryption: true })'],
            ['PDFDocument.load(arrayBuffer)', 'PDFDocument.load(arrayBuffer, { ignoreEncryption: true })']
        ];

        for (const [from, to] of replacements) {
            // using split and join to replace all occurrences literally
            txt = txt.split(from).join(to);
        }

        if (txt !== originalTxt) {
            fs.writeFileSync(filePath, txt, 'utf8');
            console.log(`Updated exactly ${filePath}`);
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
            replaceExact(fullPath);
        }
    }
}

walkDir('d:/budget/temp_pdf_annotator_120/package');
console.log('Done exact fix!');
