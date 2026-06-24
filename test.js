const fs = require('fs');
const txt = fs.readFileSync('d:/budget/node_modules/pdf-annotator/fesm2015/pdf-annotator.js', 'utf8');
const start = 209859;
console.log(txt.substring(start - 1000, start + 3000));
