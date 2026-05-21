const fs = require('fs');
const path = require('path');

const apiServicePath = path.join(process.cwd(), 'src', 'api', 'apiService.ts');
const content = fs.readFileSync(apiServicePath, 'utf8');
const lines = content.split('\n');

const defined = new Set();
// First pass: find all defined functions
lines.forEach(line => {
  const match = line.match(/^export const (\w+)/);
  if (match) defined.add(match[1]);
});

// Second pass: find aliases where RHS is not defined
const broken = [];
lines.forEach((line, i) => {
  const match = line.match(/^export const (\w+) = (\w+);/);
  if (match) {
    const lhs = match[1];
    const rhs = match[2];
    if (!defined.has(rhs)) {
      broken.push({ line: i + 1, lhs, rhs });
    }
  }
});

console.log(JSON.stringify(broken, null, 2));
