const fs = require('fs');
const swagger = JSON.parse(fs.readFileSync('swagger.json', 'utf8'));
const tags = new Set();
for (const path in swagger.paths) {
  for (const method in swagger.paths[path]) {
    const operation = swagger.paths[path][method];
    if (operation.tags) {
      operation.tags.forEach(tag => tags.add(tag));
    }
  }
}
console.log(JSON.stringify(Array.from(tags).sort(), null, 2));
