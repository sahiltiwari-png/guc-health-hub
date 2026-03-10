import React, { useState } from 'react';
import { Search, Edit, Eye, Printer, Plus, ArrowRight } from 'lucide-react';
import { findPatientByMobile, registerPatient, createPatientVisit } from '@/api/apiService';
import { useToast } from '@/components/ui/use-toast';

// Mock data for patient list display
const mockPatients = [
  { sno: 1, uhid: 'U-1001', name: 'Mr. Rajesh Kumar', age: '45Y', gender: 'Male', mobile: '9876543210', address: 'Sector 12, Noida', guardian: 'Suresh Kumar', regDate: '10-Jan-2023' },
  { sno: 2, uhid: 'U-1002', name: 'Mrs. Sunita Devi', age: '32Y', gender: 'Female', mobile: '8765432109', address: 'Lajpat Nagar, Delhi', guardian: 'Ramesh Kumar', regDate: '12-Jan-2023' },
];

const PatientRegistration = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'list' | 'new'>('new');
  const [mobile, setMobile] = useState('');
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

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
    country: 'India',
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
      const newPatient = await registerPatient({ ...formData, mobile });
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
        <div>
          {/* ... Patient List View ... */}
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
