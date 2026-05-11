/**
 * AUTO-GENERATED API SERVICE
 * Generated on: 2026-05-11T15:41:20.916Z
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

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

const apiRequest = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
  const token = getToken();
  const hospitalId = getHospitalId();
  const branchId = getBranchId();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  
  if (options.headers) {
    Object.assign(headers, options.headers);
  }
  
  if (token) headers['Authorization'] = "Bearer " + token;
  if (hospitalId) headers['X-Hospital-Id'] = hospitalId;
  if (branchId) headers['X-Branch-Id'] = branchId;

  const url = API_BASE_URL + endpoint;
  const startTime = Date.now();

  try {
    const response = await fetch(url, { ...options, headers });
    const duration = Date.now() - startTime;
    
    let data;
    try { 
      data = await response.json(); 
    } catch (e) { 
      data = null; 
    }
    
    if (!response.ok) {
      console.error(`[API Error] ${options.method || 'GET'} ${endpoint} - Status: ${response.status}`, data);
    } else {
      console.log(`[API Success] ${options.method || 'GET'} ${endpoint} - ${duration}ms`);
    }

    return { 
      data: data?.data || data, 
      success: data?.success || response.ok,
      message: data?.message || (response.ok ? 'Success' : 'Error'),
      status: response.status, 
      ok: response.ok 
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[API Network Error] ${options.method || 'GET'} ${endpoint} - ${duration}ms`, error);
    return { data: null as any, success: false, status: 0, ok: false, error, message: 'Network error occurred' };
  }
};

/* --- TYPES --- */
export interface BaseResponse { success?: boolean; message?: string; error?: string; data?: any; }


export const getAutoApiError401 = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api-error/401`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoApiError403 = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api-error/403`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoHomeController = async (queryParams?: Record<string, any>) => {
  let endpoint = `/`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoAdminUsers = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api/admin/users`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoAdminUsersSearch = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api/admin/users/search`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoAdminRoles = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api/admin/roles`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoAdminBranches = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api/admin/branches`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

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

export const getAutoAuthLogin = async (data: any) => {
  return apiRequest('/auth/login', { 
    method: 'POST', 
    body: JSON.stringify(data)
  });
};

export const getAutoUsers = async (queryParams?: Record<string, any>) => {
  let endpoint = `/auth/users`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const createAutoDepartments = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/api/departments`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

export const getAutoDepartments = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api/departments`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoDepartmentsListAll = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api/departments/list-all`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoDepartmentsActive = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api/departments/active`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoDepartments1 = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/api/departments/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const updateAutoDepartments = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/api/departments/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

export const deleteAutoDepartments = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/api/departments/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

export const getAutoDepartmentsCode = async (code: string, queryParams?: Record<string, any>) => {
  let endpoint = `/api/departments/code/${code}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoDepartmentsSearch = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api/departments/search`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

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

export const getAutoAppointments1 = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/appointments/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const updateAutoAppointments = async (id: string, data?: any, queryParams?: Record<string, any>) => {
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

export const deleteAutoAppointments = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/appointments/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

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

export const getAutoAppointmentsPatient = async (queryParams?: Record<string, any>) => {
  let endpoint = `/appointments/patient/{patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoAppointmentsDoctor = async (queryParams?: Record<string, any>) => {
  let endpoint = `/appointments/doctor/{doctorId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

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

export const getAutoAssetsMasters1 = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/assets/masters/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const updateAutoAssetsMasters = async (id: string, data?: any, queryParams?: Record<string, any>) => {
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

export const deleteAutoAssetsMasters = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/assets/masters/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

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

export const getAutoAssetsSubCategories = async (queryParams?: Record<string, any>) => {
  let endpoint = `/assets/sub-categories`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const createAutoAssetsSubCategories = async (data?: any, queryParams?: Record<string, any>) => {
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

export const getAutoAssetsUsageLogs = async (queryParams?: Record<string, any>) => {
  let endpoint = `/assets/usage-logs`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

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

export const getAutoBilling1 = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/billing/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const updateAutoBilling = async (id: string, data?: any, queryParams?: Record<string, any>) => {
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

export const deleteAutoBilling = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/billing/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

export const createAutoBillingServiceCharges = async (data?: any, queryParams?: Record<string, any>) => {
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

export const getAutoBillingServiceCharges = async (queryParams?: Record<string, any>) => {
  let endpoint = `/billing/service-charges`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

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

export const deleteAutoBillingInvoices = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/billing/invoices/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

export const getAutoClinicals = async (queryParams?: Record<string, any>) => {
  let endpoint = `/clinical`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoClinicals1 = async (data?: any, queryParams?: Record<string, any>) => {
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

export const getAutoClinical = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const updateAutoClinical = async (id: string, data?: any, queryParams?: Record<string, any>) => {
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

export const deleteAutoClinical = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

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

export const getAutoClinicalAddiction = async (patientId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/addiction/${patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const updateAutoClinicalAddiction = async (id: string, data?: any, queryParams?: Record<string, any>) => {
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

export const deleteAutoClinicalAddiction = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/addiction/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

export const getAutoClinicalAllClinicalDetails = async (queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/all-clinical-details/`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

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

export const getAutoClinicalSurgical = async (patientId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/surgical/${patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const updateAutoClinicalSurgical = async (id: string, data?: any, queryParams?: Record<string, any>) => {
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

export const getAutoClinicalMedical = async (patientId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/medical/${patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const updateAutoClinicalMedical = async (id: string, data?: any, queryParams?: Record<string, any>) => {
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

export const deleteAutoClinicalMedical = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/medical/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

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

export const getAutoClinicalPersonalhistory = async (patientId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/personalhistory/${patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const updateAutoClinicalPersonalhistory = async (id: string, data?: any, queryParams?: Record<string, any>) => {
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

export const updateAutoClinicalUpdatediagnosis = async (id: string, data?: any, queryParams?: Record<string, any>) => {
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

export const getAutoClinicalGetdiagnosis = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/getdiagnosis/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoClinicalDiagnosispatient = async (patientId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/diagnosispatient/${patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoClinicalVisitdiagnosis = async (visitId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/visitdiagnosis/${visitId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

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

export const updateAutoClinicalUpdatedoctornotes = async (id: string, data?: any, queryParams?: Record<string, any>) => {
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

export const getAutoClinicalUpdatedoctornotes = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/updatedoctornotes/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const deleteAutoClinicalDeletedoctornotes = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/deletedoctornotes/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

export const createAutoClinicalCreatePrescription = async (visitId: string, data?: any, queryParams?: Record<string, any>) => {
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

export const updateAutoClinicalUpdatePrescription = async (id: string, data?: any, queryParams?: Record<string, any>) => {
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

export const getAutoClinicalGetPrescription = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/getPrescription/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const deleteAutoClinicalDeletePrescription = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/deletePrescription/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

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

export const getAutoClinicalEmr = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/emr/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const updateAutoClinicalEmr = async (id: string, data?: any, queryParams?: Record<string, any>) => {
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

export const createAutoClinicalNursingNote = async (data?: any, queryParams?: Record<string, any>) => {
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

export const getAutoClinicalNursingNoteAdmission = async (admissionId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/nursing-note/admission/${admissionId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const createAutoClinicalDischargeSummary = async (data?: any, queryParams?: Record<string, any>) => {
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

export const getAutoClinicalDischargeSummaryAdmission = async (admissionId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/discharge-summary/admission/${admissionId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

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

export const createAutoClinicalSurgicalHistory = async (data?: any, queryParams?: Record<string, any>) => {
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

export const getAutoClinicalSurgicalHistoryPatient = async (patientId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/surgical-history/patient/${patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const createAutoClinicalMedicalHistory = async (data?: any, queryParams?: Record<string, any>) => {
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

export const getAutoClinicalMedicalHistoryPatient = async (patientId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/medical-history/patient/${patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const createAutoClinicalPersonalHistory = async (data?: any, queryParams?: Record<string, any>) => {
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

export const getAutoClinicalPersonalHistoryPatient = async (patientId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/personal-history/patient/${patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

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

export const getAutoClinicalDiagnosisPatient = async (patientId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/diagnosis/patient/${patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const createAutoClinicalDoctorNote = async (data?: any, queryParams?: Record<string, any>) => {
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

export const getAutoClinicalDoctorNotePatient = async (patientId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/doctor-note/patient/${patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

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

export const getAutoClinicalPrescriptionPatient = async (queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/prescription/patient/{patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

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

export const getAutoClinicalVitalsHistory = async (queryParams?: Record<string, any>) => {
  let endpoint = `/clinical/vitals/history/{patientId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoDashboardDoctor = async (doctorId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/api/dashboard/doctor/${doctorId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoDashboardPatient = async (uhid: string, queryParams?: Record<string, any>) => {
  let endpoint = `/api/dashboard/patient/${uhid}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

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

export const getAutoDiagnosticsLab1 = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/diagnostics/lab/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const updateAutoDiagnosticsLab = async (id: string, data?: any, queryParams?: Record<string, any>) => {
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

export const deleteAutoDiagnosticsLab = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/diagnostics/lab/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

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

export const getAutoDiagnosticsRadiology1 = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/diagnostics/radiology/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const updateAutoDiagnosticsRadiology = async (id: string, data?: any, queryParams?: Record<string, any>) => {
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

export const deleteAutoDiagnosticsRadiology = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/diagnostics/radiology/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

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

export const createAutoDoctors = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/api/doctors`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

export const getAutoDoctors = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api/doctors`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoDoctors1 = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/api/doctors/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const updateAutoDoctors = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/api/doctors/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

export const deleteAutoDoctors = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/api/doctors/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

export const getAutoDoctorsAvailable = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api/doctors/available`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoDoctorsSpecialization = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api/doctors/specialization`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoDoctorsDepartment = async (departmentId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/api/doctors/department/${departmentId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoDoctorsSearch = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api/doctors/search`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const createAutoFinanceTransaction = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/api/finance/transaction`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

export const getAutoFinanceTransactions = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api/finance/transactions`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const createAutoInventoryPharmacyStock = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/api/inventory/pharmacy/stock`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

export const getAutoInventoryPharmacyStock = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api/inventory/pharmacy/stock`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoInventoryPharmacyStockSearch = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api/inventory/pharmacy/stock/search`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const updateAutoInventoryPharmacyStock = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/api/inventory/pharmacy/stock/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

export const deleteAutoInventoryPharmacyStock = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/api/inventory/pharmacy/stock/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

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

export const getAutoIpd1 = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/ipd/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const updateAutoIpd = async (id: string, data?: any, queryParams?: Record<string, any>) => {
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

export const deleteAutoIpd = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/ipd/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

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

export const getAutoIpdBeds1 = async (bedId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/ipd/beds/${bedId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

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

export const createAutoIpdDischarge = async (admissionId: string, data?: any, queryParams?: Record<string, any>) => {
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

export const createAutoIpdTransferBed = async (admissionId: string, data?: any, queryParams?: Record<string, any>) => {
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

export const getAutoNursesAvailable = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api/nurses/available`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoNursesDepartment = async (departmentId: string, queryParams?: Record<string, any>) => {
  let endpoint = `/api/nurses/department/${departmentId}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoNurses = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/api/nurses/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const createAutoOpdCheckIn = async (appointmentId: string, data?: any, queryParams?: Record<string, any>) => {
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

export const createAutoOpdWalkIn = async (data?: any, queryParams?: Record<string, any>) => {
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

export const getAutoOpd1 = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/opd/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const deleteAutoOpd = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/opd/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

export const createAutoOpdVitals = async (opdVisitId: string, data?: any, queryParams?: Record<string, any>) => {
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

export const getAutoPatients1 = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/patients/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const updateAutoPatients = async (id: string, data?: any, queryParams?: Record<string, any>) => {
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

export const deleteAutoPatients = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/patients/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'DELETE', 
  });
};

export const getAutoPatientsSearchByPhone = async (queryParams?: Record<string, any>) => {
  let endpoint = `/patients/search-by-phone`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoPatientsUhid = async (uhid: string, queryParams?: Record<string, any>) => {
  let endpoint = `/patients/uhid/${uhid}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const getAutoPatientsFamily = async (id: string, queryParams?: Record<string, any>) => {
  let endpoint = `/patients/${id}/family`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

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

export const createAutoReceptionVisitorEntry = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/api/reception/visitor/entry`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

export const updateAutoReceptionVisitorExit = async (id: string, data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/api/reception/visitor/exit/${id}`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data || {}) 
  });
};

export const getAutoReceptionVisitorsActive = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api/reception/visitors/active`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const createAutoReportingGenerate = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/api/reporting/generate`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

export const getAutoReportingList = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api/reporting/list`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const createAutoSupportEmployee = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/api/support/employee`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};

export const getAutoSupportEmployees = async (queryParams?: Record<string, any>) => {
  let endpoint = `/api/support/employees`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'GET', 
  });
};

export const createAutoTelemedicineInitiate = async (data?: any, queryParams?: Record<string, any>) => {
  let endpoint = `/api/telemedicine/initiate`;
  if (queryParams) {
    const sp = new URLSearchParams(queryParams);
    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();
  }
  return apiRequest(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data || {}) 
  });
};




/* --- MANUAL EXTENSIONS --- */
export const getGeoCountries = async (queryParams?: any) => apiRequest('/geo/countries', { method: 'GET' });
export const getGeoStates = async (queryParams?: any) => apiRequest('/geo/states', { method: 'GET' });
export const getGeoCities = async (queryParams?: any) => apiRequest('/geo/cities', { method: 'GET' });
export const getclinicalDetailsById = async (id: string) => apiRequest(`/clinical-details/${id}`, { method: 'GET' });
export const updateclinicalDetails = async (id: string, data: any) => apiRequest(`/clinical-details/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteclinicalDetails = async (id: string) => apiRequest(`/clinical-details/${id}`, { method: 'DELETE' });
export const createAddiction = async (data: any) => apiRequest('/addiction', { method: 'POST', body: JSON.stringify(data) });
export const deleteAddiction = async (data: any) => apiRequest('/addiction', { method: 'DELETE', body: JSON.stringify(data) });
export const updateAddiction = async (id: string, data: any) => apiRequest(`/addiction/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAddictionById = async (id: string) => apiRequest(`/addiction/${id}`, { method: 'DELETE' });
export const getAddictionByPatientId = async (patientId: string) => apiRequest(`/addiction/${patientId}`, { method: 'GET' });
export const createDiagnosis = async (data: any) => apiRequest('/creatediagnosis', { method: 'POST', body: JSON.stringify(data) });
export const updateDiagnosis = async (id: string, data: any) => apiRequest(`/updatediagnosis/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const getDiagnosisById = async (id: string) => apiRequest(`/getdiagnosis/${id}`, { method: 'GET' });
export const getDiagnosisByPatientId = async (patientId: string) => apiRequest(`/diagnosispatient/${patientId}`, { method: 'GET' });
export const getDiagnosisByVisitId = async (visitId: string) => apiRequest(`/visitdiagnosis/${visitId}`, { method: 'GET' });
export const createPrescription = async (visitId: string, data: any) => apiRequest(`/createPrescription/${visitId}`, { method: 'POST', body: JSON.stringify(data) });
export const updatePrescription = async (id: string, data: any) => apiRequest(`/updatePrescription/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const getPrescriptionById = async (id: string) => apiRequest(`/getPrescription/${id}`, { method: 'GET' });
export const deletePrescription = async (id: string) => apiRequest(`/deletePrescription/${id}`, { method: 'DELETE' });
export const getAssetsCategories = async () => apiRequest('/assets/categories', { method: 'GET' });
export const createAssetsCategories = async (data: any) => apiRequest('/assets/categories', { method: 'POST', body: JSON.stringify(data) });
export const getAssetsVendors = async () => apiRequest('/assets/vendors', { method: 'GET' });
export const getAssetsLocations = async () => apiRequest('/assets/locations', { method: 'GET' });
export const getAssetsMaintenances = async () => apiRequest('/assets/maintenances', { method: 'GET' });
export const getAssetsAudits = async () => apiRequest('/assets/audits', { method: 'GET' });
export const getAssetsDepreciations = async () => apiRequest('/assets/depreciations', { method: 'GET' });
export const getAssetsDisposals = async () => apiRequest('/assets/disposals', { method: 'GET' });
export const getEquipmentEquipments = async () => apiRequest('/equipment/equipments', { method: 'GET' });
export const getEquipmentCategories = async () => apiRequest('/equipment/categories', { method: 'GET' });
export const getEquipmentVendors = async () => apiRequest('/equipment/vendors', { method: 'GET' });
export const getEquipmentLocations = async () => apiRequest('/equipment/locations', { method: 'GET' });
export const getEquipmentMaintenanceSchedules = async () => apiRequest('/equipment/maintenance-schedules', { method: 'GET' });
export const getEquipmentMaintenanceLogs = async () => apiRequest('/equipment/maintenance-logs', { method: 'GET' });
export const getEquipmentCalibrationRecords = async () => apiRequest('/equipment/calibration-records', { method: 'GET' });
export const getEquipmentBreakdowns = async () => apiRequest('/equipment/breakdown-tickets', { method: 'GET' });
export const getEquipmentSpareParts = async () => apiRequest('/equipment/spare-parts', { method: 'GET' });
export const getEquipmentTransfers = async () => apiRequest('/equipment/transfers', { method: 'GET' });
export const getEquipmentUsageLogs = async () => apiRequest('/equipment/usage-logs', { method: 'GET' });
export const getEquipmentDocuments = async () => apiRequest('/equipment/documents', { method: 'GET' });
export const listCertificateTypes = async () => apiRequest('/certificates/types', { method: 'GET' });
export const listCertificateTemplates = async () => apiRequest('/certificates/templates', { method: 'GET' });
export const listGeneratedCertificates = async () => apiRequest('/certificates/generated', { method: 'GET' });
export const listCertificateSignatures = async () => apiRequest('/certificates/signatures', { method: 'GET' });
export const listCertificateVerifications = async () => apiRequest('/certificates/verifications', { method: 'GET' });
export const getGlobalVitals = async () => apiRequest('/vitals/global', { method: 'GET' });
export const getVisitVitals = async () => apiRequest('/vitals/visit', { method: 'GET' });
export const getCoreDepartments = async () => apiRequest('/core/departments', { method: 'GET' });
export const getCorePatients = async () => apiRequest('/core/patients', { method: 'GET' });
export const getCoreReceipts = async () => apiRequest('/core/receipts', { method: 'GET' });
export const getLabSamples = async () => apiRequest('/lab/samples', { method: 'GET' });
export const getLabResults = async () => apiRequest('/lab/results', { method: 'GET' });
export const getRadiologyStudies = async () => apiRequest('/radiology/studies', { method: 'GET' });
export const getRadiologyReports = async () => apiRequest('/radiology/reports', { method: 'GET' });
export const getRadiologyImages = async () => apiRequest('/radiology/images', { method: 'GET' });
export const listInvestigationMasters = async (q?: any) => apiRequest('/investigation/masters', { method: 'GET' });
export const listInvestigationOrders = async () => apiRequest('/investigation/orders', { method: 'GET' });
export const getInstruments = async () => apiRequest('/instruments', { method: 'GET' });
export const getInstrumentBatches = async () => apiRequest('/instrument-batches', { method: 'GET' });
export const getSterilizationCycles = async () => apiRequest('/sterilization-cycles', { method: 'GET' });
export const getIssuedInstruments = async () => apiRequest('/issued-instruments', { method: 'GET' });
export const getIPDAdmissions = async () => apiRequest('/ipd/admissions', { method: 'GET' });
export const createQuickAdmission = async (data: any) => apiRequest('/ipd/quick-admission', { method: 'POST', body: JSON.stringify(data) });
export const getPharmacyDispenses = async () => apiRequest('/pharmacy/dispenses', { method: 'GET' });
export const getPharmacyInvoices = async () => apiRequest('/pharmacy/invoices', { method: 'GET' });
export const getPharmacyStocks = async () => apiRequest('/pharmacy/stocks', { method: 'GET' });
export const getPharmacySuppliers = async () => apiRequest('/pharmacy/suppliers', { method: 'GET' });
export const getPharmacyPrescriptions = async () => apiRequest('/pharmacy/prescriptions', { method: 'GET' });
export const getPurchaseOrders = async () => apiRequest('/pharmacy/purchase-orders', { method: 'GET' });
export const getGRNs = async () => apiRequest('/pharmacy/grns', { method: 'GET' });
export const getInsuranceClaims = async () => apiRequest('/pharmacy/insurance-claims', { method: 'GET' });
export const getStockTransfers = async () => apiRequest('/pharmacy/stock-transfers', { method: 'GET' });
export const getStockAdjustments = async () => apiRequest('/pharmacy/stock-adjustments', { method: 'GET' });
export const listMedicines = async () => apiRequest('/pharmacy/medicines', { method: 'GET' });
export const createMedicine = async (data: any) => apiRequest('/pharmacy/medicines', { method: 'POST', body: JSON.stringify(data) });
export const createPharmacyDispense = async (data: any) => apiRequest('/pharmacy/dispenses', { method: 'POST', body: JSON.stringify(data) });
export const createPharmacyInvoice = async (data: any) => apiRequest('/pharmacy/invoices', { method: 'POST', body: JSON.stringify(data) });
export const createPharmacyStock = async (data: any) => apiRequest('/pharmacy/stocks', { method: 'POST', body: JSON.stringify(data) });
export const createPharmacySupplier = async (data: any) => apiRequest('/pharmacy/suppliers', { method: 'POST', body: JSON.stringify(data) });
export const patientRegister = async (data: any) => apiRequest('/patient-register', { method: 'POST', body: JSON.stringify(data) });
export const deleteUsersById = async (id: string) => apiRequest(`/users/${id}`, { method: 'DELETE' });
export const getTeamUnder = async (id: string) => apiRequest(`/users/team/${id}`, { method: 'GET' });
export const updateCertificateTemplate = async (id: string, data: any) => apiRequest(`/certificates/templates/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const createCertificateTemplate = async (data: any) => apiRequest('/certificates/templates', { method: 'POST', body: JSON.stringify(data) });
export const deleteCertificateTemplate = async (id: string) => apiRequest(`/certificates/templates/${id}`, { method: 'DELETE' });
export const createCertificateSignature = async (data: any) => apiRequest('/certificates/signatures', { method: 'POST', body: JSON.stringify(data) });
export const updateCertificateSignature = async (id: string, data: any) => apiRequest(`/certificates/signatures/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCertificateSignature = async (id: string) => apiRequest(`/certificates/signatures/${id}`, { method: 'DELETE' });
export const createGeneratedCertificate = async (data: any) => apiRequest('/certificates/generated', { method: 'POST', body: JSON.stringify(data) });
export const verifyCertificate = async (data: any) => apiRequest('/certificates/verify', { method: 'POST', body: JSON.stringify(data) });
export const listAmbulances = async () => apiRequest('/ambulances', { method: 'GET' });
export const createAmbulance = async (data: any) => apiRequest('/ambulances', { method: 'POST', body: JSON.stringify(data) });
export const updateAmbulance = async (id: string, data: any) => apiRequest(`/ambulances/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAmbulance = async (id: string) => apiRequest(`/ambulances/${id}`, { method: 'DELETE' });
export const listAmbulanceTrips = async () => apiRequest('/ambulances/trips', { method: 'GET' });
export const createAmbulanceTrip = async (data: any) => apiRequest('/ambulances/trips', { method: 'POST', body: JSON.stringify(data) });
export const listAmbulanceMaintenances = async () => apiRequest('/ambulances/maintenances', { method: 'GET' });
export const createAmbulanceMaintenance = async (data: any) => apiRequest('/ambulances/maintenances', { method: 'POST', body: JSON.stringify(data) });
export const listBloodInventory = async () => apiRequest('/blood-bank/inventory', { method: 'GET' });
export const listBloodRequests = async () => apiRequest('/blood-bank/requests', { method: 'GET' });
export const listBloodDonors = async () => apiRequest('/blood-bank/donors', { method: 'GET' });
export const listBloodDonations = async () => apiRequest('/blood-bank/donations', { method: 'GET' });
export const listBloodGroups = async () => apiRequest('/blood-bank/groups', { method: 'GET' });
export const listBloodComponents = async () => apiRequest('/blood-bank/components', { method: 'GET' });
export const createBloodRequest = async (data: any) => apiRequest('/blood-bank/requests', { method: 'POST', body: JSON.stringify(data) });
export const updateBloodRequestStatus = async (id: string, data: any) => apiRequest(`/blood-bank/requests/${id}/status`, { method: 'PUT', body: JSON.stringify(data) });
export const createBloodDonor = async (data: any) => apiRequest('/blood-bank/donors', { method: 'POST', body: JSON.stringify(data) });
export const createBloodDonation = async (data: any) => apiRequest('/blood-bank/donations', { method: 'POST', body: JSON.stringify(data) });
export const issueBlood = async (data: any) => apiRequest('/blood-bank/issue', { method: 'POST', body: JSON.stringify(data) });
export const updateBloodDonor = async (id: string, data: any) => apiRequest(`/blood-bank/donors/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteBloodDonor = async (id: string) => apiRequest(`/blood-bank/donors/${id}`, { method: 'DELETE' });
export const updateBloodRequest = async (id: string, data: any) => apiRequest(`/blood-bank/requests/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteBloodRequest = async (id: string) => apiRequest(`/blood-bank/requests/${id}`, { method: 'DELETE' });
export const updateBloodInventoryStatus = async (id: string, data: any) => apiRequest(`/blood-bank/inventory/${id}/status`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteBloodInventory = async (id: string) => apiRequest(`/blood-bank/inventory/${id}`, { method: 'DELETE' });
export const createBloodComponent = async (data: any) => apiRequest('/blood-bank/components', { method: 'POST', body: JSON.stringify(data) });
export const createBloodInventory = async (data: any) => apiRequest('/blood-bank/inventory', { method: 'POST', body: JSON.stringify(data) });
export const createInstrument = async (data: any) => apiRequest('/instruments', { method: 'POST', body: JSON.stringify(data) });
export const createInstrumentBatch = async (data: any) => apiRequest('/instrument-batches', { method: 'POST', body: JSON.stringify(data) });
export const createSterilizationCycle = async (data: any) => apiRequest('/sterilization-cycles', { method: 'POST', body: JSON.stringify(data) });
export const updateSterilizationCycle = async (id: string, data: any) => apiRequest(`/sterilization-cycles/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const issueInstrument = async (data: any) => apiRequest('/instruments/issue', { method: 'POST', body: JSON.stringify(data) });
export const returnInstrument = async (data: any) => apiRequest('/instruments/return', { method: 'POST', body: JSON.stringify(data) });
export const createLabSample = async (data: any) => apiRequest('/lab/samples', { method: 'POST', body: JSON.stringify(data) });
export const updateLabSampleStatus = async (id: string, data: any) => apiRequest(`/lab/samples/${id}/status`, { method: 'PUT', body: JSON.stringify(data) });
export const createLabResult = async (data: any) => apiRequest('/lab/results', { method: 'POST', body: JSON.stringify(data) });
export const updateLabResultStatus = async (id: string, data: any) => apiRequest(`/lab/results/${id}/status`, { method: 'PUT', body: JSON.stringify(data) });


/* --- ALIASES FOR COMPATIBILITY --- */
export const createRegister = createAutoAuthRegister;
export const listUsers = getAutoUsers;
export const createAutoClinical = getAutoClinicals;
export const createAsset = createAutoAssetsMasters;
export const createAssetsMasters = createAutoAssetsMasters;
export const getAssets = getAutoAssetsMasters;
export const listDepartments = getAutoDepartments;
export const listDoctors = getAutoDoctors;
export const createLogin = getAutoAuthLogin;
export const listPatients = getAutoClinicals;
export const listVisits = getAutoClinicals;
export const getAssetCategories = getAssetsCategories;
export const getAssetVendors = getAssetsVendors;
export const getAssetMaintenances = getAssetsMaintenances;
export const getAssetDepreciations = getAssetsDepreciations;
export const getAssetDisposals = getAssetsDisposals;
export const getAssetAudits = getAssetsAudits;
export const getEquipments = getEquipmentEquipments;
export const getAutoGeoCountries = getGeoCountries;
export const getAutoGeoStates = getGeoStates;
export const getAutoGeoCities = getGeoCities;
export const listCities = getGeoCities;
export const updateById = updateAutoClinical;
export const updatePosition = updateAutoClinical;

/* --- UTILITY FUNCTIONS --- */
export const getMonthName = (monthIndex: number) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[monthIndex] || '';
};

export const post = async (endpoint: string, data?: any) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(data || {}) });

/* --- ADDITIONAL ALIASES --- */
export const getAutoEquipmentLocations = getEquipmentLocations;
export const getAssetLocations = getAssetsLocations;
export const getBloodDonors = listBloodDonors;
export const getBloodInventory = listBloodInventory;
export const getBloodRequests = listBloodRequests;
export const getAmbulanceAmbulances = listAmbulances;
export const getAmbulanceTrips = listAmbulanceTrips;
export const getCertificatesGenerated = listGeneratedCertificates;
export const getCertificatesTemplates = listCertificateTemplates;
export const deleteAsset = deleteAutoAssetsMasters;
export const createAssetCategory = createAutoAssetsCategories;
export const deleteAssetCategory = async (id: string) => apiRequest(`/assets/categories/${id}`, { method: 'DELETE' });
export const deleteAssetVendor = async (id: string) => apiRequest(`/assets/vendors/${id}`, { method: 'DELETE' });
export const createAssetVendor = async (data: any) => apiRequest('/assets/vendors', { method: 'POST', body: JSON.stringify(data) });
export const createAssetMaintenance = async (data: any) => apiRequest('/assets/maintenances', { method: 'POST', body: JSON.stringify(data) });
export const createAssetDepreciation = async (data: any) => apiRequest('/assets/depreciations', { method: 'POST', body: JSON.stringify(data) });
export const createAssetDisposal = async (data: any) => apiRequest('/assets/disposals', { method: 'POST', body: JSON.stringify(data) });

export const createEquipment = async (data: any) => apiRequest('/equipment', { method: 'POST', body: JSON.stringify(data) });
export const deleteEquipment = async (id: string) => apiRequest(`/equipment/${id}`, { method: 'DELETE' });
export const createEquipmentCategory = async (data: any) => apiRequest('/equipment/categories', { method: 'POST', body: JSON.stringify(data) });
export const createEquipmentMaintenanceSchedule = async (data: any) => apiRequest('/equipment/maintenance-schedules', { method: 'POST', body: JSON.stringify(data) });
export const createEquipmentBreakdown = async (data: any) => apiRequest('/equipment/breakdown-tickets', { method: 'POST', body: JSON.stringify(data) });

export const createRadiologyReport = async (data: any) => apiRequest('/radiology/reports', { method: 'POST', body: JSON.stringify(data) });
export const createRadiologyStudy = async (data: any) => apiRequest('/radiology/studies', { method: 'POST', body: JSON.stringify(data) });
export const updateRadiologyStudyStatus = async (id: string, status: string) => apiRequest(`/radiology/studies/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });

export const getVitalsGlobal = getGlobalVitals;
export const getVitalsVisit = getVisitVitals;
export const createVisitVitals = async (data: any) => apiRequest('/vitals/visit', { method: 'POST', body: JSON.stringify(data) });
export const updateVisitVitals = async (id: string, data: any) => apiRequest(`/vitals/visit/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteVisitVitals = async (id: string) => apiRequest(`/vitals/visit/${id}`, { method: 'DELETE' });
export const getVitalIcon = (vitalName: string) => {
  const icons: Record<string, string> = {
    'BP': 'Activity',
    'Pulse': 'HeartPulse',
    'Temp': 'Thermometer',
    'SpO2': 'Zap',
    'Weight': 'Weight'
  };
  return icons[vitalName] || 'Activity';
};
