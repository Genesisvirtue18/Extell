const fs = require('fs');
let content = fs.readFileSync('./src/upsCalc/Pages/ResulltPage.jsx', 'utf8');

// Add use client if missing
if (!content.includes("'use client'")) {
  content = "'use client';\n\n" + content;
}

// Replace react-router-dom imports with next/router
content = content.replace(
  /import\s*{\s*useLocation\s*,\s*useNavigate\s*}\s*from\s*['"]react-router-dom['"]/g,
  "import { useRouter } from 'next/navigation'"
);

// Replace useNavigate with useRouter usage if needed
fs.writeFileSync('./src/upsCalc/Pages/ResulltPage.jsx', content);
console.log('Fixed ResulltPage');
