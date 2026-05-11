import React, { useState, useEffect, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  FileText, Printer, X, Plus, Edit, Trash2, Save, Eye, Search, 
  Settings, UserCheck, ShieldCheck, History, Layout, Download,
  CheckCircle, AlertCircle, UserPlus, ChevronRight, RefreshCw,
  ArrowLeftRight
} from 'lucide-react';
import { createCertificateSignature, createCertificateTemplate, createGeneratedCertificate, deleteCertificateSignature, deleteCertificateTemplate, getCertificatesGenerated, getCertificatesTemplates, listCertificateSignatures, listCertificateTemplates, listCertificateTypes, listCertificateVerifications, listDoctors, listGeneratedCertificates, getAutoPatients, updateCertificateSignature, updateCertificateTemplate, verifyCertificate } from "@/api/apiService";

const Certificates = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [issueData, setIssueData] = useState<any>({
    templateId: '',
    patientId: '',
    doctorId: '',
    filledData: {}
  });
  const [verifyId, setVerifyId] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [data, setData] = useState({
    types: [],
    templates: [],
    generated: [],
    patients: [],
    doctors: [],
    signatures: [],
    verifications: []
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [typesRes, templatesRes, generatedRes, patientsRes, doctorsRes, signaturesRes, verificationsRes] = await Promise.all([
        listCertificateTypes(),
        listCertificateTemplates(),
        listGeneratedCertificates(),
        getAutoPatients({ limit: 100 }),
        listDoctors({ limit: 100 }),
        listCertificateSignatures(),
        listCertificateVerifications()
      ]);
      setData({
        types: typesRes.data?.data || typesRes.data || [],
        templates: templatesRes.data?.data || templatesRes.data || [],
        generated: generatedRes.data?.data || generatedRes.data || [],
        patients: patientsRes.data?.data || patientsRes.data || [],
        doctors: doctorsRes.data?.data || doctorsRes.data || [],
        signatures: signaturesRes.data?.data || signaturesRes.data || [],
        verifications: verificationsRes.data?.data || verificationsRes.data || []
      });
    } catch (error) {
      console.error('Error fetching certificate data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const placeholders = useMemo(() => {
    if (activeTab === 'issue-new' && issueData.templateId) {
      const template = data.templates.find((t: any) => t._id === issueData.templateId);
      if (template) {
        const matches = (template as any).layoutHtml.match(/{{(.*?)}}/g);
        if (matches) {
          return Array.from(new Set(matches.map((m: string) => m.replace(/{{|}}/g, ''))));
        }
      }
    }
    return [];
  }, [issueData.templateId, data.templates, activeTab]);

  const handlePrint = () => {
    const printContent = document.getElementById('certificate-preview');
    if (!printContent) return;
    const win = window.open('', '', 'height=700,width=900');
    if (!win) return;
    win.document.write('<html><head><title>Print Certificate</title>');
    win.document.write('<style>@media print { .no-print { display: none; } body { margin: 0; } .print-area { width: 210mm; min-height: 297mm; padding: 20mm; margin: auto; background: white; } }</style>');
    win.document.write('</head><body>');
    win.document.write(`<div class="print-area">${printContent.innerHTML}</div>`);
    win.document.write('</body></html>');
    win.document.close();
    setTimeout(() => {
      win.print();
      win.close();
    }, 500);
  };

  const handleSaveTemplate = async () => {
    try {
      if (selectedItem._id) {
        await updateCertificateTemplate(selectedItem._id, selectedItem);
        alert('Template updated successfully');
      } else {
        await createCertificateTemplate(selectedItem);
        alert('Template created successfully');
      }
      setActiveTab('templates');
      fetchData();
    } catch (error) {
      alert('Error saving template');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
      await deleteCertificateTemplate(id);
      fetchData();
    } catch (error) {
      alert('Error deleting template');
    }
  };

  const handleSaveSignature = async () => {
    try {
      if (selectedItem._id) {
        await updateCertificateSignature(selectedItem._id, selectedItem);
        alert('Signature updated successfully');
      } else {
        await createCertificateSignature(selectedItem);
        alert('Signature created successfully');
      }
      setActiveTab('signatures');
      fetchData();
    } catch (error) {
      alert('Error saving signature');
    }
  };

  const handleDeleteSignature = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this signature?')) return;
    try {
      await deleteCertificateSignature(id);
      fetchData();
    } catch (error) {
      alert('Error deleting signature');
    }
  };

  const handleVerifyCertificate = async () => {
    if (!verifyId) return;
    setLoading(true);
    try {
      const res = await verifyCertificate({ certificateNumber: verifyId });
      setVerificationResult(res.data || res);
      fetchData();
    } catch (error: any) {
      alert(error.message || 'Verification failed');
      setVerificationResult({ status: 'invalid', message: 'Certificate not found or invalid' });
    } finally {
      setLoading(false);
    }
  };

  const handleIssueCertificate = async () => {
    try {
      if (!issueData.templateId || !issueData.patientId) {
        alert('Please select template and patient');
        return;
      }
      
      const patient: any = data.patients.find((p: any) => p._id === issueData.patientId);
      const doctor: any = data.doctors.find((d: any) => d._id === issueData.doctorId);
      
      const finalFilledData = {
        ...issueData.filledData,
        patientName: patient?.patientName,
        uhid: patient?.uhid,
        age: patient?.age,
        gender: patient?.gender,
        doctorName: doctor?.name,
        issueDate: new Date().toLocaleDateString(),
        certificateNumber: `CERT-${Date.now().toString().slice(-6)}`
      };

      const finalData = {
        templateId: issueData.templateId,
        patientId: issueData.patientId,
        doctorId: issueData.doctorId,
        certificateNumber: finalFilledData.certificateNumber,
        status: 'issued',
        filledData: finalFilledData
      };

      await createGeneratedCertificate(finalData);
      alert('Certificate issued successfully');
      setActiveTab('generated');
      fetchData();
    } catch (error) {
      alert('Error issuing certificate');
    }
  };

  const renderTemplates = () => (
    <div className="grid grid-cols-3 gap-3">
      {data.templates.map((template: any) => (
        <div key={template._id} className="bg-card border border-border p-4 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => { setSelectedItem(template); setActiveTab('preview'); }}>
          <div className="flex justify-between items-start mb-2">
            <div className="bg-primary/10 p-2 rounded">
              <FileText className="text-primary" size={20} />
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1 hover:bg-muted rounded text-primary" onClick={(e) => { e.stopPropagation(); setSelectedItem(template); setActiveTab('editor'); }}><Edit size={14} /></button>
              <button className="p-1 hover:bg-muted rounded text-destructive" onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(template._id); }}><Trash2 size={14} /></button>
            </div>
          </div>
          <h3 className="text-sm font-bold truncate">{template.templateName}</h3>
          <p className="text-[10px] text-muted-foreground mt-1">Category: {template.category}</p>
          <div className="flex justify-between items-center mt-3">
            <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded uppercase font-bold">{template.pageSize} | {template.orientation}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${template.isActive ? 'bg-hms-success text-white' : 'bg-destructive text-white'}`}>
              {template.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      ))}
      <div 
        className="border-2 border-dashed border-border p-4 flex flex-col items-center justify-center min-h-[120px] hover:bg-muted cursor-pointer transition-colors rounded-lg"
        onClick={() => { setSelectedItem({ templateName: '', category: 'General', layoutHtml: '', pageSize: 'A4', orientation: 'portrait', isActive: true }); setActiveTab('editor'); }}
      >
        <Plus className="text-muted-foreground mb-2" />
        <span className="text-xs font-semibold text-muted-foreground">Create New Template</span>
      </div>
    </div>
  );

  const renderGenerated = () => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-xs font-bold uppercase text-muted-foreground">Issued Certificates History</h2>
        <div className="flex gap-2">
          <button className="hms-btn-secondary flex items-center gap-1" onClick={fetchData}><RefreshCw size={12} /> Refresh</button>
          <button className="hms-btn-success flex items-center gap-1" onClick={() => { setIssueData({ templateId: '', patientId: '', doctorId: '', filledData: {} }); setActiveTab('issue-new'); }}><UserPlus size={14} /> Issue New Certificate</button>
        </div>
      </div>
      <div className="bg-card border border-border overflow-hidden">
        <table className="hms-table">
          <thead>
            <tr>
              <th>Certificate No</th>
              <th>Type / Template</th>
              <th>Patient</th>
              <th>UHID</th>
              <th>Doctor</th>
              <th>Issue Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.generated.map((cert: any) => (
              <tr key={cert._id}>
                <td className="font-mono font-bold text-primary">{cert.certificateNumber}</td>
                <td>{cert.certificateTypeId?.name || cert.templateId?.templateName}</td>
                <td className="font-semibold">{cert.patientId?.patientName}</td>
                <td className="text-[10px]">{cert.patientId?.uhid}</td>
                <td>{cert.doctorId?.name || 'Medical Officer'}</td>
                <td>{new Date(cert.issueDate).toLocaleDateString()}</td>
                <td>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                    cert.status === 'issued' ? 'bg-hms-success text-white' : 
                    cert.status === 'draft' ? 'bg-hms-warning text-white' : 'bg-destructive text-white'
                  }`}>
                    {cert.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="text-primary hover:bg-primary/10 p-1 rounded" title="View/Print" onClick={() => { setSelectedItem(cert); setActiveTab('view-generated'); }}><Printer size={14} /></button>
                    <button className="text-muted-foreground hover:bg-muted p-1 rounded" title="Download PDF"><Download size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {data.generated.length === 0 && (
              <tr><td colSpan={8} className="text-center py-10 text-muted-foreground italic">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSignatures = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xs font-bold uppercase text-muted-foreground">Digital Signatures & Stamps</h2>
        <button 
          className="hms-btn-success flex items-center gap-1"
          onClick={() => { setSelectedItem({ name: '', designation: '', signatureImage: '', department: '', isActive: true }); setActiveTab('signature-editor'); }}
        >
          <Plus size={14} /> Add Signature
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {data.signatures.map((sig: any) => (
          <div key={sig._id} className="bg-card border border-border p-4 flex flex-col items-center group relative">
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1 hover:bg-muted rounded text-primary" onClick={() => { setSelectedItem(sig); setActiveTab('signature-editor'); }}><Edit size={12} /></button>
              <button className="p-1 hover:bg-muted rounded text-destructive" onClick={() => handleDeleteSignature(sig._id)}><Trash2 size={12} /></button>
            </div>
            <div className="w-24 h-16 bg-muted/30 border border-border flex items-center justify-center mb-3 overflow-hidden rounded">
              {sig.signatureImage ? (
                <img src={sig.signatureImage} alt={sig.name} className="max-h-full max-w-full object-contain" />
              ) : (
                <UserCheck size={24} className="text-muted-foreground/30" />
              )}
            </div>
            <h4 className="text-xs font-bold text-center">{sig.name}</h4>
            <p className="text-[9px] text-muted-foreground uppercase">{sig.designation}</p>
            <p className="text-[8px] text-primary mt-1">{sig.department}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSignatureEditor = () => (
    <div className="bg-card border border-border max-w-lg mx-auto p-6 shadow-sm">
      <h3 className="text-sm font-bold mb-4 flex items-center gap-2 border-b border-border pb-2">
        <UserCheck size={16} className="text-primary" /> {selectedItem?._id ? 'Edit Signature' : 'New Signature'}
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Full Name</label>
            <input 
              className="hms-input w-full" 
              value={selectedItem?.name} 
              onChange={(e) => setSelectedItem({...selectedItem, name: e.target.value})}
              placeholder="Dr. John Doe"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Designation</label>
            <input 
              className="hms-input w-full" 
              value={selectedItem?.designation} 
              onChange={(e) => setSelectedItem({...selectedItem, designation: e.target.value})}
              placeholder="Senior Medical Officer"
            />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Department</label>
          <input 
            className="hms-input w-full" 
            value={selectedItem?.department} 
            onChange={(e) => setSelectedItem({...selectedItem, department: e.target.value})}
            placeholder="Cardiology / General Medicine"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Signature Image URL / Base64</label>
          <textarea 
            className="hms-input w-full h-20 text-[10px]" 
            value={selectedItem?.signatureImage} 
            onChange={(e) => setSelectedItem({...selectedItem, signatureImage: e.target.value})}
            placeholder="Paste image URL or Base64 string here..."
          />
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={selectedItem?.isActive} 
            onChange={(e) => setSelectedItem({...selectedItem, isActive: e.target.checked})}
          />
          <span className="text-xs font-semibold">Active Signature</span>
        </div>
        <div className="flex gap-2 pt-4">
          <button className="hms-btn-secondary flex-1" onClick={() => setActiveTab('signatures')}>Cancel</button>
          <button className="hms-btn-primary flex-1" onClick={handleSaveSignature}>Save Signature</button>
        </div>
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-card border border-border p-8 text-center shadow-sm">
        <ShieldCheck size={48} className="text-primary/20 mx-auto mb-4" />
        <h2 className="text-lg font-bold mb-2">Certificate Verification Portal</h2>
        <p className="text-xs text-muted-foreground mb-6 max-w-md mx-auto">Verify the authenticity of any medical certificate issued by GUC Health Hub using the unique certificate number.</p>
        
        <div className="flex gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              className="hms-input w-full pl-10 py-3 text-sm font-mono" 
              placeholder="Enter Certificate No (e.g., CERT-123456)" 
              value={verifyId}
              onChange={(e) => setVerifyId(e.target.value)}
            />
          </div>
          <button className="hms-btn-primary px-6 flex items-center gap-2" onClick={handleVerifyCertificate}>
            <UserCheck size={16} /> Verify
          </button>
        </div>

        {verificationResult && (
          <div className={`mt-8 p-6 rounded-lg border-2 ${
            verificationResult.status === 'valid' ? 'bg-hms-success/5 border-hms-success/20' : 'bg-destructive/5 border-destructive/20'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-4">
              {verificationResult.status === 'valid' ? (
                <CheckCircle size={24} className="text-hms-success" />
              ) : (
                <AlertCircle size={24} className="text-destructive" />
              )}
              <h3 className="text-md font-bold uppercase">
                {verificationResult.status === 'valid' ? 'Authentic Certificate' : 'Invalid Certificate'}
              </h3>
            </div>
            
            {verificationResult.status === 'valid' ? (
              <div className="grid grid-cols-2 gap-4 text-left max-w-md mx-auto">
                <div>
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">Patient Name</span>
                  <p className="text-sm font-semibold">{verificationResult.certificate?.patientId?.patientName}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">Issue Date</span>
                  <p className="text-sm font-semibold">{new Date(verificationResult.certificate?.issueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">Doctor</span>
                  <p className="text-sm font-semibold">{verificationResult.certificate?.doctorId?.name}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">Template</span>
                  <p className="text-sm font-semibold">{verificationResult.certificate?.templateId?.templateName}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-destructive font-semibold">The certificate number provided does not match any records in our database.</p>
            )}
          </div>
        )}
      </div>

      <div className="bg-card border border-border">
        <div className="p-3 border-b border-border bg-muted/20 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
            <History size={14} /> Recent Verification Audits
          </h3>
        </div>
        <table className="hms-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>IP Address</th>
              <th>Certificate No</th>
              <th>Status</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {data.verifications.map((v: any) => (
              <tr key={v._id}>
                <td className="text-[10px]">{new Date(v.verificationTimestamp).toLocaleString()}</td>
                <td className="font-mono text-[10px]">{v.ipAddress || '127.0.0.1'}</td>
                <td className="font-bold text-primary">{v.certificateNumber}</td>
                <td>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                    v.status === 'valid' ? 'bg-hms-success text-white' : 'bg-destructive text-white'
                  }`}>
                    {v.status}
                  </span>
                </td>
                <td className="text-[10px]">{v.location || 'Cloud Server'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEditor = () => (
    <div className="bg-card border border-border flex flex-col h-[700px]">
      <div className="p-3 border-b border-border flex justify-between items-center bg-muted/30">
        <div className="flex items-center gap-2">
          <Layout size={16} className="text-primary" />
          <h3 className="text-sm font-bold">{selectedItem?._id ? 'Edit Template' : 'New Template'}</h3>
        </div>
        <div className="flex gap-2">
          <button className="hms-btn-secondary flex items-center gap-1" onClick={() => setActiveTab('templates')}><X size={12} /> Cancel</button>
          <button className="hms-btn-success flex items-center gap-1" onClick={handleSaveTemplate}><Save size={12} /> Save Template</button>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 p-4 flex flex-col gap-3 overflow-y-auto border-r border-border">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Template Name</label>
              <input 
                className="hms-input w-full" 
                value={selectedItem?.templateName} 
                onChange={(e) => setSelectedItem({...selectedItem, templateName: e.target.value})}
                placeholder="e.g., Medical Certificate"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Category</label>
              <select 
                className="hms-select w-full"
                value={selectedItem?.category}
                onChange={(e) => setSelectedItem({...selectedItem, category: e.target.value})}
              >
                <option value="Medical">Medical</option>
                <option value="Fitness">Fitness</option>
                <option value="Birth">Birth</option>
                <option value="Death">Death</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>
          <div className="flex-1 flex flex-col min-h-0 quill-container">
            <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">Template Layout (Rich Text Editor)</label>
            <ReactQuill 
              theme="snow"
              value={selectedItem?.layoutHtml}
              onChange={(content) => setSelectedItem({...selectedItem, layoutHtml: content})}
              className="flex-1 bg-white overflow-hidden flex flex-col"
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'align': [] }],
                  ['link', 'image', 'clean'],
                  ['code-block']
                ],
              }}
            />
          </div>
          <div className="bg-primary/5 p-3 rounded border border-primary/10">
            <p className="text-[10px] font-bold text-primary mb-2 flex items-center gap-1"><AlertCircle size={10} /> Dynamic Placeholders</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                '{{patientName}}', '{{uhid}}', '{{age}}', '{{gender}}', 
                '{{diagnosis}}', '{{doctorName}}', '{{issueDate}}', 
                '{{certificateNumber}}', '{{treatment}}', '{{remarks}}'
              ].map(p => (
                <code key={p} className="bg-white px-1.5 py-0.5 border border-border rounded text-[10px] text-primary cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => setSelectedItem({...selectedItem, layoutHtml: selectedItem.layoutHtml + p})}>
                  {p}
                </code>
              ))}
            </div>
            <p className="text-[9px] text-muted-foreground mt-2 italic">* Click a placeholder to insert it into the editor at the end.</p>
          </div>
        </div>
        <div className="w-1/2 p-4 bg-muted/20 overflow-y-auto">
          <label className="text-[10px] font-bold uppercase text-muted-foreground mb-2 block text-center italic">Live Preview (A4 Scale)</label>
          <div className="bg-white shadow-xl border border-border mx-auto p-10 min-h-[297mm] w-full max-w-[210mm] overflow-hidden" 
               dangerouslySetInnerHTML={{ __html: selectedItem?.layoutHtml?.replace(/{{(.*?)}}/g, '<span style="color:blue;background:#eef;padding:0 2px;border-radius:2px;border:1px dashed blue">$1</span>') }} 
          />
        </div>
      </div>
    </div>
  );

  const renderIssueNew = () => (
    <div className="bg-card border border-border p-6 max-w-5xl mx-auto shadow-sm">
      <div className="flex justify-between items-center mb-6 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-full"><UserPlus size={18} className="text-primary" /></div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Issue New Certificate</h3>
            <p className="text-[10px] text-muted-foreground">Select a template and fill required details</p>
          </div>
        </div>
        <button className="p-1 hover:bg-muted rounded-full" onClick={() => setActiveTab('generated')}><X size={18} /></button>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Selections */}
        <div className="col-span-4 space-y-4 border-r border-border pr-6">
          <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">1. Select Template</label>
            <select className="hms-select w-full" value={issueData.templateId} onChange={(e) => setIssueData({...issueData, templateId: e.target.value})}>
              <option value="">-- Choose Template --</option>
              {data.templates.map((t: any) => <option key={t._id} value={t._id}>{t.templateName}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">2. Select Patient</label>
            <select className="hms-select w-full" value={issueData.patientId} onChange={(e) => setIssueData({...issueData, patientId: e.target.value})}>
              <option value="">-- Choose Patient --</option>
              {data.patients.map((p: any) => <option key={p._id} value={p._id}>{p.patientName} ({p.uhid})</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block">3. Assigning Doctor</label>
            <select className="hms-select w-full" value={issueData.doctorId} onChange={(e) => setIssueData({...issueData, doctorId: e.target.value})}>
              <option value="">-- Choose Doctor --</option>
              {data.doctors.map((d: any) => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
          </div>
          
          <div className="pt-4">
            <button 
              className={`hms-btn-primary w-full py-2.5 flex items-center justify-center gap-2 shadow-sm ${(!issueData.templateId || !issueData.patientId) ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleIssueCertificate}
              disabled={!issueData.templateId || !issueData.patientId}
            >
               <CheckCircle size={16} /> Finalize & Issue
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Fields */}
        <div className="col-span-8 space-y-4">
          <h4 className="text-[10px] font-bold uppercase text-primary border-b border-primary/10 pb-1">4. Fill Template Fields</h4>
          {placeholders.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {placeholders.map(key => {
                // Skip auto-filled fields
                if (['patientName', 'uhid', 'age', 'gender', 'doctorName', 'issueDate', 'certificateNumber'].includes(key)) return null;
                return (
                  <div key={key}>
                    <label className="text-[10px] font-bold uppercase text-muted-foreground mb-1 block capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                    <input 
                      className="hms-input w-full"
                      value={issueData.filledData[key] || ''}
                      onChange={(e) => setIssueData({
                        ...issueData, 
                        filledData: { ...issueData.filledData, [key]: e.target.value }
                      })}
                      placeholder={`Enter ${key}...`}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 bg-muted/10 rounded-lg border-2 border-dashed border-border">
               <AlertCircle size={24} className="text-muted-foreground/30 mb-2" />
               <p className="text-xs text-muted-foreground italic">Select a template to view dynamic fields</p>
            </div>
          )}
          
          {issueData.templateId && (
            <div className="mt-6 p-4 bg-primary/5 rounded border border-primary/10">
               <p className="text-[10px] font-bold text-primary mb-2">Live Preview Snippet</p>
               <div className="bg-white p-4 border border-border text-[11px] h-32 overflow-y-auto"
                    dangerouslySetInnerHTML={{ 
                      __html: (data.templates.find((t: any) => t._id === issueData.templateId) as any)?.layoutHtml
                        ?.replace(/{{(.*?)}}/g, (match: string, p1: string) => {
                          return issueData.filledData[p1] || `<span style="color:red">[${p1}]</span>`;
                        })
                    }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="bg-card border border-border p-6">
      <div className="flex justify-between items-center mb-6 no-print">
        <button className="hms-btn-secondary flex items-center gap-1" onClick={() => setActiveTab('templates')}><ArrowLeftRight size={12} /> Back</button>
        <div className="flex gap-2">
          <button className="hms-btn-primary flex items-center gap-1" onClick={handlePrint}><Printer size={12} /> Print Preview</button>
        </div>
      </div>
      <div id="certificate-preview" className="print-area mx-auto bg-white p-12 shadow-sm border border-border" style={{ width: '210mm', minHeight: '297mm' }}>
         <div dangerouslySetInnerHTML={{ __html: selectedItem?.layoutHtml?.replace(/{{(.*?)}}/g, '<span style="border-bottom: 1px dotted #000; min-width: 100px; display: inline-block;">&nbsp;</span>') }} />
      </div>
    </div>
  );

  const renderViewGenerated = () => {
    let html = selectedItem?.templateId?.layoutHtml || '';
    const filledData = selectedItem?.filledData || {};
    Object.keys(filledData).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, filledData[key]);
    });

    return (
      <div className="bg-card border border-border p-6">
        <div className="flex justify-between items-center mb-6 no-print">
          <button className="hms-btn-secondary flex items-center gap-1" onClick={() => setActiveTab('generated')}><ArrowLeftRight size={12} /> Back to List</button>
          <div className="flex gap-2">
            <button className="hms-btn-primary flex items-center gap-1" onClick={handlePrint}><Printer size={12} /> Print Certificate</button>
          </div>
        </div>
        <div id="certificate-preview" className="print-area mx-auto bg-white p-12 shadow-sm border border-border" style={{ width: '210mm', minHeight: '297mm' }}>
           <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} /> Certificate Management
        </div>
        <div className="flex gap-3 text-[10px] font-normal uppercase tracking-wider">
          <span className="flex items-center gap-1"><CheckCircle size={10} className="text-hms-success" /> Templates: {data.templates.length}</span>
          <span className="flex items-center gap-1"><History size={10} className="text-primary" /> Issued: {data.generated.length}</span>
        </div>
      </div>

      <div className="flex items-center gap-0 border-b border-border bg-card overflow-x-auto no-scrollbar">
        {[
          { key: 'templates', label: 'Templates', icon: Layout },
          { key: 'generated', label: 'Generated Records', icon: History },
          { key: 'signatures', label: 'Signatures', icon: UserCheck },
          { key: 'verification', label: 'Verification', icon: ShieldCheck },
          { key: 'settings', label: 'Configuration', icon: Settings }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.key || (activeTab === 'issue-new' && tab.key === 'generated') 
                ? 'border-primary text-primary bg-primary/5' 
                : 'border-transparent text-muted-foreground hover:bg-muted'
            }`}
          >
            <tab.icon size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {loading ? (
          <div className="flex items-center justify-center h-64 flex-col gap-2">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-semibold text-muted-foreground">Loading Module Data...</span>
          </div>
        ) : (
          <>
            {activeTab === 'templates' && renderTemplates()}
            {activeTab === 'generated' && renderGenerated()}
            {activeTab === 'editor' && renderEditor()}
            {activeTab === 'preview' && renderPreview()}
            {activeTab === 'view-generated' && renderViewGenerated()}
            {activeTab === 'issue-new' && renderIssueNew()}
            {activeTab === 'signatures' && renderSignatures()}
            {activeTab === 'signature-editor' && renderSignatureEditor()}
            {activeTab === 'verification' && renderVerification()}
            {activeTab === 'settings' && (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground bg-muted/10 border border-dashed border-border rounded-lg">
                <Settings className="mb-2 opacity-20" size={48} />
                <p className="text-sm font-semibold italic">Configuration submodule interface is coming soon...</p>
                <p className="text-[10px] mt-1">Global settings for certificates (prefixes, auto-increment, etc.)</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Certificates;
