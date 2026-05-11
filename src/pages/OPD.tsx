import React, { useState, useEffect } from 'react';
import { Search, Edit, Printer, Trash2, Eye, Calendar, FileText, Image, UserSearch } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { createAutoPatientsPatientRegister, createAutoClinical, getAutoGeoCities, getAutoGeoCountries, getAutoGeoStates, getAutoUsers, getAutoClinicals, getAutoEquipmentLocations, getAutoDepartments } from "@/api/apiService";

import { toast as sonnerToast } from 'sonner';

const OPD = () => {
  const { toast } = useToast();
  const [searchUhid, setSearchUhid] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [patient, setPatient] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);

  // Dynamic lists
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    visitDate: new Date().toISOString().split('T')[0],
    visitTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    visitType: 'OPD',
    mobile: '',
    patientName: '',
    gender: 'Male',
    maritalStatus: 'Single',
    address: '',
    bloodGroup: 'NA',
    departmentId: '',
    departmentName: '',
    doctorId: '',
    roomId: '',
    fee: 0,
    paymentMode: 'Cash',
    remark: '',
    title: 'Mr.',
    relationType: 'Father',
    guardianName: '',
    dob: '',
    age: 0,
    currentAge: '',
    country: '',
    stateId: '',
    cityId: '',
    email: '',
    discountPercent: 0,
    source: 'WALK-IN',
    slot: 'Slot I'
  });

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [vRes, dRes, cRes, rRes, deptRes] = await Promise.all([
        getAutoClinicals({ visitType: 'OPD' }),
        getAutoUsers({ role: 'DOCTOR' }), 
        getAutoGeoCountries(),
        getAutoEquipmentLocations(),
        getAutoDepartments()
      ]);
      
      if (vRes.ok) setVisits(vRes.data?.data || vRes.data || []);
      else sonnerToast.error("Failed to load visits");

      if (dRes.ok) setDoctors(dRes.data?.data || dRes.data || []);
      else sonnerToast.error("Failed to load doctors");

      if (cRes.ok) setCountries(cRes.data?.data || cRes.data || []);
      if (rRes.ok) setRooms(rRes.data?.data || rRes.data || []);
      if (deptRes.ok) setDepartments(deptRes.data?.data || deptRes.data || []);
      
    } catch (e) { 
      console.error(e); 
      sonnerToast.error("Error loading initial data");
    } finally { 
      setIsLoading(false); 
      setDataLoaded(true); 
    }
  };

  const handleSaveVisit = async () => {
    if (!formData.patientName || !formData.mobile) {
      sonnerToast.error("Patient Name and Mobile are required");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await createAutoClinical(formData);
      if (res.ok) {
        sonnerToast.success("OPD Visit created successfully");
        fetchInitialData();
        // Reset form or redirect
      } else {
        sonnerToast.error(res.message || "Failed to create visit");
      }
    } catch (error) {
      console.error(error);
      sonnerToast.error("An error occurred while saving");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => { fetchInitialData(); }, []);

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

  // Fetch rooms when department or doctor changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      fee: formData.doctorId ? 500 : 0
    }));
  }, [formData.doctorId, formData.departmentId, doctors]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for department to set name too
    if (name === 'departmentId') {
      const dept = departments.find(d => d._id === value);
      setFormData(prev => ({ ...prev, departmentId: value, departmentName: dept?.name || '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const preFillForm = (foundPatient: any) => {
    setPatient(foundPatient);
    setFormData(prev => ({
      ...prev,
      mobile: foundPatient.mobile || '',
      patientName: foundPatient.patientName || '',
      gender: foundPatient.gender || 'Male',
      maritalStatus: foundPatient.maritalStatus || 'Single',
      address: foundPatient.address || '',
      bloodGroup: foundPatient.bloodGroup || 'NA',
      email: foundPatient.email || '',
      dob: foundPatient.dob ? new Date(foundPatient.dob).toISOString().split('T')[0] : '',
      age: foundPatient.age || 0,
      currentAge: foundPatient.currentAge || '',
      guardianName: foundPatient.guardianName || '',
      relationType: foundPatient.relationType || 'Father',
      stateId: foundPatient.stateId || '',
      cityId: foundPatient.cityId || '',
    }));
    toast({ title: "Patient Found", description: `Pre-filling form for ${foundPatient.patientName}` });
  };

  const handleSearch = async () => {
    if (!searchUhid) {
      toast({ title: "Error", description: "Please enter a UHID to search.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await getAutoPatients();
      const foundPatient = res.data?.find((p: any) => p.uhid === searchUhid);
      if (foundPatient) {
        preFillForm(foundPatient);
      } else {
        toast({ title: "Not Found", description: "No patient found with this UHID", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Search failed.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleMobileSearch = async () => {
    if (!formData.mobile || formData.mobile.length < 10) {
      toast({ title: "Error", description: "Please enter a valid mobile number.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await getAutoPatients();
      const foundPatient = res.data?.find((p: any) => p.mobile === formData.mobile);
      if (foundPatient) {
        preFillForm(foundPatient);
      } else {
        toast({ title: "Not Found", description: "No patient found with this mobile number", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Search failed.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleViewVisit = (visit: any) => {
    if (!visit.patientId) return;
    
    // Fill patient state
    setPatient(visit.patientId);
    
    // Fill form data
    setFormData(prev => ({
      ...prev,
      visitDate: visit.visitDate ? new Date(visit.visitDate).toISOString().split('T')[0] : prev.visitDate,
      visitTime: visit.visitTime || prev.visitTime,
      visitType: visit.visitType || 'OPD',
      mobile: visit.patientId.mobile || '',
      patientName: visit.patientId.patientName || '',
      gender: visit.patientId.gender || 'Male',
      maritalStatus: visit.patientId.maritalStatus || 'Single',
      address: visit.patientId.address || '',
      bloodGroup: visit.patientId.bloodGroup || 'NA',
      email: visit.patientId.email || '',
      dob: visit.patientId.dob ? new Date(visit.patientId.dob).toISOString().split('T')[0] : '',
      age: visit.patientId.age || 0,
      currentAge: visit.patientId.currentAge || '',
      guardianName: visit.patientId.guardianName || '',
      relationType: visit.patientId.relationType || 'Father',
      stateId: visit.patientId.stateId || '',
      cityId: visit.patientId.cityId || '',
      departmentId: visit.departmentId || '',
      departmentName: visit.departmentName || '',
      doctorId: visit.doctorId?._id || visit.doctorId || '',
      roomId: visit.roomId || '',
      fee: visit.fee || 0,
      paymentMode: visit.paymentMode || 'Cash',
      remark: visit.remark || '',
      discountPercent: visit.discountPercent || 0,
    }));
    
    toast({ title: "Visit Loaded", description: `Showing details for ${visit.patientId.patientName}` });
  };

  const handleCreateOpd = async () => {
    setIsLoading(true);
    try {
      const res = await createAutoPatientsPatientRegister({ ...formData, patientId: patient?._id });
      if (res.ok) {
        toast({ title: "Success", description: "OPD visit registered successfully." });
        fetchInitialData();
        // Reset after success to prevent duplicates
        setPatient(null);
        setFormData(prev => ({
          ...prev,
          mobile: '',
          patientName: '',
          address: '',
          email: '',
          dob: '',
          age: 0,
          currentAge: '',
          guardianName: '',
          remark: '',
          fee: 0,
          discountPercent: 0
        }));
        setSearchUhid('');
      } else {
        throw new Error(res.data?.message || "Failed to register OPD visit.");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to register OPD visit.", variant: "destructive" });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* UHID Search Bar */}
      <div className="flex items-center gap-2 mb-2 bg-card border border-border p-2 shadow-sm">
        <label className="hms-form-label flex items-center gap-1"><UserSearch size={14} /> Enter UHID:</label>
        <div className="flex">
          <input 
            className="hms-input w-32 border-r-0 bg-[hsl(var(--hms-warning)/0.2)] font-bold text-primary" 
            value={searchUhid} 
            onChange={e => setSearchUhid(e.target.value)} 
            placeholder="UHID" 
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch} 
            className="hms-btn-primary px-3 flex items-center gap-1 rounded-r-none" 
            disabled={isLoading}
          >
            <Search size={12} /> {isLoading ? '...' : 'Search'}
          </button>
        </div>
        <div className="ml-auto text-[11px] font-bold text-primary bg-primary/10 px-3 py-1 rounded border border-primary/20">
          OPD : Rs.1500 | Discount : Rs.50/- | Collection : Rs.1450/-
        </div>
      </div>

      {/* Registration Form */}
      <div className="bg-card border border-border p-4 mb-2 shadow-sm">
        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
          {/* Left Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="hms-form-label w-24 text-right">Date & Time :</label>
              <input type="date" name="visitDate" value={formData.visitDate} onChange={handleInputChange} className="hms-input w-40" />
              <input type="time" name="visitTime" value={formData.visitTime} onChange={handleInputChange} className="hms-input w-32" />
            </div>
            <div className="flex items-center gap-3">
              <label className="hms-form-label w-24 text-right">Mobile :</label>
              <div className="flex flex-1">
                <input 
                  name="mobile" 
                  value={formData.mobile} 
                  onChange={handleInputChange} 
                  className="hms-input flex-1 border-r-0 font-semibold" 
                  placeholder="Mobile Number" 
                  onKeyDown={(e) => e.key === 'Enter' && handleMobileSearch()}
                />
                <button 
                  title="Search by Mobile"
                  onClick={handleMobileSearch}
                  className="hms-btn-primary px-3 bg-slate-700 hover:bg-slate-800 transition-colors"
                  disabled={isLoading}
                >
                  <Search size={14} />
                </button>
              </div>
              <label className="hms-form-label ml-2">Panel:</label>
              <select className="hms-select w-32"><option>--NA--</option><option>CGHS</option><option>ECHS</option><option>Star Health</option></select>
            </div>
            <div className="flex items-center gap-3">
              <label className="hms-form-label w-24 text-right">Department :</label>
              <select name="departmentId" value={formData.departmentId} onChange={handleInputChange} className="hms-select flex-1">
                <option value="">-- Select Department --</option>
                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <label className="hms-form-label w-24 text-right">Patient Name :</label>
              <select name="title" value={formData.title} onChange={handleInputChange} className="hms-select w-20"><option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Baby</option></select>
              <input name="patientName" value={formData.patientName} onChange={handleInputChange} className="hms-input flex-1 font-semibold" placeholder="Patient Name" />
            </div>
            <div className="flex items-center gap-3">
              <label className="hms-form-label w-24 text-right">Gender :</label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} className="hms-select w-28"><option>Male</option><option>Female</option><option>Other</option></select>
              <label className="hms-form-label ml-2">Marital :</label>
              <select name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} className="hms-select flex-1"><option>Single</option><option>Married</option><option>Widowed</option><option>Divorced</option></select>
            </div>
            <div className="flex items-center gap-3">
              <label className="hms-form-label w-24 text-right">Address :</label>
              <textarea name="address" value={formData.address} onChange={handleInputChange} className="hms-input flex-1 h-14 resize-none" placeholder="Patient Address" />
            </div>
            <div className="flex items-center gap-3">
              <label className="hms-form-label w-24 text-right">Blood Group :</label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} className="hms-select w-24"><option>NA</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></select>
              <label className="hms-form-label ml-2">Source :</label>
              <select name="source" value={formData.source} onChange={handleInputChange} className="hms-select flex-1">
                <option>WALK-IN</option><option>ADV HOARDINGS</option><option>REFERENCE</option><option>ONLINE</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="hms-form-label w-24 text-right">Email :</label>
              <input name="email" value={formData.email} onChange={handleInputChange} className="hms-input w-40" placeholder="Email" />
              <select className="hms-select w-28"><option>Aadhar</option><option>PAN</option><option>Voter ID</option></select>
              <input className="hms-input flex-1" placeholder="ID Number" />
            </div>
            <div className="flex items-center gap-3">
              <label className="hms-form-label w-24 text-right">Doctor :</label>
              <select name="doctorId" value={formData.doctorId} onChange={handleInputChange} className="hms-select flex-1">
                <option value="">-- Select Doctor --</option>
                {doctors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
              <label className="hms-form-label ml-2">Room:</label>
              <select name="roomId" value={formData.roomId} onChange={handleInputChange} className="hms-select w-32">
                <option value="">-- Select Room --</option>
                {rooms.map(r => <option key={r._id} value={r._id}>{r.roomNumber}</option>)}
              </select>
              <div className="w-28 hms-input bg-muted font-bold text-primary flex items-center justify-center">
                {formData.fee > 0 ? formData.fee : '--'}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="hms-form-label w-24 text-right">S/D/W o :</label>
              <select name="relationType" value={formData.relationType} onChange={handleInputChange} className="hms-select w-20"><option>S/o</option><option>D/o</option><option>W/o</option></select>
              <input name="guardianName" value={formData.guardianName} onChange={handleInputChange} className="hms-input flex-1" placeholder="Relation Name" />
              <select className="hms-select w-32">
                <option>Father</option><option>Mother</option><option>Spouse</option><option>Guardian</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <label className="hms-form-label w-24 text-right">DOB/Age :</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="hms-input w-40" />
              <input name="age" type="number" value={formData.age} onChange={handleInputChange} className="hms-input w-20" placeholder="Age" />
              <input name="currentAge" value={formData.currentAge} onChange={handleInputChange} className="hms-input flex-1" placeholder="e.g. 25Y 2M" />
            </div>
            <div className="flex items-center gap-3">
              <label className="hms-form-label w-24 text-right">Resident :</label>
              <select name="country" value={formData.country} onChange={handleInputChange} className="hms-select w-28">
                <option value="">-- Country --</option>
                {countries.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <label className="hms-form-label ml-2">State :</label>
              <select name="stateId" value={formData.stateId} onChange={handleInputChange} className="hms-select flex-1">
                <option value="">-- Select State --</option>
                {states.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
              <label className="hms-form-label ml-2">City :</label>
              <select name="cityId" value={formData.cityId} onChange={handleInputChange} className="hms-select flex-1">
                <option value="">-- Select City --</option>
                {cities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <label className="hms-form-label w-24 text-right">Discount :</label>
              <input type="checkbox" className="mr-1" />
              <input name="discountPercent" value={formData.discountPercent} onChange={handleInputChange} className="hms-input w-16" placeholder="%" />
              <input className="hms-input w-24" placeholder="Amount" />
              <label className="hms-form-label ml-2">Remark :</label>
              <input name="remark" value={formData.remark} onChange={handleInputChange} className="hms-input flex-1" placeholder="Remark" />
            </div>
            <div className="flex items-center gap-3">
              <label className="hms-form-label w-24 text-right">Payment :</label>
              <select name="paymentMode" value={formData.paymentMode} onChange={handleInputChange} className="hms-select w-40"><option>Cash</option><option>Card</option><option>UPI</option><option>TPA</option></select>
              <div className="flex-1" />
              <button onClick={handleCreateOpd} className="hms-btn-primary px-16 py-3 text-sm font-bold shadow-md hover:translate-y-[-1px] transition-all" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Complete Registration'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export buttons + Search */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-1">
          <button className="hms-btn-secondary text-xs px-4 py-2">Copy</button>
          <button className="hms-btn-secondary text-xs px-4 py-2">CSV</button>
          <button className="hms-btn-secondary text-xs px-4 py-2">PDF</button>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border px-4 py-1.5 rounded shadow-sm">
          <label className="hms-form-label">Search List:</label>
          <div className="relative">
            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="hms-input pl-8 w-60" value={tableSearch} onChange={e => setTableSearch(e.target.value)} placeholder="Name or UHID..." />
          </div>
        </div>
      </div>

      {/* List Table */}
      <div className="flex-1 bg-card border border-border shadow-sm rounded-sm overflow-hidden">
        <table className="hms-table w-full border-collapse">
          <thead>
            <tr className="bg-[#cc0000] text-white">
              <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">S.No.</th>
              <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">Queue</th>
              <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">OPD ID</th>
              <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">UHID</th>
              <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">Patient Name</th>
              <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">Department</th>
              <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">Doctor</th>
              <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">Type</th>
              <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">Fee</th>
              <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">Mode</th>
              <th className="text-white font-semibold py-1 px-2 text-left text-[11px]">Process</th>
            </tr>
          </thead>
          <tbody className="text-[11px]">
            {visits.length > 0 ? (
              visits.map((visit, index) => (
                <tr key={visit._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-1 px-2 border-r border-border">
                    <div className="flex items-center gap-1">
                      {index + 1} <FileText size={10} className="text-[#cc0000]" />
                    </div>
                  </td>
                  <td className="py-1 px-2 border-r border-border">
                    <div className="flex items-center gap-1">
                      {visit.queue || index + 1} <span className="text-[#cc0000] text-[10px]">✕</span>
                    </div>
                  </td>
                  <td className="py-1 px-2 border-r border-border">
                    <div className="flex items-center gap-1">
                      {visit.receiptNo || `OP-${index + 1}`} <Printer size={10} className="text-[#cc0000]" />
                    </div>
                  </td>
                  <td className="py-1 px-2 border-r border-border text-slate-600">{visit.patientId?.uhid || 'N/A'}</td>
                  <td className="py-1 px-2 border-r border-border">
                    <div className="flex items-center gap-1">
                      <Edit size={10} className="text-[#cc0000]" />
                      <span className="font-medium text-slate-700 uppercase">{visit.patientId?.patientName || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-1 px-2 border-r border-border uppercase text-slate-600">{visit.departmentName || 'N/A'}</td>
                  <td className="py-1 px-2 border-r border-border uppercase text-slate-600">{visit.doctorId?.name || 'N/A'}</td>
                  <td className="py-1 px-2 border-r border-border text-slate-600">{visit.visitType === 'OPD' ? 'Gen' : visit.visitType}</td>
                  <td className="py-1 px-2 border-r border-border">
                    <div className="flex items-center gap-1">
                      <Edit size={10} className="text-[#cc0000]" />
                      <span className="text-slate-600 font-medium">{visit.fee}/-</span>
                    </div>
                  </td>
                  <td className="py-1 px-2 border-r border-border text-slate-600">{visit.paymentMode}</td>
                  <td className="py-0.5 px-2">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleViewVisit(visit)}
                        className="w-5 h-5 flex items-center justify-center bg-[#ff0000] text-white rounded-sm shadow-sm hover:bg-[#cc0000] transition-colors" 
                        title="View"
                      >
                        <Eye size={10} />
                      </button>
                      <button className="w-5 h-5 flex items-center justify-center bg-[#28a745] text-white rounded-sm shadow-sm" title="Print"><Printer size={10} /></button>
                      <button className="w-5 h-5 flex items-center justify-center bg-[#17a2b8] text-white rounded-sm shadow-sm" title="Edit"><Edit size={10} /></button>
                      <button className="w-5 h-5 flex items-center justify-center bg-[#dc3545] text-white rounded-sm shadow-sm" title="Delete"><Trash2 size={10} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="text-center text-muted-foreground py-4">No visits today</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OPD;
