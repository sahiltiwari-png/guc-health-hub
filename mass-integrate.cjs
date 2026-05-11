const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/P cc/Desktop/devs/samrat';

const pageIntegrations = {
  'src/pages/Dashboard.tsx': {
    imports: ['getUsers', 'getclinicalDetails', 'getAssetsMasters'],
    fetchLogic: `
  const [stats, setStats] = useState({ users: 0, patients: 0, assets: 0 });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [u, p, a] = await Promise.all([getUsers(), getclinicalDetails(), getAssetsMasters()]);
      setStats({
        users: u.ok ? (u.data?.total || u.data?.length || 0) : 0,
        patients: p.ok ? (p.data?.total || p.data?.length || 0) : 0,
        assets: a.ok ? (a.data?.total || a.data?.length || 0) : 0
      });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDashboardData(); }, []);
`
  },
  'src/pages/OPD.tsx': {
    imports: ['getclinicalDetails', 'getUsers', 'createPatientRegister', 'createclinicalDetails', 'getGeoCountries', 'getGeoStates', 'getGeoCities'],
    fetchLogic: `
  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [vRes, dRes, cRes] = await Promise.all([
        getclinicalDetails({ visitType: 'OPD' }),
        getUsers(), // Filter for doctors if needed
        getGeoCountries()
      ]);
      if (vRes.ok) setVisits(vRes.data?.data || vRes.data || []);
      if (dRes.ok) setDoctors(dRes.data?.data || dRes.data || []);
      if (cRes.ok) setCountries(cRes.data?.data || cRes.data || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); setDataLoaded(true); }
  };
  useEffect(() => { fetchInitialData(); }, []);
`
  },
  'src/pages/Staff.tsx': {
    imports: ['getUsers', 'deleteUsersById'],
    fetchLogic: `
  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const res = await getUsers({ role: tab !== 'all' ? tab : undefined, search: searchQuery });
      if (res.ok) {
        setStaff(res.data?.data || res.data || []);
        setTotalPages(res.data?.totalPages || 1);
      }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };
  useEffect(() => { fetchStaff(); }, [tab, searchQuery, currentPage]);
`
  },
  'src/pages/Pharmacy.tsx': {
    imports: ['getPharmacyStocks', 'getPharmacyDispenses', 'getPharmacyInvoices', 'createPharmacyDispense'],
    fetchLogic: `
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [s, d, i] = await Promise.all([getPharmacyStocks(), getPharmacyDispenses(), getPharmacyInvoices()]);
      if (s.ok) setInventory(s.data?.data || s.data || []);
      if (d.ok) setDispenses(d.data?.data || d.data || []);
      if (i.ok) setInvoices(i.data?.data || i.data || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);
`
  },
  'src/pages/Assets.tsx': {
    imports: ['getAssetsMasters', 'getAssetsCategories', 'getAssetsVendors', 'getAssetsLocations', 'createAssetsMasters'],
    fetchLogic: `
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [m, c, v, l] = await Promise.all([getAssetsMasters(), getAssetsCategories(), getAssetsVendors(), getAssetsLocations()]);
      if (m.ok) setAssets(m.data?.data || m.data || []);
      if (c.ok) setCategories(c.data?.data || c.data || []);
      if (v.ok) setVendors(v.data?.data || v.data || []);
      if (l.ok) setLocations(l.data?.data || l.data || []);
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
    // This is tricky, we'll try to find the first useEffect that sets mock data
    const useEffectRegex = /useEffect\s*\(\s*\(\)\s*=>\s*\{[^}]*mock[^}]*\}\s*,\s*\[[^\]]*\]\s*\)/s;
    if (useEffectRegex.test(content)) {
      content = content.replace(useEffectRegex, `/* API INTEGRATED */\n  ${config.fetchLogic}`);
    } else {
        // If no mock useEffect found, just append the fetch logic after the state declarations
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
