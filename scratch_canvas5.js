const fs = require('fs');
const content = fs.readFileSync('d:/budget/node_modules/pdf-annotator/fesm2015/pdf-annotator.js', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
    if (line.includes('signatureCanvas') || line.includes('signatureCtx')) {
        console.log(`Line ${i}: ${line.trim()}`);
    }
});
