import React, { useState } from 'react';
import {
  Pill, ClipboardList, Package, TrendingUp, AlertTriangle, CreditCard,
  Users, FileText, Eye, Printer, Search, BarChart3, ShieldCheck,
  Truck, Activity, Bell, Clock, ChevronDown, Download, ArrowLeftRight,
  BookOpen, Receipt, Layers, ShoppingCart, Wrench, UserCheck, Archive
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

/* ───────── DUMMY DATA ───────── */

const kpiCards = [
  { label: 'Total Rx Today', value: '187', icon: ClipboardList, change: '+12 vs yesterday', color: 'bg-primary' },
  { label: 'Medicines Dispensed', value: '1,243', icon: Pill, change: '98% fulfilment', color: 'bg-hms-success' },
  { label: 'Low Stock Items', value: '14', icon: AlertTriangle, change: '3 critical', color: 'bg-hms-warning' },
  { label: 'Expiring Soon', value: '23', icon: Clock, change: 'Within 30 days', color: 'bg-destructive' },
  { label: 'Pending Bills', value: '₹45,200', icon: CreditCard, change: '8 patients', color: 'bg-hms-info' },
  { label: 'Revenue Today', value: '₹1,82,500', icon: TrendingUp, change: '+8% vs avg', color: 'bg-primary' },
];

const prescriptionQueue = [
  { id: 'RX-2026-001', uhid: 'U-1001', patient: 'Mr. Rajesh Kumar', age: '45Y', doctor: 'Dr. Alok Mehta', dept: 'General Medicine', diagnosis: 'Acute Fever', items: 4, time: '09:15 AM', status: 'Pending' },
  { id: 'RX-2026-002', uhid: 'U-1002', patient: 'Mrs. Sunita Devi', age: '32Y', doctor: 'Dr. Priya Singh', dept: 'Gynecology', diagnosis: 'PCOD', items: 6, time: '09:30 AM', status: 'In Progress' },
  { id: 'RX-2026-003', uhid: 'U-1003', patient: 'Mr. Amit Sharma', age: '28Y', doctor: 'Dr. Rahul Verma', dept: 'Orthopedics', diagnosis: 'Knee Pain', items: 3, time: '09:45 AM', status: 'Dispensed' },
  { id: 'RX-2026-004', uhid: 'U-1004', patient: 'Baby Riya', age: '2Y', doctor: 'Dr. Neha Gupta', dept: 'Pediatrics', diagnosis: 'Cold & Cough', items: 5, time: '10:00 AM', status: 'Pending' },
  { id: 'RX-2026-005', uhid: 'U-1005', patient: 'Mr. Suresh Yadav', age: '55Y', doctor: 'Dr. Alok Mehta', dept: 'General Medicine', diagnosis: 'Diabetes Type-2', items: 7, time: '10:15 AM', status: 'Pending' },
  { id: 'RX-2026-006', uhid: 'U-1006', patient: 'Mrs. Kamla Devi', age: '60Y', doctor: 'Dr. Rahul Verma', dept: 'Orthopedics', diagnosis: 'Arthritis', items: 4, time: '10:30 AM', status: 'In Progress' },
];

const inventoryData = [
  { sno: 1, name: 'Paracetamol 500mg', batch: 'B-2026-A01', category: 'Analgesic', stock: 1200, minStock: 500, unit: 'Tabs', mrp: 2.5, expiry: '15-Dec-2027', supplier: 'Cipla Ltd', status: 'OK' },
  { sno: 2, name: 'Amoxicillin 250mg', batch: 'B-2026-A02', category: 'Antibiotic', stock: 8, minStock: 30, unit: 'Caps', mrp: 12, expiry: '15-Apr-2026', supplier: 'Sun Pharma', status: 'Low' },
  { sno: 3, name: 'Cetrizine 10mg', batch: 'B-2026-A03', category: 'Anti-allergy', stock: 5, minStock: 20, unit: 'Tabs', mrp: 3, expiry: '28-Feb-2026', supplier: 'Dr. Reddy', status: 'Critical' },
  { sno: 4, name: 'Metformin 500mg', batch: 'B-2026-A04', category: 'Anti-diabetic', stock: 850, minStock: 200, unit: 'Tabs', mrp: 5, expiry: '30-Jun-2027', supplier: 'USV Pvt Ltd', status: 'OK' },
  { sno: 5, name: 'Atorvastatin 10mg', batch: 'B-2026-A05', category: 'Lipid Lowering', stock: 15, minStock: 50, unit: 'Tabs', mrp: 8, expiry: '15-Mar-2026', supplier: 'Ranbaxy', status: 'Low' },
  { sno: 6, name: 'Omeprazole 20mg', batch: 'B-2026-A06', category: 'Antacid', stock: 600, minStock: 100, unit: 'Caps', mrp: 6, expiry: '20-Sep-2027', supplier: 'Cipla Ltd', status: 'OK' },
  { sno: 7, name: 'Azithromycin 500mg', batch: 'B-2026-A07', category: 'Antibiotic', stock: 45, minStock: 40, unit: 'Tabs', mrp: 65, expiry: '10-Aug-2026', supplier: 'Alkem Labs', status: 'OK' },
  { sno: 8, name: 'Insulin Glargine', batch: 'B-2026-A08', category: 'Anti-diabetic', stock: 3, minStock: 10, unit: 'Vials', mrp: 850, expiry: '05-Mar-2026', supplier: 'Novo Nordisk', status: 'Critical' },
];

const dispensingLog = [
  { id: 'D-001', rxId: 'RX-2026-003', patient: 'Mr. Amit Sharma', uhid: 'U-1003', medicine: 'Diclofenac 50mg x 10', pharmacist: 'Ankit Gupta', time: '09:50 AM', payStatus: 'Paid', amount: '₹120' },
  { id: 'D-002', rxId: 'RX-2026-001', patient: 'Mr. Rajesh Kumar', uhid: 'U-1001', medicine: 'Paracetamol 500mg x 20', pharmacist: 'Ankit Gupta', time: '09:25 AM', payStatus: 'Paid', amount: '₹50' },
  { id: 'D-003', rxId: 'RX-2026-002', patient: 'Mrs. Sunita Devi', uhid: 'U-1002', medicine: 'Metformin 500mg x 30', pharmacist: 'Renu Singh', time: '09:40 AM', payStatus: 'Pending', amount: '₹150' },
  { id: 'D-004', rxId: 'RX-2026-006', patient: 'Mrs. Kamla Devi', uhid: 'U-1006', medicine: 'Calcium + Vit D3 x 30', pharmacist: 'Renu Singh', time: '10:35 AM', payStatus: 'Insurance', amount: '₹280' },
];

const billingData = [
  { billNo: 'PH-B-001', patient: 'Mr. Rajesh Kumar', uhid: 'U-1001', items: 4, gross: 450, discount: 0, net: 450, mode: 'Cash', insurance: '-', status: 'Paid' },
  { billNo: 'PH-B-002', patient: 'Mrs. Sunita Devi', uhid: 'U-1002', items: 6, gross: 1200, discount: 120, net: 1080, mode: 'Card', insurance: 'Star Health', status: 'Partial' },
  { billNo: 'PH-B-003', patient: 'Mr. Amit Sharma', uhid: 'U-1003', items: 3, gross: 300, discount: 0, net: 300, mode: 'UPI', insurance: '-', status: 'Paid' },
  { billNo: 'PH-B-004', patient: 'Mrs. Kamla Devi', uhid: 'U-1006', items: 4, gross: 950, discount: 50, net: 900, mode: 'Insurance', insurance: 'ICICI Lombard', status: 'Pending' },
];

const doctorPrescriptions = [
  { doctor: 'Dr. Alok Mehta', dept: 'General Medicine', totalRx: 52, topDrug: 'Paracetamol 500mg', generic: '72%', branded: '28%', avgItems: 4.2 },
  { doctor: 'Dr. Priya Singh', dept: 'Gynecology', totalRx: 38, topDrug: 'Folic Acid 5mg', generic: '65%', branded: '35%', avgItems: 5.1 },
  { doctor: 'Dr. Rahul Verma', dept: 'Orthopedics', totalRx: 41, topDrug: 'Diclofenac 50mg', generic: '58%', branded: '42%', avgItems: 3.8 },
  { doctor: 'Dr. Neha Gupta', dept: 'Pediatrics', totalRx: 29, topDrug: 'Amoxicillin Syrup', generic: '80%', branded: '20%', avgItems: 3.5 },
  { doctor: 'Dr. Sanjay Kapoor', dept: 'Cardiology', totalRx: 34, topDrug: 'Atorvastatin 10mg', generic: '55%', branded: '45%', avgItems: 5.8 },
];

const expiryAlerts = [
  { name: 'Cetrizine 10mg', batch: 'B-2026-A03', expiry: '28-Feb-2026', stock: 5, daysLeft: 7, action: 'Return/Destroy' },
  { name: 'Insulin Glargine', batch: 'B-2026-A08', expiry: '05-Mar-2026', stock: 3, daysLeft: 12, action: 'Use Priority' },
  { name: 'Atorvastatin 10mg', batch: 'B-2026-A05', expiry: '15-Mar-2026', stock: 15, daysLeft: 22, action: 'Use Priority' },
  { name: 'Amoxicillin 250mg', batch: 'B-2026-A02', expiry: '15-Apr-2026', stock: 8, daysLeft: 53, action: 'Monitor' },
  { name: 'Clopidogrel 75mg', batch: 'B-2026-C11', expiry: '20-Apr-2026', stock: 22, daysLeft: 58, action: 'Monitor' },
];

const vendorData = [
  { vendor: 'Cipla Ltd', contact: '9876543210', orders: 12, pending: 2, lastOrder: '18-Feb-2026', amount: '₹45,000', rating: '4.5/5' },
  { vendor: 'Sun Pharma', contact: '9876543211', orders: 8, pending: 1, lastOrder: '15-Feb-2026', amount: '₹32,000', rating: '4.2/5' },
  { vendor: 'Dr. Reddy', contact: '9876543212', orders: 6, pending: 0, lastOrder: '12-Feb-2026', amount: '₹28,500', rating: '4.0/5' },
  { vendor: 'Novo Nordisk', contact: '9876543213', orders: 3, pending: 1, lastOrder: '10-Feb-2026', amount: '₹1,25,000', rating: '4.8/5' },
];

const auditLogs = [
  { time: '10:35 AM', user: 'Ankit Gupta', action: 'Dispensed', detail: 'RX-2026-006 - Calcium + Vit D3 x 30 to Mrs. Kamla Devi', module: 'Dispensing' },
  { time: '10:20 AM', user: 'Admin', action: 'Stock Update', detail: 'Added 500 units of Paracetamol 500mg (Batch B-2026-A01)', module: 'Inventory' },
  { time: '10:05 AM', user: 'Renu Singh', action: 'Dispensed', detail: 'RX-2026-002 - Metformin 500mg x 30 to Mrs. Sunita Devi', module: 'Dispensing' },
  { time: '09:50 AM', user: 'Ankit Gupta', action: 'Dispensed', detail: 'RX-2026-003 - Diclofenac 50mg x 10 to Mr. Amit Sharma', module: 'Dispensing' },
  { time: '09:30 AM', user: 'Admin', action: 'Price Update', detail: 'Amoxicillin 250mg MRP changed ₹10 → ₹12', module: 'Inventory' },
  { time: '09:15 AM', user: 'System', action: 'Alert', detail: 'Low stock alert triggered for Insulin Glargine (3 units)', module: 'Alerts' },
];

/* Charts Data */
const doctorWiseChart = [
  { name: 'Dr. Alok', rx: 52 }, { name: 'Dr. Priya', rx: 38 }, { name: 'Dr. Rahul', rx: 41 },
  { name: 'Dr. Neha', rx: 29 }, { name: 'Dr. Sanjay', rx: 34 },
];

const stockUsageChart = [
  { name: 'Mon', dispensed: 180, received: 50 }, { name: 'Tue', dispensed: 210, received: 0 },
  { name: 'Wed', dispensed: 195, received: 120 }, { name: 'Thu', dispensed: 230, received: 0 },
  { name: 'Fri', dispensed: 250, received: 80 }, { name: 'Sat', dispensed: 160, received: 200 },
  { name: 'Sun', dispensed: 90, received: 0 },
];

const categoryPieData = [
  { name: 'Analgesic', value: 28 }, { name: 'Antibiotic', value: 22 },
  { name: 'Anti-diabetic', value: 18 }, { name: 'Cardiac', value: 15 },
  { name: 'Anti-allergy', value: 10 }, { name: 'Others', value: 7 },
];

const PIE_COLORS = ['hsl(0,100%,50%)', 'hsl(0,100%,40%)', 'hsl(30,90%,50%)', 'hsl(200,80%,50%)', 'hsl(120,40%,45%)', 'hsl(0,0%,55%)'];

const salesTrendChart = [
  { name: 'Week 1', sales: 125000, returns: 3200 }, { name: 'Week 2', sales: 142000, returns: 4100 },
  { name: 'Week 3', sales: 138000, returns: 2800 }, { name: 'Week 4', sales: 155000, returns: 3500 },
];

/* ───── NEW DATA for additional modules ───── */

const grnData = [
  { grnNo: 'GRN-2026-001', poNo: 'PO-2026-005', supplier: 'Cipla Ltd', date: '20-Feb-2026', items: 12, totalQty: 5000, amount: '₹45,000', receivedBy: 'Ankit Gupta', status: 'Verified' },
  { grnNo: 'GRN-2026-002', poNo: 'PO-2026-006', supplier: 'Sun Pharma', date: '19-Feb-2026', items: 8, totalQty: 2500, amount: '₹32,000', receivedBy: 'Renu Singh', status: 'Pending QC' },
  { grnNo: 'GRN-2026-003', poNo: 'PO-2026-004', supplier: 'Novo Nordisk', date: '18-Feb-2026', items: 3, totalQty: 50, amount: '₹1,25,000', receivedBy: 'Ankit Gupta', status: 'Verified' },
  { grnNo: 'GRN-2026-004', poNo: 'PO-2026-007', supplier: 'Dr. Reddy', date: '17-Feb-2026', items: 6, totalQty: 1800, amount: '₹28,500', receivedBy: 'Renu Singh', status: 'Rejected' },
  { grnNo: 'GRN-2026-005', poNo: 'PO-2026-008', supplier: 'Alkem Labs', date: '16-Feb-2026', items: 10, totalQty: 3200, amount: '₹56,000', receivedBy: 'Ankit Gupta', status: 'Verified' },
];

const insuranceClaimsData = [
  { claimId: 'IC-2026-001', patient: 'Mrs. Sunita Devi', uhid: 'U-1002', insurer: 'Star Health', policyNo: 'SH-98765', billAmt: 1200, claimAmt: 1080, tpa: 'Medi Assist', submittedOn: '20-Feb-2026', status: 'Submitted' },
  { claimId: 'IC-2026-002', patient: 'Mrs. Kamla Devi', uhid: 'U-1006', insurer: 'ICICI Lombard', policyNo: 'IL-45678', billAmt: 950, claimAmt: 900, tpa: 'Raksha TPA', submittedOn: '20-Feb-2026', status: 'Under Review' },
  { claimId: 'IC-2026-003', patient: 'Mr. Ramesh Jain', uhid: 'U-1010', insurer: 'HDFC Ergo', policyNo: 'HE-33221', billAmt: 3500, claimAmt: 3200, tpa: 'Vidal Health', submittedOn: '18-Feb-2026', status: 'Approved' },
  { claimId: 'IC-2026-004', patient: 'Mrs. Pooja Singh', uhid: 'U-1015', insurer: 'Bajaj Allianz', policyNo: 'BA-77889', billAmt: 2100, claimAmt: 1800, tpa: 'Medi Assist', submittedOn: '15-Feb-2026', status: 'Rejected' },
  { claimId: 'IC-2026-005', patient: 'Mr. Suresh Yadav', uhid: 'U-1005', insurer: 'Star Health', policyNo: 'SH-11223', billAmt: 4500, claimAmt: 4200, tpa: 'Paramount Health', submittedOn: '14-Feb-2026', status: 'Settled' },
];

const interBranchTransferData = [
  { transferId: 'IBT-001', fromBranch: 'Main Branch - Noida', toBranch: 'Branch 2 - Delhi', medicine: 'Paracetamol 500mg', batch: 'B-2026-A01', qty: 500, requestedBy: 'Dr. Mehta', date: '20-Feb-2026', status: 'In Transit' },
  { transferId: 'IBT-002', fromBranch: 'Branch 3 - Gurgaon', toBranch: 'Main Branch - Noida', medicine: 'Insulin Glargine', batch: 'B-2026-A08', qty: 10, requestedBy: 'Ankit Gupta', date: '19-Feb-2026', status: 'Received' },
  { transferId: 'IBT-003', fromBranch: 'Main Branch - Noida', toBranch: 'Branch 4 - Ghaziabad', medicine: 'Amoxicillin 250mg', batch: 'B-2026-A02', qty: 200, requestedBy: 'Renu Singh', date: '18-Feb-2026', status: 'Pending Approval' },
  { transferId: 'IBT-004', fromBranch: 'Branch 2 - Delhi', toBranch: 'Branch 3 - Gurgaon', medicine: 'Omeprazole 20mg', batch: 'B-2026-A06', qty: 300, requestedBy: 'Admin', date: '17-Feb-2026', status: 'Completed' },
];

const medicineMasterData = [
  { code: 'MED-001', name: 'Paracetamol 500mg', genericName: 'Acetaminophen', category: 'Analgesic', schedule: 'OTC', form: 'Tablet', strength: '500mg', hsnCode: '30049099', gst: '12%', rackNo: 'A-01', status: 'Active' },
  { code: 'MED-002', name: 'Amoxicillin 250mg', genericName: 'Amoxicillin', category: 'Antibiotic', schedule: 'H', form: 'Capsule', strength: '250mg', hsnCode: '30041000', gst: '12%', rackNo: 'A-05', status: 'Active' },
  { code: 'MED-003', name: 'Metformin 500mg', genericName: 'Metformin HCl', category: 'Anti-diabetic', schedule: 'H', form: 'Tablet', strength: '500mg', hsnCode: '30049099', gst: '12%', rackNo: 'B-02', status: 'Active' },
  { code: 'MED-004', name: 'Insulin Glargine', genericName: 'Insulin Glargine', category: 'Anti-diabetic', schedule: 'H', form: 'Injection', strength: '100IU/ml', hsnCode: '30041000', gst: '5%', rackNo: 'Cold-01', status: 'Active' },
  { code: 'MED-005', name: 'Diclofenac 50mg', genericName: 'Diclofenac Sodium', category: 'NSAID', schedule: 'H', form: 'Tablet', strength: '50mg', hsnCode: '30049099', gst: '12%', rackNo: 'A-03', status: 'Active' },
  { code: 'MED-006', name: 'Cetrizine 10mg', genericName: 'Cetirizine HCl', category: 'Anti-allergy', schedule: 'OTC', form: 'Tablet', strength: '10mg', hsnCode: '30049099', gst: '12%', rackNo: 'C-01', status: 'Active' },
  { code: 'MED-007', name: 'Clopidogrel 75mg', genericName: 'Clopidogrel', category: 'Antiplatelet', schedule: 'H', form: 'Tablet', strength: '75mg', hsnCode: '30049099', gst: '12%', rackNo: 'B-08', status: 'Inactive' },
];

const dispenseRecordData = [
  { dispenseId: 'DR-001', rxId: 'RX-2026-003', patient: 'Mr. Amit Sharma', uhid: 'U-1003', medicine: 'Diclofenac 50mg', batch: 'B-2026-D01', qtyPrescribed: 10, qtyDispensed: 10, pharmacist: 'Ankit Gupta', time: '09:50 AM', returnQty: 0, status: 'Completed' },
  { dispenseId: 'DR-002', rxId: 'RX-2026-001', patient: 'Mr. Rajesh Kumar', uhid: 'U-1001', medicine: 'Paracetamol 500mg', batch: 'B-2026-A01', qtyPrescribed: 20, qtyDispensed: 20, pharmacist: 'Ankit Gupta', time: '09:25 AM', returnQty: 0, status: 'Completed' },
  { dispenseId: 'DR-003', rxId: 'RX-2026-002', patient: 'Mrs. Sunita Devi', uhid: 'U-1002', medicine: 'Metformin 500mg', batch: 'B-2026-A04', qtyPrescribed: 30, qtyDispensed: 30, pharmacist: 'Renu Singh', time: '09:40 AM', returnQty: 5, status: 'Partial Return' },
  { dispenseId: 'DR-004', rxId: 'RX-2026-006', patient: 'Mrs. Kamla Devi', uhid: 'U-1006', medicine: 'Calcium + Vit D3', batch: 'B-2026-C05', qtyPrescribed: 30, qtyDispensed: 30, pharmacist: 'Renu Singh', time: '10:35 AM', returnQty: 0, status: 'Completed' },
  { dispenseId: 'DR-005', rxId: 'RX-2026-004', patient: 'Baby Riya', uhid: 'U-1004', medicine: 'Amoxicillin Syrup', batch: 'B-2026-S01', qtyPrescribed: 1, qtyDispensed: 1, pharmacist: 'Ankit Gupta', time: '10:10 AM', returnQty: 0, status: 'Completed' },
];

const invoiceData = [
  { invoiceNo: 'INV-PH-001', date: '21-Feb-2026', patient: 'Mr. Rajesh Kumar', uhid: 'U-1001', rxId: 'RX-2026-001', items: 4, grossAmt: 450, discount: 0, gst: 54, netAmt: 504, payMode: 'Cash', status: 'Paid' },
  { invoiceNo: 'INV-PH-002', date: '21-Feb-2026', patient: 'Mrs. Sunita Devi', uhid: 'U-1002', rxId: 'RX-2026-002', items: 6, grossAmt: 1200, discount: 120, gst: 130, netAmt: 1210, payMode: 'Card', status: 'Paid' },
  { invoiceNo: 'INV-PH-003', date: '21-Feb-2026', patient: 'Mr. Amit Sharma', uhid: 'U-1003', rxId: 'RX-2026-003', items: 3, grossAmt: 300, discount: 0, gst: 36, netAmt: 336, payMode: 'UPI', status: 'Paid' },
  { invoiceNo: 'INV-PH-004', date: '21-Feb-2026', patient: 'Mrs. Kamla Devi', uhid: 'U-1006', rxId: 'RX-2026-006', items: 4, grossAmt: 950, discount: 50, gst: 108, netAmt: 1008, payMode: 'Insurance', status: 'Pending' },
  { invoiceNo: 'INV-PH-005', date: '20-Feb-2026', patient: 'Mr. Suresh Yadav', uhid: 'U-1005', rxId: 'RX-2026-005', items: 7, grossAmt: 2200, discount: 200, gst: 240, netAmt: 2240, payMode: 'Cash', status: 'Paid' },
];

const stockData = [
  { sno: 1, medicine: 'Paracetamol 500mg', category: 'Analgesic', openingStock: 1500, received: 500, dispensed: 800, adjustment: 0, closingStock: 1200, unit: 'Tabs', value: '₹3,000' },
  { sno: 2, medicine: 'Amoxicillin 250mg', category: 'Antibiotic', openingStock: 50, received: 0, dispensed: 42, adjustment: 0, closingStock: 8, unit: 'Caps', value: '₹96' },
  { sno: 3, medicine: 'Metformin 500mg', category: 'Anti-diabetic', openingStock: 1000, received: 200, dispensed: 350, adjustment: 0, closingStock: 850, unit: 'Tabs', value: '₹4,250' },
  { sno: 4, medicine: 'Insulin Glargine', category: 'Anti-diabetic', openingStock: 10, received: 0, dispensed: 7, adjustment: 0, closingStock: 3, unit: 'Vials', value: '₹2,550' },
  { sno: 5, medicine: 'Omeprazole 20mg', category: 'Antacid', openingStock: 700, received: 200, dispensed: 300, adjustment: 0, closingStock: 600, unit: 'Caps', value: '₹3,600' },
  { sno: 6, medicine: 'Azithromycin 500mg', category: 'Antibiotic', openingStock: 60, received: 0, dispensed: 15, adjustment: 0, closingStock: 45, unit: 'Tabs', value: '₹2,925' },
];

const stockBatchWiseData = [
  { medicine: 'Paracetamol 500mg', batch: 'B-2026-A01', mfgDate: '15-Jan-2026', expDate: '15-Dec-2027', qty: 800, mrp: 2.5, purchasePrice: 1.8, supplier: 'Cipla Ltd', rackNo: 'A-01' },
  { medicine: 'Paracetamol 500mg', batch: 'B-2025-P12', mfgDate: '10-Oct-2025', expDate: '10-Oct-2027', qty: 400, mrp: 2.5, purchasePrice: 1.7, supplier: 'Cipla Ltd', rackNo: 'A-01' },
  { medicine: 'Amoxicillin 250mg', batch: 'B-2026-A02', mfgDate: '01-Dec-2025', expDate: '15-Apr-2026', qty: 8, mrp: 12, purchasePrice: 8, supplier: 'Sun Pharma', rackNo: 'A-05' },
  { medicine: 'Metformin 500mg', batch: 'B-2026-A04', mfgDate: '20-Jan-2026', expDate: '30-Jun-2027', qty: 500, mrp: 5, purchasePrice: 3.2, supplier: 'USV Pvt Ltd', rackNo: 'B-02' },
  { medicine: 'Metformin 500mg', batch: 'B-2025-M08', mfgDate: '15-Aug-2025', expDate: '15-Aug-2027', qty: 350, mrp: 5, purchasePrice: 3, supplier: 'USV Pvt Ltd', rackNo: 'B-02' },
  { medicine: 'Insulin Glargine', batch: 'B-2026-A08', mfgDate: '05-Sep-2025', expDate: '05-Mar-2026', qty: 3, mrp: 850, purchasePrice: 620, supplier: 'Novo Nordisk', rackNo: 'Cold-01' },
];

const purchaseOrderData = [
  { poNo: 'PO-2026-005', date: '18-Feb-2026', supplier: 'Cipla Ltd', items: 12, totalQty: 5000, amount: '₹45,000', deliveryDate: '22-Feb-2026', createdBy: 'Admin', status: 'Delivered' },
  { poNo: 'PO-2026-006', date: '17-Feb-2026', supplier: 'Sun Pharma', items: 8, totalQty: 2500, amount: '₹32,000', deliveryDate: '23-Feb-2026', createdBy: 'Admin', status: 'In Transit' },
  { poNo: 'PO-2026-007', date: '16-Feb-2026', supplier: 'Dr. Reddy', items: 6, totalQty: 1800, amount: '₹28,500', deliveryDate: '24-Feb-2026', createdBy: 'Ankit Gupta', status: 'Approved' },
  { poNo: 'PO-2026-008', date: '15-Feb-2026', supplier: 'Alkem Labs', items: 10, totalQty: 3200, amount: '₹56,000', deliveryDate: '25-Feb-2026', createdBy: 'Admin', status: 'Pending Approval' },
  { poNo: 'PO-2026-009', date: '14-Feb-2026', supplier: 'Novo Nordisk', items: 3, totalQty: 50, amount: '₹1,25,000', deliveryDate: '20-Feb-2026', createdBy: 'Admin', status: 'Delivered' },
];

const purchaseOrderItemsData = [
  { poNo: 'PO-2026-005', sno: 1, medicine: 'Paracetamol 500mg', qty: 2000, unit: 'Tabs', rate: 1.8, amount: 3600, batch: 'B-2026-A01', expiry: '15-Dec-2027', received: 2000, status: 'Complete' },
  { poNo: 'PO-2026-005', sno: 2, medicine: 'Omeprazole 20mg', qty: 1000, unit: 'Caps', rate: 4, amount: 4000, batch: 'B-2026-A06', expiry: '20-Sep-2027', received: 1000, status: 'Complete' },
  { poNo: 'PO-2026-005', sno: 3, medicine: 'Azithromycin 500mg', qty: 500, unit: 'Tabs', rate: 45, amount: 22500, batch: 'B-2026-A07', expiry: '10-Aug-2026', received: 500, status: 'Complete' },
  { poNo: 'PO-2026-006', sno: 1, medicine: 'Amoxicillin 250mg', qty: 1000, unit: 'Caps', rate: 8, amount: 8000, batch: '-', expiry: '-', received: 0, status: 'Pending' },
  { poNo: 'PO-2026-006', sno: 2, medicine: 'Cetrizine 10mg', qty: 500, unit: 'Tabs', rate: 2, amount: 1000, batch: '-', expiry: '-', received: 0, status: 'Pending' },
  { poNo: 'PO-2026-007', sno: 1, medicine: 'Atorvastatin 10mg', qty: 800, unit: 'Tabs', rate: 5.5, amount: 4400, batch: '-', expiry: '-', received: 0, status: 'Pending' },
];

const stockAdjustmentData = [
  { adjId: 'ADJ-001', date: '20-Feb-2026', medicine: 'Cetrizine 10mg', batch: 'B-2026-A03', type: 'Damage', qtyBefore: 8, adjusted: -3, qtyAfter: 5, reason: 'Water damage in storage', adjustedBy: 'Admin', approvedBy: 'Dr. Mehta' },
  { adjId: 'ADJ-002', date: '18-Feb-2026', medicine: 'Paracetamol 500mg', batch: 'B-2026-A01', type: 'Found Surplus', qtyBefore: 1180, adjusted: 20, qtyAfter: 1200, reason: 'Physical count mismatch', adjustedBy: 'Ankit Gupta', approvedBy: 'Admin' },
  { adjId: 'ADJ-003', date: '15-Feb-2026', medicine: 'Insulin Glargine', batch: 'B-2026-A08', type: 'Expired Write-off', qtyBefore: 5, adjusted: -2, qtyAfter: 3, reason: 'Units found expired on inspection', adjustedBy: 'Renu Singh', approvedBy: 'Admin' },
  { adjId: 'ADJ-004', date: '12-Feb-2026', medicine: 'Omeprazole 20mg', batch: 'B-2026-A06', type: 'Transfer Out', qtyBefore: 700, adjusted: -100, qtyAfter: 600, reason: 'Transferred to Branch 2 - Delhi', adjustedBy: 'Admin', approvedBy: 'Admin' },
];

const supplierData = [
  { code: 'SUP-001', name: 'Cipla Ltd', contactPerson: 'Mr. Rakesh Sharma', phone: '9876543210', email: 'orders@cipla.com', gstNo: '09AABCC1234F1ZP', drugLicNo: 'DL-UP-2025-1001', address: 'Plot 12, Noida Sec-62', creditDays: 30, status: 'Active' },
  { code: 'SUP-002', name: 'Sun Pharma', contactPerson: 'Ms. Meera Patel', phone: '9876543211', email: 'sales@sunpharma.com', gstNo: '24AABCS5678G1ZX', drugLicNo: 'DL-GJ-2024-0567', address: 'Unit 5, Ahmedabad', creditDays: 45, status: 'Active' },
  { code: 'SUP-003', name: 'Dr. Reddy', contactPerson: 'Mr. Vinay Rao', phone: '9876543212', email: 'supply@drreddy.com', gstNo: '36AABCD9012H1ZY', drugLicNo: 'DL-TS-2025-0890', address: 'Banjara Hills, Hyderabad', creditDays: 30, status: 'Active' },
  { code: 'SUP-004', name: 'Novo Nordisk', contactPerson: 'Mr. Arjun Nair', phone: '9876543213', email: 'india@novonordisk.com', gstNo: '27AABEN3456I1ZW', drugLicNo: 'DL-MH-2025-1122', address: 'BKC, Mumbai', creditDays: 60, status: 'Active' },
  { code: 'SUP-005', name: 'Alkem Labs', contactPerson: 'Mr. Deepak Joshi', phone: '9876543214', email: 'trade@alkem.com', gstNo: '27AABCA7890J1ZV', drugLicNo: 'DL-MH-2024-0334', address: 'Andheri, Mumbai', creditDays: 30, status: 'Active' },
  { code: 'SUP-006', name: 'Ranbaxy (Sun)', contactPerson: 'Ms. Kavita Singh', phone: '9876543215', email: 'orders@ranbaxy.com', gstNo: '07AABCR1234K1ZU', drugLicNo: 'DL-DL-2023-0778', address: 'Connaught Place, Delhi', creditDays: 45, status: 'Inactive' },
];

const prescriptionHeaderData = [
  { rxId: 'RX-2026-001', uhid: 'U-1001', patient: 'Mr. Rajesh Kumar', age: '45Y', gender: 'M', doctor: 'Dr. Alok Mehta', dept: 'General Medicine', visitType: 'OPD', diagnosis: 'Acute Fever', allergies: 'None', date: '21-Feb-2026', status: 'Active' },
  { rxId: 'RX-2026-002', uhid: 'U-1002', patient: 'Mrs. Sunita Devi', age: '32Y', gender: 'F', doctor: 'Dr. Priya Singh', dept: 'Gynecology', visitType: 'OPD', diagnosis: 'PCOD', allergies: 'Sulfa drugs', date: '21-Feb-2026', status: 'Active' },
  { rxId: 'RX-2026-003', uhid: 'U-1003', patient: 'Mr. Amit Sharma', age: '28Y', gender: 'M', doctor: 'Dr. Rahul Verma', dept: 'Orthopedics', visitType: 'OPD', diagnosis: 'Knee Pain', allergies: 'None', date: '21-Feb-2026', status: 'Dispensed' },
  { rxId: 'RX-2026-004', uhid: 'U-1004', patient: 'Baby Riya', age: '2Y', gender: 'F', doctor: 'Dr. Neha Gupta', dept: 'Pediatrics', visitType: 'OPD', diagnosis: 'Cold & Cough', allergies: 'None', date: '21-Feb-2026', status: 'Active' },
];

const prescriptionItemsData = [
  { rxId: 'RX-2026-001', sno: 1, medicine: 'Paracetamol 500mg', dosage: '1-0-1', duration: '5 days', qty: 10, route: 'Oral', instruction: 'After food', substitution: 'Allowed', status: 'Dispensed' },
  { rxId: 'RX-2026-001', sno: 2, medicine: 'Azithromycin 500mg', dosage: '1-0-0', duration: '3 days', qty: 3, route: 'Oral', instruction: 'Before food', substitution: 'Not Allowed', status: 'Dispensed' },
  { rxId: 'RX-2026-001', sno: 3, medicine: 'Cetrizine 10mg', dosage: '0-0-1', duration: '5 days', qty: 5, route: 'Oral', instruction: 'At bedtime', substitution: 'Allowed', status: 'Dispensed' },
  { rxId: 'RX-2026-001', sno: 4, medicine: 'Omeprazole 20mg', dosage: '1-0-0', duration: '5 days', qty: 5, route: 'Oral', instruction: 'Empty stomach', substitution: 'Allowed', status: 'Dispensed' },
  { rxId: 'RX-2026-002', sno: 1, medicine: 'Metformin 500mg', dosage: '1-0-1', duration: '30 days', qty: 60, route: 'Oral', instruction: 'After food', substitution: 'Allowed', status: 'In Progress' },
  { rxId: 'RX-2026-002', sno: 2, medicine: 'Folic Acid 5mg', dosage: '1-0-0', duration: '30 days', qty: 30, route: 'Oral', instruction: 'Before food', substitution: 'Allowed', status: 'In Progress' },
];

/* ───────── TABS ───────── */

const tabs = [
  { key: 'overview', label: 'Overview', icon: BarChart3 },
  { key: 'prescriptions', label: 'Prescriptions', icon: ClipboardList },
  { key: 'rx-header', label: 'Rx Header', icon: FileText },
  { key: 'rx-items', label: 'Rx Items', icon: ClipboardList },
  { key: 'medicine-master', label: 'Medicine Master', icon: BookOpen },
  { key: 'inventory', label: 'Inventory', icon: Package },
  { key: 'stock', label: 'Stock', icon: Archive },
  { key: 'stock-batchwise', label: 'Stock Batch-Wise', icon: Layers },
  { key: 'dispensing', label: 'Dispensing', icon: Pill },
  { key: 'dispense-records', label: 'Dispense Records', icon: Receipt },
  { key: 'invoices', label: 'Invoices', icon: Receipt },
  { key: 'billing', label: 'Billing & Insurance', icon: CreditCard },
  { key: 'insurance-claims', label: 'Insurance Claims', icon: ShieldCheck },
  { key: 'purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
  { key: 'po-items', label: 'PO Items', icon: ClipboardList },
  { key: 'grn', label: 'GRN', icon: Download },
  { key: 'suppliers', label: 'Suppliers', icon: UserCheck },
  { key: 'vendors', label: 'Vendors', icon: Truck },
  { key: 'inter-branch', label: 'Inter-Branch Transfer', icon: ArrowLeftRight },
  { key: 'stock-adjustment', label: 'Stock Adjustment', icon: Wrench },
  { key: 'doctor-analytics', label: 'Doctor Analytics', icon: Activity },
  { key: 'expiry', label: 'Expiry & Compliance', icon: ShieldCheck },
  { key: 'reports', label: 'Reports', icon: FileText },
  { key: 'alerts', label: 'Alerts', icon: Bell },
  { key: 'audit', label: 'Audit Logs', icon: FileText },
];

/* ───────── STATUS BADGE ───────── */
const StatusBadge = ({ status }: { status: string }) => {
  const cls =
    status === 'Dispensed' || status === 'Paid' || status === 'OK' || status === 'Verified' || status === 'Complete' || status === 'Completed' || status === 'Approved' || status === 'Settled' || status === 'Received' || status === 'Active' || status === 'Delivered'
      ? 'bg-hms-success text-hms-success-foreground'
      : status === 'Pending' || status === 'Low' || status === 'Partial' || status === 'Pending Approval' || status === 'Pending QC' || status === 'Under Review' || status === 'In Transit'
        ? 'bg-hms-warning text-foreground'
        : status === 'In Progress'
          ? 'bg-hms-info text-hms-success-foreground'
          : status === 'Critical' || status === 'Insurance' || status === 'Rejected' || status === 'Inactive'
            ? 'bg-destructive text-destructive-foreground'
            : status === 'Partial Return'
              ? 'bg-hms-info text-hms-success-foreground'
              : 'bg-muted text-foreground';
  return <span className={`px-2 py-0.5 text-[10px] font-bold ${cls}`}>{status}</span>;
};

/* ───────── TAB PANELS ───────── */

const OverviewPanel = () => (
  <div className="space-y-3">
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-card border border-border p-2">
        <h4 className="text-xs font-bold mb-1">Doctor-wise Prescriptions (This Month)</h4>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={doctorWiseChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 11 }} />
            <Bar dataKey="rx" fill="hsl(0,100%,50%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card border border-border p-2">
        <h4 className="text-xs font-bold mb-1">Stock Movement (This Week)</h4>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={stockUsageChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Line type="monotone" dataKey="dispensed" stroke="hsl(0,100%,50%)" strokeWidth={2} />
            <Line type="monotone" dataKey="received" stroke="hsl(120,40%,45%)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card border border-border p-2">
        <h4 className="text-xs font-bold mb-1">Dispensing by Category</h4>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={categoryPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: 9 }}>
              {categoryPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div>
      <div className="hms-section-header">Live Prescription Queue</div>
      <table className="hms-table">
        <thead><tr><th>Rx ID</th><th>UHID</th><th>Patient</th><th>Age</th><th>Doctor</th><th>Dept</th><th>Diagnosis</th><th>Items</th><th>Time</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {prescriptionQueue.map(p => (
            <tr key={p.id}><td>{p.id}</td><td>{p.uhid}</td><td>{p.patient}</td><td>{p.age}</td><td>{p.doctor}</td><td>{p.dept}</td><td>{p.diagnosis}</td><td>{p.items}</td><td>{p.time}</td>
              <td><StatusBadge status={p.status} /></td>
              <td className="flex gap-1"><Eye size={13} className="text-primary cursor-pointer" /><Printer size={13} className="text-primary cursor-pointer" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <div className="hms-section-header">Low Stock Items</div>
        <table className="hms-table">
          <thead><tr><th>Medicine</th><th>Stock</th><th>Min Stock</th><th>Supplier</th><th>Status</th></tr></thead>
          <tbody>
            {inventoryData.filter(i => i.status !== 'OK').map((i, idx) => (
              <tr key={idx}><td>{i.name}</td><td className="text-destructive font-bold">{i.stock}</td><td>{i.minStock}</td><td>{i.supplier}</td><td><StatusBadge status={i.status} /></td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <div className="hms-section-header">Expiry Alerts (Next 60 Days)</div>
        <table className="hms-table">
          <thead><tr><th>Medicine</th><th>Batch</th><th>Expiry</th><th>Days Left</th><th>Action</th></tr></thead>
          <tbody>
            {expiryAlerts.slice(0, 4).map((e, idx) => (
              <tr key={idx} className={e.daysLeft <= 14 ? 'text-destructive font-semibold' : ''}><td>{e.name}</td><td>{e.batch}</td><td>{e.expiry}</td><td>{e.daysLeft}</td><td>{e.action}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const PrescriptionsPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <input className="hms-input w-48" placeholder="Search Rx ID / Patient..." />
      <select className="hms-select"><option>All Doctors</option>{doctorPrescriptions.map(d => <option key={d.doctor}>{d.doctor}</option>)}</select>
      <select className="hms-select"><option>All Status</option><option>Pending</option><option>In Progress</option><option>Dispensed</option></select>
      <select className="hms-select"><option>Today</option><option>Last 7 Days</option><option>This Month</option></select>
      <button className="hms-btn-primary"><Search size={12} /> Search</button>
    </div>
    <div className="hms-section-header">Prescription Management</div>
    <table className="hms-table">
      <thead><tr><th>S.No</th><th>Rx ID</th><th>UHID</th><th>Patient</th><th>Age</th><th>Doctor</th><th>Department</th><th>Diagnosis</th><th>Items</th><th>Date/Time</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>
        {prescriptionQueue.map((p, i) => (
          <tr key={p.id}><td>{i + 1}</td><td>{p.id}</td><td>{p.uhid}</td><td>{p.patient}</td><td>{p.age}</td><td>{p.doctor}</td><td>{p.dept}</td><td>{p.diagnosis}</td><td>{p.items}</td><td>21-Feb-2026 {p.time}</td>
            <td><StatusBadge status={p.status} /></td>
            <td className="flex gap-1"><Eye size={13} className="text-primary cursor-pointer" /><Printer size={13} className="text-primary cursor-pointer" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const RxHeaderPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <input className="hms-input w-48" placeholder="Search Rx ID / UHID..." />
      <select className="hms-select"><option>All Departments</option><option>General Medicine</option><option>Gynecology</option><option>Orthopedics</option><option>Pediatrics</option></select>
      <select className="hms-select"><option>Today</option><option>Last 7 Days</option><option>This Month</option></select>
      <button className="hms-btn-primary"><Search size={12} /> Search</button>
    </div>
    <div className="hms-section-header">Prescription Headers</div>
    <table className="hms-table">
      <thead><tr><th>Rx ID</th><th>UHID</th><th>Patient</th><th>Age</th><th>Gender</th><th>Doctor</th><th>Dept</th><th>Visit</th><th>Diagnosis</th><th>Allergies</th><th>Date</th><th>Status</th></tr></thead>
      <tbody>
        {prescriptionHeaderData.map(p => (
          <tr key={p.rxId}><td>{p.rxId}</td><td>{p.uhid}</td><td>{p.patient}</td><td>{p.age}</td><td>{p.gender}</td><td>{p.doctor}</td><td>{p.dept}</td><td>{p.visitType}</td><td>{p.diagnosis}</td><td>{p.allergies}</td><td>{p.date}</td>
            <td><StatusBadge status={p.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const RxItemsPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <input className="hms-input w-48" placeholder="Search Rx ID..." />
      <select className="hms-select"><option>All Rx</option>{prescriptionHeaderData.map(p => <option key={p.rxId}>{p.rxId}</option>)}</select>
      <button className="hms-btn-primary"><Search size={12} /> Search</button>
    </div>
    <div className="hms-section-header">Prescription Items Detail</div>
    <table className="hms-table">
      <thead><tr><th>Rx ID</th><th>S.No</th><th>Medicine</th><th>Dosage</th><th>Duration</th><th>Qty</th><th>Route</th><th>Instruction</th><th>Substitution</th><th>Status</th></tr></thead>
      <tbody>
        {prescriptionItemsData.map((p, i) => (
          <tr key={i}><td>{p.rxId}</td><td>{p.sno}</td><td>{p.medicine}</td><td>{p.dosage}</td><td>{p.duration}</td><td>{p.qty}</td><td>{p.route}</td><td>{p.instruction}</td><td>{p.substitution}</td>
            <td><StatusBadge status={p.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const MedicineMasterPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <input className="hms-input w-48" placeholder="Search Medicine..." />
      <select className="hms-select"><option>All Categories</option><option>Analgesic</option><option>Antibiotic</option><option>Anti-diabetic</option><option>NSAID</option></select>
      <select className="hms-select"><option>All Schedules</option><option>OTC</option><option>H</option><option>H1</option><option>X</option></select>
      <button className="hms-btn-primary"><Search size={12} /> Search</button>
      <button className="hms-btn-success">+ Add Medicine</button>
    </div>
    <div className="hms-section-header">Medicine Master List</div>
    <table className="hms-table">
      <thead><tr><th>Code</th><th>Medicine Name</th><th>Generic Name</th><th>Category</th><th>Schedule</th><th>Form</th><th>Strength</th><th>HSN</th><th>GST</th><th>Rack</th><th>Status</th></tr></thead>
      <tbody>
        {medicineMasterData.map(m => (
          <tr key={m.code}><td>{m.code}</td><td>{m.name}</td><td>{m.genericName}</td><td>{m.category}</td><td>{m.schedule}</td><td>{m.form}</td><td>{m.strength}</td><td>{m.hsnCode}</td><td>{m.gst}</td><td>{m.rackNo}</td>
            <td><StatusBadge status={m.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const InventoryPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <input className="hms-input w-48" placeholder="Search Medicine..." />
      <select className="hms-select"><option>All Categories</option><option>Analgesic</option><option>Antibiotic</option><option>Anti-diabetic</option><option>Cardiac</option></select>
      <select className="hms-select"><option>All Status</option><option>OK</option><option>Low</option><option>Critical</option></select>
      <button className="hms-btn-primary">Search</button>
      <button className="hms-btn-success">+ Add Medicine</button>
    </div>
    <div className="hms-section-header">Medicine Inventory</div>
    <table className="hms-table">
      <thead><tr><th>S.No</th><th>Medicine Name</th><th>Batch No</th><th>Category</th><th>Stock</th><th>Min Stock</th><th>Unit</th><th>MRP (₹)</th><th>Expiry</th><th>Supplier</th><th>Status</th></tr></thead>
      <tbody>
        {inventoryData.map(i => (
          <tr key={i.sno} className={i.status === 'Critical' ? 'text-destructive font-semibold' : ''}>
            <td>{i.sno}</td><td>{i.name}</td><td>{i.batch}</td><td>{i.category}</td>
            <td className={i.stock < i.minStock ? 'text-destructive font-bold' : ''}>{i.stock}</td>
            <td>{i.minStock}</td><td>{i.unit}</td><td>{i.mrp}</td><td>{i.expiry}</td><td>{i.supplier}</td>
            <td><StatusBadge status={i.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const StockPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <input className="hms-input w-48" placeholder="Search Medicine..." />
      <select className="hms-select"><option>Today</option><option>This Week</option><option>This Month</option></select>
      <button className="hms-btn-primary"><Search size={12} /> Search</button>
      <button className="hms-btn-primary"><Download size={12} /> Export</button>
    </div>
    <div className="hms-section-header">Pharmacy Stock Summary</div>
    <table className="hms-table">
      <thead><tr><th>S.No</th><th>Medicine</th><th>Category</th><th>Opening</th><th>Received</th><th>Dispensed</th><th>Adjustment</th><th>Closing</th><th>Unit</th><th>Stock Value</th></tr></thead>
      <tbody>
        {stockData.map(s => (
          <tr key={s.sno}><td>{s.sno}</td><td>{s.medicine}</td><td>{s.category}</td><td>{s.openingStock}</td><td className="text-hms-success font-semibold">{s.received}</td><td className="text-destructive font-semibold">{s.dispensed}</td><td>{s.adjustment}</td><td className="font-bold">{s.closingStock}</td><td>{s.unit}</td><td>{s.value}</td></tr>
        ))}
      </tbody>
    </table>
  </div>
);

const StockBatchWisePanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <input className="hms-input w-48" placeholder="Search Medicine / Batch..." />
      <button className="hms-btn-primary"><Search size={12} /> Search</button>
    </div>
    <div className="hms-section-header">Stock — Batch-Wise Detail</div>
    <table className="hms-table">
      <thead><tr><th>Medicine</th><th>Batch No</th><th>Mfg Date</th><th>Exp Date</th><th>Qty</th><th>MRP (₹)</th><th>Purchase Price (₹)</th><th>Supplier</th><th>Rack No</th></tr></thead>
      <tbody>
        {stockBatchWiseData.map((s, i) => (
          <tr key={i}><td>{s.medicine}</td><td>{s.batch}</td><td>{s.mfgDate}</td><td>{s.expDate}</td><td>{s.qty}</td><td>{s.mrp}</td><td>{s.purchasePrice}</td><td>{s.supplier}</td><td>{s.rackNo}</td></tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DispensingPanel = () => (
  <div>
    <div className="hms-section-header">Dispensing Tracking</div>
    <table className="hms-table">
      <thead><tr><th>ID</th><th>Rx ID</th><th>Patient</th><th>UHID</th><th>Medicine & Qty</th><th>Pharmacist</th><th>Time</th><th>Amount</th><th>Payment</th></tr></thead>
      <tbody>
        {dispensingLog.map(d => (
          <tr key={d.id}><td>{d.id}</td><td>{d.rxId}</td><td>{d.patient}</td><td>{d.uhid}</td><td>{d.medicine}</td><td>{d.pharmacist}</td><td>{d.time}</td><td>{d.amount}</td>
            <td><StatusBadge status={d.payStatus} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DispenseRecordsPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <input className="hms-input w-48" placeholder="Search Dispense ID / Rx ID..." />
      <select className="hms-select"><option>All Status</option><option>Completed</option><option>Partial Return</option></select>
      <button className="hms-btn-primary"><Search size={12} /> Search</button>
    </div>
    <div className="hms-section-header">Pharmacy Dispense Records</div>
    <table className="hms-table">
      <thead><tr><th>Dispense ID</th><th>Rx ID</th><th>Patient</th><th>UHID</th><th>Medicine</th><th>Batch</th><th>Qty Prescribed</th><th>Qty Dispensed</th><th>Return Qty</th><th>Pharmacist</th><th>Time</th><th>Status</th></tr></thead>
      <tbody>
        {dispenseRecordData.map(d => (
          <tr key={d.dispenseId}><td>{d.dispenseId}</td><td>{d.rxId}</td><td>{d.patient}</td><td>{d.uhid}</td><td>{d.medicine}</td><td>{d.batch}</td><td>{d.qtyPrescribed}</td><td>{d.qtyDispensed}</td><td>{d.returnQty}</td><td>{d.pharmacist}</td><td>{d.time}</td>
            <td><StatusBadge status={d.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const InvoicesPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <input className="hms-input w-48" placeholder="Search Invoice No / Patient..." />
      <select className="hms-select"><option>Today</option><option>Last 7 Days</option><option>This Month</option></select>
      <button className="hms-btn-primary"><Search size={12} /> Search</button>
      <button className="hms-btn-success">+ New Invoice</button>
    </div>
    <div className="hms-section-header">Pharmacy Invoices</div>
    <table className="hms-table">
      <thead><tr><th>Invoice No</th><th>Date</th><th>Patient</th><th>UHID</th><th>Rx ID</th><th>Items</th><th>Gross (₹)</th><th>Discount (₹)</th><th>GST (₹)</th><th>Net (₹)</th><th>Pay Mode</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>
        {invoiceData.map(inv => (
          <tr key={inv.invoiceNo}><td>{inv.invoiceNo}</td><td>{inv.date}</td><td>{inv.patient}</td><td>{inv.uhid}</td><td>{inv.rxId}</td><td>{inv.items}</td><td>{inv.grossAmt}</td><td>{inv.discount}</td><td>{inv.gst}</td><td className="font-bold">{inv.netAmt}</td><td>{inv.payMode}</td>
            <td><StatusBadge status={inv.status} /></td>
            <td><Printer size={13} className="text-primary cursor-pointer" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const BillingPanel = () => (
  <div>
    <div className="hms-section-header">Pharmacy Billing & Insurance</div>
    <table className="hms-table">
      <thead><tr><th>Bill No</th><th>Patient</th><th>UHID</th><th>Items</th><th>Gross (₹)</th><th>Discount (₹)</th><th>Net (₹)</th><th>Mode</th><th>Insurance</th><th>Status</th></tr></thead>
      <tbody>
        {billingData.map(b => (
          <tr key={b.billNo}><td>{b.billNo}</td><td>{b.patient}</td><td>{b.uhid}</td><td>{b.items}</td><td>{b.gross}</td><td>{b.discount}</td><td>{b.net}</td><td>{b.mode}</td><td>{b.insurance}</td>
            <td><StatusBadge status={b.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const InsuranceClaimsPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <input className="hms-input w-48" placeholder="Search Claim ID / Patient..." />
      <select className="hms-select"><option>All Insurers</option><option>Star Health</option><option>ICICI Lombard</option><option>HDFC Ergo</option><option>Bajaj Allianz</option></select>
      <select className="hms-select"><option>All Status</option><option>Submitted</option><option>Under Review</option><option>Approved</option><option>Rejected</option><option>Settled</option></select>
      <button className="hms-btn-primary"><Search size={12} /> Search</button>
      <button className="hms-btn-success">+ New Claim</button>
    </div>
    <div className="hms-section-header">Insurance Claims</div>
    <table className="hms-table">
      <thead><tr><th>Claim ID</th><th>Patient</th><th>UHID</th><th>Insurer</th><th>Policy No</th><th>Bill Amt (₹)</th><th>Claim Amt (₹)</th><th>TPA</th><th>Submitted On</th><th>Status</th></tr></thead>
      <tbody>
        {insuranceClaimsData.map(c => (
          <tr key={c.claimId}><td>{c.claimId}</td><td>{c.patient}</td><td>{c.uhid}</td><td>{c.insurer}</td><td>{c.policyNo}</td><td>{c.billAmt}</td><td>{c.claimAmt}</td><td>{c.tpa}</td><td>{c.submittedOn}</td>
            <td><StatusBadge status={c.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PurchaseOrdersPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <input className="hms-input w-48" placeholder="Search PO No..." />
      <select className="hms-select"><option>All Suppliers</option>{vendorData.map(v => <option key={v.vendor}>{v.vendor}</option>)}</select>
      <select className="hms-select"><option>All Status</option><option>Pending Approval</option><option>Approved</option><option>In Transit</option><option>Delivered</option></select>
      <button className="hms-btn-primary"><Search size={12} /> Search</button>
      <button className="hms-btn-success">+ New Purchase Order</button>
    </div>
    <div className="hms-section-header">Purchase Orders</div>
    <table className="hms-table">
      <thead><tr><th>PO No</th><th>Date</th><th>Supplier</th><th>Items</th><th>Total Qty</th><th>Amount</th><th>Delivery Date</th><th>Created By</th><th>Status</th></tr></thead>
      <tbody>
        {purchaseOrderData.map(po => (
          <tr key={po.poNo}><td>{po.poNo}</td><td>{po.date}</td><td>{po.supplier}</td><td>{po.items}</td><td>{po.totalQty}</td><td>{po.amount}</td><td>{po.deliveryDate}</td><td>{po.createdBy}</td>
            <td><StatusBadge status={po.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const POItemsPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <select className="hms-select"><option>All POs</option>{purchaseOrderData.map(po => <option key={po.poNo}>{po.poNo}</option>)}</select>
      <button className="hms-btn-primary"><Search size={12} /> Filter</button>
    </div>
    <div className="hms-section-header">Purchase Order Items</div>
    <table className="hms-table">
      <thead><tr><th>PO No</th><th>S.No</th><th>Medicine</th><th>Qty</th><th>Unit</th><th>Rate (₹)</th><th>Amount (₹)</th><th>Batch</th><th>Expiry</th><th>Received</th><th>Status</th></tr></thead>
      <tbody>
        {purchaseOrderItemsData.map((item, i) => (
          <tr key={i}><td>{item.poNo}</td><td>{item.sno}</td><td>{item.medicine}</td><td>{item.qty}</td><td>{item.unit}</td><td>{item.rate}</td><td>{item.amount}</td><td>{item.batch}</td><td>{item.expiry}</td><td>{item.received}</td>
            <td><StatusBadge status={item.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const GRNPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <input className="hms-input w-48" placeholder="Search GRN No / PO No..." />
      <select className="hms-select"><option>All Status</option><option>Verified</option><option>Pending QC</option><option>Rejected</option></select>
      <button className="hms-btn-primary"><Search size={12} /> Search</button>
      <button className="hms-btn-success">+ New GRN</button>
    </div>
    <div className="hms-section-header">Goods Received Notes (GRN)</div>
    <table className="hms-table">
      <thead><tr><th>GRN No</th><th>PO No</th><th>Supplier</th><th>Date</th><th>Items</th><th>Total Qty</th><th>Amount</th><th>Received By</th><th>Status</th></tr></thead>
      <tbody>
        {grnData.map(g => (
          <tr key={g.grnNo}><td>{g.grnNo}</td><td>{g.poNo}</td><td>{g.supplier}</td><td>{g.date}</td><td>{g.items}</td><td>{g.totalQty}</td><td>{g.amount}</td><td>{g.receivedBy}</td>
            <td><StatusBadge status={g.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SuppliersPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <input className="hms-input w-48" placeholder="Search Supplier..." />
      <select className="hms-select"><option>All Status</option><option>Active</option><option>Inactive</option></select>
      <button className="hms-btn-primary"><Search size={12} /> Search</button>
      <button className="hms-btn-success">+ Add Supplier</button>
    </div>
    <div className="hms-section-header">Supplier Master</div>
    <table className="hms-table">
      <thead><tr><th>Code</th><th>Supplier Name</th><th>Contact Person</th><th>Phone</th><th>Email</th><th>GST No</th><th>Drug Lic No</th><th>Address</th><th>Credit Days</th><th>Status</th></tr></thead>
      <tbody>
        {supplierData.map(s => (
          <tr key={s.code}><td>{s.code}</td><td>{s.name}</td><td>{s.contactPerson}</td><td>{s.phone}</td><td>{s.email}</td><td className="text-[9px]">{s.gstNo}</td><td className="text-[9px]">{s.drugLicNo}</td><td className="text-[9px]">{s.address}</td><td>{s.creditDays}</td>
            <td><StatusBadge status={s.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const InterBranchPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <input className="hms-input w-48" placeholder="Search Transfer ID..." />
      <select className="hms-select"><option>All Status</option><option>Pending Approval</option><option>In Transit</option><option>Received</option><option>Completed</option></select>
      <button className="hms-btn-primary"><Search size={12} /> Search</button>
      <button className="hms-btn-success">+ New Transfer</button>
    </div>
    <div className="hms-section-header">Inter-Branch Stock Transfer</div>
    <table className="hms-table">
      <thead><tr><th>Transfer ID</th><th>From Branch</th><th>To Branch</th><th>Medicine</th><th>Batch</th><th>Qty</th><th>Requested By</th><th>Date</th><th>Status</th></tr></thead>
      <tbody>
        {interBranchTransferData.map(t => (
          <tr key={t.transferId}><td>{t.transferId}</td><td>{t.fromBranch}</td><td>{t.toBranch}</td><td>{t.medicine}</td><td>{t.batch}</td><td>{t.qty}</td><td>{t.requestedBy}</td><td>{t.date}</td>
            <td><StatusBadge status={t.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const StockAdjustmentPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <input className="hms-input w-48" placeholder="Search Adjustment ID..." />
      <select className="hms-select"><option>All Types</option><option>Damage</option><option>Found Surplus</option><option>Expired Write-off</option><option>Transfer Out</option></select>
      <button className="hms-btn-primary"><Search size={12} /> Search</button>
      <button className="hms-btn-success">+ New Adjustment</button>
    </div>
    <div className="hms-section-header">Stock Adjustments</div>
    <table className="hms-table">
      <thead><tr><th>Adj ID</th><th>Date</th><th>Medicine</th><th>Batch</th><th>Type</th><th>Qty Before</th><th>Adjusted</th><th>Qty After</th><th>Reason</th><th>Adjusted By</th><th>Approved By</th></tr></thead>
      <tbody>
        {stockAdjustmentData.map(a => (
          <tr key={a.adjId}><td>{a.adjId}</td><td>{a.date}</td><td>{a.medicine}</td><td>{a.batch}</td><td>{a.type}</td><td>{a.qtyBefore}</td>
            <td className={a.adjusted < 0 ? 'text-destructive font-bold' : 'text-hms-success font-bold'}>{a.adjusted > 0 ? `+${a.adjusted}` : a.adjusted}</td>
            <td className="font-bold">{a.qtyAfter}</td><td className="text-[9px]">{a.reason}</td><td>{a.adjustedBy}</td><td>{a.approvedBy}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DoctorAnalyticsPanel = () => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-card border border-border p-2">
        <h4 className="text-xs font-bold mb-1">Prescriptions by Doctor</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={doctorWiseChart} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 10 }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={70} />
            <Tooltip contentStyle={{ fontSize: 11 }} />
            <Bar dataKey="rx" fill="hsl(0,100%,50%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card border border-border p-2">
        <h4 className="text-xs font-bold mb-1">Generic vs Branded Usage</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={[{ name: 'Generic', value: 66 }, { name: 'Branded', value: 34 }]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label style={{ fontSize: 10 }}>
              <Cell fill="hsl(120,40%,45%)" />
              <Cell fill="hsl(0,100%,50%)" />
            </Pie>
            <Tooltip contentStyle={{ fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="hms-section-header">Doctor-wise Prescription Details</div>
    <table className="hms-table">
      <thead><tr><th>Doctor</th><th>Department</th><th>Total Rx</th><th>Top Drug</th><th>Generic %</th><th>Branded %</th><th>Avg Items/Rx</th></tr></thead>
      <tbody>
        {doctorPrescriptions.map(d => (
          <tr key={d.doctor}><td>{d.doctor}</td><td>{d.dept}</td><td>{d.totalRx}</td><td>{d.topDrug}</td><td>{d.generic}</td><td>{d.branded}</td><td>{d.avgItems}</td></tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ExpiryPanel = () => (
  <div>
    <div className="hms-section-header">Expiry & Compliance Monitoring</div>
    <table className="hms-table">
      <thead><tr><th>Medicine</th><th>Batch</th><th>Expiry Date</th><th>Stock</th><th>Days Left</th><th>Recommended Action</th></tr></thead>
      <tbody>
        {expiryAlerts.map((e, i) => (
          <tr key={i} className={e.daysLeft <= 14 ? 'text-destructive font-bold' : e.daysLeft <= 30 ? 'text-foreground font-semibold' : ''}>
            <td>{e.name}</td><td>{e.batch}</td><td>{e.expiry}</td><td>{e.stock}</td><td>{e.daysLeft}</td><td>{e.action}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="mt-3">
      <div className="hms-section-header">Compliance Logs</div>
      <div className="bg-card border border-border p-2 space-y-1 text-xs">
        <p>✅ Schedule H drug register updated — 20-Feb-2026</p>
        <p>✅ Narcotic drug register verified — 18-Feb-2026</p>
        <p>⚠️ Drug license renewal due — 15-Mar-2026</p>
        <p>✅ Temperature log (2-8°C Cold Storage) — Normal — 21-Feb-2026</p>
      </div>
    </div>
  </div>
);

const VendorsPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <button className="hms-btn-success">+ New Purchase Order</button>
      <button className="hms-btn-primary">GRN Entry</button>
    </div>
    <div className="hms-section-header">Vendor / Supplier Management</div>
    <table className="hms-table">
      <thead><tr><th>Vendor</th><th>Contact</th><th>Total Orders</th><th>Pending</th><th>Last Order</th><th>Amount</th><th>Rating</th></tr></thead>
      <tbody>
        {vendorData.map(v => (
          <tr key={v.vendor}><td>{v.vendor}</td><td>{v.contact}</td><td>{v.orders}</td><td>{v.pending}</td><td>{v.lastOrder}</td><td>{v.amount}</td><td>{v.rating}</td></tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ReportsPanel = () => (
  <div className="space-y-3">
    <div className="bg-card border border-border p-2">
      <h4 className="text-xs font-bold mb-1">Weekly Sales Trend</h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={salesTrendChart}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip contentStyle={{ fontSize: 11 }} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar dataKey="sales" fill="hsl(0,100%,50%)" name="Sales (₹)" />
          <Bar dataKey="returns" fill="hsl(0,0%,60%)" name="Returns (₹)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div className="hms-section-header">Quick Reports</div>
    <div className="grid grid-cols-3 gap-2">
      {['Daily Sales Report', 'Weekly Summary', 'Monthly Revenue', 'Stock Consumption', 'Fast Moving Items', 'Slow Moving Items',
        'Profit Margin Report', 'Expiry Loss Report', 'Doctor-wise Sales'].map((r, i) => (
        <div key={i} className="bg-card border border-border p-2 hover:bg-muted cursor-pointer flex items-center gap-2">
          <Download size={12} className="text-primary" />
          <span className="text-xs font-semibold">{r}</span>
        </div>
      ))}
    </div>
  </div>
);

const AlertsPanel = () => (
  <div>
    <div className="hms-section-header">Alerts & Notifications</div>
    <div className="bg-card border border-border p-2 space-y-1.5">
      <p className="text-xs">🔴 <strong>CRITICAL:</strong> Insulin Glargine stock at 3 units (Min: 10) — Reorder immediately</p>
      <p className="text-xs">🔴 <strong>CRITICAL:</strong> Cetrizine 10mg expires in 7 days — 5 units remaining</p>
      <p className="text-xs">🟡 <strong>LOW STOCK:</strong> Amoxicillin 250mg — 8 units (Min: 30)</p>
      <p className="text-xs">🟡 <strong>LOW STOCK:</strong> Atorvastatin 10mg — 15 units (Min: 50)</p>
      <p className="text-xs">🟡 <strong>EXPIRY:</strong> Insulin Glargine expires in 12 days</p>
      <p className="text-xs">🔵 <strong>PAYMENT:</strong> 8 pending pharmacy bills totaling ₹45,200</p>
      <p className="text-xs">🔵 <strong>INSURANCE:</strong> 2 claims pending approval (Star Health, ICICI Lombard)</p>
      <p className="text-xs">⚠️ <strong>HIGH-RISK:</strong> Schedule H drug dispensing requires double verification</p>
      <p className="text-xs">✅ Drug license valid till 15-Mar-2026 — Renewal reminder sent</p>
    </div>
  </div>
);

const AuditPanel = () => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <input className="hms-input w-40" placeholder="Search logs..." />
      <select className="hms-select"><option>All Modules</option><option>Dispensing</option><option>Inventory</option><option>Alerts</option></select>
      <select className="hms-select"><option>Today</option><option>Last 7 Days</option><option>This Month</option></select>
      <button className="hms-btn-primary">Filter</button>
    </div>
    <div className="hms-section-header">Audit Logs</div>
    <table className="hms-table">
      <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Detail</th><th>Module</th></tr></thead>
      <tbody>
        {auditLogs.map((a, i) => (
          <tr key={i}><td>{a.time}</td><td>{a.user}</td><td>{a.action}</td><td className="max-w-xs truncate">{a.detail}</td><td>{a.module}</td></tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ───────── MAIN COMPONENT ───────── */

const Pharmacy = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const panelMap: Record<string, React.ReactNode> = {
    overview: <OverviewPanel />,
    prescriptions: <PrescriptionsPanel />,
    'rx-header': <RxHeaderPanel />,
    'rx-items': <RxItemsPanel />,
    'medicine-master': <MedicineMasterPanel />,
    inventory: <InventoryPanel />,
    stock: <StockPanel />,
    'stock-batchwise': <StockBatchWisePanel />,
    dispensing: <DispensingPanel />,
    'dispense-records': <DispenseRecordsPanel />,
    invoices: <InvoicesPanel />,
    billing: <BillingPanel />,
    'insurance-claims': <InsuranceClaimsPanel />,
    'purchase-orders': <PurchaseOrdersPanel />,
    'po-items': <POItemsPanel />,
    grn: <GRNPanel />,
    suppliers: <SuppliersPanel />,
    vendors: <VendorsPanel />,
    'inter-branch': <InterBranchPanel />,
    'stock-adjustment': <StockAdjustmentPanel />,
    'doctor-analytics': <DoctorAnalyticsPanel />,
    expiry: <ExpiryPanel />,
    reports: <ReportsPanel />,
    alerts: <AlertsPanel />,
    audit: <AuditPanel />,
  };

  return (
    <div>
      {/* Header */}
      <div className="hms-section-header flex items-center justify-between">
        <span className="flex items-center gap-2"><Pill size={16} /> Pharmacy Dashboard — GUC HMS</span>
        <span className="text-[10px] font-normal">21-Feb-2026 | Pharmacist: Ankit Gupta</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-2 my-2">
        {kpiCards.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className="bg-card border border-border p-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase">{k.label}</p>
                  <p className="text-base font-bold text-foreground">{k.value}</p>
                  <p className="text-[9px] text-muted-foreground">{k.change}</p>
                </div>
                <Icon size={22} className="text-primary opacity-70" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tab Navigation — module style */}
      <div className="bg-primary flex items-center gap-0 overflow-x-auto">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1 px-3 py-2 text-[11px] font-semibold whitespace-nowrap transition-colors
                ${activeTab === t.key
                  ? 'bg-card text-foreground'
                  : 'text-primary-foreground hover:bg-primary-foreground/10'
                }`}
            >
              <Icon size={12} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-2">
        {panelMap[activeTab]}
      </div>
    </div>
  );
};

export default Pharmacy;
