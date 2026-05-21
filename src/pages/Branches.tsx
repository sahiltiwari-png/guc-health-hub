import React, { useEffect, useState } from 'react';
import { Building2, Edit, RefreshCw } from 'lucide-react';
import { getAutoAdminBranches, apiRequest, extractArray } from "@/api/apiService";

const Branches = () => {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const res = await getAutoAdminBranches();
      if (res.ok) {
        setBranches(extractArray(res));
      } else {
        // Fallback to manual fetch if helper fails
        const directRes = await apiRequest('/api/admin/branches');
        if (directRes.ok) {
          setBranches(extractArray(directRes));
        }
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <div>
      <div className="hms-section-header flex items-center justify-between">
        <div className="flex items-center gap-2"><Building2 size={14} /> Branch Management</div>
        <button className="hms-btn-secondary" onClick={fetchBranches}>
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      <div className="flex mb-2"><button className="hms-btn-primary ml-auto">+ Add Branch</button></div>
      <table className="hms-table">
        <thead><tr><th>S.No.</th><th>Branch Name</th><th>Address</th><th>Phone</th><th>Beds</th><th>Departments</th><th>Staff</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={9} className="text-center py-4">Loading branches...</td></tr>
          ) : branches.length === 0 ? (
            <tr><td colSpan={9} className="text-center py-4">No branches found</td></tr>
          ) : branches.map((b, i) => (
            <tr key={b.id || i}>
              <td>{i + 1}</td>
              <td>{b.name}</td>
              <td>{b.address}</td>
              <td>{b.phone}</td>
              <td>{b.totalBeds || 0}</td>
              <td>{b.totalDepartments || 0}</td>
              <td>{b.totalStaff || 0}</td>
              <td>{b.status || 'Active'}</td>
              <td><Edit size={14} className="text-primary cursor-pointer" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Branches;
