const fs = require('fs');
const path = require('path');

const sectionsDir = './src/components/sections';
const files = fs.readdirSync(sectionsDir);

files.forEach(file => {
  if (file.endsWith('.jsx')) {
    const fullPath = path.join(sectionsDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    if (!content.includes("'use client'")) {
      content = "'use client';\n\n" + content;
      fs.writeFileSync(fullPath, content);
      console.log('Added use client to:', file);
    }
  }
});
