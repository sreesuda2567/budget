const fs = require('fs');
const txt = fs.readFileSync('d:/budget/temp_pdf_annotator_120/package/fesm2015/pdf-annotator.js', 'utf8');
const start = txt.indexOf('class="thumb-item"');
if(start > -1) {
    console.log(txt.substring(start - 200, start + 1000));
} else {
    console.log('not found');
}
