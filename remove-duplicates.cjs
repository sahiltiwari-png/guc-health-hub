const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'api', 'apiService.ts');
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
const seen = new Set();
const result = [];

let inHeader = true;

for (const line of lines) {
  if (line.startsWith('export const ')) {
    inHeader = false;
    const nameMatch = line.match(/export const (\w+) =/);
    if (nameMatch) {
      const name = nameMatch[1];
      if (seen.has(name)) {
        console.log(`Removing duplicate: ${name}`);
        continue;
      }
      seen.add(name);
    }
  }
  result.push(line);
}

fs.writeFileSync(filePath, result.join('\n'));
console.log('Duplicates removed successfully!');
