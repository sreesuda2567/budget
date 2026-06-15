const fs = require('fs');
const content = fs.readFileSync('d:/budget/node_modules/pdf-annotator/fesm2015/pdf-annotator.js', 'utf8');
const lines = content.split('\n');
const start = lines.findIndex(l => l.includes('onSignaturePointerDown') || l.includes('onSignatureTouchStart'));
if(start !== -1) {
    console.log(lines.slice(start, start + 30).join('\n'));
}
