import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, Printer, Trash2 } from 'lucide-react';

const mockPatients = [
  { sno: 1, opdId: 'OP-7', uhid: 'U-7', name: 'Mr. LOKESH KUMAR', age: '38Y', gender: 'Male', mobile: '7878787878', doctor: 'Dr. ALOK MEHTA', dept: 'GENERAL MEDICINE', mode: 'Cash', date: '15-Jan-2023', time: '04:08 PM' },
  { sno: 2, opdId: 'OP-8', uhid: 'U-8', name: 'Mrs. SUNITA DEVI', age: '45Y', gender: 'Female', mobile: '9876543210', doctor: 'Dr. PRIYA SINGH', dept: 'GYNECOLOGY', mode: 'Cash', date: '15-Jan-2023', time: '04:15 PM' },
  { sno: 3, opdId: 'OP-9', uhid: 'U-9', name: 'Mr. AMIT SHARMA', age: '28Y', gender: 'Male', mobile: '8765432109', doctor: 'Dr. RAHUL VERMA', dept: 'ORTHOPEDICS', mode: 'TPA', date: '15-Jan-2023', time: '04:30 PM' },
  { sno: 4, opdId: 'OP-10', uhid: 'U-10', name: 'Baby RIYA', age: '2Y', gender: 'Female', mobile: '7654321098', doctor: 'Dr. NEHA GUPTA', dept: 'PEDIATRICS', mode: 'Cash', date: '15-Jan-2023', time: '04:45 PM' },
  { sno: 5, opdId: 'OP-11', uhid: 'U-11', name: 'Mr. SURESH YADAV', age: '55Y', gender: 'Male', mobile: '6543210987', doctor: 'Dr. ALOK MEHTA', dept: 'GENERAL MEDICINE', mode: 'Cash', date: '15-Jan-2023', time: '05:00 PM' },
];

const symptoms = ['ABD DISCOMFORT', 'ABDOMINAL DISTENTION', 'ABDOMINAL FULLNESS', 'BACK PAIN', 'CHEST PAIN', 'BURNING PARASTHESIA', 'FEVER', 'HEADACHE', 'COUGH', 'VOMITING'];

const OPD = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'new' | 'vitals'>('list');
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [searchUhid, setSearchUhid] = useState('');
  const [formData, setFormData] = useState({
    symptoms: '',
    pulse: '', spo2: '', sbp: '', dbp: '', map: '', temp: '', resp: '', painScore: '',
    height: '', weight: '', bsa: '', bmi: '',
    diet: '--Select--', appetite: 'Normal', sleep: 'Normal', bladder: 'Normal', bowel: 'Normal',
    currentTreatment: '', comments: '',
  });

  const [medicalHistory, setMedicalHistory] = useState([
    { disease: 'TB [TUBERCULOSIS]', duration: '2 Year(s)', medication: 'GOVT MED' }
  ]);
  const [surgicalHistory, setSurgicalHistory] = useState([
    { name: 'ADENOIDECTOMY', date: '2023-01-15', surgeon: 'DR ABC', hospital: 'XYZ' }
  ]);
  const [addictions, setAddictions] = useState([
    { type: 'TOBACCO', duration: '2 Year(s)', units: '3', frequency: 'Daily', action: 'OnGoing' }
  ]);

  return (
    <div>
      {/* Sub navigation */}
      <div className="flex gap-1 mb-2 border-b border-border pb-1">
        <button onClick={() => setActiveTab('list')} className={`px-3 py-1 text-xs font-semibold ${activeTab === 'list' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
          OPD List
        </button>
        <button onClick={() => setActiveTab('new')} className={`px-3 py-1 text-xs font-semibold ${activeTab === 'new' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
          New OPD
        </button>
        <button onClick={() => setActiveTab('vitals')} className={`px-3 py-1 text-xs font-semibold ${activeTab === 'vitals' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
          Notes & Vitals
        </button>
      </div>

      {activeTab === 'list' && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="hms-form-label">Search:</label>
            <input className="hms-input w-48" placeholder="Search by Name/UHID..." />
            <label className="hms-form-label ml-4">Date:</label>
            <input type="date" className="hms-input" defaultValue="2023-01-15" />
            <button className="hms-btn-primary"><Search size={12} /> Search</button>
          </div>
          <table className="hms-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>UHID</th>
                <th>Source</th>
                <th>Age/Sex</th>
                <th>Doctor</th>
                <th>Edit</th>
                <th>Print</th>
              </tr>
            </thead>
            <tbody>
              {mockPatients.map(p => (
                <tr key={p.sno} className="cursor-pointer" onClick={() => setSelectedPatient(p.sno)}>
                  <td>{p.sno}</td>
                  <td>{p.name}</td>
                  <td>{p.date}</td>
                  <td>{p.time}</td>
                  <td>{p.uhid}</td>
                  <td>OPD ID: {p.opdId}</td>
                  <td>{p.age} / {p.gender}</td>
                  <td>{p.doctor}</td>
                  <td><Edit size={14} className="text-primary cursor-pointer" /></td>
                  <td><Printer size={14} className="text-primary cursor-pointer" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-xs text-muted-foreground mt-1">Showing 1 to {mockPatients.length} of {mockPatients.length} entries</div>
        </div>
      )}

      {activeTab === 'new' && (
        <div>
          <div className="hms-section-header">New OPD Registration</div>
          <div className="bg-card border border-border p-3 space-y-3">
            <div className="grid grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <label className="hms-form-label">UHID:</label>
                <input className="hms-input flex-1" placeholder="Auto / Enter UHID" />
              </div>
              <div className="flex items-center gap-2">
                <label className="hms-form-label">Department:</label>
                <select className="hms-select flex-1">
                  <option>GENERAL MEDICINE</option>
                  <option>ORTHOPEDICS</option>
                  <option>GYNECOLOGY</option>
                  <option>PEDIATRICS</option>
                  <option>CARDIOLOGY</option>
                  <option>DIAGNOSTIC UNIT</option>
                  <option>ENT</option>
                  <option>DERMATOLOGY</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="hms-form-label">Doctor:</label>
                <select className="hms-select flex-1">
                  <option>Dr. ALOK MEHTA</option>
                  <option>Dr. PRIYA SINGH</option>
                  <option>Dr. RAHUL VERMA</option>
                  <option>Dr. NEHA GUPTA</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="hms-form-label">TPA/Panel:</label>
                <select className="hms-select flex-1">
                  <option>--NA--</option>
                  <option>CGHS</option>
                  <option>ECHS</option>
                  <option>Star Health</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <label className="hms-form-label">Patient Name:</label>
                <select className="hms-select w-14"><option>Mr.</option><option>Mrs.</option><option>Ms.</option><option>Baby</option></select>
                <input className="hms-input flex-1" placeholder="Patient Name" />
              </div>
              <div className="flex items-center gap-2">
                <label className="hms-form-label">Mobile:</label>
                <input className="hms-input flex-1" placeholder="Mobile Number" />
              </div>
              <div className="flex items-center gap-2">
                <label className="hms-form-label">Age:</label>
                <input className="hms-input w-12" placeholder="Y" />
                <input className="hms-input w-12" placeholder="M" />
                <input className="hms-input w-12" placeholder="D" />
                <select className="hms-select w-16"><option>Male</option><option>Female</option><option>Other</option></select>
              </div>
              <div className="flex items-center gap-2">
                <label className="hms-form-label">Address:</label>
                <input className="hms-input flex-1" placeholder="Address" />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <label className="hms-form-label">Consultant:</label>
                <select className="hms-select flex-1">
                  <option>ALOK MEHTA</option>
                  <option>PRIYA SINGH</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="hms-form-label">Ref. By:</label>
                <input className="hms-input flex-1" placeholder="SELF" />
              </div>
              <div className="flex items-center gap-2">
                <label className="hms-form-label">S/D/W/o:</label>
                <select className="hms-select w-14"><option>Mr.</option><option>Mrs.</option></select>
                <input className="hms-input flex-1" placeholder="Guardian Name" />
              </div>
              <div className="flex items-center gap-2">
                <label className="hms-form-label">Mode:</label>
                <select className="hms-select flex-1"><option>Cash</option><option>Card</option><option>UPI</option><option>TPA</option></select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button className="hms-btn-primary">Submit</button>
              <button className="hms-btn-secondary">Reset</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'vitals' && (
        <div>
          {/* Patient header */}
          <div className="bg-hms-nav text-hms-nav-foreground px-3 py-1.5 text-xs mb-2">
            Patient Details:- UHID: 7 &nbsp; Name: Mr. LOKESH KUMAR &nbsp; OPD ID: 7
          </div>

          {/* Notes & Vital Summary */}
          <div className="hms-section-header">Notes & Vital Summary</div>
          <div className="bg-card border border-border p-3 mb-3">
            <div className="grid grid-cols-6 gap-2 mb-2">
              {[
                { label: 'Pulse(bpm)', key: 'pulse', val: '65' },
                { label: 'SPO2(%)', key: 'spo2', val: '98' },
                { label: 'SBP(mmHg)', key: 'sbp', val: '120' },
                { label: 'DBP(mmHg)', key: 'dbp', val: '75' },
                { label: 'MAP', key: 'map', val: '90' },
                { label: 'Temp(F)', key: 'temp', val: '99' },
              ].map(v => (
                <div key={v.key} className="flex items-center gap-1">
                  <label className="hms-form-label">{v.label}</label>
                  <input className="hms-input w-16" defaultValue={v.val} />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-6 gap-2">
              {[
                { label: 'Height(cm)', key: 'height' },
                { label: 'Weight(kg)', key: 'weight' },
                { label: 'BSA', key: 'bsa' },
                { label: 'BMI', key: 'bmi' },
                { label: 'Pain Score(1-10)', key: 'painScore' },
                { label: 'Res(bpm)', key: 'resp' },
              ].map(v => (
                <div key={v.key} className="flex items-center gap-1">
                  <label className="hms-form-label">{v.label}</label>
                  <input className="hms-input w-16" placeholder="0" />
                </div>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div className="hms-section-header">Symptoms / Complaints</div>
          <div className="bg-card border border-border p-3 mb-3 flex gap-3">
            <div className="flex-1">
              <textarea className="hms-input w-full h-24" placeholder="Symptoms" defaultValue="BACK PAIN; CHEST PAIN; LEFT SIDE THIGH PAIN&#10;HEAVINES IN RIGHT LOWER LIMB&#10;FEVER" />
            </div>
            <button className="self-start text-primary"><Plus size={20} /></button>
            <div className="w-64">
              <input className="hms-input w-full mb-1" placeholder="Search.." />
              <div className="border border-border h-20 overflow-y-auto text-xs">
                {symptoms.map(s => (
                  <div key={s} className="px-2 py-1 hover:bg-muted cursor-pointer">{s}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Past Medical History */}
          <h3 className="text-sm font-semibold mb-1">Past Medical History</h3>
          <table className="hms-table mb-3">
            <thead>
              <tr>
                <th>Disease <span className="text-destructive cursor-pointer">⊕</span></th>
                <th>Duration</th>
                <th>Medication</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {medicalHistory.map((m, i) => (
                <tr key={i}>
                  <td><input className="hms-input w-full" defaultValue={m.disease} /></td>
                  <td><input className="hms-input w-full" defaultValue={m.duration} /></td>
                  <td><input className="hms-input w-full" defaultValue={m.medication} /></td>
                  <td className="text-center"><Trash2 size={14} className="text-destructive cursor-pointer inline" /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Past Surgical History */}
          <h3 className="text-sm font-semibold mb-1">Past Surgical History</h3>
          <table className="hms-table mb-3">
            <thead>
              <tr>
                <th>Search Name <span className="text-destructive cursor-pointer">⊕</span></th>
                <th>Date</th>
                <th>Surgeon Name</th>
                <th>Hospital</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {surgicalHistory.map((s, i) => (
                <tr key={i}>
                  <td><input className="hms-input w-full" defaultValue={s.name} /></td>
                  <td><input className="hms-input w-full" defaultValue={s.date} /></td>
                  <td><input className="hms-input w-full" defaultValue={s.surgeon} /></td>
                  <td><input className="hms-input w-full" defaultValue={s.hospital} /></td>
                  <td className="text-center"><Trash2 size={14} className="text-destructive cursor-pointer inline" /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Addiction Details */}
          <h3 className="text-sm font-semibold mb-1">Addiction Details</h3>
          <table className="hms-table mb-3">
            <thead>
              <tr>
                <th>Type <span className="text-destructive cursor-pointer">⊕</span></th>
                <th>Duration</th>
                <th>Units</th>
                <th>Frequency</th>
                <th>Action</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {addictions.map((a, i) => (
                <tr key={i}>
                  <td><input className="hms-input w-full" defaultValue={a.type} /></td>
                  <td><input className="hms-input w-full" defaultValue={a.duration} /></td>
                  <td><input className="hms-input w-full" defaultValue={a.units} /></td>
                  <td><select className="hms-select w-full" defaultValue={a.frequency}><option>Daily</option><option>Weekly</option><option>Monthly</option><option>Occasional</option></select></td>
                  <td><select className="hms-select w-full" defaultValue={a.action}><option>OnGoing</option><option>Stopped</option></select></td>
                  <td className="text-center"><Trash2 size={14} className="text-destructive cursor-pointer inline" /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Personal History */}
          <h3 className="text-sm font-semibold mb-1">Personal History</h3>
          <table className="hms-table mb-3">
            <thead>
              <tr><th>Diet</th><th>Appetite</th><th>Sleep</th><th>Bladder</th><th>Bowel</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><select className="hms-select w-full"><option>--Select--</option><option>Non-Vegetarian</option><option>Vegetarian</option><option>Vegan</option></select></td>
                <td><select className="hms-select w-full"><option>Normal</option><option>Reduced</option><option>Increased</option></select></td>
                <td><select className="hms-select w-full"><option>Normal</option><option>Reduced</option><option>Disturbed</option></select></td>
                <td><select className="hms-select w-full"><option>Normal</option><option>Inconsistent</option><option>Frequent</option></select></td>
                <td><select className="hms-select w-full"><option>Normal</option><option>Loose-Motions</option><option>Constipation</option></select></td>
              </tr>
            </tbody>
          </table>

          {/* Current Treatment & Comments */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="hms-form-label">Current Treatment :</label>
              <textarea className="hms-input w-full h-20 mt-1" placeholder="Current Treatment" />
            </div>
            <div>
              <label className="hms-form-label flex items-center gap-1">Comments : <Plus size={14} className="text-primary cursor-pointer" /></label>
              <textarea className="hms-input w-full h-20 mt-1" placeholder="comments" />
            </div>
          </div>

          <div className="flex justify-end">
            <button className="hms-btn-primary px-8 py-2">Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OPD;
