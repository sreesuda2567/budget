const fs = require('fs');
const content = fs.readFileSync('d:/budget/node_modules/pdf-annotator/fesm2015/pdf-annotator.js', 'utf8');
const idx = content.indexOf('signature-modal__canvas');
console.log(content.substring(idx - 2500, idx - 1000));
