import React, { useState, useEffect } from 'react';
import { Search, Edit, Printer, Trash2, Eye, Calendar, FileText, Image, UserSearch, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { PhoneOutgoing, Volume2 } from 'lucide-react';
import { 
  getOPDVisits, createOPDWalkIn, 
  getAutoGeoCities, getAutoGeoCountries, getAutoGeoStates, 
  getAutoUsers, getAutoEquipmentLocations, 
  getAutoDepartments, extractArray, searchPatients,
  getApiV1OpdSearch, patchApiV1OpdByidStatus, postApiV1OpdVitalsByopdVisitId,
  getApiV1OpdByid,
  postApiV1OpdCall,
  getApiV1OpdQueue,
  getApiV1PatientsSearchByPhone,
  getApiDoctorsAvailable,
  getApiDoctorsByid,
  getApiV1InfrastructureRooms,
  postApiV1OpdWalkIn,
  getApiDoctorsDepartmentBydepartmentId
} from "@/api/apiService";

import { toast as sonnerToast } from 'sonner';

import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const OPD = () => {
  const { toast } = useToast();
  const [searchUhid, setSearchUhid] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [patient, setPatient] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'queue'>('list');
  const [pagination, setPagination] = useState({ page: 0, size: 10, total: 0 });

  // Vitals State
  const [isVitalsOpen, setIsVitalsOpen] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const [vitalsData, setVitalsData] = useState({
    weight: 0,
    height: 0,
    bp: '',
    temp: 0,
    pulse: 0,
    resp: 0,
    spo2: 0
  });

  // Status State
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({ status: 'WAITING', remark: '' });

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
    slot: 'Slot I',
    panel: '--NA--',
    idType: 'Aadhar',
    idNumber: '',
    guardianRelation: 'Father'
  });

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const res = await getApiV1OpdQueue({ page: 0, size: 50 });
      if (res.ok) {
        setQueue(res.data?.data?.content || res.data?.content || extractArray(res));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallPatient = async (id: string | number) => {
    try {
      const res = await postApiV1OpdCall(id);
      if (res.ok) {
        sonnerToast.success("Patient called for consultation");
        fetchInitialData(pagination.page);
        if (activeTab === 'queue') fetchQueue();
      } else {
        sonnerToast.error(res.data?.message || "Failed to call patient");
      }
    } catch (e) {
      console.error(e);
      sonnerToast.error("Error calling patient");
    }
  };

  const fetchInitialData = async (page = 0) => {
    setIsLoading(true);
    try {
      const [vRes, dRes, cRes, deptRes, rRes] = await Promise.all([
        getOPDVisits({ page, size: pagination.size }),
        getApiDoctorsAvailable(), 
        getAutoGeoCountries(),
        getAutoDepartments(),
        getApiV1InfrastructureRooms({ search: 'Consultation' })
      ]);
      
      if (vRes.ok) {
        // Handle nested data.data.content for paginated response
        const content = vRes.data?.data?.content || vRes.data?.content || extractArray(vRes);
        setVisits(content);
        
        const total = vRes.data?.data?.totalElements ?? vRes.data?.totalElements ?? 0;
        setPagination(prev => ({ ...prev, page, total }));
      } else sonnerToast.error("Failed to load visits");

      if (dRes.ok) {
        const doctorsData = extractArray(dRes);
        setDoctors(doctorsData);
        if (doctorsData.length > 0 && !formData.doctorId) {
          const firstDoc = doctorsData[0];
          setFormData(prev => ({ 
            ...prev, 
            doctorId: firstDoc.id,
            fee: firstDoc.consultationFee || 0
          }));
        }
      } else sonnerToast.error("Failed to load doctors");

      if (cRes.ok) setCountries(extractArray(cRes));
      if (deptRes.ok) setDepartments(extractArray(deptRes));
      
      if (rRes.ok) {
        const roomsData = extractArray(rRes);
        setRooms(roomsData);
        if (roomsData.length > 0 && !formData.roomId) {
          setFormData(prev => ({ ...prev, roomId: roomsData[0].id }));
        }
      }
      
    } catch (e) { 
      console.error(e); 
      sonnerToast.error("Error loading initial data");
    } finally { 
      setIsLoading(false); 
      setDataLoaded(true); 
    }
  };

  const handleTableSearch = async () => {
    if (!tableSearch) {
      fetchInitialData();
      return;
    }
    setIsLoading(true);
    try {
      const res = await getApiV1OpdSearch({ 
        patientName: tableSearch, 
        page: 0, 
        size: pagination.size 
      });
      if (res.ok) {
        const content = res.data?.data?.content || res.data?.content || extractArray(res);
        setVisits(content);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedVisitId) return;
    setIsLoading(true);
    try {
      const res = await patchApiV1OpdByidStatus(selectedVisitId, statusUpdate);
      if (res.ok) {
        sonnerToast.success("Status updated successfully");
        setIsStatusOpen(false);
        fetchInitialData(pagination.page);
      } else {
        sonnerToast.error((res as any).message || "Failed to update status");
      }
    } catch (e) {
      console.error(e);
      sonnerToast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveVitals = async () => {
    if (!selectedVisitId) return;
    setIsLoading(true);
    try {
      const res = await postApiV1OpdVitalsByopdVisitId(selectedVisitId, vitalsData);
      if (res.ok) {
        sonnerToast.success("Vitals recorded successfully");
        setIsVitalsOpen(false);
        fetchInitialData(pagination.page);
      } else {
        sonnerToast.error((res as any).message || "Failed to record vitals");
      }
    } catch (e) {
      console.error(e);
      sonnerToast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveVisit = async () => {
    if (!formData.patientName || !formData.mobile) {
      sonnerToast.error("Patient Name and Mobile are required");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await createOPDWalkIn(formData);
      if (res.ok) {
        sonnerToast.success("OPD Visit created successfully");
        fetchInitialData();
        // Reset form or redirect
      } else {
        sonnerToast.error((res as any).message || "Failed to create visit");
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

  const fetchAvailableDoctors = async () => {
    try {
      let res;
      if (formData.departmentId) {
        res = await getApiDoctorsDepartmentBydepartmentId(formData.departmentId);
      } else {
        res = await getApiDoctorsAvailable();
      }
      
      if (res.ok) {
        const doctorsData = extractArray(res);
        setDoctors(doctorsData);
        
        // Auto-select first doctor if none selected and doctors exist
        if (doctorsData.length > 0 && !formData.doctorId) {
          const firstDoc = doctorsData[0];
          setFormData(prev => ({ 
            ...prev, 
            doctorId: firstDoc.id,
            fee: firstDoc.consultationFee || 0
          }));
        }
      }
    } catch (e) {
      console.error("Error fetching doctors:", e);
    }
  };

  // Fetch doctors when department changes
  useEffect(() => {
    fetchAvailableDoctors();
  }, [formData.departmentId]);

  const fetchRoomsList = async () => {
    try {
      const res = await getApiV1InfrastructureRooms({ search: 'Consultation' });
      if (res.ok) {
        const roomsData = extractArray(res);
        setRooms(roomsData);
        
        // Auto-select first room if none selected
        if (roomsData.length > 0 && !formData.roomId) {
          setFormData(prev => ({ ...prev, roomId: roomsData[0].id }));
        }
      }
    } catch (e) {
      console.error("Error fetching rooms:", e);
    }
  };

  // Fetch rooms on mount and when department/doctor changes
  useEffect(() => {
    fetchRoomsList();
  }, [formData.departmentId, formData.doctorId]);

  // Fetch doctor details when doctor is selected
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (formData.doctorId) {
        try {
          const res = await getApiDoctorsByid(formData.doctorId);
          if (res.ok && res.data?.data) {
            const docData = res.data.data;
            setFormData(prev => ({
              ...prev,
              fee: docData.consultationFee || 0,
              // If the doctor response had a room, we could pre-fill it here
            }));
          }
        } catch (e) {
          console.error("Error fetching doctor details:", e);
        }
      } else {
        setFormData(prev => ({ ...prev, fee: 0 }));
      }
    };
    fetchDoctorDetails();
  }, [formData.doctorId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for department to set name too
    if (name === 'departmentId') {
      const dept = departments.find(d => d.id === value);
      setFormData(prev => ({ 
        ...prev, 
        departmentId: value, 
        departmentName: dept?.name || '',
        doctorId: '', // Reset doctor when department changes
        roomId: '',   // Reset room when department changes
        fee: 0        // Reset fee
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const preFillForm = (foundPatient: any) => {
    setPatient(foundPatient);
    const patientName = foundPatient.patientName || 
                       (foundPatient.firstName ? `${foundPatient.firstName} ${foundPatient.lastName || ''}`.trim() : '');
    
    const dobStr = foundPatient.dateOfBirth || foundPatient.dob || '';
    let calculatedAge = foundPatient.age || 0;
    
    if (!calculatedAge && dobStr) {
      const birthDate = new Date(dobStr);
      const today = new Date();
      calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
    }

    setFormData(prev => ({
      ...prev,
      title: foundPatient.title || prev.title || 'Mr.',
      mobile: foundPatient.phoneNumber || foundPatient.mobile || '',
      patientName: patientName,
      gender: foundPatient.gender || 'Male',
      maritalStatus: foundPatient.maritalStatus || 'Single',
      address: foundPatient.address || '',
      bloodGroup: foundPatient.bloodGroup || 'NA',
      email: foundPatient.email || '',
      dob: dobStr ? new Date(dobStr).toISOString().split('T')[0] : '',
      age: calculatedAge,
      currentAge: foundPatient.currentAge || (calculatedAge ? `${calculatedAge}Y` : ''),
      guardianName: foundPatient.guardianName || '',
      relationType: foundPatient.relation || 'S/o',
      guardianRelation: foundPatient.guardianRelation || 'Father',
      stateId: foundPatient.stateId || '',
      cityId: foundPatient.cityId || '',
      panel: foundPatient.panel || '--NA--',
      idType: foundPatient.idType || 'Aadhar',
      idNumber: foundPatient.idNumber || '',
    }));

    if (foundPatient.uhid) {
      setSearchUhid(foundPatient.uhid);
    }

    toast({ title: "Patient Found", description: `Pre-filling form for ${patientName}` });
  };

  const handleSearch = async () => {
    if (!searchUhid) {
      toast({ title: "Error", description: "Please enter a UHID to search.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await searchPatients({ uhid: searchUhid });
      const foundPatient = res.data?.find((p: any) => p.uhid === searchUhid) || res.data?.[0];
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
      const res = await getApiV1PatientsSearchByPhone({ phoneNumber: formData.mobile });
      const foundPatient = res.data?.data?.find((p: any) => p.phoneNumber === formData.mobile) || res.data?.data?.[0];
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

  const handleViewVisit = async (visit: any) => {
    setIsLoading(true);
    try {
      const res = await getApiV1OpdByid(visit.id);
      if (res.ok && res.data?.data) {
        const fullVisit = res.data.data;
        const p = fullVisit.patient || {};
        const pName = fullVisit.patientName || (p.firstName ? `${p.firstName} ${p.lastName || ''}`.trim() : '');
        
        // Fill patient state
        setPatient(p);
        
        // Fill form data
        setFormData(prev => ({
          ...prev,
          visitDate: fullVisit.visitTime ? new Date(fullVisit.visitTime).toISOString().split('T')[0] : prev.visitDate,
          visitTime: fullVisit.visitTime ? new Date(fullVisit.visitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : prev.visitTime,
          visitType: fullVisit.visitType || 'OPD',
          mobile: p.phoneNumber || fullVisit.mobile || '',
          patientName: pName,
          gender: p.gender || fullVisit.gender || 'Male',
          maritalStatus: p.maritalStatus || fullVisit.maritalStatus || 'Single',
          address: p.address || fullVisit.address || '',
          bloodGroup: p.bloodGroup || fullVisit.bloodGroup || 'NA',
          email: p.email || fullVisit.email || '',
          dob: p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split('T')[0] : 
               fullVisit.dob ? new Date(fullVisit.dob).toISOString().split('T')[0] : '',
          age: fullVisit.age || 0,
          currentAge: fullVisit.currentAge || '',
          guardianName: fullVisit.guardianName || '',
          relationType: fullVisit.relationType || 'Father',
          stateId: fullVisit.stateId || '',
          cityId: fullVisit.cityId || '',
          departmentId: fullVisit.departmentId || '',
          departmentName: fullVisit.departmentName || '',
          doctorId: fullVisit.doctorId || '',
          roomId: fullVisit.roomId || '',
          fee: fullVisit.fee || 0,
          paymentMode: fullVisit.paymentMode || 'Cash',
          remark: fullVisit.remark || '',
          discountPercent: fullVisit.discountPercent || 0,
        }));
        
        toast({ title: "Visit Details Loaded", description: `Showing details for ${pName}` });
      } else {
        sonnerToast.error("Failed to fetch visit details");
      }
    } catch (e) {
      console.error(e);
      sonnerToast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOpd = async () => {
    setIsLoading(true);
    try {
      const res = await createOPDWalkIn({ ...formData, patientId: patient?.id });
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
              <select name="panel" value={formData.panel} onChange={handleInputChange} className="hms-select w-32">
                <option>--NA--</option><option>CGHS</option><option>ECHS</option><option>Star Health</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <label className="hms-form-label w-24 text-right">Department :</label>
              <select name="departmentId" value={formData.departmentId} onChange={handleInputChange} className="hms-select flex-1">
                <option value="">-- Select Department --</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
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
              <select name="idType" value={formData.idType} onChange={handleInputChange} className="hms-select w-28">
                <option>Aadhar</option><option>PAN</option><option>Voter ID</option>
              </select>
              <input name="idNumber" value={formData.idNumber} onChange={handleInputChange} className="hms-input flex-1" placeholder="ID Number" />
            </div>
            <div className="flex items-center gap-3">
              <label className="hms-form-label w-24 text-right">Doctor :</label>
              <select 
                name="doctorId" 
                value={formData.doctorId} 
                onChange={handleInputChange} 
                onFocus={fetchAvailableDoctors}
                className="hms-select flex-1"
              >
                <option value="">-- Select Doctor --</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.fullName || d.name}</option>)}
              </select>
              <label className="hms-form-label ml-2">Room:</label>
              <select 
                name="roomId" 
                value={formData.roomId} 
                onChange={handleInputChange} 
                onFocus={fetchRoomsList}
                className="hms-select w-32"
              >
                <option value="">-- Select Room --</option>
                {rooms.map(r => <option key={r.id} value={r.id}>{r.roomNumber}</option>)}
              </select>
              <div className="w-28 hms-input bg-muted font-bold text-primary flex items-center justify-center">
                {formData.fee > 0 ? formData.fee : '--'}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="hms-form-label w-24 text-right">S/D/W o :</label>
              <select name="relationType" value={formData.relationType} onChange={handleInputChange} className="hms-select w-20"><option>S/o</option><option>D/o</option><option>W/o</option></select>
              <input name="guardianName" value={formData.guardianName} onChange={handleInputChange} className="hms-input flex-1" placeholder="Relation Name" />
              <select name="guardianRelation" value={formData.guardianRelation} onChange={handleInputChange} className="hms-select w-32">
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
                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <label className="hms-form-label ml-2">State :</label>
              <select name="stateId" value={formData.stateId} onChange={handleInputChange} className="hms-select flex-1">
                <option value="">-- Select State --</option>
                {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <label className="hms-form-label ml-2">City :</label>
              <select name="cityId" value={formData.cityId} onChange={handleInputChange} className="hms-select flex-1">
                <option value="">-- Select City --</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
          <button 
            onClick={() => setActiveTab('list')} 
            className={`px-4 py-2 text-xs font-bold uppercase rounded-sm transition-all ${activeTab === 'list' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-muted-foreground'}`}
          >
            Visit List
          </button>
          <button 
            onClick={() => { setActiveTab('queue'); fetchQueue(); }} 
            className={`px-4 py-2 text-xs font-bold uppercase rounded-sm transition-all ${activeTab === 'queue' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-muted-foreground'}`}
          >
            OPD Queue
          </button>
        </div>
        <div className="flex items-center gap-2 bg-card border border-border px-4 py-1.5 rounded shadow-sm">
          <label className="hms-form-label">Search List:</label>
          <div className="relative">
            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="hms-input pl-8 w-60" value={tableSearch} onChange={e => setTableSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleTableSearch()} placeholder="Name or UHID..." />
          </div>
        </div>
      </div>

      {/* List Table */}
      <div className="flex-1 bg-card border border-border shadow-sm rounded-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
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
                <th className="text-white font-semibold py-1 px-2 border-r border-white/20 text-left text-[11px]">Status</th>
                <th className="text-white font-semibold py-1 px-2 text-left text-[11px]">Process</th>
              </tr>
            </thead>
            <tbody className="text-[11px]">
              {(activeTab === 'list' ? visits : queue).length > 0 ? (
                (activeTab === 'list' ? visits : queue).map((visit, index) => (
                  <tr key={visit.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-1 px-2 border-r border-border">
                      <div className="flex items-center gap-1">
                        {pagination.page * pagination.size + index + 1} <FileText size={10} className="text-[#cc0000]" />
                      </div>
                    </td>
                    <td className="py-1 px-2 border-r border-border">
                      <div className="flex items-center gap-1">
                        {visit.tokenNumber || index + 1} <span className="text-[#cc0000] text-[10px]">✕</span>
                      </div>
                    </td>
                    <td className="py-1 px-2 border-r border-border">
                      <div className="flex items-center gap-1">
                        {visit.tokenNumber || `OP-${visit.id}`} <Printer size={10} className="text-[#cc0000]" />
                      </div>
                    </td>
                    <td className="py-1 px-2 border-r border-border font-bold text-primary">{visit.patientId?.uhid || visit.patientId || 'N/A'}</td>
                    <td className="py-1 px-2 border-r border-border uppercase font-medium">{visit.patientName}</td>
                    <td className="py-1 px-2 border-r border-border">{visit.departmentName}</td>
                    <td className="py-1 px-2 border-r border-border">{visit.doctorName}</td>
                    <td className="py-1 px-2 border-r border-border text-[#cc0000] font-bold">{visit.visitType || 'OPD'}</td>
                    <td className="py-1 px-2 border-r border-border font-bold">{visit.fee || 0}/-</td>
                    <td className="py-1 px-2 border-r border-border">
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                        visit.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                        visit.status === 'IN_CONSULTATION' ? 'bg-blue-100 text-blue-700' :
                        visit.status === 'CALLED' ? 'bg-purple-100 text-purple-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {visit.status || 'WAITING'}
                      </span>
                    </td>
                    <td className="py-0.5 px-2">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleCallPatient(visit.id)}
                          className="w-5 h-5 flex items-center justify-center bg-purple-600 text-white rounded-sm shadow-sm hover:bg-purple-700 transition-colors" 
                          title="Call Patient"
                        >
                          <Volume2 size={10} />
                        </button>
                        <button 
                          onClick={() => handleViewVisit(visit)}
                          className="w-5 h-5 flex items-center justify-center bg-[#ff0000] text-white rounded-sm shadow-sm hover:bg-[#cc0000] transition-colors" 
                          title="View"
                        >
                          <Eye size={10} />
                        </button>
                        <button className="w-5 h-5 flex items-center justify-center bg-[#28a745] text-white rounded-sm shadow-sm" title="Print"><Printer size={10} /></button>
                        <button onClick={() => handleViewVisit(visit)} className="w-5 h-5 flex items-center justify-center bg-[#17a2b8] text-white rounded-sm shadow-sm" title="Edit"><Edit size={10} /></button>
                        <button 
                          onClick={() => {
                            setSelectedVisitId(visit.id);
                            setVitalsData({
                              weight: visit.weight || 0,
                              height: visit.height || 0,
                              bp: visit.bloodPressure || '',
                              temp: visit.temperature || 0,
                              pulse: visit.pulseRate || 0,
                              resp: visit.respiratoryRate || 0,
                              spo2: visit.spo2 || 0
                            });
                            setIsVitalsOpen(true);
                          }}
                          className="w-5 h-5 flex items-center justify-center bg-blue-600 text-white rounded-sm shadow-sm" 
                          title="Vitals"
                        >
                          <FileText size={10} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedVisitId(visit.id);
                            setStatusUpdate({ status: visit.status || 'WAITING', remark: visit.remark || '' });
                            setIsStatusOpen(true);
                          }}
                          className="w-5 h-5 flex items-center justify-center bg-orange-600 text-white rounded-sm shadow-sm" 
                          title="Status"
                        >
                          <Calendar size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={11} className="py-8 text-center text-muted-foreground italic">No OPD visits found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-muted/30 p-2 flex items-center justify-between border-t border-border text-[10px]">
          <div>Total Records: {pagination.total}</div>
          <div className="flex gap-2">
            <button 
              disabled={pagination.page === 0} 
              onClick={() => fetchInitialData(pagination.page - 1)}
              className="px-2 py-1 bg-card border border-border disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center px-2">Page {pagination.page + 1}</span>
            <button 
              disabled={(pagination.page + 1) * pagination.size >= pagination.total} 
              onClick={() => fetchInitialData(pagination.page + 1)}
              className="px-2 py-1 bg-card border border-border disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Vitals Dialog */}
      <Dialog open={isVitalsOpen} onOpenChange={setIsVitalsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Record Patient Vitals</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight" className="text-right text-xs">Weight (kg)</Label>
              <Input id="weight" type="number" className="col-span-3 h-8 text-xs" value={vitalsData.weight} onChange={e => setVitalsData({...vitalsData, weight: parseFloat(e.target.value)})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="height" className="text-right text-xs">Height (cm)</Label>
              <Input id="height" type="number" className="col-span-3 h-8 text-xs" value={vitalsData.height} onChange={e => setVitalsData({...vitalsData, height: parseFloat(e.target.value)})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bp" className="text-right text-xs">BP (mmHg)</Label>
              <Input id="bp" placeholder="120/80" className="col-span-3 h-8 text-xs" value={vitalsData.bp} onChange={e => setVitalsData({...vitalsData, bp: e.target.value})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="temp" className="text-right text-xs">Temp (°C)</Label>
              <Input id="temp" type="number" className="col-span-3 h-8 text-xs" value={vitalsData.temp} onChange={e => setVitalsData({...vitalsData, temp: parseFloat(e.target.value)})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pulse" className="text-right text-xs">Pulse (bpm)</Label>
              <Input id="pulse" type="number" className="col-span-3 h-8 text-xs" value={vitalsData.pulse} onChange={e => setVitalsData({...vitalsData, pulse: parseInt(e.target.value)})} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="spo2" className="text-right text-xs">SpO2 (%)</Label>
              <Input id="spo2" type="number" className="col-span-3 h-8 text-xs" value={vitalsData.spo2} onChange={e => setVitalsData({...vitalsData, spo2: parseInt(e.target.value)})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVitalsOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveVitals} disabled={isLoading}>Save Vitals</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Dialog */}
      <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Visit Status</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right text-xs">Status</Label>
              <select 
                id="status" 
                className="col-span-3 hms-select" 
                value={statusUpdate.status} 
                onChange={e => setStatusUpdate({...statusUpdate, status: e.target.value})}
              >
                <option value="WAITING">WAITING</option>
                <option value="CALLED">CALLED</option>
                <option value="IN_CONSULTATION">IN_CONSULTATION</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="remark" className="text-right text-xs">Remark</Label>
              <Input id="remark" className="col-span-3 h-8 text-xs" value={statusUpdate.remark} onChange={e => setStatusUpdate({...statusUpdate, remark: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateStatus} disabled={isLoading}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OPD;
