import React, { useState, useEffect } from 'react';
import { Search, Trash2, RefreshCw } from 'lucide-react';
import { listLabOrders, getAutoPatients, getAutoUsers, extractArray, createLabEntry } from "@/api/apiService";
import { useToast } from '@/components/ui/use-toast';

const Investigations = () => {
  const { toast } = useToast();
  const [searchUhid, setSearchUhid] = useState('');
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedTests, setSelectedTests] = useState<any[]>([]);
  const [testSearch, setTestSearch] = useState('');

  const fetchInitial = async () => {
    const dRes = await getAutoUsers({ role: 'DOCTOR' });
    if (dRes.ok) setDoctors(extractArray(dRes));
  };

  useEffect(() => { fetchInitial(); }, []);

  const handleSearch = async () => {
    if (!searchUhid) return;
    setLoading(true);
    const res = await getAutoPatients({ uhid: searchUhid });
    const pts = extractArray(res);
    if (pts.length > 0) setPatient(pts[0]);
    else toast({ title: "Not Found", description: "Patient not found", variant: "destructive" });
    setLoading(false);
  };

  const total = selectedTests.reduce((s, t) => s + t.amount, 0);
  const filteredTests = testList.filter(t => t.name.toLowerCase().includes(testSearch.toLowerCase()));

  const addTest = (test: typeof testList[0]) => {
    if (!selectedTests.find(s => s.name === test.name)) {
      setSelectedTests([...selectedTests, { ...test, unit: 1, amount: test.rate }]);
    }
  };

  const removeTest = (name: string) => {
    setSelectedTests(selectedTests.filter(t => t.name !== name));
  };

  return (
    <div>
      {/* UHID Search */}
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-primary text-primary-foreground px-2 py-1 text-xs font-bold">Enter UHID:</span>
        <input className="hms-input w-24" value={searchUhid} onChange={e => setSearchUhid(e.target.value)} />
        <button className="hms-btn-success">Search</button>
      </div>

      {/* Patient Info */}
      <div className="bg-card border border-border p-2 mb-2 text-xs grid grid-cols-3 gap-2">
        <div className="flex gap-2"><span className="hms-form-label w-24">Department:</span><select className="hms-select flex-1"><option>DIAGNOSTIC UNIT</option></select></div>
        <div className="flex gap-2"><span className="hms-form-label w-24">Mobile:</span><span>7878787878</span></div>
        <div className="flex gap-2"><span className="hms-form-label w-24">Patient Name:</span><span>Mr. LOKESH KUMAR</span></div>
        <div className="flex gap-2"><span className="hms-form-label w-24">Consultant:</span><select className="hms-select flex-1"><option>ALOK MEHTA</option></select></div>
        <div className="flex gap-2"><span className="hms-form-label w-24">Age:</span><span>38Y / Male</span></div>
        <div className="flex gap-2"><span className="hms-form-label w-24">Address:</span><span>SEC TOR 54, NOIDA</span></div>
      </div>

      <div className="flex gap-3">
        {/* Test Selection */}
        <div className="w-1/2">
          <div className="hms-section-header">Test Name</div>
          <input className="hms-input w-full mb-1" placeholder="SEARCH NAME" value={testSearch} onChange={e => setTestSearch(e.target.value)} />
          <p className="text-[10px] text-muted-foreground mb-1">Select to Enter Quantity</p>
          <div className="border border-border h-48 overflow-y-auto">
            {filteredTests.map(t => (
              <label key={t.name} className="flex items-center gap-2 px-2 py-1 text-xs hover:bg-muted cursor-pointer">
                <input type="checkbox" checked={!!selectedTests.find(s => s.name === t.name)} onChange={() => selectedTests.find(s => s.name === t.name) ? removeTest(t.name) : addTest(t)} />
                {t.name} - Unit 1 / Rs {t.rate}
              </label>
            ))}
          </div>
        </div>

        {/* Selected Tests */}
        <div className="w-1/2">
          <table className="hms-table">
            <thead>
              <tr><th>Test Name</th><th>Rate</th><th>Unit</th><th>Amount</th><th>Remove</th></tr>
            </thead>
            <tbody>
              {selectedTests.map(t => (
                <tr key={t.name}>
                  <td>{t.name}</td><td>{t.rate}</td><td>{t.unit}</td><td>{t.amount}</td>
                  <td className="text-center"><button onClick={() => removeTest(t.name)} className="text-muted-foreground hover:text-destructive">Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="bg-card border border-border p-2 text-xs mt-1">
            <div className="hms-section-header">Total</div>
            <div className="flex justify-between"><span>Total</span><span>Rs.{total}</span></div>
            <div className="flex justify-between"><span>Discount</span><span>Rs.0</span></div>
            <div className="flex justify-between font-bold"><span>Net Payable</span><span>Rs.{total}</span></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-secondary border-t border-border mt-2 p-2 flex items-center gap-3 text-xs">
        <span className="hms-form-label">Total: <span className="bg-primary text-primary-foreground px-2 py-0.5">{total}</span></span>
        <span className="hms-form-label">Discount: <input className="hms-input w-16" defaultValue="0" /></span>
        <span className="hms-form-label">Waive Off: <input className="hms-input w-16" defaultValue="0" /></span>
        <span className="hms-form-label">Deposit: <input className="hms-input w-20" defaultValue={total.toString()} /></span>
        <span className="hms-form-label">Due: <input className="hms-input w-16" defaultValue="0" /></span>
        <span className="hms-form-label">Mode: <select className="hms-select"><option>Cash</option><option>Card</option><option>UPI</option></select></span>
        <button className="hms-btn-primary ml-auto">Submit</button>
      </div>
    </div>
  );
};

export default Investigations;
