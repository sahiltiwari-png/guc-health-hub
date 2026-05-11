const fs = require('fs');
const path = require('path');
const glob = require('glob');

const pageFiles = glob.sync('src/**/*.tsx');
const mockPatterns = [
  /const\s+\[[a-zA-Z0-9_]+,\s*[a-zA-Z0-9_]+\]\s*=\s*useState\(\s*\[\s*\{/s, // useState with array of objects
  /rows\s*=\s*\{\s*\[\s*\[/s, // rows={[ [...], [...] ]}
  /value\s*=\s*['"]\d+['"]/s, // value="123"
  /value\s*=\s*['"]₹/s, // value="₹..."
];

const results = [];

for (const file of pageFiles) {
  if (file.includes('apiService.ts')) continue;
  const content = fs.readFileSync(file, 'utf8');
  const fileMocks = [];
  
  mockPatterns.forEach((pattern, index) => {
    if (pattern.test(content)) {
      fileMocks.push(`Pattern ${index}`);
    }
  });
  
  if (fileMocks.length > 0) {
    results.push({ file, mocks: fileMocks });
  }
}

console.log('Potential UI files with mock data:', results.length);
results.forEach(r => console.log(`- ${r.file} (${r.mocks.join(', ')})`));
