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
export const getPharmacyDispenses = async () => {
    try {
        const response = await api.get('/pharmacy/dispenses');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Lists patient receipts.
 * @returns {Promise<object>} The list of receipts.
 */
export const getReceipts = async () => {
    try {
        const response = await api.get('/core/receipts');
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

