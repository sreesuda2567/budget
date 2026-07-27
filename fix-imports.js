const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('pdf-annotator')) {
    const updated = content.replace(/['"]pdf-annotator['"]/g, "'src/app/shared/pdf-annotator/public-api'");
    if (content !== updated) {
        fs.writeFileSync(file, updated);
        console.log(`Updated ${file}`);
    }
  }
});
