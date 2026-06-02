import React, { useState, useEffect } from 'react';
import { 
  Users, Activity, BedDouble, FileText, RefreshCw, 
  Search, Plus, Heart, Thermometer, Wind, Droplets, 
  AlertCircle, CheckCircle, Clock, TrendingUp
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  getApiV1Opd, 
  getApiV1IpdAdmissions,
  postApiV1ClinicalNursingNote,
  searchIcuAdmissions,
  recordIcuMonitoring,
  recordIcuIntakeOutput,
  postApiV1OpdVitalsByopdVisitId,
  getApiV1OpdByid,
  getApiV1ClinicalVitalsHistory,
  postApiV1ClinicalVitals,
  updateVisitVitals,
  extractArray
} from "@/api/apiService";
import { ChevronLeft, ChevronRight, Eye, Edit, User, Calendar, MapPin, Phone, Mail, Stethoscope, Building, ClipboardList, Info } from 'lucide-react';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NurseDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('opd');

  // Data States
  const [opdQueue, setOpdQueue] = useState<any[]>([]);
  const [ipdAdmissions, setIpdAdmissions] = useState<any[]>([]);
  const [icuAdmissions, setIcuAdmissions] = useState<any[]>([]);
  const [vitalsHistory, setVitalsHistory] = useState<any[]>([]);

  // Modal States
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showIcuModal, setShowIcuModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedAdmission, setSelectedAdmission] = useState<any>(null);
  const [selectedVital, setSelectedVital] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Pagination States
  const [opdPagination, setOpdPagination] = useState({ page: 0, size: 10, total: 0 });
  const [ipdPagination, setIpdPagination] = useState({ page: 0, size: 10, total: 0 });
  const [icuPagination, setIcuPagination] = useState({ page: 0, size: 10, total: 0 });

  // Form States
  const [vitalsForm, setVitalsForm] = useState({
    weight: '',
    height: '',
    bloodPressure: '',
    temperature: '',
    pulseRate: '',
    spo2: '',
    remark: ''
  });

  const [noteForm, setNoteForm] = useState({
    description: '',
    status: 'NORMAL',
    noteTime: new Date().toISOString().slice(0, 16)
  });

  const [icuForm, setIcuForm] = useState({
    type: 'monitoring', // monitoring or intake-output
    ventilatorMode: '',
    peep: '',
    fio2: '',
    gcsE: '',
    gcsV: '',
    gcsM: '',
    intakeType: 'IV Fluids',
    intakeAmount: '',
    outputType: 'Urine',
    outputAmount: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [opdRes, ipdRes, icuRes] = await Promise.all([
        getApiV1Opd({ status: 'WAITING', page: opdPagination.page, size: opdPagination.size }),
        getApiV1IpdAdmissions({ status: 'ADMITTED', page: ipdPagination.page, size: ipdPagination.size }),
        searchIcuAdmissions({ status: 'ADMITTED', page: icuPagination.page, size: icuPagination.size })
      ]);

      if (opdRes.ok) {
        setOpdQueue(extractArray(opdRes));
        setOpdPagination(prev => ({ ...prev, total: opdRes.data?.data?.totalElements || opdRes.data?.totalElements || 0 }));
      }
      if (ipdRes.ok) {
        setIpdAdmissions(extractArray(ipdRes));
        setIpdPagination(prev => ({ ...prev, total: ipdRes.data?.data?.totalElements || ipdRes.data?.totalElements || 0 }));
      }
      if (icuRes.ok) {
        setIcuAdmissions(extractArray(icuRes));
        setIcuPagination(prev => ({ ...prev, total: icuRes.data?.data?.totalElements || icuRes.data?.totalElements || 0 }));
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({ title: 'Error', description: 'Failed to sync dashboard data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [opdPagination.page, ipdPagination.page, icuPagination.page]);

  const handleRecordVitals = async () => {
    if (!selectedPatient) return;
    try {
      let res;
      if (isEditing && selectedVital?.id) {
        // Use generic clinical update API for both OPD and IPD when editing
        const payload = {
          patientId: selectedPatient.patient?.id || selectedPatient.patientId,
          weight: parseFloat(vitalsForm.weight),
          height: parseFloat(vitalsForm.height),
          bloodPressure: vitalsForm.bloodPressure,
          temperature: parseFloat(vitalsForm.temperature),
          pulseRate: parseInt(vitalsForm.pulseRate),
          spo2: parseInt(vitalsForm.spo2),
          remark: vitalsForm.remark,
          recordedAt: new Date().toISOString()
        };
        res = await updateVisitVitals(selectedVital.id, payload);
      } else {
        // Record New Vitals
        if (activeTab === 'opd') {
          const payload = {
            weight: vitalsForm.weight,
            height: vitalsForm.height,
            bp: vitalsForm.bloodPressure,
            temp: vitalsForm.temperature,
            pulse: vitalsForm.pulseRate,
            resp: '', 
            spo2: vitalsForm.spo2
          };
          res = await postApiV1OpdVitalsByopdVisitId(selectedPatient.id, payload);
        } else {
          // For IPD, use generic clinical vitals record
          res = await postApiV1ClinicalVitals({
            ...vitalsForm,
            patientId: selectedPatient.patient?.id || selectedPatient.patientId,
            admissionId: selectedPatient.id,
            recordedAt: new Date().toISOString()
          });
        }
      }

      if (res.ok) {
        toast({ title: 'Success', description: `Vitals ${isEditing ? 'updated' : 'recorded'} successfully` });
        setShowVitalsModal(false);
        setIsEditing(false);
        fetchData();
      } else {
        toast({ title: 'Error', description: res.data?.message || `Failed to ${isEditing ? 'update' : 'record'} vitals`, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'An unexpected error occurred', variant: 'destructive' });
    }
  };

  const handleEditVitals = async (patient: any) => {
    setSelectedPatient(patient);
    setLoading(true);
    try {
      // To edit, we need the specific vital record ID
      // Fetch history for the patient to find the latest vital record
      const patientId = patient.patient?.id || patient.patientId;
      const res = await getApiV1ClinicalVitalsHistory({ patientId });
      
      if (res.ok) {
        const history = extractArray(res);
        if (history.length > 0) {
          const latest = history[0];
          setSelectedVital(latest);
          setVitalsForm({
            weight: latest.weight?.toString() || '',
            height: latest.height?.toString() || '',
            bloodPressure: (latest.bloodPressure || latest.bp || '').toString(),
            temperature: (latest.temperature || latest.temp || '').toString(),
            pulseRate: (latest.pulseRate || latest.pulse || '').toString(),
            spo2: (latest.spo2 || '').toString(),
            remark: latest.remark || ''
          });
          setIsEditing(true);
          setShowVitalsModal(true);
        } else {
          // If no history found, but we have data in the visit (for OPD), 
          // we still need to record a new one because we don't have an ID to update
          toast({ title: 'Info', description: 'No previous vitals record found to edit. Switching to record mode.' });
          
          // Pre-fill from visit if available
          if (activeTab === 'opd') {
            const visitRes = await getApiV1OpdByid(patient.id);
            if (visitRes.ok) {
              const data = visitRes.data?.data || visitRes.data;
              setVitalsForm({
                weight: data.weight?.toString() || '',
                height: data.height?.toString() || '',
                bloodPressure: (data.bloodPressure || data.bp || '').toString(),
                temperature: (data.temperature || data.temp || '').toString(),
                pulseRate: (data.pulseRate || data.pulse || '').toString(),
                spo2: (data.spo2 || '').toString(),
                remark: data.remark || ''
              });
            }
          }
          setIsEditing(false);
          setShowVitalsModal(true);
        }
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch vitals for editing', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewVitals = async (patient: any) => {
    setSelectedPatient(patient);
    setLoading(true);
    try {
      // For a professional view, we fetch the full visit details for OPD
      // but also the clinical history for IPD
      let visitDetails = null;
      if (activeTab === 'opd') {
        const res = await getApiV1OpdByid(patient.id);
        if (res.ok) visitDetails = res.data?.data || res.data;
      }

      const patientId = patient.patient?.id || patient.patientId;
      const historyRes = await getApiV1ClinicalVitalsHistory({ patientId });
      
      if (historyRes.ok) {
        const history = extractArray(historyRes);
        const latestVital = history[0] || {};
        
        // Merge data for a comprehensive view
        setSelectedVital({
          ...visitDetails,
          ...latestVital,
          // Prioritize visit details for patient info if available
          patientName: visitDetails?.patientName || latestVital?.patientName || patient.patientName || patient.patient?.fullName
        });
        setShowViewModal(true);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch vitals details', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!selectedAdmission) return;
    try {
      const { description, status, noteTime } = noteForm;
      const res = await postApiV1ClinicalNursingNote(
        { description, status, noteTime },
        { admissionId: selectedAdmission.id }
      );

      if (res.ok) {
        toast({ title: 'Success', description: 'Nursing note added' });
        setShowNoteModal(false);
        setNoteForm({ description: '', status: 'NORMAL', noteTime: new Date().toISOString().slice(0, 16) });
      } else {
        toast({ title: 'Error', description: res.data?.message || 'Failed to add note', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'An unexpected error occurred', variant: 'destructive' });
    }
  };

  const handleIcuSubmit = async () => {
    if (!selectedAdmission) return;
    try {
      let res;
      if (icuForm.type === 'monitoring') {
        res = await recordIcuMonitoring(selectedAdmission.id, {
          ventilatorMode: icuForm.ventilatorMode,
          peep: parseFloat(icuForm.peep),
          fio2: parseFloat(icuForm.fio2),
          gcsScore: `${icuForm.gcsE},${icuForm.gcsV},${icuForm.gcsM}`
        });
      } else {
        res = await recordIcuIntakeOutput(selectedAdmission.id, {
          intakeType: icuForm.intakeType,
          intakeAmount: parseFloat(icuForm.intakeAmount),
          outputType: icuForm.outputType,
          outputAmount: parseFloat(icuForm.outputAmount)
        });
      }

      if (res.ok) {
        toast({ title: 'Success', description: 'ICU record saved' });
        setShowIcuModal(false);
      } else {
        toast({ title: 'Error', description: res.data?.message || 'Failed to save ICU record', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'An unexpected error occurred', variant: 'destructive' });
    }
  };

  const fetchHistory = async (patientId: any) => {
    try {
      const res = await getApiV1ClinicalVitalsHistory({ patientId });
      if (res.ok) {
        setVitalsHistory(extractArray(res));
        setShowHistoryModal(true);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch history', variant: 'destructive' });
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3 overflow-y-auto pb-6">
      <div className="flex items-center justify-between bg-card border border-border p-2 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <Activity size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">Nurse Care Dashboard</h1>
            <p className="text-[10px] text-muted-foreground">Real-time Patient Monitoring & Triage</p>
          </div>
        </div>
        <button onClick={fetchData} className="hms-btn-secondary p-1.5 rounded-full">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md bg-muted/50 p-1">
          <TabsTrigger value="opd" className="text-[10px] font-bold uppercase tracking-wider">
            <Users size={12} className="mr-1" /> OPD Queue
          </TabsTrigger>
          <TabsTrigger value="ipd" className="text-[10px] font-bold uppercase tracking-wider">
            <BedDouble size={12} className="mr-1" /> IPD Care
          </TabsTrigger>
          <TabsTrigger value="icu" className="text-[10px] font-bold uppercase tracking-wider">
            <AlertCircle size={12} className="mr-1" /> ICU Module
          </TabsTrigger>
        </TabsList>

        {/* OPD Queue */}
        <TabsContent value="opd" className="mt-3">
          <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
            <div className="hms-section-header flex items-center justify-between">
              <span className="font-semibold">Waiting Patients (Triage)</span>
              <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">{opdQueue.length} Pending</span>
            </div>
            <div className="overflow-x-auto">
              <table className="hms-table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Patient Name</th>
                    <th>UHID</th>
                    <th>Wait Time</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {opdQueue.map((p) => (
                    <tr key={p.id}>
                      <td className="font-bold text-primary">#{p.tokenNumber}</td>
                      <td className="font-medium">{p.patientName}</td>
                      <td className="text-[10px] font-mono">{p.patientId?.uhid || 'N/A'}</td>
                      <td className="text-muted-foreground">{p.waitTime || '5 mins'}</td>
                      <td>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-yellow-100 text-yellow-700 uppercase">
                          {p.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => { setSelectedPatient(p); setIsEditing(false); setVitalsForm({weight:'',height:'',bloodPressure:'',temperature:'',pulseRate:'',spo2:'',remark:''}); setShowVitalsModal(true); }}
                            className="hms-btn-primary p-1 flex items-center gap-1 text-[9px]"
                            title="Record New Vitals"
                          >
                            <Plus size={10} /> Record
                          </button>
                          <button 
                            onClick={() => handleEditVitals(p)}
                            className="hms-btn-primary p-1 flex items-center gap-1 text-[9px] bg-amber-600 hover:bg-amber-700"
                            title="Edit Latest Vitals"
                          >
                            <Edit size={10} /> Edit
                          </button>
                          <button 
                            onClick={() => handleViewVitals(p)}
                            className="hms-btn-secondary p-1 flex items-center gap-1 text-[9px]"
                            title="View Vitals"
                          >
                            <Eye size={10} /> View
                          </button>
                          <button 
                            onClick={() => fetchHistory(p.patientId?.id || p.patientId)}
                            className="hms-btn-secondary p-1 flex items-center gap-1 text-[9px]"
                            title="Vitals Trends"
                          >
                            <TrendingUp size={10} /> Trends
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {opdQueue.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-10 text-muted-foreground italic text-xs">No patients waiting in queue</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {opdPagination.total > 0 && (
              <div className="p-2 border-t border-border flex items-center justify-between bg-muted/20">
                <span className="text-[10px] text-muted-foreground font-bold uppercase">Total: {opdPagination.total}</span>
                <div className="flex items-center gap-2">
                  <button 
                    disabled={opdPagination.page === 0}
                    onClick={() => setOpdPagination(p => ({ ...p, page: p.page - 1 }))}
                    className="p-1 hover:bg-muted disabled:opacity-30 rounded transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-[10px] font-bold">Page {opdPagination.page + 1}</span>
                  <button 
                    disabled={(opdPagination.page + 1) * opdPagination.size >= opdPagination.total}
                    onClick={() => setOpdPagination(p => ({ ...p, page: p.page + 1 }))}
                    className="p-1 hover:bg-muted disabled:opacity-30 rounded transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* IPD Care */}
        <TabsContent value="ipd" className="mt-3">
          <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
            <div className="hms-section-header flex items-center justify-between">
              <span className="font-semibold">Admitted Patients Monitoring</span>
              <span className="text-[10px] bg-hms-success/20 text-hms-success-foreground px-2 py-0.5 rounded-full font-bold">{ipdAdmissions.length} Admitted</span>
            </div>
            <div className="overflow-x-auto">
              <table className="hms-table">
                <thead>
                  <tr>
                    <th>Bed</th>
                    <th>Patient Details</th>
                    <th>Diagnosis</th>
                    <th>Attending Doctor</th>
                    <th className="text-right">Care Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ipdAdmissions.map((a) => (
                    <tr key={a.id}>
                      <td className="font-bold text-primary text-sm">{a.bed?.bedNumber || 'B-101'}</td>
                      <td>
                        <div className="font-medium">{a.patient?.fullName || a.patientName}</div>
                        <div className="text-[9px] text-muted-foreground font-mono">{a.patient?.uhid}</div>
                      </td>
                      <td className="text-xs">{a.diagnosis || 'General Observation'}</td>
                      <td className="text-xs">{a.primaryDoctor?.user?.fullName || 'Dr. Sameer Khanna'}</td>
                      <td className="text-right">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => { setSelectedAdmission(a); setShowNoteModal(true); }}
                            className="hms-btn-primary p-1 flex items-center gap-1 text-[9px]"
                            title="Add Nursing Note"
                          >
                            <FileText size={10} /> Note
                          </button>
                          <button 
                            onClick={() => { setSelectedPatient(a); setIsEditing(false); setVitalsForm({weight:'',height:'',bloodPressure:'',temperature:'',pulseRate:'',spo2:'',remark:''}); setShowVitalsModal(true); }}
                            className="hms-btn-primary p-1 flex items-center gap-1 text-[9px] bg-blue-600 hover:bg-blue-700"
                            title="Record New Vitals"
                          >
                            <Plus size={10} /> Record
                          </button>
                          <button 
                            onClick={() => handleEditVitals(a)}
                            className="hms-btn-primary p-1 flex items-center gap-1 text-[9px] bg-amber-600 hover:bg-amber-700"
                            title="Edit Latest Vitals"
                          >
                            <Edit size={10} /> Edit
                          </button>
                          <button 
                            onClick={() => handleViewVitals(a)}
                            className="hms-btn-secondary p-1 flex items-center gap-1 text-[9px]"
                            title="View Vitals"
                          >
                            <Eye size={10} /> View
                          </button>
                          <button 
                            onClick={() => fetchHistory(a.patient?.id || a.patientId)}
                            className="hms-btn-secondary p-1 flex items-center gap-1 text-[9px]"
                            title="Vitals Trends"
                          >
                            <TrendingUp size={10} /> Trends
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {ipdAdmissions.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-10 text-muted-foreground italic text-xs">No admitted patients in your assigned ward</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {ipdPagination.total > 0 && (
              <div className="p-2 border-t border-border flex items-center justify-between bg-muted/20">
                <span className="text-[10px] text-muted-foreground font-bold uppercase">Total: {ipdPagination.total}</span>
                <div className="flex items-center gap-2">
                  <button 
                    disabled={ipdPagination.page === 0}
                    onClick={() => setIpdPagination(p => ({ ...p, page: p.page - 1 }))}
                    className="p-1 hover:bg-muted disabled:opacity-30 rounded transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-[10px] font-bold">Page {ipdPagination.page + 1}</span>
                  <button 
                    disabled={(ipdPagination.page + 1) * ipdPagination.size >= ipdPagination.total}
                    onClick={() => setIpdPagination(p => ({ ...p, page: p.page + 1 }))}
                    className="p-1 hover:bg-muted disabled:opacity-30 rounded transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ICU Module */}
        <TabsContent value="icu" className="mt-3">
          <div className="bg-card border border-border rounded shadow-sm overflow-hidden">
            <div className="hms-section-header flex items-center justify-between bg-destructive/10 text-destructive border-b border-destructive/20">
              <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5"><AlertCircle size={12} /> Critical Care Monitoring</span>
              <span className="text-[10px] bg-destructive text-white px-2 py-0.5 rounded-full font-bold">{icuAdmissions.length} Critical</span>
            </div>
            <div className="overflow-x-auto">
              <table className="hms-table">
                <thead>
                  <tr>
                    <th>Bed</th>
                    <th>Critical Patient</th>
                    <th>SpO2</th>
                    <th>Support</th>
                    <th className="text-right">Update Chart</th>
                  </tr>
                </thead>
                <tbody>
                  {icuAdmissions.map((a) => (
                    <tr key={a.id} className="bg-destructive/[0.02]">
                      <td className="font-bold text-destructive">{a.icuAdmission?.bed?.bedNumber || a.bed?.bedNumber}</td>
                      <td>
                        <div className="font-bold">{a.patient?.fullName}</div>
                        <div className="text-[9px] text-muted-foreground font-mono">{a.patient?.uhid}</div>
                      </td>
                      <td>
                        <span className={`text-sm font-bold ${parseInt(a.latestMonitoring?.spo2) < 90 ? 'text-destructive animate-pulse' : 'text-hms-success'}`}>
                          {a.latestMonitoring?.spo2 || '--'}%
                        </span>
                      </td>
                      <td className="text-[10px] uppercase font-bold text-muted-foreground">{a.latestMonitoring?.ventilatorMode || 'Oxygen Mask'}</td>
                      <td className="text-right">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => { setSelectedAdmission(a); setIcuForm({...icuForm, type: 'monitoring'}); setShowIcuModal(true); }}
                            className="hms-btn-primary p-1 flex items-center gap-1 text-[9px] bg-slate-800"
                          >
                            <Activity size={10} /> Charting
                          </button>
                          <button 
                            onClick={() => { setSelectedAdmission(a); setIcuForm({...icuForm, type: 'intake-output'}); setShowIcuModal(true); }}
                            className="hms-btn-secondary p-1 flex items-center gap-1 text-[9px] text-rose-600"
                          >
                            <Droplets size={10} /> I/O Chart
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {icuAdmissions.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-10 text-muted-foreground italic text-xs">No active ICU admissions</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {icuPagination.total > 0 && (
              <div className="p-2 border-t border-border flex items-center justify-between bg-muted/20">
                <span className="text-[10px] text-muted-foreground font-bold uppercase">Total: {icuPagination.total}</span>
                <div className="flex items-center gap-2">
                  <button 
                    disabled={icuPagination.page === 0}
                    onClick={() => setIcuPagination(p => ({ ...p, page: p.page - 1 }))}
                    className="p-1 hover:bg-muted disabled:opacity-30 rounded transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-[10px] font-bold">Page {icuPagination.page + 1}</span>
                  <button 
                    disabled={(icuPagination.page + 1) * icuPagination.size >= icuPagination.total}
                    onClick={() => setIcuPagination(p => ({ ...p, page: p.page + 1 }))}
                    className="p-1 hover:bg-muted disabled:opacity-30 rounded transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Record/Edit Vitals Modal */}
      <Dialog open={showVitalsModal} onOpenChange={setShowVitalsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <Activity className="text-primary" size={16} /> {isEditing ? 'Edit' : 'Record'} Vitals: {selectedPatient?.patientName || selectedPatient?.patient?.fullName}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Weight (kg)</Label>
              <Input type="number" value={vitalsForm.weight} onChange={e => setVitalsForm({...vitalsForm, weight: e.target.value})} placeholder="70.5" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Height (cm)</Label>
              <Input type="number" value={vitalsForm.height} onChange={e => setVitalsForm({...vitalsForm, height: e.target.value})} placeholder="170" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">BP (SYS/DIA)</Label>
              <Input value={vitalsForm.bloodPressure} onChange={e => setVitalsForm({...vitalsForm, bloodPressure: e.target.value})} placeholder="120/80" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Temp (°F)</Label>
              <Input type="number" value={vitalsForm.temperature} onChange={e => setVitalsForm({...vitalsForm, temperature: e.target.value})} placeholder="98.6" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Pulse (bpm)</Label>
              <Input type="number" value={vitalsForm.pulseRate} onChange={e => setVitalsForm({...vitalsForm, pulseRate: e.target.value})} placeholder="72" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">SpO2 (%)</Label>
              <Input type="number" value={vitalsForm.spo2} onChange={e => setVitalsForm({...vitalsForm, spo2: e.target.value})} placeholder="98" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Nurse Remarks</Label>
              <Input value={vitalsForm.remark} onChange={e => setVitalsForm({...vitalsForm, remark: e.target.value})} placeholder="Patient stable..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVitalsModal(false)} className="text-[10px] h-8">Cancel</Button>
            <Button onClick={handleRecordVitals} className="text-[10px] h-8 hms-btn-primary">
              {isEditing ? 'Update Vitals' : 'Save Vitals'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Vitals Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-primary">
              <ClipboardList size={20} /> Professional Patient Encounter Summary
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-6">
            {/* Section 1: Patient Information */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-1.5 border-b pb-1">
                <User size={12} /> Patient Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-3 rounded-lg border border-border">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground block">Full Name</span>
                  <span className="text-sm font-semibold">{selectedVital?.patientName || "N/A"}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground block">UHID / Patient ID</span>
                  <span className="text-sm font-mono font-bold text-primary">{selectedVital?.patient?.uhid || `PID-${selectedVital?.patientId}` || "N/A"}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground block">Gender / Age</span>
                  <span className="text-sm font-semibold">{selectedVital?.patient?.gender || "N/A"} / {selectedVital?.patient?.dateOfBirth ? `${new Date().getFullYear() - new Date(selectedVital.patient.dateOfBirth).getFullYear()} Yrs` : "N/A"}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground block">Blood Group</span>
                  <span className="text-sm font-bold text-red-600">{selectedVital?.patient?.bloodGroup || "N/A"}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground block">Contact Number</span>
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <Phone size={10} className="text-muted-foreground" />
                    {selectedVital?.patient?.phoneNumber || "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground block">Email Address</span>
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <Mail size={10} className="text-muted-foreground" />
                    {selectedVital?.patient?.email || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Visit & Consultation Details */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-1.5 border-b pb-1">
                <Stethoscope size={12} /> Visit & Consultation Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border border-border rounded-lg">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground block">Token Number</span>
                  <span className="text-sm font-bold text-hms-info px-2 py-0.5 bg-hms-info/10 rounded">{selectedVital?.tokenNumber || "N/A"}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground block">Consulting Doctor</span>
                  <span className="text-sm font-semibold flex items-center gap-1">
                    <User size={10} className="text-primary" /> {selectedVital?.doctorName || "N/A"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground block">Department</span>
                  <span className="text-sm font-semibold flex items-center gap-1">
                    <Building size={10} className="text-primary" /> {selectedVital?.departmentName || "N/A"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground block">Visit Type / Slot</span>
                  <span className="text-sm font-semibold capitalize">{selectedVital?.visitType?.toLowerCase() || "OPD"} / {selectedVital?.slot?.toLowerCase() || "Morning"}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground block">Encounter Time</span>
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    <Calendar size={10} className="text-muted-foreground" />
                    {selectedVital?.visitTime ? new Date(selectedVital.visitTime).toLocaleString() : "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground block">Current Status</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedVital?.status === 'CALLED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedVital?.status || "WAITING"}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Clinical Vitals */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold uppercase text-muted-foreground flex items-center gap-1.5 border-b pb-1">
                <Activity size={12} /> Clinical Vitals Data
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex flex-col items-center justify-center p-2 bg-background rounded border border-border shadow-sm">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Weight</span>
                  <span className="text-lg font-bold text-primary">{selectedVital?.weight || '--'} <small className="text-[10px] text-muted-foreground">kg</small></span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-background rounded border border-border shadow-sm">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Height</span>
                  <span className="text-lg font-bold text-primary">{selectedVital?.height || '--'} <small className="text-[10px] text-muted-foreground">cm</small></span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-background rounded border border-border shadow-sm">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Blood Pressure</span>
                  <span className="text-lg font-bold text-primary">{(selectedVital?.bloodPressure || selectedVital?.bp) || '--'} <small className="text-[10px] text-muted-foreground">mmHg</small></span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-background rounded border border-border shadow-sm">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Temperature</span>
                  <span className="text-lg font-bold text-primary">{(selectedVital?.temperature || selectedVital?.temp) || '--'} <small className="text-[10px] text-muted-foreground">°F</small></span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-background rounded border border-border shadow-sm">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Pulse Rate</span>
                  <span className="text-lg font-bold text-primary">{(selectedVital?.pulseRate || selectedVital?.pulse) || '--'} <small className="text-[10px] text-muted-foreground">bpm</small></span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-background rounded border border-border shadow-sm">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Resp. Rate</span>
                  <span className="text-lg font-bold text-primary">{selectedVital?.respiratoryRate || '--'} <small className="text-[10px] text-muted-foreground">/min</small></span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-background rounded border border-border shadow-sm">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">SpO2</span>
                  <span className="text-lg font-bold text-primary">{selectedVital?.spo2 || '--'} <small className="text-[10px] text-muted-foreground">%</small></span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-background rounded border border-border shadow-sm">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">BMI Status</span>
                  <span className="text-sm font-bold text-green-600">Normal</span>
                </div>
              </div>
            </div>

            {/* Section 4: Remarks */}
            <div className="bg-muted/50 p-3 rounded-lg border border-dashed border-border">
              <div className="flex items-center gap-1.5 mb-1">
                <Info size={12} className="text-primary" />
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Clinical Remarks / Notes</span>
              </div>
              <p className="text-sm italic text-foreground leading-relaxed">
                {selectedVital?.remark || selectedVital?.notes || "No clinical remarks or additional notes were provided during this encounter."}
              </p>
            </div>
          </div>

          <DialogFooter className="border-t pt-3">
            <div className="flex justify-between items-center w-full">
              <span className="text-[9px] text-muted-foreground font-mono italic">
                Data extracted at: {new Date().toLocaleString()}
              </span>
              <Button onClick={() => setShowViewModal(false)} className="hms-btn-primary px-8">Close Details</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Nursing Note Modal */}
      <Dialog open={showNoteModal} onOpenChange={setShowNoteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <FileText className="text-primary" size={16} /> Nursing Observation Note
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Observation / Description</Label>
              <textarea 
                className="hms-input min-h-[100px] w-full resize-none"
                value={noteForm.description}
                onChange={e => setNoteForm({...noteForm, description: e.target.value})}
                placeholder="Enter patient observations, medications administered..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Status</Label>
                <select 
                  className="hms-select w-full"
                  value={noteForm.status}
                  onChange={e => setNoteForm({...noteForm, status: e.target.value})}
                >
                  <option value="NORMAL">NORMAL</option>
                  <option value="URGENT">URGENT</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Note Time</Label>
                <Input type="datetime-local" value={noteForm.noteTime} onChange={e => setNoteForm({...noteForm, noteTime: e.target.value})} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteModal(false)} className="text-[10px] h-8">Cancel</Button>
            <Button onClick={handleAddNote} className="text-[10px] h-8 hms-btn-primary">Add Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ICU Monitoring/IO Modal */}
      <Dialog open={showIcuModal} onOpenChange={setShowIcuModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              {icuForm.type === 'monitoring' ? <Activity size={16} /> : <Droplets size={16} />}
              ICU Charting: {selectedAdmission?.patient?.fullName}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs value={icuForm.type} onValueChange={(v) => setIcuForm({...icuForm, type: v as any})} className="w-full">
            <TabsList className="grid grid-cols-2 w-full bg-muted/50 p-1 mb-4">
              <TabsTrigger value="monitoring" className="text-[10px] font-bold uppercase tracking-wider">Critical Monitoring</TabsTrigger>
              <TabsTrigger value="intake-output" className="text-[10px] font-bold uppercase tracking-wider">Fluid Balance (I/O)</TabsTrigger>
            </TabsList>

            <TabsContent value="monitoring" className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Vent Mode</Label>
                  <Input value={icuForm.ventilatorMode} onChange={e => setIcuForm({...icuForm, ventilatorMode: e.target.value})} placeholder="CPAP" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">PEEP</Label>
                  <Input type="number" value={icuForm.peep} onChange={e => setIcuForm({...icuForm, peep: e.target.value})} placeholder="5" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">FiO2 (%)</Label>
                  <Input type="number" value={icuForm.fio2} onChange={e => setIcuForm({...icuForm, fio2: e.target.value})} placeholder="40" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">GCS Score (E, V, M)</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Input type="number" max="4" value={icuForm.gcsE} onChange={e => setIcuForm({...icuForm, gcsE: e.target.value})} placeholder="E (1-4)" />
                  <Input type="number" max="5" value={icuForm.gcsV} onChange={e => setIcuForm({...icuForm, gcsV: e.target.value})} placeholder="V (1-5)" />
                  <Input type="number" max="6" value={icuForm.gcsM} onChange={e => setIcuForm({...icuForm, gcsM: e.target.value})} placeholder="M (1-6)" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="intake-output" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3 p-3 bg-blue-50 rounded border border-blue-100">
                  <Label className="text-[10px] uppercase font-bold text-blue-700 flex items-center gap-1"><ArrowUp size={12}/> Intake (ml)</Label>
                  <select className="hms-select w-full" value={icuForm.intakeType} onChange={e => setIcuForm({...icuForm, intakeType: e.target.value})}>
                    <option>IV Fluids</option><option>Oral Feeds</option><option>Blood Products</option>
                  </select>
                  <Input type="number" value={icuForm.intakeAmount} onChange={e => setIcuForm({...icuForm, intakeAmount: e.target.value})} placeholder="Amount ml" />
                </div>
                <div className="space-y-3 p-3 bg-rose-50 rounded border border-rose-100">
                  <Label className="text-[10px] uppercase font-bold text-rose-700 flex items-center gap-1"><ArrowDown size={12}/> Output (ml)</Label>
                  <select className="hms-select w-full" value={icuForm.outputType} onChange={e => setIcuForm({...icuForm, outputType: e.target.value})}>
                    <option>Urine</option><option>Drains</option><option>Vomitus</option><option>Stool</option>
                  </select>
                  <Input type="number" value={icuForm.outputAmount} onChange={e => setIcuForm({...icuForm, outputAmount: e.target.value})} placeholder="Amount ml" />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowIcuModal(false)} className="text-[10px] h-8">Cancel</Button>
            <Button onClick={handleIcuSubmit} className="text-[10px] h-8 hms-btn-primary bg-slate-800">Save ICU Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vitals History Modal */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="text-primary" size={16} /> Vitals Trends & History
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto py-4">
            <table className="hms-table">
              <thead>
                <tr>
                  <th>Date/Time</th>
                  <th>BP</th>
                  <th>Pulse</th>
                  <th>Temp</th>
                  <th>SpO2</th>
                  <th>Resp</th>
                  <th>Weight</th>
                </tr>
              </thead>
              <tbody className="text-[10px]">
                {vitalsHistory.map((h, i) => (
                  <tr key={i}>
                    <td>{new Date(h.recordedAt || h.createdAt).toLocaleString()}</td>
                    <td className="font-mono font-bold">{h.bloodPressure || '--'}</td>
                    <td>{h.pulseRate || '--'} bpm</td>
                    <td>{h.temperature || '--'} °F</td>
                    <td className={`font-bold ${h.spo2 < 94 ? 'text-destructive' : 'text-hms-success'}`}>{h.spo2 || '--'}%</td>
                    <td>{h.respiratoryRate || '--'}</td>
                    <td>{h.weight || '--'} kg</td>
                  </tr>
                ))}
                {vitalsHistory.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-10 text-muted-foreground italic">No historical data available for this patient</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

import { ArrowUp, ArrowDown } from 'lucide-react';

export default NurseDashboard;
