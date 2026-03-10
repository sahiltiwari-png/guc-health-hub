
import React, { useEffect, useState } from 'react';
import { Search, Edit, Eye, Printer, Plus, UserSearch, Bed, ClipboardList, LogOut } from 'lucide-react';
import { findPatientByUhid, createPatientVisit, getIPDAdmissions } from '../api/apiService';

const IPD = () => {
  const [ipdList, setIpdList] = useState([]);
  const [activeTab, setActiveTab] = useState<'list' | 'admit' | 'discharge'>('list');
  const [searchUhid, setSearchUhid] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (activeTab === 'list') {
      const fetchIPDList = async () => {
        setLoading(true);
        try {
          const data = await getIPDAdmissions();
          setIpdList(data);
        } catch (error) {
          setMessage({ type: 'error', text: 'Failed to fetch IPD list.' });
        }
        setLoading(false);
      };
      fetchIPDList();
    }
  }, [activeTab]);

  const [formData, setFormData] = useState({
    uhid: '',
    patientName: '',
    mobile: '',
    age: '',
    gender: '',
    department: 'GENERAL MEDICINE',
    doctor: 'Dr. ALOK MEHTA',
    ward: 'Ward-A',
    bedNo: 'B-01',
    tpaPanel: '--NA--',
    referredBy: 'SELF',
    diagnosis: '',
    admissionDate: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    if (!searchUhid) return;
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const patient = await findPatientByUhid(searchUhid);
      if (patient) {
        setFormData(prev => ({
          ...prev,
          uhid: patient.uhid || '',
          patientName: patient.patientName || '',
          mobile: patient.mobile || '',
          age: patient.age || '',
          gender: patient.gender || '',
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

  const handleAdmit = async () => {
    if (!formData.uhid) {
      setMessage({ type: 'error', text: 'Please select a patient first.' });
      return;
    }
    setLoading(true);
    try {
      const visitData = {
        uhid: formData.uhid,
        visitType: 'IPD',
        department: formData.department,
        doctor: formData.doctor,
        details: {
          ward: formData.ward,
          bedNo: formData.bedNo,
          tpaPanel: formData.tpaPanel,
          referredBy: formData.referredBy,
          diagnosis: formData.diagnosis,
          admissionDate: formData.admissionDate
        }
      };
      await createPatientVisit(visitData);
      setMessage({ type: 'success', text: 'IPD Admission successful!' });
      // Reset form or redirect
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create IPD admission.' });
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
                <input className="hms-input pl-9 w-64" placeholder="Search by Name / UHID / IPD ID..." />
              </div>
              <select className="hms-select w-40"><option>All Wards</option><option>Ward-A</option><option>Ward-B</option><option>Ward-C</option><option>ICU</option><option>NICU</option></select>
              <select className="hms-select w-40"><option>All Status</option><option>Admitted</option><option>Critical</option><option>Stable</option><option>Discharged</option></select>
              <button className="hms-btn-primary flex items-center gap-2">
                <Search size={14} /> Filter
              </button>
            </div>

            <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
              <table className="hms-table">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>IPD ID</th>
                    <th>UHID</th>
                    <th>Patient Name</th>
                    <th>Age/Sex</th>
                    <th>Ward/Bed</th>
                    <th>Doctor</th>
                    <th>Department</th>
                    <th>DOA</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ipdList.map((p, index) => (
                    <tr key={p._id}>
                      <td>{index + 1}</td>
                      <td className="font-medium text-primary">{p.admissionNumber}</td>
                      <td>{p.patientId.uhid}</td>
                      <td className="font-semibold">{p.patientId.patientName}</td>
                      <td>{p.patientId.age}/{p.patientId.gender[0]}</td>
                      <td>{p.bedId?.ward}/ <span className="font-medium">{p.bedId?.bedNumber}</span></td>
                      <td>{p.treatingDoctors.map(d => d.name).join(', ')}</td>
                      <td>{p.visitId.departmentName}</td>
                      <td>{new Date(p.admissionDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.status === 'Discharged' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="flex gap-2">
                        <button title="View Profile" className="p-1 hover:bg-secondary rounded text-primary"><Eye size={14} /></button>
                        <button title="Edit Details" className="p-1 hover:bg-secondary rounded text-primary"><Edit size={14} /></button>
                        <button title="Print Admission Form" className="p-1 hover:bg-secondary rounded text-primary"><Printer size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'admit' && (
          <div className="max-w-6xl mx-auto space-y-4">
            {/* Search Section */}
            <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
              <div className="hms-section-header flex items-center gap-2">
                <UserSearch size={16} /> Patient Identification
              </div>
              <div className="p-4 flex items-center gap-4 bg-muted/30">
                <div className="flex-1 max-w-md flex items-center gap-2">
                  <label className="hms-form-label w-24">Enter UHID:</label>
                  <div className="flex-1 flex">
                    <input 
                      className="hms-input flex-1 border-r-0" 
                      placeholder="e.g. UHID-12345" 
                      value={searchUhid}
                      onChange={(e) => setSearchUhid(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button 
                      className="hms-btn-primary px-3 flex items-center gap-1"
                      onClick={handleSearch}
                      disabled={loading}
                    >
                      {loading ? '...' : <Search size={14} />} Search
                    </button>
                  </div>
                </div>
                <div className="text-muted-foreground text-[11px] italic">
                  Search by UHID to pre-fill patient details for IPD admission.
                </div>
              </div>
            </div>

            {/* Admission Form */}
            <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
              <div className="hms-section-header flex items-center gap-2">
                <Bed size={16} /> Admission Details
              </div>
              <div className="p-4 space-y-6">
                {/* Patient Info Row (Read Only mostly) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4 border-b border-dashed border-border">
                  <div className="space-y-1">
                    <label className="hms-form-label">Patient Name</label>
                    <input className="hms-input w-full bg-muted/50" readOnly value={formData.patientName} />
                  </div>
                  <div className="space-y-1">
                    <label className="hms-form-label">Mobile Number</label>
                    <input className="hms-input w-full bg-muted/50" readOnly value={formData.mobile} />
                  </div>
                  <div className="space-y-1">
                    <label className="hms-form-label">Age / Gender</label>
                    <div className="flex gap-2">
                      <input className="hms-input w-1/2 bg-muted/50" readOnly value={formData.age} />
                      <input className="hms-input w-1/2 bg-muted/50" readOnly value={formData.gender} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="hms-form-label">Admission Date</label>
                    <input type="date" name="admissionDate" className="hms-input w-full" value={formData.admissionDate} onChange={handleInputChange} />
                  </div>
                </div>

                {/* Clinical Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="hms-form-label">Department</label>
                      <select name="department" className="hms-select w-full" value={formData.department} onChange={handleInputChange}>
                        <option>GENERAL MEDICINE</option>
                        <option>ORTHOPEDICS</option>
                        <option>GYNECOLOGY</option>
                        <option>CARDIOLOGY</option>
                        <option>PEDIATRICS</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="hms-form-label">Consultant Doctor</label>
                      <select name="doctor" className="hms-select w-full" value={formData.doctor} onChange={handleInputChange}>
                        <option>Dr. ALOK MEHTA</option>
                        <option>Dr. RAHUL VERMA</option>
                        <option>Dr. PRIYA SINGH</option>
                        <option>Dr. NEHA GUPTA</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="hms-form-label">Ward / Floor</label>
                        <select name="ward" className="hms-select w-full" value={formData.ward} onChange={handleInputChange}>
                          <option>Ward-A</option><option>Ward-B</option><option>Ward-C</option>
                          <option>ICU</option><option>NICU</option><option>Deluxe</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="hms-form-label">Bed Number</label>
                        <select name="bedNo" className="hms-select w-full" value={formData.bedNo} onChange={handleInputChange}>
                          <option>B-01</option><option>B-02</option><option>B-03</option><option>B-04</option>
                          <option>ICU-01</option><option>ICU-02</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="hms-form-label">TPA / Panel Name</label>
                      <select name="tpaPanel" className="hms-select w-full" value={formData.tpaPanel} onChange={handleInputChange}>
                        <option>--NA--</option>
                        <option>CGHS (Central Govt)</option>
                        <option>ECHS (Ex-Servicemen)</option>
                        <option>STAR HEALTH INSURANCE</option>
                        <option>HDFC ERGO</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="hms-form-label">Referred By</label>
                      <input name="referredBy" className="hms-input w-full" placeholder="Doctor or Hospital Name" value={formData.referredBy} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-1">
                      <label className="hms-form-label">Provisional Diagnosis</label>
                      <textarea name="diagnosis" className="hms-input w-full h-20 resize-none" placeholder="Enter clinical findings..." value={formData.diagnosis} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <button className="hms-btn-secondary px-8" onClick={() => setFormData({ ...formData, diagnosis: '', uhid: '', patientName: '', mobile: '' })}>Reset</button>
                  <button className="hms-btn-primary px-10 flex items-center gap-2" onClick={handleAdmit} disabled={loading || !formData.uhid}>
                    {loading ? 'Processing...' : <><Plus size={16} /> Confirm Admission</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'discharge' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="bg-card border border-border rounded-md shadow-sm overflow-hidden">
              <div className="hms-section-header flex items-center gap-2 bg-slate-700">
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
