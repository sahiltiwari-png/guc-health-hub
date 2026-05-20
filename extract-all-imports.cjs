const fs = require('fs');
const path = require('path');

const files = [];
function getFiles(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(file => {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') getFiles(p);
    } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
      files.push(p);
    }
  });
}

getFiles('src');

const imports = new Set();
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Match both single and multiline imports
  const regex = /import\s*{([\s\S]*?)}\s*from\s*['"]@\/api\/apiService['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const importContent = match[1];
    // Split by comma and clean up
    importContent.split(',').forEach(i => {
      const cleaned = i.replace(/\/\/.*$/gm, '') // Remove single line comments
                      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multiline comments
                      .trim();
      if (!cleaned) return;
      
      // Handle "name as alias"
      const name = cleaned.split(/\s+as\s+/)[0].trim();
      if (name && !name.includes('\n') && !name.includes('}')) {
        imports.add(name);
      } else if (name.includes('}')) {
        // Handle cases where the closing brace is caught
        const actualName = name.split('}')[0].trim();
        if (actualName) imports.add(actualName);
      }
    });
  }
});

console.log(JSON.stringify(Array.from(imports).sort(), null, 2));
