import React, { useState, useEffect } from 'react';
import { Search, Edit, Eye, Printer, Plus, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  getAutoPatients,
  patientRegister,
  getAutoGeoCountries,
  getAutoGeoStates,
  getAutoGeoCities,
  extractArray,
  getApiV1PatientsVisits,
  postApiV1PatientsVisitRegister
} from "@/api/apiService";

const PatientRegistration = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'list' | 'new' | 'visits'>('new');
  const [mobile, setMobile] = useState('');
  const [patient, setPatient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  // Search filter
  const [listSearch, setListSearch] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    gender: 'Male',
    maritalStatus: 'Single',
    dob: '',
    age: '',
    currentAge: '',
    relationType: 'Father',
    guardianName: '',
    address: '',
    country: '',
    stateId: '',
    cityId: '',
    bloodGroup: '',
    source: 'Walk-in',
    referredDoctorId: '',
    referralMobile: '',
    discountPercent: 0,
    remark: '',
    patientImage: ''
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [cRes, sRes] = await Promise.all([
          getAutoGeoCountries(),
          getAutoGeoStates()
        ]);
        
        if (cRes.ok) setCountries(cRes.data || []);
        if (sRes.ok) setStates(sRes.data || []);
        
        if (cRes.data && cRes.data.length > 0) {
          setFormData(prev => ({ ...prev, country: cRes.data[0].id }));
        }
      } catch (error: any) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch cities when state changes
   useEffect(() => {
     const fetchCities = async () => {
       if (formData.stateId) {
         try {
           const res = await getAutoGeoCities({ stateId: formData.stateId });
           if (res.ok) setCities(res.data || []);
         } catch (e) {
           console.error("Error fetching cities:", e);
         }
       } else {
         setCities([]);
       }
     };
     fetchCities();
   }, [formData.stateId]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (activeTab === 'list') {
          const res = await getAutoPatients({ query: listSearch });
          if (res.ok) setPatients(extractArray(res));
        } else if (activeTab === 'visits') {
          const res = await getApiV1PatientsVisits();
          if (res.ok) setVisits(extractArray(res));
        }
      } catch (e) {
        console.error("Error fetching data:", e);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [activeTab, listSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    if (mobile.length !== 10) {
      toast({ title: "Error", description: "Please enter a valid 10-digit mobile number.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const response = await getAutoPatients({ mobile });
      const data = extractArray(response);
      const foundPatient = data.find((p: any) => p.mobile === mobile || p.phone === mobile);
      if (foundPatient) {
        setPatient(foundPatient);
        toast({ title: "Patient Found", description: `Patient ${foundPatient.patientName || foundPatient.name} is already registered.` });
      } else {
        toast({ title: "Patient Not Found", description: "No patient found with this mobile number. Please register as new patient." });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "An error occurred while searching.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await patientRegister({ ...formData, mobile });
      if (response.ok || response.status < 300) {
        const newPatient = response.data || { ...formData, id: Date.now().toString(), mobile };
        setPatient(newPatient);
        setIsRegistered(true);
        toast({ title: "Success", description: "Patient registered successfully." });
      } else {
        throw new Error(response.data?.message || 'Registration failed');
      }
    } catch (error: any) {
      toast({ title: "Registration Failed", description: error.message || "Could not register the patient.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleCreateVisit = async (visitType: 'OPD' | 'IPD') => {
    if (!patient) return;
    setIsLoading(true);
    try {
      const visitData = {
        patientId: patient.id,
        visitType: visitType,
        visitDate: new Date().toISOString(),
        status: 'OPEN'
      };
      const res = await postApiV1PatientsVisitRegister(visitData);
      if (res.ok) {
        toast({ title: "Visit Created", description: `Successfully created ${visitType} visit for ${patient.patientName || patient.name}.` });
        setMobile('');
        setPatient(null);
        setIsRegistered(false);
        setActiveTab('visits');
      } else {
        throw new Error(res.data?.message || 'Visit creation failed');
      }
    } catch (error: any) {
      toast({ title: "Visit Creation Failed", description: error.message, variant: "destructive" });
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div className="flex gap-1 mb-2 border-b border-border pb-1">
        <button onClick={() => setActiveTab('list')} className={`px-3 py-1 text-xs font-semibold ${activeTab === 'list' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>Patient List</button>
        <button onClick={() => setActiveTab('new')} className={`px-3 py-1 text-xs font-semibold ${activeTab === 'new' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>New Registration / Visit</button>
        <button onClick={() => setActiveTab('visits')} className={`px-3 py-1 text-xs font-semibold ${activeTab === 'visits' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>Recent Visits</button>
      </div>

      {activeTab === 'list' && (
        <div className="space-y-2">
          <div className="flex gap-2 mb-2">
            <input 
              className="hms-input w-64" 
              placeholder="Search by UHID, Name, Mobile..." 
              value={listSearch}
              onChange={(e) => setListSearch(e.target.value)}
            />
            <button className="hms-btn-primary" onClick={() => setListSearch(listSearch)}><Search size={12} /> Search</button>
          </div>
          <table className="hms-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>UHID</th>
                <th>Patient Name</th>
                <th>Age/Gender</th>
                <th>Mobile</th>
                <th>Address</th>
                <th>Guardian</th>
                <th>Reg. Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p, index) => (
                <tr key={p.id}>
                  <td>{index + 1}</td>
                  <td className="font-bold text-primary">{p.uhid}</td>
                  <td className="font-semibold">{p.patientName}</td>
                  <td>{p.age}Y / {p.gender}</td>
                  <td>{p.mobile}</td>
                  <td className="max-w-[150px] truncate">{p.address}</td>
                  <td>{p.guardianName}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="flex gap-1">
                    <button className="p-1 hover:bg-secondary rounded text-primary" title="View"><Eye size={14} /></button>
                    <button className="p-1 hover:bg-secondary rounded text-primary" title="Edit"><Edit size={14} /></button>
                    <button className="p-1 hover:bg-secondary rounded text-primary" title="Print"><Printer size={14} /></button>
                  </td>
                </tr>
              ))}
              {patients.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-muted-foreground">No patients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'visits' && (
        <div className="space-y-2">
          <table className="hms-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Visit ID</th>
                <th>Patient Name</th>
                <th>UHID</th>
                <th>Visit Type</th>
                <th>Doctor</th>
                <th>Date/Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((v, index) => (
                <tr key={v.id}>
                  <td>{index + 1}</td>
                  <td className="font-bold">{v.visitId || v.id}</td>
                  <td className="font-semibold">{v.patientName}</td>
                  <td className="text-primary font-bold">{v.uhid}</td>
                  <td><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${v.visitType === 'IPD' ? 'bg-hms-success text-hms-success-foreground' : 'bg-primary text-primary-foreground'}`}>{v.visitType}</span></td>
                  <td>{v.doctorName || 'N/A'}</td>
                  <td>{new Date(v.visitDate || v.createdAt).toLocaleString()}</td>
                  <td><span className="text-[10px] font-bold uppercase">{v.status || 'OPEN'}</span></td>
                  <td>
                    <button className="hms-btn-secondary p-1" title="Print Slip"><Printer size={12} /></button>
                  </td>
                </tr>
              ))}
              {visits.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-muted-foreground">No recent visits found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'new' && (
        <div className="space-y-4">
          {/* Step 1: Patient Identification */}
          <div className="hms-section-header">Step 1: Find or Register Patient</div>
          <div className="bg-card border border-border p-3">
            <div className="flex items-center gap-2">
              <label className="hms-form-label w-32">Enter Mobile Number:</label>
              <input 
                className="hms-input w-48" 
                placeholder="10-digit mobile..." 
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                disabled={!!patient}
              />
              <button onClick={handleSearch} className="hms-btn-primary" disabled={isLoading || !!patient}>
                <Search size={12} /> {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Step 2: Registration Form (if new patient) */}
          {!patient && (
            <form onSubmit={handleRegister}>
              <div className="hms-section-header">New Patient Details</div>
              <div className="bg-card border border-border p-3 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <label className="hms-form-label w-28">Patient Name:</label>
                    <input name="patientName" value={formData.patientName} onChange={handleInputChange} className="hms-input flex-1" required />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="hms-form-label w-28">Email:</label>
                    <input name="email" value={formData.email} onChange={handleInputChange} className="hms-input flex-1" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="hms-form-label w-28">Gender:</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="hms-select flex-1">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <label className="hms-form-label w-28">Age:</label>
                    <input name="age" value={formData.age} onChange={handleInputChange} className="hms-input w-full" placeholder="Age" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="hms-form-label w-28">DOB:</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="hms-input flex-1" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="hms-form-label w-28">Blood Group:</label>
                    <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} className="hms-select flex-1">
                      <option value="">--Select--</option>
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>O+</option>
                      <option>O-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <label className="hms-form-label w-28">Guardian Name:</label>
                    <input name="guardianName" value={formData.guardianName} onChange={handleInputChange} className="hms-input flex-1" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="hms-form-label w-28">Relation:</label>
                    <select name="relationType" value={formData.relationType} onChange={handleInputChange} className="hms-select flex-1">
                      <option>Father</option>
                      <option>Mother</option>
                      <option>Husband</option>
                      <option>Wife</option>
                      <option>Son</option>
                      <option>Daughter</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="hms-form-label w-28">Marital Status:</label>
                    <select name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} className="hms-select flex-1">
                      <option>Single</option>
                      <option>Married</option>
                      <option>Divorced</option>
                      <option>Widowed</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <label className="hms-form-label w-28">Address:</label>
                    <textarea name="address" value={formData.address} onChange={handleInputChange} className="hms-input flex-1 h-12" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="hms-form-label w-28">Remarks:</label>
                    <textarea name="remark" value={formData.remark} onChange={handleInputChange} className="hms-input flex-1 h-12" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <label className="hms-form-label w-28">Country:</label>
                    <select name="country" value={formData.country} onChange={handleInputChange} className="hms-select flex-1">
                      <option value="">--Select--</option>
                      {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="hms-form-label w-28">State:</label>
                    <select name="stateId" value={formData.stateId} onChange={handleInputChange} className="hms-select flex-1">
                      <option value="">--Select--</option>
                      {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="hms-form-label w-28">City:</label>
                    <select name="cityId" value={formData.cityId} onChange={handleInputChange} className="hms-select flex-1">
                      <option value="">--Select--</option>
                      {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="submit" className="hms-btn-primary" disabled={isLoading}>Register Patient</button>
                </div>
              </div>
            </form>
          )}

          {/* Step 3: Create Visit (if patient is identified/registered) */}
          {(patient || isRegistered) && patient && (
            <div>
              <div className="hms-section-header">Step 2: Create a Visit for {patient.name} (UHID: {patient.uhid})</div>
              <div className="bg-card border border-border p-3">
                <p className="text-sm mb-3">Patient has been identified. Please select the visit type to proceed.</p>
                <div className="flex gap-4">
                  <button onClick={() => handleCreateVisit('OPD')} className="hms-btn-primary flex items-center gap-2" disabled={isLoading}>
                    Create OPD Visit <ArrowRight size={16} />
                  </button>
                  <button onClick={() => handleCreateVisit('IPD')} className="hms-btn-success flex items-center gap-2" disabled={isLoading}>
                    Create IPD Visit <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientRegistration;
