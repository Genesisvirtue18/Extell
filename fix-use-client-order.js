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
      
      // Extract use client and dynamic export
      let useClientLine = '';
      let dynamicLine = '';
      let otherLines = '';
      
      const lines = content.split('\n');
      for (let line of lines) {
        if (line.includes("'use client'")) {
          useClientLine = line;
        } else if (line.includes('export const dynamic')) {
          dynamicLine = line;
        } else {
          otherLines += (otherLines ? '\n' : '') + line;
        }
      }
      
      // Reconstruct with correct order
      if (useClientLine) {
        let newContent = useClientLine + '\n';
        if (dynamicLine) {
          newContent += dynamicLine + '\n';
        }
        newContent += otherLines;
        
        fs.writeFileSync(fullPath, newContent);
        console.log('Fixed:', fullPath);
      }
    }
  });
}

processDir('./src/app');
console.log('Done');
