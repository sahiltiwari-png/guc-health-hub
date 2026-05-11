const fs = require('fs');
const path = require('path');

const swagger = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8'));

// Helper to convert Swagger types to TypeScript types
function toTsType(schema) {
  if (!schema) return 'any';
  
  if (schema.$ref) {
    return schema.$ref.split('/').pop();
  }
  
  if (schema.allOf) {
    const mergedProps = {};
    schema.allOf.forEach(subSchema => {
      if (subSchema.$ref) {
      } else if (subSchema.properties) {
        Object.assign(mergedProps, subSchema.properties);
      }
    });
    
    if (Object.keys(mergedProps).length > 0) {
      const props = Object.entries(mergedProps)
        .map(([key, value]) => `  ${key}?: ${toTsType(value)};`)
        .join('\n');
      return `{\n${props}\n}`;
    }
    
    const refs = schema.allOf.filter(s => s.$ref).map(s => s.$ref.split('/').pop());
    if (refs.includes('BaseResponse')) {
        const otherRef = refs.find(r => r !== 'BaseResponse');
        return otherRef ? `BaseResponse & ${otherRef}` : 'BaseResponse';
    }
    return refs.join(' & ') || 'any';
  }

  switch (schema.type) {
    case 'string': return 'string';
    case 'number':
    case 'integer': return 'number';
    case 'boolean': return 'boolean';
    case 'array': return `${toTsType(schema.items)}[]`;
    case 'object':
      if (schema.properties) {
        const props = Object.entries(schema.properties)
          .map(([key, value]) => `  ${key}?: ${toTsType(value)};`)
          .join('\n');
        return `{\n${props}\n}`;
      }
      return 'Record<string, any>';
    default: return 'any';
  }
}

let apiCode = `/**
 * AUTO-GENERATED API SERVICE
 * Generated on: ${new Date().toISOString()}
 * 
 * This file contains all API endpoints defined in swagger.json.
 * Organized by modules/tags.
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
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = \`Bearer \${token}\`;
  }
  
  if (hospitalId) {
    headers['X-Hospital-Id'] = hospitalId;
  }
  
  if (branchId) {
    headers['X-Branch-Id'] = branchId;
  }

  try {
    const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`, {
      ...options,
      headers,
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }
    
    if (!response.ok) {
      console.error(\`[API Error] \${response.status} \${endpoint}\`, data);
    }
    
    return { 
      data: data?.data || data, 
      success: data?.success || response.ok,
      message: data?.message,
      status: response.status, 
      ok: response.ok 
    };
  } catch (error) {
    console.error(\`[API Network Error] \${endpoint}\`, error);
    return { data: null as any, success: false, status: 0, ok: false, error };
  }
};

/* --- TYPES & INTERFACES --- */

`;

if (swagger.components && swagger.components.schemas) {
  for (const [name, schema] of Object.entries(swagger.components.schemas)) {
    if (name === 'BaseResponse') {
        apiCode += `export interface BaseResponse {
  success?: boolean;
  message?: string;
  error?: string;
  data?: any;
}\n\n`;
    } else {
        apiCode += `export interface ${name} ${toTsType(schema)}\n\n`;
    }
  }
}

const functionNames = new Set();
const methodNames = { get: 'get', post: 'create', put: 'update', delete: 'delete', patch: 'patch' };

const modules = {};
for (const [path, methods] of Object.entries(swagger.paths)) {
  for (const [method, operation] of Object.entries(methods)) {
    const tag = (operation.tags && operation.tags[0]) || 'General';
    if (!modules[tag]) modules[tag] = [];
    modules[tag].push({ path, method, operation });
  }
}

for (const [moduleName, operations] of Object.entries(modules)) {
  apiCode += `\n/* --- MODULE: ${moduleName} --- */\n`;
  
  for (const { path, method, operation } of operations) {
    let functionName = '';
    
    if (operation.operationId) {
      functionName = operation.operationId;
    } else {
      let pathName = path.replace(/^\/api\/v1\//, '').replace(/^\/api\/v1$/, '');
      if (pathName === '') {
        const cleanTag = moduleName.replace(/V1 - /, '').replace(/Route$/, '').replace(/\s+/g, '');
        functionName = methodNames[method.toLowerCase()] + cleanTag;
      } else {
        pathName = pathName.replace(/\{([^}]+)\}/g, '');
        const parts = pathName.split('/').filter(Boolean);
        functionName = methodNames[method.toLowerCase()] || method.toLowerCase();
        if (parts.length > 0) {
          functionName += parts.map(part => {
            return part.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
          }).join('');
        }
        if (path.includes('{')) {
          const params = path.match(/\{([^}]+)\}/g);
          if (params && params.length === 1) {
            const paramName = params[0].slice(1, -1);
            functionName += 'By' + paramName.charAt(0).toUpperCase() + paramName.slice(1);
          }
        }
      }
    }
    
    let cleanName = functionName.replace(/[^a-zA-Z0-9]/g, '');
    if (!/^[a-zA-Z]/.test(cleanName)) cleanName = 'api' + cleanName;
    let count = 1;
    let finalName = cleanName;
    while (functionNames.has(finalName)) {
      finalName = cleanName + count++;
    }
    functionNames.add(finalName);
    
    const pathParams = (operation.parameters || []).filter(p => p.in === 'path');
    const queryParams = (operation.parameters || []).filter(p => p.in === 'query');
    
    const paramList = [];
    pathParams.forEach(p => paramList.push(`${p.name}: string`));
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) paramList.push('data?: any');
    if (queryParams.length > 0 || method.toUpperCase() === 'GET') paramList.push('queryParams?: Record<string, any>');
    
    let endpointVar = path.replace(/^\/api\/v1/, '');
    if (endpointVar === '') endpointVar = '/';
    pathParams.forEach(p => {
      endpointVar = endpointVar.replace(`{${p.name}}`, `\${${p.name}}`);
    });
    
    let fetchOptions = `method: '${method.toUpperCase()}'`;
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      fetchOptions += `,
    body: JSON.stringify(data || {})`;
    }
    
    let queryPart = '';
    if (queryParams.length > 0 || method.toUpperCase() === 'GET') {
      queryPart = `
  if (queryParams) {
    const searchParams = new URLSearchParams(queryParams);
    if (searchParams.toString()) {
      endpoint += (endpoint.includes('?') ? '&' : '?') + searchParams.toString();
    }
  }`;
    }
    
    apiCode += `
/**
 * ${operation.summary || method.toUpperCase() + ' ' + path}
 */
export const ${finalName} = async (${paramList.join(', ')}) => {
  let endpoint = \`${endpointVar}\`;
  ${queryPart}
  return apiRequest(endpoint, {
    ${fetchOptions}
  });
};
`;
  }
}

apiCode += '\n';
fs.writeFileSync(path.join(__dirname, 'src', 'api', 'apiService.ts'), apiCode);
console.log("API service generated successfully!");
fs.writeFileSync(path.join(__dirname, 'generated-functions.json'), JSON.stringify(Array.from(functionNames)));
