const fs = require('fs');
const content = fs.readFileSync('d:/budget/node_modules/pdf-annotator/esm2015/lib/pdf-annotator-modal.component.js', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
    if (line.includes('signature') || line.includes('canvas')) {
        const matches = line.match(/(class|id)=['"]([^'"]+)['"]/g);
        if (matches) console.log(matches.join(', '));
    }
});
