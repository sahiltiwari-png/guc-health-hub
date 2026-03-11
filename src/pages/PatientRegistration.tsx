import React, { useState, useEffect } from 'react';
import { Search, Edit, Eye, Printer, Plus, ArrowRight } from 'lucide-react';
import { findPatientByMobile, registerPatient, createPatientVisit, listPatients, listCountries, listStates, listCities } from '@/api/apiService';
import { useToast } from '@/components/ui/use-toast';

const PatientRegistration = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'list' | 'new'>('new');
  const [mobile, setMobile] = useState('');
  const [patient, setPatient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [countryRes, stateRes] = await Promise.all([
          listCountries(),
          listStates()
        ]);
        const countriesList = countryRes.data || [];
        setCountries(countriesList);
        setStates(stateRes.data || []);
        
        // Find India and set its ID as default
        const india = countriesList.find((c: any) => c.name === 'India');
        if (india) {
          setFormData(prev => ({ ...prev, country: india._id }));
        }
      } catch (error: any) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch cities when state changes
   useEffect(() => {
     if (formData.stateId) {
       listCities(formData.stateId).then(res => setCities(res.data || []));
     } else {
       setCities([]);
     }
   }, [formData.stateId]);

  useEffect(() => {
    if (activeTab === 'list') {
      const fetchPatients = async () => {
        setIsLoading(true);
        try {
          const res = await listPatients({});
          setPatients(res.data || []);
        } catch (error: any) {
          toast({ title: "Error", description: error.message || "Failed to fetch patients.", variant: "destructive" });
        }
        setIsLoading(false);
      };
      fetchPatients();
    }
  }, [activeTab]);

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
      const foundPatient = await findPatientByMobile(mobile);
      if (foundPatient) {
        setPatient(foundPatient);
        toast({ title: "Patient Found", description: `Patient ${foundPatient.name} is already registered.` });
      } else {
        setPatient(null);
        toast({ title: "New Patient", description: "No existing patient found with this mobile number. Please proceed with registration." });
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
      // Sanitize ObjectIds to handle empty strings
      const sanitizedData = {
        ...formData,
        country: formData.country || undefined,
        stateId: formData.stateId || undefined,
        cityId: formData.cityId || undefined,
        referredDoctorId: formData.referredDoctorId || undefined
      };
      const newPatient = await registerPatient({ ...sanitizedData, mobile });
      setPatient(newPatient.patient);
      setIsRegistered(true);
      toast({ title: "Success", description: "Patient registered successfully." });
    } catch (error: any) {
      toast({ title: "Registration Failed", description: error.message || "Could not register the patient.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleCreateVisit = async (visitType: 'OPD' | 'IPD') => {
    if (!patient) return;
    setIsLoading(true);
    try {
      await createPatientVisit({ patientId: patient._id, visitType, fee: 500, paymentMode: 'Cash' /* ... other visit details */ });
      toast({ title: "Visit Created", description: `Successfully created ${visitType} visit for ${patient.name}.` });
      // Reset state or navigate away
      setMobile('');
      setPatient(null);
      setIsRegistered(false);
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
      </div>

      {activeTab === 'list' && (
        <div className="space-y-2">
          <div className="flex gap-2 mb-2">
            <input className="hms-input w-64" placeholder="Search by UHID, Name, Mobile..." />
            <button className="hms-btn-primary"><Search size={12} /> Search</button>
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
                <tr key={p._id}>
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
                      {countries.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="hms-form-label w-28">State:</label>
                    <select name="stateId" value={formData.stateId} onChange={handleInputChange} className="hms-select flex-1">
                      <option value="">--Select--</option>
                      {states.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="hms-form-label w-28">City:</label>
                    <select name="cityId" value={formData.cityId} onChange={handleInputChange} className="hms-select flex-1">
                      <option value="">--Select--</option>
                      {cities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
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
