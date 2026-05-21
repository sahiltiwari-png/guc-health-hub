const fs = require('fs');
const path = require('path');

const swaggerPath = path.join(__dirname, 'swagger.json');
const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

const endpoints = [];
for (const [path, methods] of Object.entries(swagger.paths)) {
  for (const [method, details] of Object.entries(methods)) {
    endpoints.push({
      path,
      method: method.toUpperCase(),
      summary: details.summary || details.operationId || 'No summary',
      tags: details.tags || []
    });
  }
}

fs.writeFileSync('all_endpoints.json', JSON.stringify(endpoints, null, 2));
console.log(`Extracted ${endpoints.length} endpoints.`);
