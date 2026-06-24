const fs = require('fs');
const path = require('path');

function replaceExact(filePath) {
    const ext = path.extname(filePath);
    if (ext === '.js' || ext === '.ts') {
        let txt = fs.readFileSync(filePath, 'utf8');
        let originalTxt = txt;
        
        const replacements = [
            ['{ data: this.basePdfBytes }', '{ data: this.basePdfBytes.slice(0) }'],
            ['{ data: buffer }', '{ data: buffer.slice(0) }'],
            ['{ data: arrayBuffer }', '{ data: arrayBuffer.slice(0) }']
        ];

        for (const [from, to] of replacements) {
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

walkDir('d:/budget/temp_pdf_130/package');
console.log('Done patch!');
