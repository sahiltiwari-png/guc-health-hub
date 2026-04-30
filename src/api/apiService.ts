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
