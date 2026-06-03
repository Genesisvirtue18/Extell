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
      
      // Skip if already has use client or is a data file
      if (content.includes("'use client'") || file === 'siteData.jsx') {
        return;
      }
      
      // Check if file needs use client
      const needsUseClient = 
        // React hooks
        content.includes('useState') ||
        content.includes('useEffect') ||
        content.includes('useContext') ||
        content.includes('useRef') ||
        content.includes('useForm') ||
        content.includes('useNavigate') ||
        content.includes('useParams') ||
        content.includes('useRouter') ||
        content.includes('useLayout') ||
        // Framer Motion
        content.includes('motion.') ||
        content.includes('AnimatePresence') ||
        content.includes('from "framer-motion"') ||
        // Event handlers in JSX
        content.match(/onClick=|onChange=|onSubmit=|onScroll=/) ||
        // Dynamic interactions
        content.includes('setInterval') ||
        content.includes('setTimeout');
      
      if (needsUseClient) {
        // Add use client at the very beginning
        content = "'use client';\n\n" + content;
        fs.writeFileSync(fullPath, content);
        console.log('Added use client to:', fullPath);
      }
    }
  });
}

processDir('./src/components');
processDir('./src/pages');
processDir('./src/admin');
processDir('./src/upsCalc');
console.log('Done');
