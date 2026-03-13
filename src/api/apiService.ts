import axios from 'axios';

const API_URL = '/api/v1'; // Using a relative URL to leverage Vite's proxy

// Create an axios instance with base configuration
const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('hms_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// =================================
// Authentication APIs
// =================================

/**
 * Logs in a user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The user data and token.
 */
export const login = async (email, password) => {
    try {
        const response = await api.post('/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// =================================
// Patient Registration & Visit APIs
// =================================

export const getReceipts = async (params = {}) => {
    try {
        const response = await api.get('/core/receipts', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Searches for a patient by their mobile number or UHID.
 * @param {object} params - The search parameters (uhid or mobile).
 * @returns {Promise<object>} The patient data if found.
 */
export const findPatient = async (params) => {
    try {
        const response = await api.get('/patients/find', { params });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null; // Patient not found
        }
        throw error.response?.data || error;
    }
};

/**
 * Searches for a patient by their mobile number.
 * @param {string} mobile - The patient's mobile number.
 * @returns {Promise<object>} The patient data if found.
 */
export const findPatientByMobile = async (mobile) => {
    return findPatient({ mobile });
};

/**
 * Searches for a patient by their UHID.
 * @param {string} uhid - The patient's UHID.
 * @returns {Promise<object>} The patient data if found.
 */
export const findPatientByUhid = async (uhid) => {
    return findPatient({ uhid });
};

/**
 * Registers a new patient.
 * @param {object} patientData - The data for the new patient.
 * @returns {Promise<object>} The newly created patient record.
 */
export const registerPatient = async (patientData) => {
    try {
        const response = await api.post('/patients/register', patientData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// =================================
// Asset Management APIs
// =================================

export const getAssets = async (params = {}) => {
    try {
        const response = await api.get('/assets/masters', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createAsset = async (assetData: any) => {
    try {
        const response = await api.post('/assets/masters', assetData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteAsset = async (id: string) => {
    try {
        const response = await api.delete(`/assets/masters/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getAssetCategories = async (params = {}) => {
    try {
        const response = await api.get('/assets/categories', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createAssetCategory = async (categoryData: any) => {
    try {
        const response = await api.post('/assets/categories', categoryData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteAssetCategory = async (id: string) => {
    try {
        const response = await api.delete(`/assets/categories/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getAssetVendors = async (params = {}) => {
    try {
        const response = await api.get('/assets/vendors', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createAssetVendor = async (vendorData: any) => {
    try {
        const response = await api.post('/assets/vendors', vendorData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteAssetVendor = async (id: string) => {
    try {
        const response = await api.delete(`/assets/vendors/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getAssetLocations = async (params = {}) => {
    try {
        const response = await api.get('/assets/locations', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getAssetMaintenances = async (params = {}) => {
    try {
        const response = await api.get('/assets/maintenances', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createAssetMaintenance = async (maintenanceData: any) => {
    try {
        const response = await api.post('/assets/maintenances', maintenanceData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getAssetDepreciations = async (params = {}) => {
    try {
        const response = await api.get('/assets/depreciations', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createAssetDepreciation = async (depreciationData: any) => {
    try {
        const response = await api.post('/assets/depreciations', depreciationData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getAssetDisposals = async (params = {}) => {
    try {
        const response = await api.get('/assets/disposals', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createAssetDisposal = async (disposalData: any) => {
    try {
        const response = await api.post('/assets/disposals', disposalData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getAssetAudits = async (params = {}) => {
    try {
        const response = await api.get('/assets/audits', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// =================================
// Equipment Management APIs
// =================================

export const getEquipments = async (params = {}) => {
    try {
        const response = await api.get('/equipment/equipments', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createEquipment = async (data: any) => {
    try {
        const response = await api.post('/equipment/equipments', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteEquipment = async (id: string) => {
    try {
        const response = await api.delete(`/equipment/equipments/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getEquipmentCategories = async (params = {}) => {
    try {
        const response = await api.get('/equipment/categories', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createEquipmentCategory = async (data: any) => {
    try {
        const response = await api.post('/equipment/categories', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getEquipmentVendors = async (params = {}) => {
    try {
        const response = await api.get('/equipment/vendors', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getEquipmentLocations = async (params = {}) => {
    try {
        const response = await api.get('/equipment/locations', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getEquipmentMaintenanceSchedules = async (params = {}) => {
    try {
        const response = await api.get('/equipment/maintenance-schedules', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createEquipmentMaintenanceSchedule = async (data: any) => {
    try {
        const response = await api.post('/equipment/maintenance-schedules', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getEquipmentMaintenanceLogs = async (params = {}) => {
    try {
        const response = await api.get('/equipment/maintenance-logs', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getEquipmentCalibrationRecords = async (params = {}) => {
    try {
        const response = await api.get('/equipment/calibration-records', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getEquipmentTransfers = async (params = {}) => {
    try {
        const response = await api.get('/equipment/transfers', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getEquipmentBreakdowns = async (params = {}) => {
    try {
        const response = await api.get('/equipment/breakdown-tickets', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createEquipmentBreakdown = async (data: any) => {
    try {
        const response = await api.post('/equipment/breakdown-tickets', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getEquipmentSpareParts = async (params = {}) => {
    try {
        const response = await api.get('/equipment/spare-parts', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getEquipmentUsageLogs = async (params = {}) => {
    try {
        const response = await api.get('/equipment/usage-logs', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getEquipmentDocuments = async (params = {}) => {
    try {
        const response = await api.get('/equipment/documents', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Lists all patients with optional filtering.
 * @param {object} params - The filtering parameters (search, limit, page, etc.).
 * @returns {Promise<object>} The list of patients.
 */
export const listPatients = async (params) => {
    try {
        const response = await api.get('/patients', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Lists patient visits with optional filtering.
 * @param {object} params - The filtering parameters (visitType, date, etc.).
 * @returns {Promise<object>} The list of visits.
 */
export const listVisits = async (params) => {
    try {
        const response = await api.get('/patients/visits', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Creates a new visit for a patient (OPD or IPD).
 * @param {object} visitData - The data for the visit.
 * @returns {Promise<object>} The newly created visit record.
 */
export const createPatientVisit = async (visitData) => {
    try {
        const response = await api.post('/patient-register', visitData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Creates a quick IPD admission (Register + Visit + Admission).
 * @param {object} admissionData - The data for the quick admission.
 * @returns {Promise<object>} The newly created admission record.
 */
export const createQuickAdmission = async (admissionData) => {
    try {
        const response = await api.post('/ipd/quick-admission', admissionData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Lists users (doctors, nurses, etc.) with optional filtering.
 * @param {object} params - The filtering parameters (role, search, etc.).
 * @returns {Promise<object>} The list of users.
 */
export const listUsers = async (params) => {
    try {
        const response = await api.get('/users', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getUserById = async (id) => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listRoles = async () => {
    try {
        const response = await api.get('/roles');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Lists rooms with optional filtering.
 * @param {object} params - The filtering parameters (departmentId, assignedDoctor, etc.).
 * @returns {Promise<object>} The list of rooms.
 */
export const listRooms = async (params) => {
    try {
        const response = await api.get('/rooms', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Lists departments.
 * @returns {Promise<object>} The list of departments.
 */
export const listDepartments = async () => {
    try {
        const response = await api.get('/core/departments');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Lists countries.
 * @returns {Promise<object>} The list of countries.
 */
export const listCountries = async () => {
    try {
        const response = await api.get('/geo/countries');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Lists states.
 * @returns {Promise<object>} The list of states.
 */
export const listStates = async () => {
    try {
        const response = await api.get('/geo/states');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Lists cities for a given state.
 * @param {string} stateId - The state ID.
 * @returns {Promise<object>} The list of cities.
 */
export const listCities = async (stateId) => {
    try {
        const response = await api.get('/geo/cities', { params: { stateId } });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// =================================
// Dashboard APIs
// =================================

/**
 * Fetches dashboard statistics.
 * @returns {Promise<object>} The dashboard statistics.
 */
export const getDashboardStats = async () => {
    try {
        const response = await api.get('/dashboard/stats');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getAuditLogs = async (params = {}) => {
    try {
        const response = await api.get('/audit-logs', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// =================================
// User Management & HRM APIs
// =================================

// Attendance
export const clockIn = async (data: any) => {
    try {
        const response = await api.post('/usermanagement/attendance/clock-in', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const clockOut = async (data: any) => {
    try {
        const response = await api.post('/usermanagement/attendance/clock-out', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getAttendanceHistory = async (params = {}) => {
    try {
        const response = await api.get('/usermanagement/attendance/history', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Leaves
export const applyLeave = async (data: any) => {
    try {
        const response = await api.post('/usermanagement/leave/apply', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getMyLeaves = async () => {
    try {
        const response = await api.get('/usermanagement/leave/my-leaves');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getLeaveRequests = async (params = {}) => {
    try {
        const response = await api.get('/usermanagement/leave/requests', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const processLeave = async (data: any) => {
    try {
        const response = await api.post('/usermanagement/leave/process', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Payroll
export const getMyPayrolls = async () => {
    try {
        const response = await api.get('/usermanagement/payroll/my-payrolls');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getPayrollHistory = async (params = {}) => {
    try {
        const response = await api.get('/usermanagement/payroll/history', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const generatePayroll = async (data: any) => {
    try {
        const response = await api.post('/usermanagement/payroll/generate', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Permissions
export const getPermissionGroups = async () => {
    try {
        const response = await api.get('/usermanagement/permission/groups');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createPermissionGroup = async (data: any) => {
    try {
        const response = await api.post('/usermanagement/permission/group', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Lists IPD admissions.
 * @returns {Promise<object>} The list of IPD admissions.
 */
export const getIPDAdmissions = async () => {
    try {
        const response = await api.get('/ipd/admissions');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Lists pharmacy dispenses.
 * @returns {Promise<object>} The list of pharmacy dispenses.
 */
export const getPharmacyDispenses = async (params = {}) => {
    try {
        const response = await api.get('/pharmacy/dispenses', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createPharmacyDispense = async (data: any) => {
    try {
        const response = await api.post('/pharmacy/dispenses', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listMedicines = async (params = {}) => {
    try {
        const response = await api.get('/pharmacy/medicines', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createMedicine = async (data: any) => {
    try {
        const response = await api.post('/pharmacy/medicines', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getPharmacyInvoices = async (params = {}) => {
    try {
        const response = await api.get('/pharmacy/invoices', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createPharmacyInvoice = async (data: any) => {
    try {
        const response = await api.post('/pharmacy/invoices', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getPharmacyStocks = async (params = {}) => {
    try {
        const response = await api.get('/pharmacy/stocks', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createPharmacyStock = async (data: any) => {
    try {
        const response = await api.post('/pharmacy/stocks', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getPharmacySuppliers = async (params = {}) => {
    try {
        const response = await api.get('/pharmacy/suppliers', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createPharmacySupplier = async (data: any) => {
    try {
        const response = await api.post('/pharmacy/suppliers', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getPurchaseOrders = async (params = {}) => {
    try {
        const response = await api.get('/pharmacy/purchase-orders', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getGRNs = async (params = {}) => {
    try {
        const response = await api.get('/pharmacy/grns', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getInsuranceClaims = async (params = {}) => {
    try {
        const response = await api.get('/pharmacy/insurance-claims', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getStockTransfers = async (params = {}) => {
    try {
        const response = await api.get('/pharmacy/stock-transfers', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getStockAdjustments = async (params = {}) => {
    try {
        const response = await api.get('/pharmacy/stock-adjustments', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getPharmacyPrescriptions = async (params = {}) => {
    try {
        const response = await api.get('/pharmacy/prescriptions', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// =================================
// Certificate Management APIs
// =================================

export const listCertificateTypes = async (params = {}) => {
    try {
        const response = await api.get('/certificates/types', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createCertificateType = async (data: any) => {
    try {
        const response = await api.post('/certificates/types', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listCertificateTemplates = async (params = {}) => {
    try {
        const response = await api.get('/certificates/templates', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createCertificateTemplate = async (data: any) => {
    try {
        const response = await api.post('/certificates/templates', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateCertificateTemplate = async (id: string, data: any) => {
    try {
        const response = await api.put(`/certificates/templates/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listGeneratedCertificates = async (params = {}) => {
    try {
        const response = await api.get('/certificates/generated', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createGeneratedCertificate = async (data: any) => {
    try {
        const response = await api.post('/certificates/generated', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listCertificateSignatures = async (params = {}) => {
    try {
        const response = await api.get('/certificates/signatures', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createCertificateSignature = async (data: any) => {
    try {
        const response = await api.post('/certificates/signatures', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateCertificateSignature = async (id: string, data: any) => {
    try {
        const response = await api.put(`/certificates/signatures/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteCertificateSignature = async (id: string) => {
    try {
        const response = await api.delete(`/certificates/signatures/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listCertificateVerifications = async (params = {}) => {
    try {
        const response = await api.get('/certificates/verifications', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const verifyCertificate = async (data: any) => {
    try {
        const response = await api.post('/certificates/verifications', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteCertificateTemplate = async (id: string) => {
    try {
        const response = await api.delete(`/certificates/templates/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listDoctors = async (params = {}) => {
    try {
        const response = await api.get('/users', { params: { ...params, role: 'Doctor' } });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listCertificateFields = async (params = {}) => {
    try {
        const response = await api.get('/certificates/fields', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// =================================
// Ambulance Management APIs
// =================================

export const listAmbulances = async (params = {}) => {
    try {
        const response = await api.get('/ambulance/masters', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createAmbulance = async (data: any) => {
    try {
        const response = await api.post('/ambulance/masters', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateAmbulance = async (id: string, data: any) => {
    try {
        const response = await api.put(`/ambulance/masters/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteAmbulance = async (id: string) => {
    try {
        const response = await api.delete(`/ambulance/masters/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listAmbulanceTrips = async (params = {}) => {
    try {
        const response = await api.get('/ambulance/trips', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createAmbulanceTrip = async (data: any) => {
    try {
        const response = await api.post('/ambulance/trips', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listAmbulanceMaintenances = async (params = {}) => {
    try {
        const response = await api.get('/ambulance/maintenances', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createAmbulanceMaintenance = async (data: any) => {
    try {
        const response = await api.post('/ambulance/maintenances', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// =================================
// Appointment Management APIs
// =================================

export const listAppointments = async (params = {}) => {
    try {
        const response = await api.get('/appointments/appointments', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createAppointment = async (data: any) => {
    try {
        const response = await api.post('/appointments/appointments', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateAppointment = async (id: string, data: any) => {
    try {
        const response = await api.put(`/appointments/appointments/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateAppointmentStatus = async (id: string, status: string) => {
    try {
        const response = await api.patch(`/appointments/appointments/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const cancelAppointment = async (id: string, cancellationReason: string) => {
    try {
        const response = await api.patch(`/appointments/appointments/${id}/cancel`, { cancellationReason });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteAppointment = async (id: string) => {
    try {
        const response = await api.delete(`/appointments/appointments/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listDoctorAvailability = async (params = {}) => {
    try {
        const response = await api.get('/appointments/doctor-availability', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
;

export const listAmbulanceAssignments = async (params = {}) => {
    try {
        const response = await api.get('/ambulance/assignments', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// =================================
// Blood Bank Management APIs
// =================================

export const listBloodInventory = async (params = {}) => {
    try {
        const response = await api.get('/blood-bank/inventory', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createBloodInventory = async (data: any) => {
    try {
        const response = await api.post('/blood-bank/inventory', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateBloodInventory = async (id: string, data: any) => {
    try {
        const response = await api.put(`/blood-bank/inventory/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateBloodInventoryStatus = async (id: string, status: string) => {
    try {
        const response = await api.patch(`/blood-bank/inventory/${id}/status`, { currentStatus: status });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteBloodInventory = async (id: string) => {
    try {
        const response = await api.delete(`/blood-bank/inventory/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listBloodRequests = async (params = {}) => {
    try {
        const response = await api.get('/blood-bank/requests', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createBloodRequest = async (data: any) => {
    try {
        const response = await api.post('/blood-bank/requests', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateBloodRequestStatus = async (id: string, status: string) => {
    try {
        const response = await api.patch(`/blood-bank/requests/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateBloodRequest = async (id: string, data: any) => {
    try {
        const response = await api.put(`/blood-bank/requests/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteBloodRequest = async (id: string) => {
    try {
        const response = await api.delete(`/blood-bank/requests/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listBloodDonors = async (params = {}) => {
    try {
        const response = await api.get('/blood-bank/donors', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createBloodDonor = async (data: any) => {
    try {
        const response = await api.post('/blood-bank/donors', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateBloodDonor = async (id: string, data: any) => {
    try {
        const response = await api.put(`/blood-bank/donors/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteBloodDonor = async (id: string) => {
    try {
        const response = await api.delete(`/blood-bank/donors/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listBloodDonations = async (params = {}) => {
    try {
        const response = await api.get('/blood-bank/donations', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createBloodDonation = async (data: any) => {
    try {
        const response = await api.post('/blood-bank/donations', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listBloodGroups = async (params = {}) => {
    try {
        const response = await api.get('/blood-bank/groups', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listBloodComponents = async (params = {}) => {
    try {
        const response = await api.get('/blood-bank/components', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createBloodComponent = async (data: any) => {
    try {
        const response = await api.post('/blood-bank/components', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateBloodComponent = async (id: string, data: any) => {
    try {
        const response = await api.put(`/blood-bank/components/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteBloodComponent = async (id: string) => {
    try {
        const response = await api.delete(`/blood-bank/components/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const issueBlood = async (data: any) => {
    try {
        const response = await api.post('/blood-bank/issues', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// =================================
// CSSD Management APIs
// =================================

export const getInstruments = async (params = {}) => {
    try {
        const response = await api.get('/cssd/instruments', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createInstrument = async (data: any) => {
    try {
        const response = await api.post('/cssd/instruments', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getInstrumentBatches = async (params = {}) => {
    try {
        const response = await api.get('/cssd/batches', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createInstrumentBatch = async (data: any) => {
    try {
        const response = await api.post('/cssd/batches', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getSterilizationCycles = async (params = {}) => {
    try {
        const response = await api.get('/cssd/cycles', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createSterilizationCycle = async (data: any) => {
    try {
        const response = await api.post('/cssd/cycles', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateSterilizationCycle = async (id: string, data: any) => {
    try {
        const response = await api.put(`/cssd/cycles/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getIssuedInstruments = async (params = {}) => {
    try {
        const response = await api.get('/cssd/issues', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const issueInstrument = async (data: any) => {
    try {
        const response = await api.post('/cssd/issues', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const returnInstrument = async (id: string) => {
    try {
        const response = await api.put(`/cssd/issues/${id}/return`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// =================================
// Radiology Management APIs
// =================================

export const getRadiologyStudies = async (params = {}) => {
    try {
        const response = await api.get('/radiology/studies', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createRadiologyStudy = async (data: any) => {
    try {
        const response = await api.post('/radiology/studies', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateRadiologyStudyStatus = async (id: string, status: string) => {
    try {
        const response = await api.patch(`/radiology/studies/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getRadiologyReports = async (params = {}) => {
    try {
        const response = await api.get('/radiology/reports', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createRadiologyReport = async (data: any) => {
    try {
        const response = await api.post('/radiology/reports', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getRadiologyImages = async (params = {}) => {
    try {
        const response = await api.get('/radiology/images', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// =================================
// Laboratory Management APIs
// =================================

export const getLabSamples = async (params = {}) => {
    try {
        const response = await api.get('/laboratory/samples', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createLabSample = async (data: any) => {
    try {
        const response = await api.post('/laboratory/samples', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateLabSampleStatus = async (id: string, status: string) => {
    try {
        const response = await api.patch(`/laboratory/samples/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getLabResults = async (params = {}) => {
    try {
        const response = await api.get('/laboratory/results', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createLabResult = async (data: any) => {
    try {
        const response = await api.post('/laboratory/results', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateLabResultStatus = async (id: string, status: string) => {
    try {
        const response = await api.patch(`/laboratory/results/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// =================================
// Vitals Management APIs
// =================================

export const getGlobalVitals = async (params = {}) => {
    try {
        const response = await api.get('/vitals/global', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getVisitVitals = async (params = {}) => {
    try {
        const response = await api.get('/vitals/visit', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createVisitVitals = async (data: any) => {
    try {
        const response = await api.post('/vitals/visit', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateVisitVitals = async (id: string, data: any) => {
    try {
        const response = await api.put(`/vitals/visit/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteVisitVitals = async (id: string) => {
    try {
        const response = await api.delete(`/vitals/visit/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// =================================
// Queue Management APIs
// =================================

export const getTokens = async (params = {}) => {
    try {
        const response = await api.get('/opd/tokens', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const callToken = async (id: string) => {
    try {
        const response = await api.put(`/opd/tokens/${id}/call`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const completeToken = async (id: string) => {
    try {
        const response = await api.put(`/opd/tokens/${id}/complete`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listInvestigationOrders = async (params = {}) => {
    try {
        const response = await api.get('/investigation-orders', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const listInvestigationMasters = async (params = {}) => {
    try {
        const response = await api.get('/investigations', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// =================================
// Bed Management APIs
// =================================

export const getWards = async (params = {}) => {
    try {
        const response = await api.get('/bedmanagement/wards', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createWard = async (data: any) => {
    try {
        const response = await api.post('/bedmanagement/wards', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getBeds = async (params = {}) => {
    try {
        const response = await api.get('/bedmanagement/beds', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createBed = async (data: any) => {
    try {
        const response = await api.post('/bedmanagement/beds', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateBedStatus = async (id: string, status: string) => {
    try {
        const response = await api.patch(`/bedmanagement/beds/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// =================================
// EHR APIs
// =================================

export const getPatientHistory = async (patientId: string) => {
    try {
        const response = await api.get(`/ehr/history/${patientId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createPatientHistory = async (data: any) => {
    try {
        const response = await api.post('/ehr/history', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getEHRPrescriptions = async (params = {}) => {
    try {
        const response = await api.get('/ehr/prescriptions', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createPrescription = async (data: any) => {
    try {
        const response = await api.post('/ehr/prescriptions', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// =================================
// Billing APIs
// =================================

export const getInvoices = async (params = {}) => {
    try {
        const response = await api.get('/billing/invoices', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createInvoice = async (data: any) => {
    try {
        const response = await api.post('/billing/invoices', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateInvoiceStatus = async (id: string, status: string) => {
    try {
        const response = await api.patch(`/billing/invoices/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// =================================
// Inventory APIs
// =================================

export const getInventoryItems = async (params = {}) => {
    try {
        const response = await api.get('/inventory/items', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createInventoryItem = async (data: any) => {
    try {
        const response = await api.post('/inventory/items', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const createStockTransaction = async (data: any) => {
    try {
        const response = await api.post('/inventory/transactions', data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getStockTransactions = async (itemId: string) => {
    try {
        const response = await api.get(`/inventory/transactions/${itemId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};





