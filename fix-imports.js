const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const originalContent = content;
      
      // Fix: const SOMETHING = '/assets/...' followed by import
      // Move all const declarations to after imports
      const lines = content.split('\n');
      const imports = [];
      const constDecs = [];
      const otherLines = [];
      let inImportSection = true;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Handle use client directive and empty lines at start
        if (i < 5 && (line.includes("'use client'") || line === '')) {
          otherLines.push(line);
        } else if (line.match(/^import\s+/)) {
          imports.push(line);
        } else if (line.match(/^const\s+\w+\s*=\s*['"`]/)) {
          constDecs.push(line);
        } else {
          if (imports.length > 0 || constDecs.length > 0) {
            inImportSection = false;
          }
          otherLines.push(line);
        }
      }
      
      // Reconstruct with proper order
      if (constDecs.length > 0) {
        const result = otherLines.slice(0, 3).join('\n') + '\n' +
                      imports.join('\n') + '\n\n' +
                      constDecs.join('\n') + '\n' +
                      otherLines.slice(3).join('\n');
        
        if (result !== originalContent) {
          fs.writeFileSync(fullPath, result);
          console.log('Fixed:', fullPath);
        }
      }
    }
  });
}

processDir('./src');
console.log('Done');
