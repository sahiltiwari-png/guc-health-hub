import React from 'react';

const BirthReg = () => (
  <div>
    <div className="hms-section-header">Birth Registration</div>
    <div className="bg-card border border-border p-3 space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2"><label className="hms-form-label w-28">Mother Name:</label><input className="hms-input flex-1" /></div>
        <div className="flex items-center gap-2"><label className="hms-form-label w-28">Father Name:</label><input className="hms-input flex-1" /></div>
        <div className="flex items-center gap-2"><label className="hms-form-label w-28">UHID:</label><input className="hms-input flex-1" /></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2"><label className="hms-form-label w-28">Date of Birth:</label><input type="date" className="hms-input flex-1" /></div>
        <div className="flex items-center gap-2"><label className="hms-form-label w-28">Time of Birth:</label><input type="time" className="hms-input flex-1" /></div>
        <div className="flex items-center gap-2"><label className="hms-form-label w-28">Gender:</label><select className="hms-select flex-1"><option>Male</option><option>Female</option></select></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2"><label className="hms-form-label w-28">Weight (kg):</label><input className="hms-input flex-1" /></div>
        <div className="flex items-center gap-2"><label className="hms-form-label w-28">Delivery Type:</label><select className="hms-select flex-1"><option>Normal</option><option>C-Section</option><option>Assisted</option></select></div>
        <div className="flex items-center gap-2"><label className="hms-form-label w-28">Doctor:</label><select className="hms-select flex-1"><option>Dr. Priya Singh</option><option>Dr. Neha Gupta</option></select></div>
      </div>
      <div className="flex items-center gap-2"><label className="hms-form-label w-28">Remarks:</label><textarea className="hms-input flex-1 h-16" /></div>
      <div className="flex justify-end gap-2"><button className="hms-btn-primary">Register</button><button className="hms-btn-secondary">Reset</button></div>
    </div>
  </div>
);

export default BirthReg;
