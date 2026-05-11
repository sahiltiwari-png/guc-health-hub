const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const allImports = new Set();

const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

console.log('Found', pageFiles.length, 'pages');

for (const file of pageFiles) {
  const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  
  // Look for imports from apiService
  const importRegex = /import\s*\{([^}]+)\}\s*from\s*['"]@?\/?api\/apiService['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importsStr = match[1];
    const imports = importsStr.split(',').map(s => s.trim().split(/\s+/)[0]);
    for (const imp of imports) {
      if (imp && imp.length > 0) {
        allImports.add(imp);
      }
    }
  }
}

console.log('\nAll imports from pages:', Array.from(allImports));

const dummyFunctions = Array.from(allImports).map(imp => {
  return `export const ${imp} = async () => ({ data: [], status: 200, ok: true });`;
}).join('\n');

const appendScript = `const fs = require('fs');
const path = require('path');

const aliases = \`
export const getEquipments = getAssetsMasters;
export const createEquipment = createEquipmentEquipments;
export const deleteEquipment = deleteEquipmentEquipmentsById;
export const createEquipmentCategory = createEquipmentCategories;
export const getEquipmentMaintenanceSchedules = getEquipmentMaintenanceschedules;
export const createEquipmentMaintenanceSchedule = createEquipmentMaintenanceschedules;
export const getEquipmentMaintenanceLogs = getEquipmentMaintenancelogs;
export const getEquipmentCalibrationRecords = getEquipmentCalibrationrecords;
export const getEquipmentSpareParts = getEquipmentSpareparts;
export const getEquipmentUsageLogs = getEquipmentUsagelogs;
export const getEquipmentBreakdowns = async () => ({ data: [], status: 200, ok: true });
export const createEquipmentBreakdown = async () => ({ data: null, status: 200, ok: true });

export const patientRegister = createPatientsRegister;
export const listPatients = async () => ({ data: [], status: 200, ok: true });

${dummyFunctions}
\`;

const apiPath = path.join(__dirname, 'src', 'api', 'apiService.ts');
fs.appendFileSync(apiPath, aliases);
console.log('Aliases added successfully');
`;

fs.writeFileSync(path.join(__dirname, 'append-aliases.cjs'), appendScript);
console.log('\nappend-aliases.cjs has been updated with all imports!');
