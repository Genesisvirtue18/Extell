const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fullPath.includes('/node_modules') || fullPath.includes('/.next')) return;
    
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (file === 'page.jsx') {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Skip if already has use client
      if (content.includes("'use client'")) {
        return;
      }
      
      // Add use client at the very start
      content = "'use client';\n\n" + content;
      fs.writeFileSync(fullPath, content);
      console.log('Added use client to:', fullPath);
    }
  });
}

processDir('./src/app');
console.log('Done');
