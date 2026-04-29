const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getToken = () => localStorage.getItem('token');

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  return { data, status: response.status, ok: response.ok };
};

export const login = async (email: string, password: string) => {
  return apiRequest('/api/v1/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (userData: any) => {
  return apiRequest('/api/v1/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const getUsers = async () => {
  return apiRequest('/api/v1/users');
};

export const patientRegister = async (data: any) => {
  return apiRequest('/api/v1/patient-register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const listVisits = async (params: any = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/api/v1?${query}`);
};

export const getVisit = async (id: string) => {
  return apiRequest(`/api/v1/${id}`);
};

export const updateVisit = async (id: string, data: any) => {
  return apiRequest(`/api/v1/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteVisit = async (id: string) => {
  return apiRequest(`/api/v1/${id}`, {
    method: 'DELETE',
  });
};

export const getGlobalVitals = async () => {
  return apiRequest('/api/v1/all-clinical-details/');
};

export const getVisitVitals = async () => {
  return apiRequest('/api/v1');
};

export const createVisitVitals = async (data: any) => {
  return apiRequest('/api/v1', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateVisitVitals = async (id: string, data: any) => {
  return apiRequest(`/api/v1/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteVisitVitals = async (id: string) => {
  return apiRequest(`/api/v1/${id}`, {
    method: 'DELETE',
  });
};

export const getEquipments = async (params: any = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/api/v1/assets/masters?${query}`);
};

export const createEquipment = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const deleteEquipment = async (id: string) => {
  return apiRequest(`/api/v1/assets/masters/${id}`, {
    method: 'DELETE',
  });
};

export const getAssets = async (params: any = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/api/v1/assets/masters?${query}`);
};

export const createAsset = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const deleteAsset = async (id: string) => {
  return apiRequest(`/api/v1/assets/masters/${id}`, {
    method: 'DELETE',
  });
};

export const getAssetCategories = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createAssetCategory = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const deleteAssetCategory = async (id: string) => {
  return apiRequest(`/api/v1/assets/masters/${id}`, {
    method: 'DELETE',
  });
};

export const getAssetVendors = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createAssetVendor = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const deleteAssetVendor = async (id: string) => {
  return apiRequest(`/api/v1/assets/masters/${id}`, {
    method: 'DELETE',
  });
};

export const getAssetLocations = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const getAssetMaintenances = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createAssetMaintenance = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getAssetDepreciations = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createAssetDepreciation = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getAssetDisposals = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createAssetDisposal = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getAssetAudits = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const getEquipmentCategories = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createEquipmentCategory = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getEquipmentVendors = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const getEquipmentLocations = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const getEquipmentMaintenanceSchedules = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createEquipmentMaintenanceSchedule = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getEquipmentMaintenanceLogs = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const getEquipmentCalibrationRecords = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const getEquipmentTransfers = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const getEquipmentBreakdowns = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createEquipmentBreakdown = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getEquipmentSpareParts = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const getEquipmentUsageLogs = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const getEquipmentDocuments = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const getPharmacyDispenses = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createPharmacyDispense = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const listMedicines = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createMedicine = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getPharmacyInvoices = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createPharmacyInvoice = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getPharmacyStocks = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createPharmacyStock = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getPharmacySuppliers = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createPharmacySupplier = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getPurchaseOrders = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const getGRNs = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const getInsuranceClaims = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const getStockTransfers = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const getStockAdjustments = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const getPharmacyPrescriptions = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const getRadiologyStudies = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createRadiologyStudy = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateRadiologyStudyStatus = async (id: string, data: any) => {
  return apiRequest(`/api/v1/assets/masters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const getRadiologyReports = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createRadiologyReport = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getRadiologyImages = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const listInvestigationOrders = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const listInvestigationMasters = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const getLabSamples = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createLabSample = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateLabSampleStatus = async (id: string, data: any) => {
  return apiRequest(`/api/v1/assets/masters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const getLabResults = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createLabResult = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateLabResultStatus = async (id: string, data: any) => {
  return apiRequest(`/api/v1/assets/masters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const listPatients = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const listUsers = async () => {
  return apiRequest('/api/v1/users');
};

export const listDoctors = async () => {
  return apiRequest('/api/v1/users');
};

export const listDepartments = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const listBloodInventory = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const listBloodRequests = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const listBloodDonors = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const listBloodDonations = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const listBloodGroups = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const listBloodComponents = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createBloodRequest = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateBloodRequestStatus = async (id: string, data: any) => {
  return apiRequest(`/api/v1/assets/masters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const createBloodDonor = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const createBloodDonation = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const issueBlood = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateBloodDonor = async (id: string, data: any) => {
  return apiRequest(`/api/v1/assets/masters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteBloodDonor = async (id: string) => {
  return apiRequest(`/api/v1/assets/masters/${id}`, {
    method: 'DELETE',
  });
};

export const updateBloodRequest = async (id: string, data: any) => {
  return apiRequest(`/api/v1/assets/masters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteBloodRequest = async (id: string) => {
  return apiRequest(`/api/v1/assets/masters/${id}`, {
    method: 'DELETE',
  });
};

export const updateBloodInventoryStatus = async (id: string, data: any) => {
  return apiRequest(`/api/v1/assets/masters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteBloodInventory = async (id: string) => {
  return apiRequest(`/api/v1/assets/masters/${id}`, {
    method: 'DELETE',
  });
};

export const createBloodComponent = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const createBloodInventory = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const listCertificateTypes = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const listCertificateTemplates = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const listGeneratedCertificates = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createGeneratedCertificate = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateCertificateTemplate = async (id: string, data: any) => {
  return apiRequest(`/api/v1/assets/masters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const createCertificateTemplate = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const deleteCertificateTemplate = async (id: string) => {
  return apiRequest(`/api/v1/assets/masters/${id}`, {
    method: 'DELETE',
  });
};

export const listCertificateSignatures = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createCertificateSignature = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateCertificateSignature = async (id: string, data: any) => {
  return apiRequest(`/api/v1/assets/masters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteCertificateSignature = async (id: string) => {
  return apiRequest(`/api/v1/assets/masters/${id}`, {
    method: 'DELETE',
  });
};

export const listCertificateVerifications = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const verifyCertificate = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getInstruments = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createInstrument = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getInstrumentBatches = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createInstrumentBatch = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getSterilizationCycles = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createSterilizationCycle = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateSterilizationCycle = async (id: string, data: any) => {
  return apiRequest(`/api/v1/assets/masters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const getIssuedInstruments = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const issueInstrument = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const returnInstrument = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const listAmbulances = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createAmbulance = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateAmbulance = async (id: string, data: any) => {
  return apiRequest(`/api/v1/assets/masters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteAmbulance = async (id: string) => {
  return apiRequest(`/api/v1/assets/masters/${id}`, {
    method: 'DELETE',
  });
};

export const listAmbulanceTrips = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createAmbulanceTrip = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const listAmbulanceMaintenances = async () => {
  return apiRequest('/api/v1/assets/masters');
};

export const createAmbulanceMaintenance = async (data: any) => {
  return apiRequest('/api/v1/assets/masters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
