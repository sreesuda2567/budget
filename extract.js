const fs = require('fs');

const content = fs.readFileSync('d:\\budget\\local_modules\\pdf-annotator\\esm2015\\lib\\pdf-annotator-modal.component.js', 'utf8');

const tStartStr = 'template: "';
let tStart = content.indexOf(tStartStr);
if (tStart === -1) {
    console.log("Could not find template");
} else {
    let tEnd = content.indexOf('",\n', tStart);
    let templateRaw = content.substring(tStart + tStartStr.length, tEnd);
    let template = eval('"' + templateRaw + '"');
    fs.writeFileSync('d:\\budget\\src\\app\\shared\\pdf-annotator\\pdf-annotator-modal.component.html', template);
    console.log("Wrote HTML");
}

const sStartStr = 'styles: ["';
let sStart = content.indexOf(sStartStr);
if (sStart === -1) {
    console.log("Could not find styles");
} else {
    let sEnd = content.indexOf('"]\n', sStart);
    let stylesRaw = content.substring(sStart + sStartStr.length, sEnd);
    let styles = eval('"' + stylesRaw + '"');
    fs.writeFileSync('d:\\budget\\src\\app\\shared\\pdf-annotator\\pdf-annotator-modal.component.scss', styles);
    console.log("Wrote SCSS");
}
