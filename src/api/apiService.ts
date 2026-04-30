const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const getToken = () => localStorage.getItem('hms_token');
const getHospitalId = () => localStorage.getItem('hospital_id');
const getBranchId = () => localStorage.getItem('branch_id');

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const hospitalId = getHospitalId();
  const branchId = getBranchId();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (hospitalId) {
    headers['X-Hospital-Id'] = hospitalId;
  }
  
  if (branchId) {
    headers['X-Branch-Id'] = branchId;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }
  
  return { data, status: response.status, ok: response.ok };
};

export const login = async (email: string, password: string) => {
  return apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (userData: any) => {
  return apiRequest('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const getUsers = async () => {
  return apiRequest('/users');
};

export const patientRegister = async (data: any) => {
  return apiRequest('/patient-register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const listVisits = async (params: any = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(query ? `/?${query}` : '/');
};

export const getVisit = async (id: string) => {
  return apiRequest(`/${id}`);
};

export const updateVisit = async (id: string, data: any) => {
  return apiRequest(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteVisit = async (id: string) => {
  return apiRequest(`/${id}`, {
    method: 'DELETE',
  });
};

export const getGlobalVitals = async () => {
  return apiRequest('/all-clinical-details/');
};

export const addAddiction = async (data: any) => {
  return apiRequest('/addiction', { method: 'POST', body: JSON.stringify(data) });
};

export const updateAddiction = async (id: string, data: any) => {
  return apiRequest(`/addiction/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};

export const deleteAddiction = async (id: string) => {
  return apiRequest(`/addiction/${id}`, { method: 'DELETE' });
};

export const getAddictions = async (patientId: string) => {
  return apiRequest(`/addiction/${patientId}`);
};

export const addSurgical = async (data: any) => {
  return apiRequest('/surgical', { method: 'POST', body: JSON.stringify(data) });
};

export const getSurgicals = async (patientId: string) => {
  return apiRequest(`/surgical/${patientId}`);
};

export const updateSurgical = async (id: string, data: any) => {
  return apiRequest(`/surgical/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};

export const deleteSurgical = async (id: string) => {
  return apiRequest(`/surgical/${id}`, { method: 'DELETE' });
};

export const addMedical = async (data: any) => {
  return apiRequest('/medical', { method: 'POST', body: JSON.stringify(data) });
};

export const getMedicals = async (patientId: string) => {
  return apiRequest(`/medical/${patientId}`);
};

export const updateMedical = async (id: string, data: any) => {
  return apiRequest(`/medical/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};

export const deleteMedical = async (id: string) => {
  return apiRequest(`/medical/${id}`, { method: 'DELETE' });
};

export const addPersonalHistory = async (data: any) => {
  return apiRequest('/personalhistory', { method: 'POST', body: JSON.stringify(data) });
};

export const getPersonalHistories = async (patientId: string) => {
  return apiRequest(`/personalhistory/${patientId}`);
};

export const updatePersonalHistory = async (id: string, data: any) => {
  return apiRequest(`/personalhistory/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};

export const deletePersonalHistory = async (id: string) => {
  return apiRequest(`/personalhistory/${id}`, { method: 'DELETE' });
};

export const createDiagnosis = async (data: any) => {
  return apiRequest('/creatediagnosis', { method: 'POST', body: JSON.stringify(data) });
};

export const updateDiagnosis = async (id: string, data: any) => {
  return apiRequest(`/updatediagnosis/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};

export const getDiagnosis = async (id: string) => {
  return apiRequest(`/getdiagnosis/${id}`);
};

export const getDiagnosisByPatient = async (patientId: string) => {
  return apiRequest(`/diagnosispatient/${patientId}`);
};

export const getDiagnosisByVisit = async (visitId: string) => {
  return apiRequest(`/visitdiagnosis/${visitId}`);
};

export const createDoctorNote = async (data: any) => {
  return apiRequest('/createdoctornotes', { method: 'POST', body: JSON.stringify(data) });
};

export const updateDoctorNote = async (id: string, data: any) => {
  return apiRequest(`/updatedoctornotes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};

export const getDoctorNote = async (id: string) => {
  return apiRequest(`/updatedoctornotes/${id}`);
};

export const deleteDoctorNote = async (id: string) => {
  return apiRequest(`/deletedoctornotes/${id}`, { method: 'DELETE' });
};

export const createPrescription = async (visitId: string, data: any) => {
  return apiRequest(`/createPrescription/${visitId}`, { method: 'POST', body: JSON.stringify(data) });
};

export const updatePrescription = async (id: string, data: any) => {
  return apiRequest(`/updatePrescription/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};

export const getPrescription = async (id: string) => {
  return apiRequest(`/getPrescription/${id}`);
};

export const deletePrescription = async (id: string) => {
  return apiRequest(`/deletePrescription/${id}`, { method: 'DELETE' });
};

export const getAssetMasters = async (params: any = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(query ? `/assets/masters?${query}` : '/assets/masters');
};

export const createAssetMaster = async (data: any) => {
  return apiRequest('/assets/masters', { method: 'POST', body: JSON.stringify(data) });
};

export const getAssetMaster = async (id: string) => {
  return apiRequest(`/assets/masters/${id}`);
};

export const updateAssetMaster = async (id: string, data: any) => {
  return apiRequest(`/assets/masters/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};

export const deleteAssetMaster = async (id: string) => {
  return apiRequest(`/assets/masters/${id}`, { method: 'DELETE' });
};

export const getAssetCategories = async (params: any = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(query ? `/assets/categories?${query}` : '/assets/categories');
};

export const createAssetCategory = async (data: any) => {
  return apiRequest('/assets/categories', { method: 'POST', body: JSON.stringify(data) });
};

export const getAssetCategory = async (id: string) => {
  return apiRequest(`/assets/categories/${id}`);
};

export const updateAssetCategory = async (id: string, data: any) => {
  return apiRequest(`/assets/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};

export const deleteAssetCategory = async (id: string) => {
  return apiRequest(`/assets/categories/${id}`, { method: 'DELETE' });
};

export const getAssetSubCategories = async (params: any = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(query ? `/assets/sub-categories?${query}` : '/assets/sub-categories');
};

export const createAssetSubCategory = async (data: any) => {
  return apiRequest('/assets/sub-categories', { method: 'POST', body: JSON.stringify(data) });
};

export const getAssetSubCategory = async (id: string) => {
  return apiRequest(`/assets/sub-categories/${id}`);
};

export const updateAssetSubCategory = async (id: string, data: any) => {
  return apiRequest(`/assets/sub-categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};

export const deleteAssetSubCategory = async (id: string) => {
  return apiRequest(`/assets/sub-categories/${id}`, { method: 'DELETE' });
};

export const getAssetVendors = async (params: any = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(query ? `/assets/vendors?${query}` : '/assets/vendors');
};

export const createAssetVendor = async (data: any) => {
  return apiRequest('/assets/vendors', { method: 'POST', body: JSON.stringify(data) });
};

export const getAssetVendor = async (id: string) => {
  return apiRequest(`/assets/vendors/${id}`);
};

export const updateAssetVendor = async (id: string, data: any) => {
  return apiRequest(`/assets/vendors/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};

export const deleteAssetVendor = async (id: string) => {
  return apiRequest(`/assets/vendors/${id}`, { method: 'DELETE' });
};

export const getAssetLocations = async (params: any = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(query ? `/assets/locations?${query}` : '/assets/locations');
};

export const createAssetLocation = async (data: any) => {
  return apiRequest('/assets/locations', { method: 'POST', body: JSON.stringify(data) });
};

export const getAssetLocation = async (id: string) => {
  return apiRequest(`/assets/locations/${id}`);
};

export const updateAssetLocation = async (id: string, data: any) => {
  return apiRequest(`/assets/locations/${id}`, { method: 'PUT', body: JSON.stringify(data) });
};

export const deleteAssetLocation = async (id: string) => {
  return apiRequest(`/assets/locations/${id}`, { method: 'DELETE' });
};

export const getEquipments = getAssetMasters;
export const createEquipment = createAssetMaster;
export const getEquipment = getAssetMaster;
export const updateEquipment = updateAssetMaster;
export const deleteEquipment = deleteAssetMaster;
export const getAssets = getAssetMasters;
export const createAsset = createAssetMaster;
export const deleteAsset = deleteAssetMaster;
export const listUsers = getUsers;
export const listDoctors = getUsers;
export const listPatients = listVisits;

export const getAssetMaintenances = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/assets/maintenances?${query}` : '/assets/maintenances'); };
export const createAssetMaintenance = async (data: any) => { return apiRequest('/assets/maintenances', { method: 'POST', body: JSON.stringify(data) }); };
export const getAssetDepreciations = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/assets/depreciations?${query}` : '/assets/depreciations'); };
export const createAssetDepreciation = async (data: any) => { return apiRequest('/assets/depreciations', { method: 'POST', body: JSON.stringify(data) }); };
export const getAssetDisposals = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/assets/disposals?${query}` : '/assets/disposals'); };
export const createAssetDisposal = async (data: any) => { return apiRequest('/assets/disposals', { method: 'POST', body: JSON.stringify(data) }); };
export const getAssetAudits = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/assets/audits?${query}` : '/assets/audits'); };

export const listBloodInventory = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/bloodbank/inventory?${query}` : '/bloodbank/inventory'); };
export const listBloodRequests = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/bloodbank/requests?${query}` : '/bloodbank/requests'); };
export const listBloodDonors = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/bloodbank/donors?${query}` : '/bloodbank/donors'); };
export const listBloodDonations = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/bloodbank/donations?${query}` : '/bloodbank/donations'); };
export const listBloodGroups = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/bloodbank/groups?${query}` : '/bloodbank/groups'); };
export const listBloodComponents = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/bloodbank/components?${query}` : '/bloodbank/components'); };
export const createBloodRequest = async (data: any) => { return apiRequest('/bloodbank/requests', { method: 'POST', body: JSON.stringify(data) }); };
export const updateBloodRequestStatus = async (id: string, data: any) => { return apiRequest(`/bloodbank/requests/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }); };
export const createBloodDonor = async (data: any) => { return apiRequest('/bloodbank/donors', { method: 'POST', body: JSON.stringify(data) }); };
export const createBloodDonation = async (data: any) => { return apiRequest('/bloodbank/donations', { method: 'POST', body: JSON.stringify(data) }); };
export const issueBlood = async (id: string, data: any) => { return apiRequest(`/bloodbank/inventory/${id}/issue`, { method: 'POST', body: JSON.stringify(data) }); };
export const updateBloodDonor = async (id: string, data: any) => { return apiRequest(`/bloodbank/donors/${id}`, { method: 'PUT', body: JSON.stringify(data) }); };
export const deleteBloodDonor = async (id: string) => { return apiRequest(`/bloodbank/donors/${id}`, { method: 'DELETE' }); };
export const updateBloodRequest = async (id: string, data: any) => { return apiRequest(`/bloodbank/requests/${id}`, { method: 'PUT', body: JSON.stringify(data) }); };
export const deleteBloodRequest = async (id: string) => { return apiRequest(`/bloodbank/requests/${id}`, { method: 'DELETE' }); };
export const updateBloodInventoryStatus = async (id: string, data: any) => { return apiRequest(`/bloodbank/inventory/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }); };
export const deleteBloodInventory = async (id: string) => { return apiRequest(`/bloodbank/inventory/${id}`, { method: 'DELETE' }); };
export const createBloodComponent = async (data: any) => { return apiRequest('/bloodbank/components', { method: 'POST', body: JSON.stringify(data) }); };
export const createBloodInventory = async (data: any) => { return apiRequest('/bloodbank/inventory', { method: 'POST', body: JSON.stringify(data) }); };

export const getInstruments = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/cssd/instruments?${query}` : '/cssd/instruments'); };
export const createInstrument = async (data: any) => { return apiRequest('/cssd/instruments', { method: 'POST', body: JSON.stringify(data) }); };
export const getInstrumentBatches = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/cssd/batches?${query}` : '/cssd/batches'); };
export const createInstrumentBatch = async (data: any) => { return apiRequest('/cssd/batches', { method: 'POST', body: JSON.stringify(data) }); };
export const getSterilizationCycles = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/cssd/cycles?${query}` : '/cssd/cycles'); };
export const createSterilizationCycle = async (data: any) => { return apiRequest('/cssd/cycles', { method: 'POST', body: JSON.stringify(data) }); };
export const updateSterilizationCycle = async (id: string, data: any) => { return apiRequest(`/cssd/cycles/${id}`, { method: 'PUT', body: JSON.stringify(data) }); };
export const getIssuedInstruments = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/cssd/issued?${query}` : '/cssd/issued'); };
export const issueInstrument = async (data: any) => { return apiRequest('/cssd/issue', { method: 'POST', body: JSON.stringify(data) }); };
export const returnInstrument = async (data: any) => { return apiRequest('/cssd/return', { method: 'POST', body: JSON.stringify(data) }); };
export const listDepartments = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/departments?${query}` : '/departments'); };

export const listAmbulances = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/ambulances?${query}` : '/ambulances'); };
export const createAmbulance = async (data: any) => { return apiRequest('/ambulances', { method: 'POST', body: JSON.stringify(data) }); };
export const updateAmbulance = async (id: string, data: any) => { return apiRequest(`/ambulances/${id}`, { method: 'PUT', body: JSON.stringify(data) }); };
export const deleteAmbulance = async (id: string) => { return apiRequest(`/ambulances/${id}`, { method: 'DELETE' }); };
export const listAmbulanceTrips = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/ambulances/trips?${query}` : '/ambulances/trips'); };
export const createAmbulanceTrip = async (data: any) => { return apiRequest('/ambulances/trips', { method: 'POST', body: JSON.stringify(data) }); };
export const listAmbulanceMaintenances = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/ambulances/maintenances?${query}` : '/ambulances/maintenances'); };
export const createAmbulanceMaintenance = async (data: any) => { return apiRequest('/ambulances/maintenances', { method: 'POST', body: JSON.stringify(data) }); };

export const listCertificateTypes = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/certificates/types?${query}` : '/certificates/types'); };
export const listCertificateTemplates = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/certificates/templates?${query}` : '/certificates/templates'); };
export const listGeneratedCertificates = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/certificates/generated?${query}` : '/certificates/generated'); };
export const createGeneratedCertificate = async (data: any) => { return apiRequest('/certificates/generated', { method: 'POST', body: JSON.stringify(data) }); };
export const updateCertificateTemplate = async (id: string, data: any) => { return apiRequest(`/certificates/templates/${id}`, { method: 'PUT', body: JSON.stringify(data) }); };
export const createCertificateTemplate = async (data: any) => { return apiRequest('/certificates/templates', { method: 'POST', body: JSON.stringify(data) }); };
export const deleteCertificateTemplate = async (id: string) => { return apiRequest(`/certificates/templates/${id}`, { method: 'DELETE' }); };
export const listCertificateSignatures = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/certificates/signatures?${query}` : '/certificates/signatures'); };
export const updateCertificateSignature = async (id: string, data: any) => { return apiRequest(`/certificates/${id}/signature`, { method: 'PUT', body: JSON.stringify(data) }); };
export const deleteCertificateSignature = async (id: string) => { return apiRequest(`/certificates/${id}/signature`, { method: 'DELETE' }); };
export const listCertificateVerifications = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/certificates/verifications?${query}` : '/certificates/verifications'); };
export const verifyCertificate = async (id: string, data: any) => { return apiRequest(`/certificates/${id}/verify`, { method: 'POST', body: JSON.stringify(data) }); };
export const createCertificateSignature = async (id: string, data: any) => { return apiRequest(`/certificates/${id}/signature`, { method: 'POST', body: JSON.stringify(data) }); };

export const getEquipmentCategories = getAssetCategories;
export const createEquipmentCategory = createAssetCategory;
export const getEquipmentVendors = getAssetVendors;
export const getEquipmentMaintenanceSchedules = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/equipment/maintenance-schedules?${query}` : '/equipment/maintenance-schedules'); };
export const createEquipmentMaintenanceSchedule = async (data: any) => { return apiRequest('/equipment/maintenance-schedules', { method: 'POST', body: JSON.stringify(data) }); };
export const getEquipmentMaintenanceLogs = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/equipment/maintenance-logs?${query}` : '/equipment/maintenance-logs'); };
export const getEquipmentCalibrationRecords = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/equipment/calibration-records?${query}` : '/equipment/calibration-records'); };
export const getEquipmentTransfers = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/equipment/transfers?${query}` : '/equipment/transfers'); };
export const getEquipmentBreakdowns = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/equipment/breakdowns?${query}` : '/equipment/breakdowns'); };
export const createEquipmentBreakdown = async (data: any) => { return apiRequest('/equipment/breakdowns', { method: 'POST', body: JSON.stringify(data) }); };
export const getEquipmentSpareParts = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/equipment/spare-parts?${query}` : '/equipment/spare-parts'); };
export const getEquipmentUsageLogs = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/equipment/usage-logs?${query}` : '/equipment/usage-logs'); };
export const getEquipmentDocuments = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/equipment/documents?${query}` : '/equipment/documents'); };

export const getLabSamples = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/laboratory/samples?${query}` : '/laboratory/samples'); };
export const createLabSample = async (data: any) => { return apiRequest('/laboratory/samples', { method: 'POST', body: JSON.stringify(data) }); };
export const updateLabSampleStatus = async (id: string, data: any) => { return apiRequest(`/laboratory/samples/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }); };
export const getLabResults = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/laboratory/results?${query}` : '/laboratory/results'); };
export const createLabResult = async (data: any) => { return apiRequest('/laboratory/results', { method: 'POST', body: JSON.stringify(data) }); };
export const updateLabResultStatus = async (id: string, data: any) => { return apiRequest(`/laboratory/results/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }); };
export const listInvestigationOrders = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/investigations/orders?${query}` : '/investigations/orders'); };
export const listInvestigationMasters = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/investigations/masters?${query}` : '/investigations/masters'); };

export const getPharmacyDispenses = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/pharmacy/dispenses?${query}` : '/pharmacy/dispenses'); };
export const createPharmacyDispense = async (data: any) => { return apiRequest('/pharmacy/dispenses', { method: 'POST', body: JSON.stringify(data) }); };
export const listMedicines = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/pharmacy/medicines?${query}` : '/pharmacy/medicines'); };
export const createMedicine = async (data: any) => { return apiRequest('/pharmacy/medicines', { method: 'POST', body: JSON.stringify(data) }); };
export const getPharmacyInvoices = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/pharmacy/invoices?${query}` : '/pharmacy/invoices'); };
export const createPharmacyInvoice = async (data: any) => { return apiRequest('/pharmacy/invoices', { method: 'POST', body: JSON.stringify(data) }); };
export const getPharmacyStocks = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/pharmacy/stocks?${query}` : '/pharmacy/stocks'); };
export const createPharmacyStock = async (data: any) => { return apiRequest('/pharmacy/stocks', { method: 'POST', body: JSON.stringify(data) }); };
export const getPharmacySuppliers = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/pharmacy/suppliers?${query}` : '/pharmacy/suppliers'); };
export const createPharmacySupplier = async (data: any) => { return apiRequest('/pharmacy/suppliers', { method: 'POST', body: JSON.stringify(data) }); };
export const getPurchaseOrders = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/pharmacy/purchase-orders?${query}` : '/pharmacy/purchase-orders'); };
export const getGRNs = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/pharmacy/grns?${query}` : '/pharmacy/grns'); };
export const getInsuranceClaims = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/pharmacy/insurance-claims?${query}` : '/pharmacy/insurance-claims'); };
export const getStockTransfers = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/pharmacy/stock-transfers?${query}` : '/pharmacy/stock-transfers'); };
export const getStockAdjustments = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/pharmacy/stock-adjustments?${query}` : '/pharmacy/stock-adjustments'); };
export const getPharmacyPrescriptions = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/pharmacy/prescriptions?${query}` : '/pharmacy/prescriptions'); };

export const getRadiologyStudies = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/radiology/studies?${query}` : '/radiology/studies'); };
export const createRadiologyStudy = async (data: any) => { return apiRequest('/radiology/studies', { method: 'POST', body: JSON.stringify(data) }); };
export const updateRadiologyStudyStatus = async (id: string, data: any) => { return apiRequest(`/radiology/studies/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }); };
export const getRadiologyReports = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/radiology/reports?${query}` : '/radiology/reports'); };
export const createRadiologyReport = async (data: any) => { return apiRequest('/radiology/reports', { method: 'POST', body: JSON.stringify(data) }); };
export const getRadiologyImages = async (params: any = {}) => { const query = new URLSearchParams(params).toString(); return apiRequest(query ? `/radiology/images?${query}` : '/radiology/images'); };
