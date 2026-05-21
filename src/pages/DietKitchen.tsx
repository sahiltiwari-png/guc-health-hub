import React, { useState } from 'react';
import { UtensilsCrossed, Eye, Edit, Printer, CheckCircle, Clock, AlertTriangle, Users } from 'lucide-react';
import { extractArray, getDietPlans, getKitchenDashboard } from "@/api/apiService";

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = { 'Active': 'bg-green-700 text-white', 'Delivered': 'bg-green-700 text-white', 'Preparing': 'bg-blue-700 text-white', 'Pending': 'bg-yellow-600 text-white', 'Cancelled': 'bg-red-700 text-white', 'NPO': 'bg-red-700 text-white', 'Regular': 'bg-green-700 text-white', 'Diabetic': 'bg-yellow-600 text-white', 'Renal': 'bg-orange-600 text-white', 'Cardiac': 'bg-blue-700 text-white', 'Liquid': 'bg-purple-700 text-white', 'Soft': 'bg-teal-700 text-white' };
  return <span className={`px-1.5 py-0.5 text-[10px] font-bold ${colors[status] || 'bg-muted text-foreground'}`}>{status}</span>;
};

const mealOrders = [
  { id: 'MO-001', patient: 'Rajesh Kumar', uhid: 'P-1001', ward: 'ICU-1', bed: 'B-03', diet: 'Diabetic', meal: 'Breakfast', items: 'Oats Porridge, Egg White, Sugar-Free Tea', time: '07:30', status: 'Delivered' },
  { id: 'MO-002', patient: 'Sita Devi', uhid: 'P-1002', ward: 'Ward-A', bed: 'B-12', diet: 'Regular', meal: 'Breakfast', items: 'Paratha, Curd, Tea', time: '07:30', status: 'Delivered' },
  { id: 'MO-003', patient: 'Amit Sharma', uhid: 'P-1003', ward: 'ICU-2', bed: 'B-01', diet: 'Liquid', meal: 'Lunch', items: 'Clear Soup, Coconut Water, ORS', time: '12:30', status: 'Preparing' },
  { id: 'MO-004', patient: 'Priya Singh', uhid: 'P-1004', ward: 'Ward-B', bed: 'B-05', diet: 'Cardiac', meal: 'Lunch', items: 'Steamed Rice, Dal, Salad (No Salt)', time: '12:30', status: 'Pending' },
  { id: 'MO-005', patient: 'Mohan Lal', uhid: 'P-1005', ward: 'Private-1', bed: 'B-01', diet: 'Regular', meal: 'Lunch', items: 'Chapati, Paneer, Rice, Dal', time: '12:30', status: 'Pending' },
  { id: 'MO-006', patient: 'Kavita Jain', uhid: 'P-1006', ward: 'Ward-C', bed: 'B-08', diet: 'Renal', meal: 'Lunch', items: 'Low Protein Rice, Bottle Gourd, Apple', time: '12:30', status: 'Preparing' },
  { id: 'MO-007', patient: 'Suresh Yadav', uhid: 'P-1007', ward: 'ICU-1', bed: 'B-05', diet: 'NPO', meal: '-', items: 'NIL (Pre-Surgery)', time: '-', status: 'NPO' },
];

const dietPlans = [
  { id: 'DP-001', name: 'Diabetic Diet Type-1', calories: '1600 kcal', protein: '60g', carbs: '180g', fat: '50g', fiber: '30g', sodium: '<2g', patients: 18 },
  { id: 'DP-002', name: 'Cardiac Diet', calories: '1800 kcal', protein: '65g', carbs: '200g', fat: '45g', fiber: '35g', sodium: '<1.5g', patients: 12 },
  { id: 'DP-003', name: 'Renal Diet', calories: '2000 kcal', protein: '40g', carbs: '280g', fat: '70g', fiber: '20g', sodium: '<2g', patients: 8 },
  { id: 'DP-004', name: 'Regular Diet', calories: '2200 kcal', protein: '75g', carbs: '300g', fat: '65g', fiber: '25g', sodium: 'Normal', patients: 45 },
  { id: 'DP-005', name: 'Liquid Diet', calories: '800 kcal', protein: '20g', carbs: '120g', fat: '15g', fiber: '5g', sodium: 'Normal', patients: 6 },
  { id: 'DP-006', name: 'Soft Diet', calories: '1800 kcal', protein: '55g', carbs: '240g', fat: '55g', fiber: '15g', sodium: 'Normal', patients: 10 },
  { id: 'DP-007', name: 'Pediatric Diet', calories: '1200 kcal', protein: '45g', carbs: '160g', fat: '40g', fiber: '20g', sodium: 'Normal', patients: 14 },
];

const kitchenSchedule = [
  { meal: 'Early Morning Tea', time: '06:00-06:30', patients: 89, staff: 3, status: 'Completed' },
  { meal: 'Breakfast', time: '07:30-08:30', patients: 89, staff: 8, status: 'Completed' },
  { meal: 'Mid-Morning Snack', time: '10:30-11:00', patients: 45, staff: 3, status: 'Preparing' },
  { meal: 'Lunch', time: '12:30-13:30', patients: 89, staff: 10, status: 'Pending' },
  { meal: 'Evening Tea/Snack', time: '16:00-16:30', patients: 89, staff: 4, status: 'Pending' },
  { meal: 'Dinner', time: '19:30-20:30', patients: 89, staff: 10, status: 'Pending' },
  { meal: 'Night Milk', time: '21:00-21:30', patients: 30, staff: 2, status: 'Pending' },
];

const DietKitchen = () => {
  const tabs = ['Dashboard','Diet Plans','Meal Orders','Kitchen Schedule','Menu Master','Patient Diet Chart','Nutritional Analysis','Inventory'];
  const [tab, setTab] = useState('Dashboard');
  const [dashboard, setDashboard] = useState<any>(null);
  const [dietPlansList, setDietPlansList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [d, p] = await Promise.all([getKitchenDashboard(), getDietPlans()]);
      if (d.ok) setDashboard(d.data);
      if (p.ok) setDietPlansList(extractArray(p));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div>
      <div className="hms-section-header flex items-center gap-2"><UtensilsCrossed size={14} /> Diet & Kitchen Management</div>
      <div className="flex gap-0 border-b border-border mb-2 overflow-x-auto">
        {tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-xs font-semibold whitespace-nowrap border-b-2 ${tab === t ? 'border-primary text-primary bg-card' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>{t}</button>)}
      </div>

      {tab === 'Dashboard' && (
        <div>
          <div className="grid grid-cols-6 gap-2 mb-3">
            {[{ l: 'Total Admitted', v: '89', s: 'Requiring Meals' },{ l: 'Meals Today', v: '534', s: '6 Meal Slots' },{ l: 'Delivered', v: '178', s: 'Breakfast Complete' },{ l: 'Preparing', v: '45', s: 'Mid-Morning Snack' },{ l: 'Special Diets', v: '44', s: 'Diabetic/Cardiac/Renal' },{ l: 'NPO Patients', v: '3', s: 'Pre-Surgery' }].map((k, i) => (
              <div key={i} className="bg-card border border-border p-2">
                <div className="text-[10px] text-muted-foreground">{k.l}</div>
                <div className="text-sm font-bold">{k.v}</div>
                <div className="text-[9px] text-muted-foreground">{k.s}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-card border border-border">
              <div className="hms-section-header text-xs">Today's Kitchen Schedule</div>
              <table className="hms-table"><thead><tr><th>Meal</th><th>Time</th><th>Patients</th><th>Staff</th><th>Status</th></tr></thead>
                <tbody>{kitchenSchedule.map((s, i) => <tr key={i}><td>{s.meal}</td><td>{s.time}</td><td>{s.patients}</td><td>{s.staff}</td><td><StatusBadge status={s.status === 'Completed' ? 'Delivered' : s.status} /></td></tr>)}</tbody>
              </table>
            </div>
            <div className="bg-card border border-border">
              <div className="hms-section-header text-xs">Diet-wise Patient Count</div>
              <table className="hms-table"><thead><tr><th>Diet Type</th><th>Patients</th><th>Calories</th><th>Special Notes</th></tr></thead>
                <tbody>{dietPlans.map((d, i) => <tr key={i}><td><StatusBadge status={d.name.split(' ')[0]} /></td><td>{d.patients}</td><td>{d.calories}</td><td>{d.sodium !== 'Normal' ? `Na ${d.sodium}` : '-'}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'Diet Plans' && (
        <div>
          <div className="flex mb-2"><button className="hms-btn-primary ml-auto">+ Create Diet Plan</button></div>
          <table className="hms-table"><thead><tr><th>ID</th><th>Plan Name</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fat</th><th>Fiber</th><th>Sodium</th><th>Active Patients</th><th>Action</th></tr></thead>
            <tbody>{dietPlans.map(d => <tr key={d.id}><td className="font-mono text-[10px]">{d.id}</td><td>{d.name}</td><td>{d.calories}</td><td>{d.protein}</td><td>{d.carbs}</td><td>{d.fat}</td><td>{d.fiber}</td><td>{d.sodium}</td><td className="font-bold">{d.patients}</td><td><Eye size={12} className="text-primary cursor-pointer" /> <Edit size={12} className="text-primary cursor-pointer" /></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'Meal Orders' && (
        <div>
          <div className="flex gap-2 mb-2">
            <select className="hms-select"><option>All Meals</option><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snacks</option></select>
            <select className="hms-select"><option>All Wards</option><option>ICU-1</option><option>ICU-2</option><option>Ward-A</option><option>Ward-B</option><option>Ward-C</option></select>
            <select className="hms-select"><option>All Diet Types</option><option>Regular</option><option>Diabetic</option><option>Cardiac</option><option>Renal</option><option>Liquid</option></select>
            <select className="hms-select"><option>All Status</option><option>Pending</option><option>Preparing</option><option>Delivered</option><option>NPO</option></select>
            <button className="hms-btn-primary ml-auto">Generate Orders</button>
            <button className="hms-btn-secondary flex items-center gap-1"><Printer size={10} />Print</button>
          </div>
          <table className="hms-table"><thead><tr><th>Order ID</th><th>Patient</th><th>UHID</th><th>Ward</th><th>Bed</th><th>Diet</th><th>Meal</th><th>Items</th><th>Time</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{mealOrders.map(m => <tr key={m.id}><td className="font-mono text-[10px]">{m.id}</td><td>{m.patient}</td><td>{m.uhid}</td><td>{m.ward}</td><td>{m.bed}</td><td><StatusBadge status={m.diet} /></td><td>{m.meal}</td><td className="text-[10px] max-w-[200px]">{m.items}</td><td>{m.time}</td><td><StatusBadge status={m.status} /></td><td><Eye size={12} className="text-primary cursor-pointer" /></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'Kitchen Schedule' && (
        <div>
          <div className="flex mb-2"><span className="text-xs font-bold">Date: {new Date().toLocaleDateString('en-IN')}</span><button className="hms-btn-primary ml-auto">Update Schedule</button></div>
          <table className="hms-table"><thead><tr><th>Meal</th><th>Time Slot</th><th>Total Patients</th><th>Regular</th><th>Diabetic</th><th>Cardiac</th><th>Renal</th><th>Liquid</th><th>NPO</th><th>Staff Assigned</th><th>Status</th></tr></thead>
            <tbody>{kitchenSchedule.map((s, i) => <tr key={i}><td className="font-bold">{s.meal}</td><td>{s.time}</td><td>{s.patients}</td><td>45</td><td>18</td><td>12</td><td>8</td><td>6</td><td>3</td><td>{s.staff}</td><td><StatusBadge status={s.status === 'Completed' ? 'Delivered' : s.status} /></td></tr>)}</tbody>
          </table>
        </div>
      )}

      {tab === 'Menu Master' && (
        <div>
          <div className="flex mb-2"><button className="hms-btn-primary ml-auto">+ Add Menu Item</button></div>
          <table className="hms-table"><thead><tr><th>Code</th><th>Item</th><th>Category</th><th>Calories</th><th>Protein</th><th>Suitable For</th><th>Allergens</th><th>Cost</th><th>Action</th></tr></thead>
            <tbody>
              {[['MI-001','Oats Porridge','Breakfast','180 kcal','6g','Diabetic, Cardiac','Gluten','₹25'],['MI-002','Paratha (2pc)','Breakfast','320 kcal','8g','Regular, Soft','Gluten, Dairy','₹30'],['MI-003','Steamed Rice','Lunch/Dinner','200 kcal','4g','All','None','₹15'],['MI-004','Dal Tadka','Lunch/Dinner','150 kcal','10g','All except Renal','None','₹20'],['MI-005','Clear Soup','Liquid','50 kcal','2g','Liquid, Post-Op','None','₹15'],['MI-006','Paneer Bhurji','Lunch','250 kcal','18g','Regular, Soft','Dairy','₹40'],['MI-007','Fruit Plate','Snack','120 kcal','1g','Most Diets','None','₹35']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}<td><Edit size={12} className="text-primary cursor-pointer" /></td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Patient Diet Chart' && (
        <div>
          <div className="flex gap-2 mb-2">
            <input className="hms-input w-48" placeholder="Search Patient/UHID..." />
            <select className="hms-select"><option>All Wards</option></select>
            <button className="hms-btn-secondary flex items-center gap-1"><Printer size={10} />Print All Charts</button>
          </div>
          <table className="hms-table"><thead><tr><th>UHID</th><th>Patient</th><th>Ward/Bed</th><th>Diagnosis</th><th>Diet Type</th><th>Allergies</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th><th>Doctor</th><th>Action</th></tr></thead>
            <tbody>
              {[['P-1001','Rajesh Kumar','ICU-1/B-03','DM Type 2','Diabetic','None','Oats, Egg White','Chapati, Dal','Soup, Bread','Dr. Sharma'],['P-1002','Sita Devi','Ward-A/B-12','Fracture','Regular','Dairy','Paratha, Tea','Rice, Paneer','Chapati, Veg','Dr. Gupta'],['P-1003','Amit Sharma','ICU-2/B-01','Post-Op Day 1','Liquid','None','Clear Soup','Coconut Water','Clear Soup','Dr. Singh'],['P-1006','Kavita Jain','Ward-C/B-08','CKD Stage 3','Renal','Nuts','Low-Pro Rice','Bottle Gourd','Rice, Lauki','Dr. Verma']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}<td><Eye size={12} className="text-primary cursor-pointer" /></td></tr>)}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Nutritional Analysis' && (
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-card border border-border">
            <div className="hms-section-header text-xs">Daily Nutritional Summary</div>
            <table className="hms-table"><thead><tr><th>Diet Type</th><th>Avg Calories</th><th>Avg Protein</th><th>Compliance %</th><th>Wastage %</th></tr></thead>
              <tbody>{[['Regular','2180 kcal','72g','94%','8%'],['Diabetic','1580 kcal','58g','97%','5%'],['Cardiac','1760 kcal','63g','95%','6%'],['Renal','1950 kcal','38g','92%','12%'],['Liquid','780 kcal','18g','100%','3%']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <div className="bg-card border border-border">
            <div className="hms-section-header text-xs">Cost Analysis (Monthly)</div>
            <table className="hms-table"><thead><tr><th>Category</th><th>Budget</th><th>Actual</th><th>Variance</th></tr></thead>
              <tbody>{[['Raw Materials','₹4,50,000','₹4,35,000','+₹15,000'],['Kitchen Staff','₹2,80,000','₹2,80,000','₹0'],['Equipment','₹50,000','₹42,000','+₹8,000'],['Disposables','₹75,000','₹82,000','-₹7,000'],['Total','₹8,55,000','₹8,39,000','+₹16,000']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={j === 3 && c.startsWith('-') ? 'text-red-600 font-bold' : j === 3 ? 'text-green-600 font-bold' : ''}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Inventory' && (
        <div>
          <div className="flex gap-2 mb-2"><input className="hms-input w-48" placeholder="Search Item..." /><button className="hms-btn-primary ml-auto">+ Add Stock</button></div>
          <table className="hms-table"><thead><tr><th>Code</th><th>Item</th><th>Category</th><th>Unit</th><th>Stock</th><th>Min Level</th><th>Reorder</th><th>Rate</th><th>Value</th><th>Expiry</th><th>Status</th></tr></thead>
            <tbody>
              {[['KI-001','Rice (Basmati)','Grains','Kg','250','50','100','₹65','₹16,250','2024-12-31','OK'],['KI-002','Wheat Flour','Grains','Kg','180','40','80','₹40','₹7,200','2024-09-30','OK'],['KI-003','Cooking Oil','Oils','Ltr','45','20','40','₹180','₹8,100','2024-11-30','OK'],['KI-004','Sugar','Condiments','Kg','15','10','20','₹45','₹675','2024-10-31','Low'],['KI-005','Milk','Dairy','Ltr','50','20','30','₹58','₹2,900','Daily','OK'],['KI-006','Eggs','Protein','Pcs','200','100','150','₹7','₹1,400','Weekly','OK']].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{j === 10 ? <StatusBadge status={c === 'Low' ? 'Pending' : 'Active'} /> : c}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DietKitchen;
