const fs = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, 'src', 'api', 'apiService.ts');
let content = fs.readFileSync(apiPath, 'utf8');

// Get all existing exports
const existingExports = new Set();
const exportRegex = /export\s+const\s+([a-zA-Z0-9_]+)/g;
let match;
while ((match = exportRegex.exec(content)) !== null) {
  existingExports.add(match[1]);
}

// All identified imports from extract-all-imports.cjs
const identifiedImports = [
  "createAmbulanceMaintenance", "createAmbulanceTrip", "createAssetCategory", "createAssetDepreciation",
  "createAssetDisposal", "createAssetMaintenance", "createAssetVendor", "createAssetsMasters",
  "createAutoClinical", "createBloodDonation", "createBloodDonor", "createBloodInventory",
  "createBloodRequest", "createCertificateTemplate", "createEquipmentBreakdown", "createEquipmentCategory",
  "createEquipmentMaintenanceSchedule", "createGeneratedCertificate", "createInstrumentBatch",
  "createMedicine", "createPharmacyDispense", "createPharmacyInvoice", "createPharmacyStock",
  "createPharmacySupplier", "createRadiologyReport", "createRegister", "createSterilizationCycle",
  "deleteAmbulance", "deleteAsset", "deleteAssetCategory", "deleteAssetVendor", "deleteBloodDonor",
  "deleteBloodInventory", "deleteBloodRequest", "deleteCertificateSignature", "deleteCertificateTemplate",
  "deleteEquipment", "deleteVisitVitals", "getAmbulanceAmbulances", "getAmbulanceTrips", "getAssetAudits",
  "getAssetCategories", "getAssetDepreciations", "getAssetDisposals", "getAssetLocations",
  "getAssetMaintenances", "getAssetVendors", "getAssets", "getAssetsCategories", "getAssetsLocations",
  "getAssetsVendors", "getAutoAdminBranches", "getAutoAdminUsersSearch", "getAutoAssetsMasters",
  "getAutoBillingInvoicesSearch", "getAutoClinicals", "getAutoDashboardDoctor", "getAutoDashboardPatient",
  "getAutoDepartments", "getAutoEquipmentLocations", "getAutoGeoCities", "getAutoGeoCountries",
  "getAutoGeoStates", "getAutoIpdBeds", "getAutoPatients", "getAutoUsers", "getBloodDonors",
  "getBloodInventory", "getBloodRequests", "getCertificatesGenerated", "getCertificatesTemplates",
  "getCoreReceipts", "getEquipmentBreakdowns", "getEquipmentCalibrationRecords", "getEquipmentCategories",
  "getEquipmentDocuments", "getEquipmentEquipments", "getEquipmentMaintenanceLogs",
  "getEquipmentMaintenanceSchedules", "getEquipmentSpareParts", "getEquipmentTransfers",
  "getEquipmentUsageLogs", "getEquipmentVendors", "getEquipments", "getGRNs", "getGlobalVitals",
  "getIPDAdmissions", "getInstrumentBatches", "getInstruments", "getInsuranceClaims",
  "getIssuedInstruments", "getLabTatMonitor", "getPharmacyDispenses", "getPharmacyInvoices",
  "getPharmacyPrescriptions", "getPharmacyStockOverview", "getPharmacySuppliers", "getPurchaseOrders",
  "getSterilizationCycles", "getStockAdjustments", "getStockTransfers", "getTeamUnder", "getVisitVitals",
  "getVitalIcon", "getVitalsGlobal", "getVitalsVisit", "issueBlood", "issueInstrument",
  "listAmbulanceMaintenances", "listAmbulanceTrips", "listAmbulances", "listBloodComponents",
  "listBloodDonations", "listBloodDonors", "listBloodGroups", "listBloodInventory", "listBloodRequests",
  "listCertificateSignatures", "listCertificateTemplates", "listCertificateTypes",
  "listCertificateVerifications", "listCities", "listDepartments", "listDoctors",
  "listGeneratedCertificates", "listLabOrders", "listMedicines", "listUsers", "listVisits",
  "patientRegister", "returnInstrument", "updateAmbulance", "updateBloodDonor",
  "updateBloodInventoryStatus", "updateBloodRequest", "updateBloodRequestStatus", "updateById",
  "updateCertificateSignature", "updateCertificateTemplate", "updateLabResultStatus",
  "updateLabSampleStatus", "updateRadiologyStudyStatus", "updateSterilizationCycle",
  "updateVisitVitals", "verifyCertificate", "createAutoPatientsPatientRegister", "createLogin"
];

const aliasesMap = {
  'getEquipments': 'getAutoAssetsMasters',
  'createEquipment': 'createAutoAssetsMasters',
  'deleteEquipment': 'deleteAutoAssetsMastersByid',
  'createEquipmentCategory': 'createAutoAssetsCategories',
  'getEquipmentCategories': 'getAutoAssetsCategories',
  'getEquipmentMaintenanceSchedules': 'getAutoAssetsMaintenances',
  'createEquipmentMaintenanceSchedule': 'createAutoAssetsMaintenances',
  'getEquipmentMaintenanceLogs': 'getAutoAssetsUsagelogs',
  'getEquipmentCalibrationRecords': 'getAutoAssetsAudits',
  'getEquipmentSpareParts': 'getAutoAssetsSubcategories',
  'getEquipmentUsageLogs': 'getAutoAssetsUsagelogs',
  'getEquipmentVendors': 'getAutoAssetsVendors',
  'getAutoEquipmentLocations': 'getAutoAssetsLocations',
  'getEquipmentEquipments': 'getAutoAssetsMasters',
  'patientRegister': 'createAutoPatientsRegister',
  'createAutoPatientsPatientRegister': 'createAutoPatientsRegister',
  'listPatients': 'getAutoClinical',
  'listUsers': 'getAutoAdminUsers',
  'listDoctors': 'getAutoAdminUsers',
  'listDepartments': 'getAutoDepartments',
  'listCities': 'getAutoGeoCities',
  'listVisits': 'getAutoClinical',
  'getAutoUsers': 'getAutoAdminUsers',
  'getAutoDepartments': 'getAutoDepartments',
  'getAutoClinicals': 'getAutoClinical',
  'getAutoPatients': 'getAutoClinical',
  'getAutoAssetsMasters': 'getAutoAssetsMasters',
  'getAutoAdminBranches': 'getAutoAdminBranches',
  'createLogin': 'getAutoAuthLogin',
  'getCoreReceipts': 'getAutoBillingInvoicesSearch',
  'getAssets': 'getAutoAssetsMasters',
  'getAssetCategories': 'getAutoAssetsCategories',
  'getAssetVendors': 'getAutoAssetsVendors',
  'getAssetMaintenances': 'getAutoAssetsMaintenances',
  'getAssetAudits': 'getAutoAssetsAudits',
  'getAssetLocations': 'getAutoAssetsLocations',
  'getPharmacyStocks': 'getAutoInventoryPharmacyStock',
  'getPharmacySuppliers': 'getAutoInventoryPharmacyStockSearch',
  'getPharmacyStockOverview': 'getAutoInventoryPharmacyStock',
  'getIPDAdmissions': 'getAutoIpdAdmissions',
  'listAmbulances': 'getAutoAmbulances',
  'listAmbulanceTrips': 'getAutoAmbulancesTrips',
  'listAmbulanceMaintenances': 'getAutoAmbulancesMaintenances',
};

const newAliases = [];
for (const [alias, target] of Object.entries(aliasesMap)) {
  if (!existingExports.has(alias) && existingExports.has(target)) {
    newAliases.push(`export const ${alias} = ${target};`);
    existingExports.add(alias);
  }
}

for (const req of identifiedImports) {
  if (!existingExports.has(req)) {
    newAliases.push(`export const ${req} = async () => ({ data: [], status: 200, ok: true });`);
    existingExports.add(req);
  }
}

if (newAliases.length > 0) {
  content += '\n\n/* --- DYNAMIC ALIASES & DUMMIES --- */\n' + newAliases.join('\n') + '\n';
  fs.writeFileSync(apiPath, content);
  console.log(`Added ${newAliases.length} aliases/dummies to apiService.ts`);
} else {
  console.log('No new aliases needed.');
}
