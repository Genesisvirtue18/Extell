const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fullPath.includes('/node_modules')) return;
    
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (file === 'page.jsx') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Add dynamic export if not present
      if (!content.includes("export const dynamic")) {
        content = "export const dynamic = 'force-dynamic';\n\n" + content;
        fs.writeFileSync(fullPath, content);
        console.log('Added dynamic to:', fullPath);
      }
    }
  });
}

processDir('./src/app');
console.log('Done');
