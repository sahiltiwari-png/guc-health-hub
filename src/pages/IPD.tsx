
import React, { useEffect, useState } from 'react';
import { Search, Edit, Eye, Printer, Plus, UserSearch, Bed, ClipboardList, LogOut } from 'lucide-react';
import { 
  getIPDAdmissions, admitPatient, dischargePatient, 
  getAutoGeoCountries, getAutoGeoStates, getAutoGeoCities, 
  getAutoDepartments, getAutoUsers, extractArray, searchPatients,
  getApiV1Ipd, getApiV1IpdByid, putApiV1IpdByid, postApiV1IpdAdmit, getApiV1IpdAdmissionsSearch
} from "@/api/apiService";

const IPD = () => {
  const [ipdList, setIpdList] = useState([]);
  const [activeTab, setActiveTab] = useState<'list' | 'admit' | 'discharge'>('list');
  const [searchUhid, setSearchUhid] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [pagination, setPagination] = useState({ page: 0, size: 10, total: 0 });
  const [tableSearch, setTableSearch] = useState('');

  // Dynamic Lists
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, docRes, countryRes] = await Promise.all([
          getAutoDepartments(),
          getAutoUsers({ role: 'DOCTOR' }),
          getAutoGeoCountries()
        ]);
        
        if (deptRes.ok) setDepartments(extractArray(deptRes));
        if (docRes.ok) setDoctors(extractArray(docRes));
        if (countryRes.ok) {
          const countriesData = extractArray(countryRes);
          setCountries(countriesData);
          const india = countriesData.find((c: any) => c.name === 'India');
          if (india) {
            setFormData(prev => ({ ...prev, country: india.id }));
          }
        }
      } catch (error) {
        console.error("Error fetching dynamic data:", error);
      }
    };
    fetchData();
  }, []);

  const fetchIPDList = async (page = 0) => {
    setLoading(true);
    try {
      const res = await getApiV1Ipd({ page, size: pagination.size });
      if (res.ok) {
        // Handle nested data.data.content for paginated response
        const content = res.data?.data?.content || res.data?.content || extractArray(res);
        setIpdList(content);
        
        const total = res.data?.data?.totalElements ?? res.data?.totalElements ?? 0;
        setPagination(prev => ({ ...prev, page, total }));
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch IPD list.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error loading IPD list.' });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'list') {
      fetchIPDList(pagination.page);
    }
  }, [activeTab]);

  const handleTableFilter = async () => {
    setLoading(true);
    try {
      const res = await getApiV1IpdAdmissionsSearch({ 
        filter: tableSearch, 
        page: 0, 
        size: pagination.size 
      });
      if (res.ok) {
        const content = res.data?.data?.content || res.data?.content || extractArray(res);
        setIpdList(content);
        const total = res.data?.data?.totalElements ?? res.data?.totalElements ?? 0;
        setPagination(prev => ({ ...prev, page: 0, total }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    uhid: '',
    mobile: '',
    idType: 'NA',
    idNumber: '',
    departmentId: '',
    departmentName: '',
    doctorId: '',
    referredBy: 'SELF',
    refMobile: '',
    patientPrefix: 'Mr.',
    patientName: '',
    relativePrefix: 'Mr.',
    relativeName: '',
    relativeRelation: 'S/o',
    dob: '',
    gender: 'Male',
    maritalStatus: 'Single',
    ageY: '',
    ageM: '',
    ageD: '',
    occupation: '',
    religion: '',
    address: '',
    country: '',
    stateId: '',
    cityId: '',
    pinCode: '',
    bloodGroup: 'NA',
    guardianPrefix: 'Mr.',
    guardianName: '',
    guardianRelation: '',
    guardianMobile: '',
    insuranceCo: '',
    payerName: '--NA--',
    cardNo: '',
    policyNo: '',
    rank: '',
    rateList: 'COMMON',
    billingType: 'Cash',
    paymentMode: 'Cash',
    provisionalDiagnosis: '',
    procedureTreatment: '',
    commentRemark: '',
    arrivalDate: new Date().toISOString().split('T')[0],
    arrivalTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    allocationCategory: '',
    unitNo: '',
    fileCharge: '0',
    isAdmission: true,
    isDaycare: false,
    source: 'ADV HOARDINGS',
    photo: null as File | null,
    isMlc: false,
    isRegisteredByUhid: false
  });

  // Fetch cities when state changes
  useEffect(() => {
    if (formData.stateId) {
      getAutoGeoCities({ stateId: formData.stateId }).then(res => setCities(res.data || []));
    } else {
      setCities([]);
    }
  }, [formData.stateId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === 'departmentId') {
      const dept = departments.find((d: any) => d.id === value);
      setFormData(prev => ({ ...prev, departmentId: value, departmentName: dept?.name || '' }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const handleSearch = async () => {
    if (!searchUhid) return;
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await searchPatients({ uhid: searchUhid });
      const patient = res.data?.find((p: any) => p.uhid === searchUhid) || res.data?.[0];
      if (patient) {
        setFormData(prev => ({
          ...prev,
          uhid: patient.uhid || '',
          patientName: patient.patientName || '',
          mobile: patient.mobile || '',
          ageY: patient.age?.toString() || '',
          gender: patient.gender || 'Male',
          address: patient.address || '',
          stateId: patient.stateId || '',
          cityId: patient.cityId || '',
        }));
        setMessage({ type: 'success', text: 'Patient found!' });
      } else {
        setMessage({ type: 'error', text: 'Patient not found. Please register first.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error searching patient.' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewIPD = async (id: string | number) => {
    setLoading(true);
    try {
      const res = await getApiV1IpdByid(id);
      if (res.ok && res.data) {
        const p = res.data;
        setFormData(prev => ({
          ...prev,
          uhid: p.patient?.uhid || '',
          patientName: p.patient?.fullName || '',
          mobile: p.patient?.phoneNumber || '',
          ageY: p.patient?.dateOfBirth ? (new Date().getFullYear() - new Date(p.patient.dateOfBirth).getFullYear()).toString() : '',
          gender: p.patient?.gender || 'Male',
          address: p.patient?.address || '',
          doctorId: p.admittingDoctor?.id || '',
          departmentId: p.department?.id || '',
          provisionalDiagnosis: p.diagnosis || '',
          admissionNumber: p.ipdNumber || '',
        }));
        setActiveTab('admit');
        setMessage({ type: 'success', text: 'Details loaded!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error fetching details.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdmit = async () => {
    if (!formData.patientName) {
      setMessage({ type: 'error', text: 'Patient Name is required.' });
      return;
    }
    setLoading(true);
    try {
      // Map form data to API format
      const admitData = {
        patientId: patient?.id, // assuming patient state is set from search
        doctorId: formData.doctorId,
        bedId: 1, // Example bedId
        departmentId: formData.departmentId,
        caseType: 'NORMAL',
        triage: 'GREEN',
        guardianName: formData.guardianName,
        guardianPhone: formData.guardianMobile,
        guardianRelation: formData.guardianRelation,
        diagnosis: formData.provisionalDiagnosis,
        admissionReason: formData.procedureTreatment,
        advanceAmount: parseFloat(formData.fileCharge) || 0
      };
      
      const res = await postApiV1IpdAdmit(admitData);
      if (res.ok) {
        setMessage({ type: 'success', text: 'IPD Admission successful!' });
        setActiveTab('list');
      } else {
        setMessage({ type: 'error', text: res.data?.message || 'Failed to create IPD admission.' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to create IPD admission.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Top Navigation Bar - SoftCure Style */}
      <div className="flex items-center justify-between bg-card border-b border-border px-4 py-2 shadow-sm">
        <div className="flex items-center gap-6">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <Bed size={20} /> IPD Management
          </h2>
          <div className="flex gap-1">
            {[
              { id: 'list', label: 'IPD List', icon: <ClipboardList size={14} /> },
              { id: 'admit', label: 'New Admission', icon: <Plus size={14} /> },
              { id: 'discharge', label: 'Discharge', icon: <LogOut size={14} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-t-md transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-primary text-primary-foreground border-b-2 border-primary' 
                    : 'bg-transparent text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {message.text && (
          <div className={`px-4 py-1 text-xs font-medium rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
      </div>

      <div className="p-4 overflow-auto flex-1">
        {activeTab === 'list' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 bg-card p-3 border border-border rounded-md shadow-sm">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input className="hms-input pl-9 w-64" placeholder="Search by Name / UHID / IPD ID..." value={tableSearch} onChange={e => setTableSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleTableFilter()} />
              </div>
              <select className="hms-select w-40"><option>All Wards</option><option>Ward-A</option><option>Ward-B</option><option>Ward-C</option><option>ICU</option><option>NICU</option></select>
              <select className="hms-select w-40"><option>All Status</option><option>Admitted</option><option>Critical</option><option>Stable</option><option>Discharged</option></select>
              <button className="hms-btn-primary flex items-center gap-2" onClick={handleTableFilter}>
                <Search size={14} /> Filter
              </button>
            </div>

            <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
              <table className="hms-table">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>IPD ID</th>
                    <th>Patient Name</th>
                    <th>Ward/Bed</th>
                    <th>Admission Date</th>
                    <th>Triage</th>
                    <th>Case Type</th>
                    <th>Diagnosis</th>
                    <th>Advance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(ipdList) && ipdList.length > 0 ? (
                    ipdList.map((p: any, index) => (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        <td>{pagination.page * pagination.size + index + 1}</td>
                        <td className="font-bold text-primary">{p.ipdNumber}</td>
                        <td className="font-semibold uppercase">
                          <div className="flex flex-col">
                            <span>{p.patient?.fullName || 'Walk-in / N/A'}</span>
                            {p.guardianName && <span className="text-[9px] text-muted-foreground normal-case">G: {p.guardianName} ({p.guardianRelation})</span>}
                          </div>
                        </td>
                        <td>
                          {p.bed ? (
                            <div className="flex flex-col">
                              <span className="font-medium">{p.bed.bedNumber}</span>
                              <span className="text-[9px] text-muted-foreground">{p.bed.ward?.name || 'General'}</span>
                            </div>
                          ) : <span className="text-muted-foreground italic text-[10px]">Unassigned</span>}
                        </td>
                        <td>
                          <div className="flex flex-col">
                            <span>{p.admissionDate ? new Date(p.admissionDate).toLocaleDateString('en-IN') : 'N/A'}</span>
                            <span className="text-[9px] text-muted-foreground">{p.admissionDate ? new Date(p.admissionDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase shadow-sm border ${
                            p.triage === 'RED' ? 'bg-red-50 border-red-200 text-red-700' : 
                            p.triage === 'YELLOW' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 
                            'bg-green-50 border-green-200 text-green-700'
                          }`}>
                            {p.triage || 'GREEN'}
                          </span>
                        </td>
                        <td className="text-xs font-medium">{p.caseType || 'NORMAL'}</td>
                        <td className="max-w-[150px] truncate text-[10px]" title={p.diagnosis}>{p.diagnosis || '-'}</td>
                        <td>
                          <div className="flex flex-col">
                            <span className="font-bold text-green-700">₹{p.advanceAmount?.toLocaleString('en-IN') || 0}</span>
                            {p.insuranceProvider && <span className="text-[8px] text-blue-600 font-medium">INS: {p.insuranceProvider}</span>}
                          </div>
                        </td>
                        <td>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            p.status === 'DISCHARGED' ? 'bg-gray-100 text-gray-600' : 'bg-blue-600 text-white shadow-sm'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="flex gap-1.5 py-1">
                          <button onClick={() => handleViewIPD(p.id)} title="View Profile" className="w-6 h-6 flex items-center justify-center bg-primary/10 text-primary rounded hover:bg-primary hover:text-white transition-colors"><Eye size={12} /></button>
                          <button onClick={() => handleViewIPD(p.id)} title="Edit Details" className="w-6 h-6 flex items-center justify-center bg-green-50 text-green-600 rounded hover:bg-green-600 hover:text-white transition-colors"><Edit size={12} /></button>
                          <button title="Print Form" className="w-6 h-6 flex items-center justify-center bg-blue-50 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors"><Printer size={12} /></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="text-center py-8 text-muted-foreground">
                        {loading ? 'Loading...' : 'No IPD admissions found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="bg-muted/30 p-2 flex items-center justify-between border-t border-border text-[10px]">
                <div>Total Records: {pagination.total}</div>
                <div className="flex gap-2">
                  <button 
                    disabled={pagination.page === 0} 
                    onClick={() => fetchIPDList(pagination.page - 1)}
                    className="px-2 py-1 bg-card border border-border disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="flex items-center px-2">Page {pagination.page + 1}</span>
                  <button 
                    disabled={(pagination.page + 1) * pagination.size >= pagination.total} 
                    onClick={() => fetchIPDList(pagination.page + 1)}
                    className="px-2 py-1 bg-card border border-border disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admit' && (
          <div className="max-w-[1400px] mx-auto bg-gray-100 p-2 rounded shadow-sm text-[11px]">
            {/* Header section with MLC and UHID Checkbox */}
            <div className="flex items-center justify-between bg-white p-1 mb-2 border border-gray-300">
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-700">Patient Registration in IPD</span>
                <div className="flex items-center gap-1 cursor-pointer">
                  <input type="checkbox" name="isMlc" id="isMlc" checked={formData.isMlc} onChange={handleInputChange} className="w-3 h-3" />
                  <label htmlFor="isMlc" className="font-bold flex items-center gap-1 text-gray-700">
                    <img src="https://cdn-icons-png.flaticon.com/512/3252/3252112.png" alt="Scale" className="w-4 h-4" /> MLC
                  </label>
                </div>
              </div>
              <div className="flex-1 bg-primary h-6 flex items-center justify-center mx-10 rounded">
                <div className="flex items-center gap-2 text-white">
                  <input type="checkbox" name="isRegisteredByUhid" id="isRegisteredByUhid" checked={formData.isRegisteredByUhid} onChange={handleInputChange} className="w-3 h-3" />
                  <label htmlFor="isRegisteredByUhid" className="font-bold">Registered by UHID</label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="User" className="w-6 h-6 rounded-full border border-gray-300 shadow-sm" />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {/* Left Column - Patient Details */}
              <div className="col-span-4 space-y-2 border-r border-gray-300 pr-4">
                <div className="bg-primary text-white px-2 py-0.5 font-bold flex justify-between items-center">
                  Patient Details
                  <div className="flex items-center gap-1 bg-[#f0ad4e] px-1 text-[10px] rounded cursor-pointer">
                    Advance Booking <span className="text-white">📅</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Mobile</label>
                    <span className="col-span-1 text-center">:</span>
                    <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none" placeholder="Mobile Number" />
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <select name="idType" value={formData.idType} onChange={handleInputChange} className="col-span-5 h-6 border border-gray-300 px-1 outline-none bg-gray-50">
                      <option value="NA">NA</option>
                      <option value="Aadhar">Aadhar</option>
                      <option value="PAN">PAN</option>
                    </select>
                    <span className="col-span-1 text-center">:</span>
                    <input type="text" name="idNumber" value={formData.idNumber} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none" placeholder="ID Number" />
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Department</label>
                    <span className="col-span-1 text-center">:</span>
                    <select name="departmentId" value={formData.departmentId} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none">
                      <option value="">-- Select Department --</option>
                      {departments.map((d: any) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Consulting Doctor</label>
                    <span className="col-span-1 text-center">:</span>
                    <select name="doctorId" value={formData.doctorId} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none">
                      <option value="">-- Select Doctor --</option>
                      {doctors.map((d: any) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Referred By</label>
                    <span className="col-span-1 text-center">:</span>
                    <input type="text" name="referredBy" value={formData.referredBy} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none" />
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap pl-4 text-[9px]">Ref Mobile</label>
                    <span className="col-span-1 text-center">:</span>
                    <input type="text" name="refMobile" value={formData.refMobile} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none" placeholder="Mobile Number" />
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Patient's Name</label>
                    <span className="col-span-1 text-center">:</span>
                    <div className="col-span-6 flex gap-1">
                      <select name="patientPrefix" value={formData.patientPrefix} onChange={handleInputChange} className="w-12 h-6 border border-gray-300 px-1 outline-none bg-gray-50">
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                      </select>
                      <input type="text" name="patientName" value={formData.patientName} onChange={handleInputChange} className="flex-1 h-6 border border-gray-300 px-1 outline-none" placeholder="Patient's Name" />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">S/D/W/o Name</label>
                    <span className="col-span-1 text-center">:</span>
                    <div className="col-span-6 flex gap-1">
                      <select name="relativePrefix" value={formData.relativePrefix} onChange={handleInputChange} className="w-12 h-6 border border-gray-300 px-1 outline-none bg-gray-50">
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                      </select>
                      <input type="text" name="relativeName" value={formData.relativeName} onChange={handleInputChange} className="flex-1 h-6 border border-gray-300 px-1 outline-none" placeholder="Relative Name" />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap pl-4 text-[9px]">Relation</label>
                    <span className="col-span-1 text-center">:</span>
                    <select name="relativeRelation" value={formData.relativeRelation} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none bg-gray-50 text-[10px]">
                      <option value="S/o">S/o</option>
                      <option value="D/o">D/o</option>
                      <option value="W/o">W/o</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">DOB/Gender/Marital</label>
                    <span className="col-span-1 text-center">:</span>
                    <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none" />
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap pl-4 text-[9px]">Gender / Marital</label>
                    <span className="col-span-1 text-center">:</span>
                    <div className="col-span-6 flex gap-1">
                      <select name="gender" value={formData.gender} onChange={handleInputChange} className="flex-1 h-6 border border-gray-300 px-0.5 outline-none bg-gray-50 text-[10px]">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <select name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} className="flex-1 h-6 border border-gray-300 px-0.5 outline-none bg-gray-50 text-[10px]">
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Age (Year)</label>
                    <span className="col-span-1 text-center">:</span>
                    <input type="text" name="ageY" value={formData.ageY} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none" placeholder="Years" />
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap pl-4 text-[9px]">Age (Month / Day)</label>
                    <span className="col-span-1 text-center">:</span>
                    <div className="col-span-6 flex gap-1">
                      <input type="text" name="ageM" value={formData.ageM} onChange={handleInputChange} className="flex-1 h-6 border border-gray-300 px-1 outline-none" placeholder="Months" />
                      <input type="text" name="ageD" value={formData.ageD} onChange={handleInputChange} className="flex-1 h-6 border border-gray-300 px-1 outline-none" placeholder="Days" />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Occupation</label>
                    <span className="col-span-1 text-center">:</span>
                    <select name="occupation" value={formData.occupation} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none bg-gray-50">
                      <option value="">--Occupation--</option>
                      <option value="Service">Service</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Religion</label>
                    <span className="col-span-1 text-center">:</span>
                    <select name="religion" value={formData.religion} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none bg-gray-50">
                      <option value="">--Religion--</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Muslim">Muslim</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-12 items-start gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold mt-1 whitespace-nowrap">Address</label>
                    <span className="col-span-1 text-center mt-1">:</span>
                    <textarea name="address" value={formData.address} onChange={handleInputChange} className="col-span-6 h-12 border border-gray-300 px-1 outline-none resize-none" placeholder="Patient Address" />
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Country</label>
                    <span className="col-span-1 text-center">:</span>
                    <select name="country" value={formData.country} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none bg-gray-50">
                      <option value="">-- Country --</option>
                      {countries.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">State / City</label>
                    <span className="col-span-1 text-center">:</span>
                    <div className="col-span-6 flex gap-1">
                      <select name="stateId" value={formData.stateId} onChange={handleInputChange} className="flex-1 h-6 border border-gray-300 px-1 outline-none bg-gray-50 text-[10px]">
                        <option value="">-- State --</option>
                        {states.map((s: any) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                      <select name="cityId" value={formData.cityId} onChange={handleInputChange} className="flex-1 h-6 border border-gray-300 px-1 outline-none bg-gray-50 text-[10px]">
                        <option value="">-- City --</option>
                        {cities.map((c: any) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Pin Code</label>
                    <span className="col-span-1 text-center">:</span>
                    <input type="text" name="pinCode" value={formData.pinCode} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none" placeholder="Pin Code" />
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap pl-4 text-[9px]">Blood Group</label>
                    <span className="col-span-1 text-center">:</span>
                    <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none bg-gray-50 text-[10px]">
                      <option value="NA">NA</option>
                      <option value="A+">A+</option>
                      <option value="O+">O+</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Middle Column - Guardian and Payer Details */}
              <div className="col-span-4 space-y-2 border-r border-gray-300 pr-4">
                <div className="bg-primary text-white px-2 py-0.5 font-bold flex justify-between items-center">
                  Guardian Details
                  <div className="flex items-center gap-1">
                    <input type="checkbox" id="sameAsReg" className="w-3 h-3" />
                    <label htmlFor="sameAsReg" className="text-[10px] text-white">Same as Reg.</label>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Guardian's Name</label>
                    <span className="col-span-1 text-center">:</span>
                    <div className="col-span-6 flex gap-1">
                      <select name="guardianPrefix" value={formData.guardianPrefix} onChange={handleInputChange} className="w-12 h-6 border border-gray-300 px-1 outline-none bg-gray-50">
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                      </select>
                      <input type="text" name="guardianName" value={formData.guardianName} onChange={handleInputChange} className="flex-1 h-6 border border-gray-300 px-1 outline-none" placeholder="Guardian's Name" />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Relation with Patient</label>
                    <span className="col-span-1 text-center">:</span>
                    <select name="guardianRelation" value={formData.guardianRelation} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none bg-gray-50 text-[10px]">
                      <option value="">-- Relation --</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Mobile</label>
                    <span className="col-span-1 text-center">:</span>
                    <input type="text" name="guardianMobile" value={formData.guardianMobile} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none" placeholder="Mobile Number" />
                  </div>
                </div>

                <div className="bg-primary text-white px-2 py-0.5 font-bold mt-4">
                  Payer Details
                </div>

                <div className="space-y-1">
                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Insurance Co.</label>
                    <span className="col-span-1 text-center">:</span>
                    <select name="insuranceCo" value={formData.insuranceCo} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none bg-gray-50 text-[10px]">
                      <option value="">Select Insurance Co.</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Payer Name</label>
                    <span className="col-span-1 text-center">:</span>
                    <select name="payerName" value={formData.payerName} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none bg-gray-50 text-[10px]">
                      <option value="--NA--">--NA--</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Card No.</label>
                    <span className="col-span-1 text-center">:</span>
                    <input type="text" name="cardNo" value={formData.cardNo} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none" placeholder="Card No." />
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Policy/Service No.</label>
                    <span className="col-span-1 text-center">:</span>
                    <input type="text" name="policyNo" value={formData.policyNo} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none" placeholder="Service No." />
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Rank</label>
                    <span className="col-span-1 text-center">:</span>
                    <input type="text" name="rank" value={formData.rank} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none" placeholder="Rank" />
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Rate List</label>
                    <span className="col-span-1 text-center">:</span>
                    <select name="rateList" value={formData.rateList} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none bg-gray-50 text-[10px]">
                      <option value="COMMON">COMMON</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Billing</label>
                    <span className="col-span-1 text-center">:</span>
                    <div className="col-span-6 flex items-center gap-4">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="billingType" value="Cash" checked={formData.billingType === 'Cash'} onChange={handleInputChange} className="w-3 h-3" /> Cash
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="billingType" value="Credit" checked={formData.billingType === 'Credit'} onChange={handleInputChange} className="w-3 h-3" /> Credit
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 mt-4">
                  <div className="flex flex-col gap-0.5">
                    <label className="text-gray-700 font-semibold text-[10px]">Provisional Diagnosis</label>
                    <textarea name="provisionalDiagnosis" value={formData.provisionalDiagnosis} onChange={handleInputChange} className="w-full h-10 border border-gray-300 px-1 outline-none resize-none" placeholder="Enter Diagnosis" />
                  </div>

                  <div className="flex flex-col gap-0.5 mt-1">
                    <label className="text-gray-700 font-semibold text-[10px]">Procedure / Treatment</label>
                    <textarea name="procedureTreatment" value={formData.procedureTreatment} onChange={handleInputChange} className="w-full h-10 border border-gray-300 px-1 outline-none resize-none" placeholder="Enter Treatment" />
                  </div>

                  <div className="flex flex-col gap-0.5 mt-1">
                    <label className="text-gray-700 font-semibold text-[10px]">Comment / Remark</label>
                    <textarea name="commentRemark" value={formData.commentRemark} onChange={handleInputChange} className="w-full h-10 border border-gray-300 px-1 outline-none resize-none" placeholder="Enter Remark" />
                  </div>
                </div>
              </div>

              {/* Right Column - Arrival and Allocation */}
              <div className="col-span-4 space-y-2 pl-4">
                <div className="bg-primary text-white px-2 py-0.5 font-bold">
                  Arrival Details
                </div>

                <div className="space-y-1">
                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Arrival Date</label>
                    <span className="col-span-1 text-center">:</span>
                    <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none" />
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Arrival Time</label>
                    <span className="col-span-1 text-center">:</span>
                    <div className="col-span-6 flex">
                      <input type="text" name="arrivalTime" value={formData.arrivalTime} onChange={handleInputChange} className="flex-1 h-6 border border-gray-300 px-1 outline-none" />
                      <span className="px-1 border border-l-0 border-gray-300 bg-gray-50 flex items-center">🕒</span>
                    </div>
                  </div>
                </div>

                <div className="bg-primary text-white px-2 py-0.5 font-bold mt-4 flex justify-between items-center cursor-pointer">
                  Allocation (Click here)
                  <Bed size={14} />
                </div>

                <div className="space-y-1">
                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Allocation</label>
                    <span className="col-span-1 text-center">:</span>
                    <select name="allocationCategory" value={formData.allocationCategory} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none bg-gray-50 text-[10px]">
                      <option value="">-- Select Category --</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-12 items-center gap-1">
                    <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Unit No.</label>
                    <span className="col-span-1 text-center">:</span>
                    <select name="unitNo" value={formData.unitNo} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none bg-gray-50 text-[10px]">
                      <option value="">-- Select --</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center mt-4 h-6">
                  <div className="w-1/2 bg-primary text-white px-2 py-0.5 font-bold h-full whitespace-nowrap">File Charge (Rs)</div>
                  <input type="text" name="fileCharge" value={formData.fileCharge} onChange={handleInputChange} className="w-1/2 h-full border border-gray-300 px-1 outline-none" placeholder="" />
                </div>

                <div className="flex items-center gap-1 mt-4 bg-primary text-white px-2 py-0.5 font-bold h-6">
                  <span className="text-[10px] whitespace-nowrap">Admission</span>
                  <input type="checkbox" name="isAdmission" checked={formData.isAdmission} onChange={handleInputChange} className="w-3 h-3" />
                  <span className="text-[10px] ml-4 whitespace-nowrap">Daycare</span>
                  <input type="checkbox" name="isDaycare" checked={formData.isDaycare} onChange={handleInputChange} className="w-3 h-3" />
                </div>

                <div className="grid grid-cols-12 items-center gap-1 mt-2">
                  <label className="col-span-5 text-gray-700 font-semibold whitespace-nowrap">Source</label>
                  <span className="col-span-1 text-center">:</span>
                  <select name="source" value={formData.source} onChange={handleInputChange} className="col-span-6 h-6 border border-gray-300 px-1 outline-none bg-gray-50 text-[10px]">
                    <option value="ADV HOARDINGS">ADV HOARDINGS</option>
                  </select>
                </div>

                <div className="mt-4 flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-2">
                    <div className="w-full h-full bg-gray-200 border border-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                      {formData.photo ? (
                        <img src={URL.createObjectURL(formData.photo)} alt="Patient" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="User" className="w-16 h-16 opacity-50" />
                        </div>
                      )}
                    </div>
                    {!formData.photo && (
                       <div className="absolute bottom-0 right-0 w-8 h-8 bg-orange-400 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 w-full overflow-hidden text-[10px]">
                    <label className="text-gray-700 font-bold whitespace-nowrap">Photo</label>
                    <span className="text-gray-700">:</span>
                    <input type="file" onChange={handleFileChange} className="w-full" />
                  </div>
                </div>

                <div className="mt-4 flex justify-center">
                  <button 
                    onClick={handleAdmit}
                    className="bg-primary text-white px-12 py-1.5 rounded font-bold hover:opacity-90 transition-colors shadow-sm flex items-center gap-2"
                    disabled={loading}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'discharge' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
              <div className="hms-section-header flex items-center gap-2 bg-primary">
                <LogOut size={16} /> Discharge Process
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="hms-form-label">Search IPD ID / UHID</label>
                    <div className="flex">
                      <input className="hms-input flex-1 border-r-0" placeholder="e.g. IPD-501" />
                      <button className="hms-btn-primary px-4"><Search size={14} /></button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="hms-form-label">Discharge Type</label>
                    <select className="hms-select w-full">
                      <option>Normal Discharge</option>
                      <option>DAMA (Discharge Against Medical Advice)</option>
                      <option>Absconded</option>
                      <option>Referred to Higher Center</option>
                      <option>Death / Expired</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="hms-form-label">Discharge Summary / Clinical Notes</label>
                  <textarea className="hms-input w-full h-32 resize-none" placeholder="Enter patient condition at discharge, medications advised, and follow-up plan..." />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <button className="hms-btn-secondary px-6">Cancel</button>
                  <button className="hms-btn-primary bg-slate-700 px-8 flex items-center gap-2">
                    <LogOut size={16} /> Finalize Discharge
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IPD;
