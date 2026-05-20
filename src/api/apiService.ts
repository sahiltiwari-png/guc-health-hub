/**
 * AUTO-GENERATED API SERVICE
 * Generated on: 2026-05-19T16:02:15.483Z
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const getToken = () => localStorage.getItem('hms_token');
const getHospitalId = () => localStorage.getItem('hospital_id');
const getBranchId = () => localStorage.getItem('branch_id');

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  status: number;
  ok: boolean;
  error?: any;
}

export const apiRequest = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  const token = getToken();
  const hospitalId = getHospitalId();
  const branchId = getBranchId();
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...options.headers };
  
  if (token) headers['Authorization'] = "Bearer " + token;
  if (hospitalId) headers['X-Hospital-Id'] = hospitalId;
  if (branchId) headers['X-Branch-Id'] = branchId;

  // Smarter URL construction
  let path = endpoint;
  if (!path.startsWith('/api')) {
    const noV1Prefixes = ['/departments', '/doctors', '/inventory', '/geo', '/finance', '/dashboard', '/admin'];
    const needsV1 = !noV1Prefixes.some(prefix => path.startsWith(prefix));
    if (needsV1) {
      path = '/api/v1' + (path.startsWith('/') ? '' : '/') + path;
    } else {
      path = '/api' + (path.startsWith('/') ? '' : '/') + path;
    }
  }
  
  const url = API_BASE_URL + path;

  try {
    const response = await fetch(url, { ...options, headers });
    let data;
    try { data = await response.json(); } catch (e) { data = null; }
    
    return { 
      data: data?.data || data, 
      success: data?.success || response.ok,
      message: data?.message || (response.ok ? 'Success' : 'Error'),
      status: response.status, 
      ok: response.ok 
    };
  } catch (error) {
    return { data: null as any, success: false, status: 0, ok: false, error, message: 'Network error occurred' };
  }
};

/** Helper to extract array from API response (handles Spring Data Page) */
export const extractArray = (res: ApiResponse): any[] => {
  if (!res.ok) return [];
  const data = res.data;
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.content)) return data.content;
  if (data && data.data && Array.isArray(data.data)) return data.data;
  return [];
};

/** Helper to extract single object from API response */
export const extractObject = (res: ApiResponse): any => {
  if (!res.ok) return null;
  return res.data;
};

/* --- TYPES --- */
export interface BaseResponse { success?: boolean; message?: string; error?: string; data?: any; }


/** Unauthorized */
export const getAutoApierror401 = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api-error/401`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Forbidden */
export const getAutoApierror403 = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api-error/403`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** OPD - List all visits */
export const getOPDVisits = async (queryParams?: Record<string, any>) => {
  let endpoint = `/opd`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { method: 'GET' });
};

/** OPD - Walk-in Registration */
export const createOPDWalkIn = async (data: any) => {
  return apiRequest('/opd/walk-in', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

/** OPD - Record Vitals */
export const recordOPDVitals = async (opdVisitId: string, data: any) => {
  return apiRequest(`/opd/vitals/${opdVisitId}`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

/** IPD - List Admissions */
export const getIPDAdmissions = async (queryParams?: Record<string, any>) => {
  let endpoint = `/ipd`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { method: 'GET' });
};

/** IPD - Admit Patient */
export const admitPatient = async (data: any) => {
  return apiRequest('/ipd/admit', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

/** IPD - Discharge Patient */
export const dischargePatient = async (id: string) => {
  return apiRequest(`/ipd/discharge/${id}`, {
    method: 'POST'
  });
};

/** IPD - List Wards */
export const getWards = async () => {
  return apiRequest('/ipd/wards', { method: 'GET' });
};

/** IPD - List All Beds */
export const getBeds = async () => {
  return apiRequest('/ipd/beds', { method: 'GET' });
};

/** IPD - Available Beds */
export const getAvailableBeds = async () => {
  return apiRequest('/ipd/beds/available', { method: 'GET' });
};

/** Appointments - List Appointments */
export const getAppointments = async (queryParams?: Record<string, any>) => {
  let endpoint = `/appointments`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { method: 'GET' });
};

/** Appointments - Update Status */
export const updateAppointmentStatus = async (id: string, status: string) => {
  return apiRequest(`/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
};

/** Diagnostics - Lab Orders */
export const getLabOrders = async (queryParams?: Record<string, any>) => {
  let endpoint = `/diagnostics/lab`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { method: 'GET' });
};

/** Diagnostics - Radiology Scans */
export const getRadiologyScans = async (queryParams?: Record<string, any>) => {
  let endpoint = `/diagnostics/radiology`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { method: 'GET' });
};

/** Inventory - Pharmacy Stock */
export const getPharmacyStock = async (queryParams?: Record<string, any>) => {
  let endpoint = `/inventory/pharmacy/stock`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { method: 'GET' });
};

/** Blood Bank - Inventory */
export const getBloodInventory = async () => {
  return apiRequest('/blood-bank/inventory', { method: 'GET' });
};

/** Registry - Births */
export const getBirths = async () => {
  return apiRequest('/registry/births', { method: 'GET' });
};

/** Registry - Deaths */
export const getDeaths = async () => {
  return apiRequest('/registry/deaths', { method: 'GET' });
};

/** Ambulances - List Fleet */
export const getAmbulanceFleet = async () => {
  return apiRequest('/ambulances', { method: 'GET' });
};

/** Dashboard - Global Stats */
export const getDashboardStats = async () => {
  return apiRequest('/dashboard/super-admin', { method: 'GET' });
};

/** MIS - Feed */
export const getMISFeed = async () => {
  return apiRequest('/mis', { method: 'GET' });
};

/** Patients - Search */
export const searchPatients = async (queryParams?: Record<string, any>) => {
  let endpoint = `/patients/search`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { method: 'GET' });
};

/** Patients - Register */
export const registerPatient = async (data: any) => {
  return apiRequest('/patients/register', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

/** Certificates - Templates */
export const getCertificateTemplates = async () => {
  return apiRequest('/certificates/templates', { method: 'GET' });
};

/** Clinical - ER Visits */
export const getERVisits = async (queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/er-visits`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { method: 'GET' });
};

/** Clinical - OT Bookings */
export const getOTBookings = async (queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/ot-bookings`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { method: 'GET' });
};

/** Clinical - Record ER Case */
export const createERVisit = async (data: any) => {
  return apiRequest('/clinical/er-visits', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

/** Clinical - OT Status Update */
export const updateOTStatus = async (id: string, status: string) => {
  return apiRequest(`/clinical/ot-bookings/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
};

/** Inventory - List Stock */
export const getInventoryStock = async (queryParams?: Record<string, any>) => {
  let endpoint = `/inventory/pharmacy/stock`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { method: 'GET' });
};

/** Kitchen - Diet Dashboard */
export const getKitchenDashboard = async () => {
  return apiRequest('/kitchen/dashboard', { method: 'GET' });
};

/** Helpdesk - Tickets */
export const getHelpdeskTickets = async () => {
  return apiRequest('/helpdesk/tickets', { method: 'GET' });
};

/** Parking - Logs */
export const getParkingLogs = async () => {
  return apiRequest('/parking', { method: 'GET' });
};

/** Assets - Master List */
export const getAssets = async () => {
  return apiRequest('/assets/masters', { method: 'GET' });
};

/** Assets - Instruments (CSSD) */
export const getInstruments = async () => {
  return apiRequest('/assets/instruments', { method: 'GET' });
};

/** Billing - List Invoices */
export const getBillingInvoices = async (queryParams?: Record<string, any>) => {
  let endpoint = `/billing/invoices`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { method: 'GET' });
};

/** HR - Attendance */
export const getHRAttendance = async (queryParams?: Record<string, any>) => {
  let endpoint = `/hr/attendance`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { method: 'GET' });
};

/** HR - Leaves */
export const getHRLeaves = async (queryParams?: Record<string, any>) => {
  let endpoint = `/hr/leaves`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { method: 'GET' });
};

/** HR - Payroll */
export const getHRPayroll = async (queryParams?: Record<string, any>) => {
  let endpoint = `/hr/payroll`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { method: 'GET' });
};

/** Login user */
export const createLogin = async (data: any) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

/** Home */
export const getAuto = async (queryParams?: Record<string, any>) => {
  let endpoint = `/`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Auto-generated */
export const getAutoAdminUsers = async (queryParams?: Record<string, any>) => {
  let endpoint = `/admin/users`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Auto-generated */
export const getAutoAdminUsersSearch = async (queryParams?: Record<string, any>) => {
  let endpoint = `/admin/users/search`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Auto-generated */
export const getAutoAdminRoles = async (queryParams?: Record<string, any>) => {
  let endpoint = `/admin/roles`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Auto-generated */
export const getAutoAdminBranches = async (queryParams?: Record<string, any>) => {
  let endpoint = `/admin/branches`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Register user */
export const createAutoAuthRegister = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/auth/register`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Auto-generated */
export const getAutoAuthLogin = async (queryParams?: Record<string, any>) => {
  let endpoint = `/auth/login`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Auto-generated */
export const getAutoAuthUsers = async (queryParams?: Record<string, any>) => {
  let endpoint = `/auth/users`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Create department */
export const createAutoDepartments = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/departments`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Get Department By Id */
export const getAutoDepartments = async (queryParams?: Record<string, any>) => {
  let endpoint = `/departments`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** List all departments (no pagination) */
export const getAutoDepartmentsListall = async (queryParams?: Record<string, any>) => {
  let endpoint = `/departments/list-all`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** List all departments (no pagination) */
export const getAutoDepartmentsActive = async (queryParams?: Record<string, any>) => {
  let endpoint = `/departments/active`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Get Department By Id */
export const getAutoDepartmentsByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/departments/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Update department */
export const updateAutoDepartmentsByid = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/departments/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

/** Update department */
export const deleteAutoDepartmentsByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/departments/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

/** Get Department By Code */
export const getAutoDepartmentsCodeBycode = async (code: string, queryParams?: Record<string, any>) => {
  let endpoint = `/departments/code/${code}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Update Department */
export const getAutoDepartmentsSearch = async (queryParams?: Record<string, any>) => {
  let endpoint = `/departments/search`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Create Appointment V1 */
export const getAutoAppointments = async (queryParams?: Record<string, any>) => {
  let endpoint = `/appointments`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Create a new appointment */
export const createAutoAppointments = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/appointments`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Get Appointment By Id */
export const getAutoAppointmentsByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/appointments/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Update Appointment V1 */
export const updateAutoAppointmentsByid = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/appointments/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

/** Update appointment */
export const deleteAutoAppointmentsByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/appointments/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

/** Auto-generated */
export const getAutoAppointmentsDaily = async (queryParams?: Record<string, any>) => {
  let endpoint = `/appointments/daily`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Auto-generated */
export const getAutoAppointmentsPatientBypatientId = async (queryParams?: Record<string, any>) => {
  let endpoint = `/appointments/patient/{patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Auto-generated */
export const getAutoAppointmentsDoctorBydoctorId = async (queryParams?: Record<string, any>) => {
  let endpoint = `/appointments/doctor/{doctorId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Auto-generated */
export const getAutoAppointmentsSearch = async (queryParams?: Record<string, any>) => {
  let endpoint = `/appointments/search`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** List Assets - Masters */
export const getAutoAssetsMasters = async (queryParams?: Record<string, any>) => {
  let endpoint = `/assets/masters`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** List Assets - Masters */
export const createAutoAssetsMasters = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/assets/masters`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Create Assets - Masters */
export const getAutoAssetsMastersByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/assets/masters/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Update Asset Master */
export const updateAutoAssetsMastersByid = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/assets/masters/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

/** Update Assets - Masters */
export const deleteAutoAssetsMastersByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/assets/masters/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

/** Create Asset Category */
export const getAutoAssetsCategories = async (queryParams?: Record<string, any>) => {
  let endpoint = `/assets/categories`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** List Assets - Categories */
export const createAutoAssetsCategories = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/assets/categories`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Create Assets - Categories */
export const getAutoAssetsSubcategories = async (queryParams?: Record<string, any>) => {
  let endpoint = `/assets/sub-categories`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** List Assets - Sub categories */
export const createAutoAssetsSubcategories = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/assets/sub-categories`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Create Assets - Sub categories */
export const getAutoAssetsVendors = async (queryParams?: Record<string, any>) => {
  let endpoint = `/assets/vendors`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** List Assets - Vendors */
export const createAutoAssetsVendors = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/assets/vendors`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Create Assets - Vendors */
export const getAutoAssetsLocations = async (queryParams?: Record<string, any>) => {
  let endpoint = `/assets/locations`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** List Assets - Locations */
export const createAutoAssetsLocations = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/assets/locations`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Create Assets - Locations */
export const getAutoAssetsAssignments = async (queryParams?: Record<string, any>) => {
  let endpoint = `/assets/assignments`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** List Assets - Assignments */
export const createAutoAssetsAssignments = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/assets/assignments`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Create Assets - Assignments */
export const getAutoAssetsMaintenances = async (queryParams?: Record<string, any>) => {
  let endpoint = `/assets/maintenances`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** List Assets - Maintenances */
export const createAutoAssetsMaintenances = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/assets/maintenances`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Create Assets - Maintenances */
export const getAutoAssetsAudits = async (queryParams?: Record<string, any>) => {
  let endpoint = `/assets/audits`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** List Assets - Audits */
export const getAutoAssetsDocuments = async (queryParams?: Record<string, any>) => {
  let endpoint = `/assets/documents`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** List Assets - Documents */
export const getAutoAssetsUsagelogs = async (queryParams?: Record<string, any>) => {
  let endpoint = `/assets/usage-logs`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Get Billing By Id V1 */
export const getAutoBilling = async (queryParams?: Record<string, any>) => {
  let endpoint = `/billing`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Get Billing By Id V1 */
export const getAutoBillingByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/billing/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Update Billing V1 */
export const updateAutoBillingByid = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/billing/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

/** Update invoice */
export const deleteAutoBillingByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/billing/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

/** Create Service Charge */
export const createAutoBillingServicecharges = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/billing/service-charges`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Create service charge */
export const getAutoBillingServicecharges = async (queryParams?: Record<string, any>) => {
  let endpoint = `/billing/service-charges`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Create Invoice */
export const createAutoBillingInvoices = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/billing/invoices`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Search invoices */
export const getAutoBillingInvoicesSearch = async (queryParams?: Record<string, any>) => {
  let endpoint = `/billing/invoices/search`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Update invoice payment */
export const deleteAutoBillingInvoicesByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/billing/invoices/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

/** List V1 - clinicalDetailsRoute */
export const getAutoClinical = async (queryParams?: Record<string, any>) => {
  let endpoint = `/clinical`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Create V1 - clinicalDetailsRoute */
export const getAutoClinical1 = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Get Clinical Detail By Id */
export const getAutoClinicalByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Update Clinical Detail */
export const updateAutoClinicalByid = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

/** Update V1 - clinicalDetailsRoute */
export const deleteAutoClinicalByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

/** Add Addiction */
export const createAutoClinicalAddiction = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/addiction`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Addiction */
export const getAutoClinicalAddictionBypatientId = async (patientId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/addiction/${patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Addiction/:patientId */
export const updateAutoClinicalAddictionByid = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/addiction/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

/** Addiction/:id */
export const deleteAutoClinicalAddictionByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/addiction/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

/** Addiction/:id */
export const getAutoClinicalAllclinicaldetails = async (queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/all-clinical-details/`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** All-clinical-details/ */
export const createAutoClinicalSurgical = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/surgical`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Surgical */
export const getAutoClinicalSurgicalBypatientId = async (patientId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/surgical/${patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Surgical/:patientId */
export const updateAutoClinicalSurgicalByid = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/surgical/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

/** Surgical/:id */
export const createAutoClinicalMedical = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/medical`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Medical */
export const getAutoClinicalMedicalBypatientId = async (patientId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/medical/${patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Medical/:patientId */
export const updateAutoClinicalMedicalByid = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/medical/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

/** Medical/:id */
export const deleteAutoClinicalMedicalByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/medical/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

/** Medical/:id */
export const createAutoClinicalPersonalhistory = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/personalhistory`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Personalhistory */
export const getAutoClinicalPersonalhistoryBypatientId = async (patientId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/personalhistory/${patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Personalhistory/:patientId */
export const updateAutoClinicalPersonalhistoryByid = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/personalhistory/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

/** Personalhistory/:id */
export const createAutoClinicalCreatediagnosis = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/creatediagnosis`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Creatediagnosis */
export const updateAutoClinicalUpdatediagnosisByid = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/updatediagnosis/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

/** Updatediagnosis/:id */
export const getAutoClinicalGetdiagnosisByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/getdiagnosis/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Getdiagnosis/:id */
export const getAutoClinicalDiagnosispatientBypatientId = async (patientId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/diagnosispatient/${patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Diagnosispatient/:patientId */
export const getAutoClinicalVisitdiagnosisByvisitId = async (visitId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/visitdiagnosis/${visitId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Visitdiagnosis/:visitId */
export const createAutoClinicalCreatedoctornotes = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/createdoctornotes`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Createdoctornotes */
export const updateAutoClinicalUpdatedoctornotesByid = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/updatedoctornotes/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

/** Updatedoctornotes/:id */
export const getAutoClinicalUpdatedoctornotesByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/updatedoctornotes/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Updatedoctornotes/:id */
export const deleteAutoClinicalDeletedoctornotesByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/deletedoctornotes/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

/** Deletedoctornotes/:id */
export const createAutoClinicalCreatePrescriptionByvisitId = async (visitId: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/createPrescription/${visitId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** CreatePrescription/:visitId */
export const updateAutoClinicalUpdatePrescriptionByid = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/updatePrescription/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

/** UpdatePrescription/:id */
export const getAutoClinicalGetPrescriptionByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/getPrescription/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** GetPrescription/:id */
export const deleteAutoClinicalDeletePrescriptionByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/deletePrescription/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

/** DeletePrescription/:id */
export const createAutoClinicalEmr = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/emr`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Search EMR records */
export const getAutoClinicalEmrSearch = async (queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/emr/search`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Get E M R By Id */
export const getAutoClinicalEmrByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/emr/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Update E M R */
export const updateAutoClinicalEmrByid = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/emr/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

/** Update EMR record */
export const createAutoClinicalNursingnote = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/nursing-note`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Add nursing note */
export const getAutoClinicalNursingnoteAdmissionByadmissionId = async (admissionId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/nursing-note/admission/${admissionId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Create discharge summary */
export const createAutoClinicalDischargesummary = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/discharge-summary`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Get Discharge Summary */
export const getAutoClinicalDischargesummaryAdmissionByadmissionId = async (admissionId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/discharge-summary/admission/${admissionId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Register E R Visit */
export const createAutoClinicalErVisit = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/er/visit`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Search ER visits */
export const getAutoClinicalErSearch = async (queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/er/search`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Schedule OT procedure */
export const createAutoClinicalOtBooking = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/ot/booking`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Search OT bookings */
export const getAutoClinicalOtSearch = async (queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/ot/search`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Add surgical history */
export const createAutoClinicalSurgicalhistory = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/surgical-history`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Add surgical history */
export const getAutoClinicalSurgicalhistoryPatientBypatientId = async (patientId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/surgical-history/patient/${patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Add Medical History */
export const createAutoClinicalMedicalhistory = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/medical-history`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Add medical history */
export const getAutoClinicalMedicalhistoryPatientBypatientId = async (patientId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/medical-history/patient/${patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Add Personal History */
export const createAutoClinicalPersonalhistory1 = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/personal-history`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Add personal history */
export const getAutoClinicalPersonalhistoryPatientBypatientId = async (patientId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/personal-history/patient/${patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Add Diagnosis */
export const createAutoClinicalDiagnosis = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/diagnosis`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Add clinical diagnosis */
export const getAutoClinicalDiagnosisPatientBypatientId = async (patientId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/diagnosis/patient/${patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Add Doctor Note */
export const createAutoClinicalDoctornote = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/doctor-note`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Add doctor note */
export const getAutoClinicalDoctornotePatientBypatientId = async (patientId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/doctor-note/patient/${patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Add Prescription */
export const createAutoClinicalPrescription = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/prescription`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Auto-generated */
export const getAutoClinicalPrescriptionPatientBypatientId = async (queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/prescription/patient/{patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Record patient vitals */
export const createAutoClinicalVitals = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/vitals`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Auto-generated */
export const getAutoClinicalVitalsHistoryBypatientId = async (queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/vitals/history/{patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Get Doctor Dashboard */
export const getAutoDashboardDoctor = async (doctorId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/dashboard/doctor/${doctorId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Get Patient Portal */
export const getAutoDashboardPatient = async (uhid: string, queryParams?: Record<string, any>) => {
  let endpoint = `/dashboard/patient/${uhid}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** List V1 - labRoute */
export const getAutoDiagnosticsLab = async (queryParams?: Record<string, any>) => {
  let endpoint = `/diagnostics/lab`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** List V1 - labRoute */
export const createAutoDiagnosticsLab = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/diagnostics/lab`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Get Lab By Id V1 */
export const getAutoDiagnosticsLabByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/diagnostics/lab/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Update Lab V1 */
export const updateAutoDiagnosticsLabByid = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/diagnostics/lab/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

/** Update V1 - labRoute */
export const deleteAutoDiagnosticsLabByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/diagnostics/lab/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

/** Create Radiology V1 */
export const getAutoDiagnosticsRadiology = async (queryParams?: Record<string, any>) => {
  let endpoint = `/diagnostics/radiology`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** List V1 - radiologyRoute */
export const createAutoDiagnosticsRadiology = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/diagnostics/radiology`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Get Radiology By Id V1 */
export const getAutoDiagnosticsRadiologyByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/diagnostics/radiology/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Update Radiology V1 */
export const updateAutoDiagnosticsRadiologyByid = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/diagnostics/radiology/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

/** Update V1 - radiologyRoute */
export const deleteAutoDiagnosticsRadiologyByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/diagnostics/radiology/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

/** Create Lab Order */
export const createAutoDiagnosticsLabOrders = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/diagnostics/lab/orders`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Search lab orders */
export const getAutoDiagnosticsLabOrdersSearch = async (queryParams?: Record<string, any>) => {
  let endpoint = `/diagnostics/lab/orders/search`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Create radiology order */
export const createAutoDiagnosticsRadiologyOrders = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/diagnostics/radiology/orders`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Search radiology orders */
export const getAutoDiagnosticsRadiologyOrdersSearch = async (queryParams?: Record<string, any>) => {
  let endpoint = `/diagnostics/radiology/orders/search`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Register new doctor */
export const createAutoDoctors = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/doctors`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Register new doctor */
export const getAutoDoctors = async (queryParams?: Record<string, any>) => {
  let endpoint = `/doctors`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Get Doctor By Id */
export const getAutoDoctorsByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/doctors/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Update Doctor */
export const updateAutoDoctorsByid = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/doctors/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

/** Delete Doctor */
export const deleteAutoDoctorsByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/doctors/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

/** Update doctor */
export const getAutoDoctorsAvailable = async (queryParams?: Record<string, any>) => {
  let endpoint = `/doctors/available`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Delete Doctor */
export const getAutoDoctorsSpecialization = async (queryParams?: Record<string, any>) => {
  let endpoint = `/doctors/specialization`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Delete Doctor */
export const getAutoDoctorsDepartmentBydepartmentId = async (departmentId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/doctors/department/${departmentId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Delete Doctor */
export const getAutoDoctorsSearch = async (queryParams?: Record<string, any>) => {
  let endpoint = `/doctors/search`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Record financial transaction */
export const createAutoFinanceTransaction = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/finance/transaction`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Auto-generated */
export const getAutoFinanceTransactions = async (queryParams?: Record<string, any>) => {
  let endpoint = `/finance/transactions`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Add pharmacy stock */
export const createAutoInventoryPharmacyStock = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/inventory/pharmacy/stock`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Add pharmacy stock */
export const getAutoInventoryPharmacyStock = async (queryParams?: Record<string, any>) => {
  let endpoint = `/inventory/pharmacy/stock`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Search pharmacy stock */
export const getAutoInventoryPharmacyStockSearch = async (queryParams?: Record<string, any>) => {
  let endpoint = `/inventory/pharmacy/stock/search`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Update pharmacy stock */
export const updateAutoInventoryPharmacyStockByid = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/inventory/pharmacy/stock/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

/** Update pharmacy stock */
export const deleteAutoInventoryPharmacyStockByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/inventory/pharmacy/stock/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

/** Get Ipd By Id V1 */
export const getAutoIpd = async (queryParams?: Record<string, any>) => {
  let endpoint = `/ipd`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Get Ipd By Id V1 */
export const getAutoIpdByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/ipd/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Update Ipd V1 */
export const updateAutoIpdByid = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/ipd/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

/** Update admission */
export const deleteAutoIpdByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/ipd/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

/** Create Ward */
export const createAutoIpdWards = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/ipd/wards`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Create ward */
export const getAutoIpdWards = async (queryParams?: Record<string, any>) => {
  let endpoint = `/ipd/wards`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Create Bed */
export const createAutoIpdBeds = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/ipd/beds`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Create bed */
export const getAutoIpdBeds = async (queryParams?: Record<string, any>) => {
  let endpoint = `/ipd/beds`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Get Bed By Id */
export const getAutoIpdBedsAvailable = async (queryParams?: Record<string, any>) => {
  let endpoint = `/ipd/beds/available`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Get Bed By Id */
export const getAutoIpdBedsBybedId = async (bedId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/ipd/beds/${bedId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Admit Patient */
export const createAutoIpdAdmit = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/ipd/admit`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Admit patient */
export const getAutoIpdAdmissionsSearch = async (queryParams?: Record<string, any>) => {
  let endpoint = `/ipd/admissions/search`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Discharge patient */
export const createAutoIpdDischargeByadmissionId = async (admissionId: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/ipd/discharge/${admissionId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Discharge patient */
export const createAutoIpdTransferbedByadmissionId = async (admissionId: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/ipd/transfer-bed/${admissionId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Get Nurse By Id */
export const getAutoNursesAvailable = async (queryParams?: Record<string, any>) => {
  let endpoint = `/nurses/available`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Get Nurse By Id */
export const getAutoNursesDepartmentBydepartmentId = async (departmentId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/nurses/department/${departmentId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Get Nurse By Id */
export const getAutoNursesByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/nurses/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Check-in patient from appointment */
export const createAutoOpdCheckinByappointmentId = async (appointmentId: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/opd/check-in/${appointmentId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Check-in patient from appointment */
export const createAutoOpdWalkin = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/opd/walk-in`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Get Visit By Id */
export const getAutoOpd = async (queryParams?: Record<string, any>) => {
  let endpoint = `/opd`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Search OPD visits */
export const getAutoOpdSearch = async (queryParams?: Record<string, any>) => {
  let endpoint = `/opd/search`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Get Visit By Id */
export const getAutoOpdByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/opd/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Delete Visit */
export const deleteAutoOpdByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/opd/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

/** Record Vitals */
export const createAutoOpdVitalsByopdVisitId = async (opdVisitId: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/opd/vitals/${opdVisitId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Patient Register V1 */
export const createAutoPatientsPatientRegister = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/patients/patient-register`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Register new patient */
export const createAutoPatientsRegister = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/patients/register`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Get Patient By Id */
export const getAutoPatients = async (queryParams?: Record<string, any>) => {
  let endpoint = `/patients`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Get Patient By Id */
export const getAutoPatientsByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/patients/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Update Patient */
export const updateAutoPatientsByid = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/patients/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

/** Delete Patient */
export const deleteAutoPatientsByid = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/patients/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

/** Update patient */
export const getAutoPatientsSearchbyphone = async (queryParams?: Record<string, any>) => {
  let endpoint = `/patients/search-by-phone`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Search patient by phone */
export const getAutoPatientsUhidByuhid = async (uhid: string, queryParams?: Record<string, any>) => {
  let endpoint = `/patients/uhid/${uhid}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Delete Patient */
export const getAutoPatientsByidFamily = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/patients/${id}/family`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Delete Patient */
export const getAutoPatientsSearch = async (queryParams?: Record<string, any>) => {
  let endpoint = `/patients/search`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Log visitor entry */
export const createAutoReceptionVisitorEntry = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/reception/visitor/entry`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Log visitor entry */
export const updateAutoReceptionVisitorExitByid = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/reception/visitor/exit/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

/** Auto-generated */
export const getAutoReceptionVisitorsActive = async (queryParams?: Record<string, any>) => {
  let endpoint = `/reception/visitors/active`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Generate system report */
export const createAutoReportingGenerate = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/reporting/generate`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Auto-generated */
export const getAutoReportingList = async (queryParams?: Record<string, any>) => {
  let endpoint = `/reporting/list`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Hire employee */
export const createAutoSupportEmployee = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/support/employee`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Auto-generated */
export const getAutoSupportEmployees = async (queryParams?: Record<string, any>) => {
  let endpoint = `/support/employees`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

/** Initiate video call */
export const createAutoTelemedicineInitiate = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/telemedicine/initiate`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Quick admission to IPD */
export const createQuickAdmission = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/ipd/quick-admission`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

/** Delete user by ID */
export const deleteUsersById = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/users/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

/* --- LEGACY ALIASES --- */
export const getAutoUsers = getAutoAdminUsers;
export const getAutoClinicals = getAutoClinical;


/* --- API Aliases --- */
export const getAssetAudits = getAutoAssetsAudits;
export const getAssetCategories = getAutoAssetsCategories;
export const getAssetLocations = getAutoAssetsLocations;
export const getAssetMaintenances = getAutoAssetsMaintenances;
export const getAssetVendors = getAutoAssetsVendors;
export const getEquipments = getAutoAssetsMasters;
export const listDepartments = getAutoDepartments;
export const listDoctors = getAutoAdminUsers;
export const listUsers = getAutoAdminUsers;
export const getCoreReceipts = getAutoBillingInvoicesSearch;
export const getPharmacyStockOverview = getAutoInventoryPharmacyStock;
export const getPharmacySuppliers = getAutoInventoryPharmacyStockSearch;
export const patientRegister = createAutoPatientsRegister;
export const createEquipment = createAutoAssetsMasters;
export const listVisits = getAutoClinical;
export const getEquipmentCalibrationRecords = getAutoAssetsAudits;
export const getEquipmentCategories = getAutoAssetsCategories;
export const getEquipmentEquipments = getAutoAssetsMasters;
export const getAutoEquipmentLocations = getAutoAssetsLocations;
export const getEquipmentMaintenanceLogs = getAutoAssetsUsagelogs;
export const getEquipmentMaintenanceSchedules = getAutoAssetsMaintenances;
export const getEquipmentSpareParts = getAutoAssetsSubcategories;
export const getEquipmentUsageLogs = getAutoAssetsUsagelogs;
export const getEquipmentVendors = getAutoAssetsVendors;
export const deleteEquipment = deleteAutoAssetsMastersByid;

