const fs = require('fs');
const path = require('path');

function replaceWithRegex(filePath) {
    const ext = path.extname(filePath);
    if (ext === '.js') {
        let txt = fs.readFileSync(filePath, 'utf8');
        let originalTxt = txt;
        
        const oldCode = `const textLayer = new pdfjsLib.TextLayer({
                            textContentSource: textContent,
                            container: textLayerDiv,
                            viewport
                        });
                        yield textLayer.render();`;

        const newCode = `if (pdfjsLib.renderTextLayer) {
                            yield pdfjsLib.renderTextLayer({
                                textContentSource: textContent,
                                container: textLayerDiv,
                                viewport
                            }).promise;
                        } else {
                            const textLayer = new pdfjsLib.TextLayer({
                                textContentSource: textContent,
                                container: textLayerDiv,
                                viewport
                            });
                            yield textLayer.render();
                        }`;

        // Remove exact whitespace matching to be safe
        const searchRegex = /const\s+textLayer\s*=\s*new\s+pdfjsLib\.TextLayer\s*\(\s*\{\s*textContentSource:\s*textContent,\s*container:\s*textLayerDiv,\s*viewport\s*\}\s*\);\s*yield\s+textLayer\.render\s*\(\s*\);/g;
        
        txt = txt.replace(searchRegex, newCode);

        if (txt !== originalTxt) {
            fs.writeFileSync(filePath, txt, 'utf8');
            console.log(`Updated TextLayer in ${filePath}`);
        }
    }
}

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else {
            replaceWithRegex(fullPath);
        }
    }
}

walkDir('d:/budget/node_modules/pdf-annotator');
console.log('Done patching TextLayer!');
