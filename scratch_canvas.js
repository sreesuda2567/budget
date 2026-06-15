const fs = require('fs');
const content = fs.readFileSync('d:/budget/node_modules/pdf-annotator/fesm2015/pdf-annotator.js', 'utf8');
let idx = content.indexOf('<canvas');
while(idx !== -1) {
    console.log(content.substring(idx - 50, idx + 150).replace(/\n/g, ' '));
    idx = content.indexOf('<canvas', idx + 1);
}
