import React from 'react';
import { Building2, Edit } from 'lucide-react';

const branches = [
  { id: 1, name: 'Main Branch - Noida', address: 'IT Tower, H-91, Sector 63, Noida-201301', phone: '9675011122', beds: 120, departments: 12, staff: 85, status: 'Active' },
  { id: 2, name: 'Branch 2 - Delhi', address: 'Lajpat Nagar, New Delhi-110024', phone: '9876543210', beds: 80, departments: 8, staff: 55, status: 'Active' },
  { id: 3, name: 'Branch 3 - Gurgaon', address: 'Sector 14, Gurgaon-122001', phone: '8765432109', beds: 60, departments: 6, staff: 40, status: 'Active' },
  { id: 4, name: 'Branch 4 - Ghaziabad', address: 'Vaishali, Ghaziabad-201010', phone: '7654321098', beds: 50, departments: 5, staff: 30, status: 'Under Setup' },
];

const Branches = () => (
  <div>
    <div className="hms-section-header flex items-center gap-2"><Building2 size={14} /> Branch Management</div>
    <div className="flex mb-2"><button className="hms-btn-primary ml-auto">+ Add Branch</button></div>
    <table className="hms-table">
      <thead><tr><th>S.No.</th><th>Branch Name</th><th>Address</th><th>Phone</th><th>Beds</th><th>Departments</th><th>Staff</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>
        {branches.map(b => (
          <tr key={b.id}><td>{b.id}</td><td>{b.name}</td><td>{b.address}</td><td>{b.phone}</td><td>{b.beds}</td><td>{b.departments}</td><td>{b.staff}</td><td>{b.status}</td><td><Edit size={14} className="text-primary cursor-pointer" /></td></tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Branches;
