const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/P cc/Desktop/devs/samrat';

const pageIntegrations = {
  'src/pages/Equipment.tsx': {
    imports: ['getEquipmentEquipments', 'getEquipmentCategories', 'getEquipmentVendors'],
    fetchLogic: `
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [e, c, v] = await Promise.all([getEquipmentEquipments(), getEquipmentCategories(), getEquipmentVendors()]);
      if (e.ok) setEquipments(e.data?.data || e.data || []);
      if (c.ok) setCategories(c.data?.data || c.data || []);
      if (v.ok) setVendors(v.data?.data || v.data || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);
`
  },
  'src/pages/BloodBank.tsx': {
    imports: ['getBloodInventory', 'getBloodRequests', 'getBloodDonors'],
    fetchLogic: `
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [i, r, d] = await Promise.all([getBloodInventory(), getBloodRequests(), getBloodDonors()]);
      if (i.ok) setInventory(i.data?.data || i.data || []);
      if (r.ok) setRequests(r.data?.data || r.data || []);
      if (d.ok) setDonors(d.data?.data || d.data || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);
`
  },
  'src/pages/Ambulance.tsx': {
    imports: ['getAmbulanceAmbulances', 'getAmbulanceTrips'],
    fetchLogic: `
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [a, t] = await Promise.all([getAmbulanceAmbulances(), getAmbulanceTrips()]);
      if (a.ok) setAmbulances(a.data?.data || a.data || []);
      if (t.ok) setTrips(t.data?.data || t.data || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);
`
  },
  'src/pages/Laboratory.tsx': {
    imports: ['getLabSamples', 'getLabResults'],
    fetchLogic: `
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [s, r] = await Promise.all([getLabSamples(), getLabResults()]);
      if (s.ok) setSamples(s.data?.data || s.data || []);
      if (r.ok) setResults(r.data?.data || r.data || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);
`
  },
  'src/pages/Radiology.tsx': {
    imports: ['getRadiologyStudies', 'getRadiologyReports'],
    fetchLogic: `
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [s, r] = await Promise.all([getRadiologyStudies(), getRadiologyReports()]);
      if (s.ok) setStudies(s.data?.data || s.data || []);
      if (r.ok) setReports(r.data?.data || r.data || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);
`
  },
  'src/pages/Certificates.tsx': {
    imports: ['getCertificatesGenerated', 'getCertificatesTemplates'],
    fetchLogic: `
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [g, t] = await Promise.all([getCertificatesGenerated(), getCertificatesTemplates()]);
      if (g.ok) setCertificates(g.data?.data || g.data || []);
      if (t.ok) setTemplates(t.data?.data || t.data || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);
`
  },
  'src/pages/Billing.tsx': {
    imports: ['getCoreReceipts'],
    fetchLogic: `
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getCoreReceipts();
      if (res.ok) setBills(res.data?.data || res.data || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);
`
  },
  'src/pages/Vitals.tsx': {
    imports: ['getVitalsGlobal', 'getVitalsVisit'],
    fetchLogic: `
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [g, v] = await Promise.all([getVitalsGlobal(), getVitalsVisit()]);
      if (g.ok) setGlobalVitals(g.data?.data || g.data || []);
      if (v.ok) setVisitVitals(v.data?.data || v.data || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);
`
  },
  'src/pages/Departments.tsx': {
    imports: ['getCoreDepartments'],
    fetchLogic: `
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getCoreDepartments();
      if (res.ok) setDepartments(res.data?.data || res.data || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);
`
  }
};

function integrate() {
  for (const [file, config] of Object.entries(pageIntegrations)) {
    const filePath = path.join(projectRoot, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Add Imports
    const importMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*['"]@\/api\/apiService['"]/);
    if (importMatch) {
      const existing = importMatch[1].split(',').map(s => s.trim());
      const all = Array.from(new Set([...existing, ...config.imports])).filter(Boolean);
      content = content.replace(importMatch[0], `import { ${all.sort().join(', ')} } from "@/api/apiService"`);
    } else {
      const lines = content.split('\n');
      let lastImport = 0;
      lines.forEach((l, i) => { if (l.startsWith('import ')) lastImport = i; });
      lines.splice(lastImport + 1, 0, `import { ${config.imports.sort().join(', ')} } from "@/api/apiService";`);
      content = lines.join('\n');
    }

    // 2. Replace useEffect with real fetch
    const useEffectRegex = /useEffect\s*\(\s*\(\)\s*=>\s*\{[^}]*mock[^}]*\}\s*,\s*\[[^\]]*\]\s*\)/s;
    if (useEffectRegex.test(content)) {
      content = content.replace(useEffectRegex, `/* API INTEGRATED */\n  ${config.fetchLogic}`);
    } else {
        const stateEndIndex = content.lastIndexOf('useState');
        if (stateEndIndex !== -1) {
            const nextNewLine = content.indexOf('\n', stateEndIndex);
            content = content.slice(0, nextNewLine) + config.fetchLogic + content.slice(nextNewLine);
        }
    }

    fs.writeFileSync(filePath, content);
    console.log(`Integrated ${file}`);
  }
}

integrate();
