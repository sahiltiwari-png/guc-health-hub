const fs = require('fs');
const path = require('path');

const swagger = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8'));

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
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = "Bearer " + token;
  if (hospitalId) headers['X-Hospital-Id'] = hospitalId;
  if (branchId) headers['X-Branch-Id'] = branchId;

  try {
    const response = await fetch(API_BASE_URL + endpoint, { ...options, headers });
    let data;
    try { data = await response.json(); } catch (e) { data = null; }
    return { 
      data: data?.data || data, 
      success: data?.success || response.ok,
      message: data?.message,
      status: response.status, 
      ok: response.ok 
    };
  } catch (error) {
    return { data: null as any, success: false, status: 0, ok: false, error };
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
    const tag = (operation.tags && operation.tags[0]) || 'General';
    
    let nameBase = pathStr.replace(/^\/api\/v1\//, '').replace(/^\/api\//, '').replace(/\{([^}]+)\}/g, '').split(/[\/-]/).filter(Boolean).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
    if (!nameBase) nameBase = tag.replace(/[^a-zA-Z0-9]/g, '');
    
    let fName = (methodNames[method] || method) + "Auto" + nameBase;
    
    // Sanitize fName - remove any non-alphanumeric characters
    fName = fName.replace(/[^a-zA-Z0-9]/g, '');
    
    if (pathStr === '/api/v1/auth/users') fName = 'getAutoUsers';
    if (pathStr === '/api/v1/clinical') fName = 'getAutoClinicals';

    let count = 1;
    let finalName = fName;
    while (functionNames.has(finalName)) { finalName = fName + count++; }
    functionNames.add(finalName);

    const pathParams = (operation.parameters || []).filter(p => p.in === 'path');
    const paramList = pathParams.map(p => p.name + ": string");
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) paramList.push('data?: any');
    paramList.push('queryParams?: Record<string, any>');

    let endpointVar = pathStr.replace(/^\/api\/v1/, '');
    pathParams.forEach(p => { endpointVar = endpointVar.replace("{" + p.name + "}", "${" + p.name + "}"); });

    apiCode += "\nexport const " + finalName + " = async (" + paramList.join(', ') + ") => {\n";
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
    apiCode += "  });\n";
    apiCode += "};\n";
  }
}

fs.writeFileSync(path.join(__dirname, 'src', 'api', 'apiService.ts'), apiCode);
console.log("Re-generated apiService.ts");
