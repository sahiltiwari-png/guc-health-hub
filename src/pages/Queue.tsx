import React from 'react';

const queueData = [
  { sno: 1, token: 'T-001', name: 'Mr. Rajesh Kumar', uhid: 'U-1001', dept: 'General Medicine', doctor: 'Dr. Alok Mehta', status: 'Waiting', waitTime: '15 min' },
  { sno: 2, token: 'T-002', name: 'Mrs. Sunita Devi', uhid: 'U-1002', dept: 'Gynecology', doctor: 'Dr. Priya Singh', status: 'In Progress', waitTime: '5 min' },
  { sno: 3, token: 'T-003', name: 'Mr. Amit Sharma', uhid: 'U-1003', dept: 'Orthopedics', doctor: 'Dr. Rahul Verma', status: 'Waiting', waitTime: '25 min' },
  { sno: 4, token: 'T-004', name: 'Baby Riya', uhid: 'U-1004', dept: 'Pediatrics', doctor: 'Dr. Neha Gupta', status: 'Waiting', waitTime: '30 min' },
  { sno: 5, token: 'T-005', name: 'Mr. Suresh Yadav', uhid: 'U-1005', dept: 'General Medicine', doctor: 'Dr. Alok Mehta', status: 'Completed', waitTime: '-' },
  { sno: 6, token: 'T-006', name: 'Mrs. Geeta Sharma', uhid: 'U-1006', dept: 'Cardiology', doctor: 'Dr. Anil Kumar', status: 'Waiting', waitTime: '10 min' },
];

const Queue = () => (
  <div>
    <div className="hms-section-header">Patient Queue Management</div>
    <div className="bg-card border border-border p-2 mb-2 flex items-center gap-3">
      <label className="hms-form-label">Department:</label>
      <select className="hms-select"><option>All Departments</option><option>General Medicine</option><option>Orthopedics</option><option>Gynecology</option><option>Pediatrics</option><option>Cardiology</option></select>
      <label className="hms-form-label ml-2">Doctor:</label>
      <select className="hms-select"><option>All Doctors</option><option>Dr. Alok Mehta</option><option>Dr. Priya Singh</option></select>
      <button className="hms-btn-primary ml-2">Refresh</button>
    </div>

    <div className="grid grid-cols-4 gap-2 mb-3">
      {[
        { label: 'Total in Queue', value: '34', color: 'bg-primary text-primary-foreground' },
        { label: 'Waiting', value: '28', color: 'bg-hms-warning text-foreground' },
        { label: 'In Progress', value: '4', color: 'bg-hms-info text-primary-foreground' },
        { label: 'Completed', value: '156', color: 'bg-hms-success text-hms-success-foreground' },
      ].map((s, i) => (
        <div key={i} className={`${s.color} px-3 py-2 text-center`}>
          <p className="text-lg font-bold">{s.value}</p>
          <p className="text-xs">{s.label}</p>
        </div>
      ))}
    </div>

    <table className="hms-table">
      <thead>
        <tr><th>S.No.</th><th>Token</th><th>Patient Name</th><th>UHID</th><th>Department</th><th>Doctor</th><th>Status</th><th>Wait Time</th><th>Action</th></tr>
      </thead>
      <tbody>
        {queueData.map(q => (
          <tr key={q.sno}>
            <td>{q.sno}</td><td>{q.token}</td><td>{q.name}</td><td>{q.uhid}</td><td>{q.dept}</td><td>{q.doctor}</td>
            <td><span className={`px-2 py-0.5 text-[10px] font-bold ${q.status === 'Waiting' ? 'bg-hms-warning' : q.status === 'In Progress' ? 'bg-hms-info text-primary-foreground' : 'bg-hms-success text-hms-success-foreground'}`}>{q.status}</span></td>
            <td>{q.waitTime}</td>
            <td>{q.status !== 'Completed' && <button className="hms-btn-primary text-[10px] px-2 py-0.5">Call</button>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Queue;
