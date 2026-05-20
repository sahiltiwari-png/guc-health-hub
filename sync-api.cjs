const fs = require('fs');
const path = require('path');

const swagger = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8'));

// Helper to convert Swagger types to TypeScript types
function toTsType(schema) {
  if (!schema) return 'any';
  if (schema.$ref) return schema.$ref.split('/').pop();
  if (schema.allOf) {
    const mergedProps = {};
    schema.allOf.forEach(subSchema => {
      if (subSchema.properties) Object.assign(mergedProps, subSchema.properties);
    });
    if (Object.keys(mergedProps).length > 0) {
      return "{\n" + Object.entries(mergedProps).map(([k, v]) => "  " + k + "?: " + toTsType(v) + ";").join('\n') + "\n}";
    }
    const refs = schema.allOf.filter(s => s.$ref).map(s => s.$ref.split('/').pop());
    return refs.join(' & ') || 'any';
  }
  switch (schema.type) {
    case 'string': return 'string';
    case 'number':
    case 'integer': return 'number';
    case 'boolean': return 'boolean';
    case 'array': return toTsType(schema.items) + "[]";
    case 'object':
      if (schema.properties) {
        return "{\n" + Object.entries(schema.properties).map(([k, v]) => "  " + k + "?: " + toTsType(v) + ";").join('\n') + "\n}";
      }
      return 'Record<string, any>';
    default: return 'any';
  }
}

let apiCode = `/**
 * AUTO-GENERATED API SERVICE
 * Generated on: ${new Date().toISOString()}
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

const apiRequest = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
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
    const noV1Prefixes = ['/departments', '/doctors', '/inventory', '/geo', '/finance', '/dashboard'];
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

/* --- TYPES --- */
`;

if (swagger.components && swagger.components.schemas) {
  for (const [name, schema] of Object.entries(swagger.components.schemas)) {
    if (name === 'BaseResponse') {
      apiCode += `export interface BaseResponse { success?: boolean; message?: string; error?: string; data?: any; }\n\n`;
    } else {
      apiCode += "export interface " + name + " " + toTsType(schema) + "\n\n";
    }
  }
}

const methodNames = { get: 'get', post: 'create', put: 'update', delete: 'delete', patch: 'patch' };
const functionNames = new Set();

for (const [pathStr, methods] of Object.entries(swagger.paths)) {
  const ops = Object.keys(methods).length > 0 ? methods : { get: { tags: ['Auto'], summary: 'Auto-generated' } };
  
  for (const [method, operation] of Object.entries(ops)) {
    let fName = '';
    if (operation.operationId) {
      fName = operation.operationId;
    } else {
      let pathName = pathStr.replace(/^\/api\/v1\//, '').replace(/^\/api\//, '');
      const parts = pathName.split('/').filter(Boolean).map(p => p.replace(/\{([^}]+)\}/g, 'By$1'));
      fName = (methodNames[method] || method) + parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
    }
    
    fName = fName.replace(/[^a-zA-Z0-9]/g, '');
    if (!fName.startsWith('get') && !fName.startsWith('create') && !fName.startsWith('update') && !fName.startsWith('delete')) {
      fName = (methodNames[method] || method) + fName.charAt(0).toUpperCase() + fName.slice(1);
    }

    if (!fName.includes('Auto')) {
        fName = fName.replace(/^(get|create|update|delete|patch)/, '$1Auto');
    }

    // Manual overrides for compatibility
    if (pathStr === '/api/admin/users') fName = 'getAutoAdminUsers';
    if (pathStr === '/api/admin/branches') fName = 'getAutoAdminBranches';
    if (pathStr === '/api/v1/clinical') fName = 'getAutoClinical';
    if (pathStr === '/api/dashboard/doctor/{doctorId}') fName = 'getAutoDashboardDoctor';
    if (pathStr === '/api/dashboard/patient/{uhid}') fName = 'getAutoDashboardPatient';

    let count = 1;
    let finalName = fName;
    while (functionNames.has(finalName)) { finalName = fName + count++; }
    functionNames.add(finalName);

    const pathParams = (operation.parameters || []).filter(p => p.in === 'path');
    const paramList = pathParams.map(p => p.name + ": string");
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) paramList.push('data?: any');
    paramList.push('queryParams?: Record<string, any>');

    let endpointVar = pathStr.replace(/^\/api\/v1/, '').replace(/^\/api/, '');
    pathParams.forEach(p => { endpointVar = endpointVar.replace("{" + p.name + "}", "${" + p.name + "}"); });

    apiCode += `\n/** ${operation.summary || finalName} */\n`;
    apiCode += "export const " + finalName + " = async (" + paramList.join(', ') + ") => {\n";
    apiCode += "  let endpoint = `" + endpointVar + "`;\n";
    apiCode += "  if (queryParams) {\n";
    apiCode += "    const sp = new URLSearchParams(queryParams);\n";
    apiCode += "    if (sp.toString()) endpoint += (endpoint.includes('?') ? '&' : '?') + sp.toString();\n";
    apiCode += "  }\n";
    apiCode += "  return apiRequest(endpoint, { \n";
    apiCode += "    method: '" + method.toUpperCase() + "', \n";
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      apiCode += "    body: JSON.stringify(data || {}) \n";
    }
    apiCode += "  });\n};\n";
  }
}

// Add legacy aliases
apiCode += `
/* --- LEGACY ALIASES --- */
export const getAutoUsers = getAutoAdminUsers;
export const getAutoClinicals = getAutoClinical;
`;

fs.writeFileSync(path.join(__dirname, 'src', 'api', 'apiService.ts'), apiCode);
console.log("Synchronized apiService.ts with swagger.json");
