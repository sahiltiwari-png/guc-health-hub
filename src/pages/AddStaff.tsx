import React, { useState, useEffect } from 'react';
import { listDepartments, listRoles, registerUser } from '../api/apiService';

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
  });

  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, roleRes] = await Promise.all([
          listDepartments(),
          listRoles(),
        ]);
        setDepartments(deptRes.data || []);
        setRoles(roleRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'document') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      await registerUser(data);
      onAdd();
    } catch (err) {
      setError(err.message || "Failed to add staff");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Add New Staff</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="hms-input" required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="hms-input" required />
            <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="hms-input" required />
            <select name="role" value={formData.role} onChange={handleChange} className="hms-select" required>
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>{role.name}</option>
              ))}
            </select>
            <select name="department_id" value={formData.department_id} onChange={handleChange} className="hms-select" required>
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>{dept.name}</option>
              ))}
            </select>
            <input type="text" name="qualification" placeholder="Qualification" value={formData.qualification} onChange={handleChange} className="hms-input" required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="hms-input" required />
            <input type="date" name="dateOfBirth" placeholder="Date of Birth" value={formData.dateOfBirth} onChange={handleChange} className="hms-input" />
            <select name="gender" value={formData.gender} onChange={handleChange} className="hms-select">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="hms-input" />
            <input type="date" name="joiningDate" placeholder="Joining Date" value={formData.joiningDate} onChange={handleChange} className="hms-input" />
            <input type="number" name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} className="hms-input" />
            <input type="file" name="document" onChange={handleChange} className="hms-input" />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onCancel} className="hms-btn-secondary" disabled={isLoading}>Cancel</button>
            <button type="submit" className="hms-btn-primary" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaff;
