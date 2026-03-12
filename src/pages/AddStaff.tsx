import React, { useState, useEffect } from 'react';
import { listDepartments, listRoles, registerUser, listUsers } from '../api/apiService';
import { X, User, Mail, Phone, Briefcase, GraduationCap, Lock, Calendar, MapPin, IndianRupee, ShieldCheck } from 'lucide-react';

const AddStaff = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department_id: '',
    qualification: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    joiningDate: '',
    salary: '',
    password: '',
    managerId: '',
  });

  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [managers, setManagers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, roleRes, managerRes] = await Promise.all([
          listDepartments(),
          listRoles(),
          listUsers({ limit: 100 }) // Fetching potential managers
        ]);
        setDepartments(deptRes.data || []);
        setRoles(roleRes.data || []);
        setManagers(managerRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await registerUser(formData);
      onAdd();
    } catch (err: any) {
      setError(err.message || "Failed to add staff");
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields = [
    { name: 'name', placeholder: 'Full Name', icon: User, type: 'text', required: true },
    { name: 'email', placeholder: 'Email Address', icon: Mail, type: 'email', required: true },
    { name: 'phone', placeholder: 'Phone Number', icon: Phone, type: 'text', required: true },
    { name: 'password', placeholder: 'Password', icon: Lock, type: 'password', required: true },
    { name: 'qualification', placeholder: 'Qualification', icon: GraduationCap, type: 'text', required: true },
    { name: 'salary', placeholder: 'Salary', icon: IndianRupee, type: 'number', required: false },
    { name: 'dateOfBirth', placeholder: 'Date of Birth', icon: Calendar, type: 'date', required: false },
    { name: 'joiningDate', placeholder: 'Joining Date', icon: Calendar, type: 'date', required: false },
    { name: 'address', placeholder: 'Complete Address', icon: MapPin, type: 'text', required: false },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-card border border-border w-full max-w-4xl shadow-2xl rounded-sm overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
          <h3 className="text-sm font-bold flex items-center gap-2 text-primary">
            <ShieldCheck size={18} /> Onboard New Staff Member
          </h3>
          <button onClick={onCancel} className="hover:bg-muted p-1 rounded transition-colors"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded text-xs font-bold flex items-center gap-2">
              <XCircle size={14} /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Basic Info */}
            <div className="md:col-span-3">
              <h4 className="text-[10px] font-bold uppercase text-muted-foreground mb-3 tracking-widest border-b border-border pb-1">Personal & Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {inputFields.slice(0, 3).map(f => (
                  <div key={f.name} className="relative">
                    <f.icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input {...f} value={formData[f.name]} onChange={handleChange} className="hms-input pl-9 w-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Role & Department */}
            <div className="md:col-span-3">
              <h4 className="text-[10px] font-bold uppercase text-muted-foreground mb-3 tracking-widest border-b border-border pb-1">Professional Assignment</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                   <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                   <select name="role" value={formData.role} onChange={handleChange} className="hms-select pl-9 w-full" required>
                      <option value="">Select Role</option>
                      {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                   </select>
                </div>
                <div className="relative">
                   <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                   <select name="department_id" value={formData.department_id} onChange={handleChange} className="hms-select pl-9 w-full" required>
                      <option value="">Select Department</option>
                      {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                   </select>
                </div>
                <div className="relative">
                   <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                   <select name="managerId" value={formData.managerId} onChange={handleChange} className="hms-select pl-9 w-full">
                      <option value="">Reports To (Manager)</option>
                      {managers.map(m => <option key={m._id} value={m._id}>{m.name} ({typeof m.role === 'object' ? m.role?.name : m.role})</option>)}
                   </select>
                </div>
                <div className="relative">
                   <ShieldCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                   <select name="gender" value={formData.gender} onChange={handleChange} className="hms-select pl-9 w-full">
                      <option value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                   </select>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="md:col-span-3">
              <h4 className="text-[10px] font-bold uppercase text-muted-foreground mb-3 tracking-widest border-b border-border pb-1">Security & Additional Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {inputFields.slice(3).map(f => (
                  <div key={f.name} className="relative">
                    <f.icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input {...f} value={formData[f.name]} onChange={handleChange} className="hms-input pl-9 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onCancel} className="hms-btn-secondary px-8" disabled={isLoading}>Cancel</button>
            <button type="submit" className="hms-btn-primary px-8 flex items-center gap-2" disabled={isLoading}>
              {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
              {isLoading ? 'Processing...' : 'Complete Onboarding'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const XCircle = ({ size, className }) => <X size={size} className={className} />;

export default AddStaff;
