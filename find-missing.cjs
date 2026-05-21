const fs = require('fs');
const path = require('path');
const glob = require('glob');

const files = glob.sync('src/**/*.{ts,tsx}');
console.error(`Found ${files.length} files`);
const allImports = new Set();
files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    const regex = /import\s*{\s*([^}]*)\s*}\s*from\s*['"]@\/api\/apiService['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
    if (f.includes('IPD.tsx')) {
      console.error(`Found IPD.tsx imports: [${match[1]}]`);
    }
    match[1].split(',').forEach(i => {
      const name = i.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').split(/\s+as\s+/)[0].trim();
      if (name && !name.includes('\n') && !name.includes('}')) allImports.add(name);
      else if (name.includes('}')) {
        const actualName = name.split('}')[0].trim();
        if (actualName) allImports.add(actualName);
      }
    });
  }
});
console.error(`Total imports found: ${allImports.size}`);
if (allImports.has('getIPDAdmissions')) {
  console.error('getIPDAdmissions IS in allImports');
} else {
  console.error('getIPDAdmissions IS NOT in allImports');
}
const apiServicePath = path.join(process.cwd(), 'src', 'api', 'apiService.ts');
const apiServiceContent = fs.readFileSync(apiServicePath, 'utf8');
const missing = [];
allImports.forEach(imp => {
    if (imp === 'apiRequest' || imp === 'extractArray' || imp === 'useAuth') return;
    if (!apiServiceContent.match(new RegExp(`export const ${imp}\\b`))) {
      missing.push(imp);
    }
  });

console.log(JSON.stringify(missing, null, 2));
