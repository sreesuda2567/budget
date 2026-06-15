const fs = require('fs');
const content = fs.readFileSync('d:/budget/node_modules/pdf-annotator/fesm2015/pdf-annotator.js', 'utf8');
const match = content.match(/template:\s*`([\s\S]*?)`/);
if (match) {
    fs.writeFileSync('d:/budget/template.html', match[1]);
    console.log("Template extracted to template.html");
} else {
    console.log("Template not found");
}
