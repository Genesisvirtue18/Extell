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
      
      // Skip if already has use client
      if (content.includes("'use client'")) {
        return;
      }
      
      // Check if file uses React hooks or needs client
      if (content.includes('useState') || content.includes('useEffect') || 
          content.includes('useContext') || content.includes('useRef') ||
          content.includes('useForm') || content.includes('useNavigate') ||
          content.includes('useParams') || content.includes('useState(') ||
          content.includes('framer-motion')) {
        content = "'use client';\n\n" + content;
        fs.writeFileSync(fullPath, content);
        console.log('Added use client to:', fullPath);
      }
    }
  });
}

processDir('./src');
console.log('Done');
