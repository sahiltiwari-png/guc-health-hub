import React, { useState, useEffect } from 'react';
import { createMedicine, createPharmacyDispense, createPharmacyInvoice, createPharmacyStock, createPharmacySupplier, getGRNs, getInsuranceClaims, getPharmacyDispenses, getPharmacyInvoices, getPharmacyPrescriptions, getPharmacyStocks, getPharmacySuppliers, getPurchaseOrders, getStockAdjustments, getStockTransfers, listMedicines } from "@/api/apiService";
import {
  Pill, ClipboardList, Package, TrendingUp, AlertTriangle, CreditCard,
  Users, FileText, Eye, Printer, Search, BarChart3, ShieldCheck,
  Truck, Activity, Bell, Clock, ChevronDown, Download, ArrowLeftRight,
  BookOpen, Receipt, Layers, ShoppingCart, Wrench, UserCheck, Archive
} from 'lucide-react';

/* ───────── DUMMY DATA ───────── */

const kpiCards = [
  { label: 'Total Rx Today', value: '187', icon: ClipboardList, change: '+12 vs yesterday', color: 'bg-primary' },
  { label: 'Medicines Dispensed', value: '1,243', icon: Pill, change: '98% fulfilment', color: 'bg-hms-success' },
  { label: 'Low Stock Items', value: '14', icon: AlertTriangle, change: '3 critical', color: 'bg-hms-warning' },
  { label: 'Expiring Soon', value: '23', icon: Clock, change: 'Within 30 days', color: 'bg-destructive' },
  { label: 'Pending Bills', value: '₹45,200', icon: CreditCard, change: '8 patients', color: 'bg-hms-info' },
  { label: 'Revenue Today', value: '₹1,82,500', icon: TrendingUp, change: '+8% vs avg', color: 'bg-primary' },
];

const auditLogs = [
  { time: '10:35 AM', user: 'Ankit Gupta', action: 'Dispensed', detail: 'RX-2026-006 - Calcium + Vit D3 x 30 to Mrs. Kamla Devi', module: 'Dispensing' },
  { time: '10:20 AM', user: 'Admin', action: 'Stock Update', detail: 'Added 500 units of Paracetamol 500mg (Batch B-2026-A01)', module: 'Inventory' },
  { time: '10:05 AM', user: 'Renu Singh', action: 'Dispensed', detail: 'RX-2026-002 - Metformin 500mg x 30 to Mrs. Sunita Devi', module: 'Dispensing' },
  { time: '09:50 AM', user: 'Ankit Gupta', action: 'Dispensed', detail: 'RX-2026-003 - Diclofenac 50mg x 10 to Mr. Amit Sharma', module: 'Dispensing' },
  { time: '09:30 AM', user: 'Admin', action: 'Price Update', detail: 'Amoxicillin 250mg MRP changed ₹10 → ₹12', module: 'Inventory' },
  { time: '09:15 AM', user: 'System', action: 'Alert', detail: 'Low stock alert triggered for Insulin Glargine (3 units)', module: 'Alerts' },
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
  return <span className={`px-2 py-0.5 text-[10px] font-bold \${cls}`}>{status}</span>;
};

/* ───────── TAB PANELS ───────── */

const OverviewPanel = ({ prescriptionQueue }: { prescriptionQueue: any[] }) => {
  const lowStock = [
    { name: 'Amoxicillin 250mg', stock: 8, minStock: 30, supplier: 'Cipla Ltd', status: 'Low' },
    { name: 'Paracetamol 500mg', stock: 1200, minStock: 500, supplier: 'Sun Pharma', status: 'OK' }
  ];
  const expiryAlerts = [
    { name: 'Cetrizine 10mg', batch: 'B-998', expiry: '2026-03-18', daysLeft: 7, action: 'Return' },
    { name: 'Insulin Glargine', batch: 'B-112', expiry: '2026-03-23', daysLeft: 12, action: 'Flash Sale' }
  ];

  return (
    <div className="space-y-3">
      <div>
        <div className="hms-section-header">Live Prescription Queue</div>
        <table className="hms-table">
          <thead><tr><th>Visit ID</th><th>UHID</th><th>Patient</th><th>Age</th><th>Doctor</th><th>Medicine</th><th>Qty</th><th>Time</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {prescriptionQueue.length > 0 ? prescriptionQueue.map(p => (
              <tr key={p._id}>
                <td>{p.prescriptionId?.visitId || 'V-001'}</td>
                <td>{p.prescriptionId?.patientId?.uhid}</td>
                <td className="font-semibold">{p.prescriptionId?.patientId?.patientName}</td>
                <td>{p.prescriptionId?.patientId?.age}Y</td>
                <td>{p.prescriptionId?.doctorId?.name}</td>
                <td>{p.prescriptionItemId?.medicineName || 'Paracetamol'}</td>
                <td>{p.quantityGiven}</td>
                <td>{new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td><StatusBadge status={p.status || 'Dispensed'} /></td>
                <td className="flex gap-1"><Eye size={13} className="text-primary cursor-pointer" /><Printer size={13} className="text-primary cursor-pointer" /></td>
              </tr>
            )) : (
              <tr><td colSpan={10} className="text-center py-4">No live prescriptions in queue</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="hms-section-header">Low Stock Items</div>
          <table className="hms-table">
            <thead><tr><th>Medicine</th><th>Stock</th><th>Min Stock</th><th>Supplier</th><th>Status</th></tr></thead>
            <tbody>
              {lowStock.map((i, idx) => (
                <tr key={idx}><td>{i.name}</td><td className={i.status === 'Low' ? 'text-destructive font-bold' : ''}>{i.stock}</td><td>{i.minStock}</td><td>{i.supplier}</td><td><StatusBadge status={i.status} /></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <div className="hms-section-header">Expiry Alerts (Next 60 Days)</div>
          <table className="hms-table">
            <thead><tr><th>Medicine</th><th>Batch</th><th>Expiry</th><th>Days Left</th><th>Action</th></tr></thead>
            <tbody>
              {expiryAlerts.map((e, idx) => (
                <tr key={idx} className={e.daysLeft <= 14 ? 'text-destructive font-semibold' : ''}><td>{e.name}</td><td>{e.batch}</td><td>{e.expiry}</td><td>{e.daysLeft}</td><td>{e.action}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const PrescriptionsPanel = ({ prescriptionQueue }: { prescriptionQueue: any[] }) => (
  <div>
    <div className="hms-section-header">Prescription Management</div>
    <table className="hms-table">
      <thead><tr><th>S.No</th><th>Visit ID</th><th>UHID</th><th>Patient</th><th>Age</th><th>Doctor</th><th>Medicine</th><th>Qty</th><th>Date/Time</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>
        {prescriptionQueue.map((p, i) => (
          <tr key={p._id}>
            <td>{i + 1}</td>
            <td>{p.prescriptionId?.visitId}</td>
            <td>{p.prescriptionId?.patientId?.uhid}</td>
            <td className="font-semibold">{p.prescriptionId?.patientId?.patientName}</td>
            <td>{p.prescriptionId?.patientId?.age}Y</td>
            <td>{p.prescriptionId?.doctorId?.name}</td>
            <td>{p.prescriptionItemId?.medicineName}</td>
            <td>{p.quantityGiven}</td>
            <td>{new Date(p.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
            <td><StatusBadge status={p.status || 'Dispensed'} /></td>
            <td className="flex gap-1"><Eye size={13} className="text-primary cursor-pointer" /><Printer size={13} className="text-primary cursor-pointer" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const RxHeaderPanel = ({ prescriptions }: { prescriptions: any[] }) => (
  <div>
    <div className="hms-section-header">Prescription Headers</div>
    <table className="hms-table">
      <thead><tr><th>Rx ID</th><th>UHID</th><th>Patient</th><th>Doctor</th><th>Dept</th><th>Date</th><th>Status</th></tr></thead>
      <tbody>
        {prescriptions.length > 0 ? prescriptions.map(p => (
          <tr key={p._id}>
            <td>{p._id.substring(0, 8)}</td>
            <td>{p.patientId?.uhid}</td>
            <td className="font-semibold">{p.patientId?.patientName}</td>
            <td>{p.doctorId?.name}</td>
            <td>{p.departmentId?.name}</td>
            <td>{new Date(p.prescriptionDate).toLocaleDateString()}</td>
            <td><StatusBadge status={p.status || 'Active'} /></td>
          </tr>
        )) : (
          <tr><td colSpan={7} className="text-center py-4">No prescriptions found</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

const RxItemsPanel = () => (
  <div>
    <div className="hms-section-header">Prescription Items Detail</div>
    <table className="hms-table">
      <thead><tr><th>Rx ID</th><th>S.No</th><th>Medicine</th><th>Dosage</th><th>Duration</th><th>Qty</th><th>Route</th><th>Instruction</th><th>Substitution</th><th>Status</th></tr></thead>
      <tbody>
        <tr><td colSpan={10} className="text-center py-4">Select a prescription header to view items</td></tr>
      </tbody>
    </table>
  </div>
);

const MedicineMasterPanel = ({ medicines }: { medicines: any[] }) => (
  <div>
    <div className="hms-section-header">Medicine Master Catalog</div>
    <table className="hms-table">
      <thead><tr><th>Code</th><th>Name</th><th>Generic Name</th><th>Category</th><th>Schedule</th><th>Form</th><th>Strength</th><th>HSN</th><th>GST</th><th>Status</th></tr></thead>
      <tbody>
        {medicines.length > 0 ? medicines.map((m, i) => (
          <tr key={m._id}>
            <td className="font-mono text-[10px]">{m._id.substring(0, 8)}</td>
            <td className="font-bold">{m.name}</td>
            <td>{m.genericName || '-'}</td>
            <td>{m.category}</td>
            <td>{m.scheduleType}</td>
            <td>{m.form}</td>
            <td>{m.strength}</td>
            <td>{m.hsnCode || '-'}</td>
            <td>{m.gstPercentage}%</td>
            <td><StatusBadge status={m.isActive ? 'Active' : 'Inactive'} /></td>
          </tr>
        )) : (
          <tr><td colSpan={10} className="text-center py-4">No medicines found in master</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

const InventoryPanel = ({ stocks }: { stocks: any[] }) => (
  <div>
    <div className="hms-section-header">Current Pharmacy Inventory</div>
    <table className="hms-table">
      <thead><tr><th>Medicine</th><th>Batch</th><th>Category</th><th>Stock</th><th>Min Stock</th><th>Unit</th><th>MRP</th><th>Expiry</th><th>Status</th></tr></thead>
      <tbody>
        {stocks.length > 0 ? stocks.map((s, i) => (
          <tr key={s._id} className={s.availableQuantity < 50 ? 'text-destructive font-semibold' : ''}>
            <td className="font-bold">{s.medicineId?.name}</td>
            <td className="font-mono text-[10px]">{s.batchNumber}</td>
            <td>{s.medicineId?.category || 'General'}</td>
            <td className={s.availableQuantity < 50 ? 'text-destructive font-bold' : 'text-hms-success font-bold'}>{s.availableQuantity}</td>
            <td>{s.medicineId?.form || 'Units'}</td>
            <td>₹{s.sellingPrice}</td>
            <td>{new Date(s.expiryDate).toLocaleDateString()}</td>
            <td><StatusBadge status={s.status || 'Available'} /></td>
          </tr>
        )) : (
          <tr><td colSpan={8} className="text-center py-4">No inventory data found</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

const StockPanel = ({ stocks }: { stocks: any[] }) => (
  <div>
    <div className="hms-section-header">Pharmacy Stock Summary</div>
    <table className="hms-table">
      <thead><tr><th>S.No</th><th>Medicine</th><th>Category</th><th>Available Stock</th><th>Unit</th><th>Purchase Price</th><th>Selling Price</th><th>Value</th></tr></thead>
      <tbody>
        {stocks.length > 0 ? stocks.map((s, i) => (
          <tr key={s._id}>
            <td>{i + 1}</td>
            <td className="font-semibold">{s.medicineId?.name}</td>
            <td>{s.medicineId?.category || 'General'}</td>
            <td className={s.availableQuantity < 50 ? 'text-destructive font-bold' : 'text-hms-success'}>{s.availableQuantity}</td>
            <td>{s.medicineId?.form || 'Units'}</td>
            <td>₹{s.purchasePrice}</td>
            <td>₹{s.sellingPrice}</td>
            <td>₹{(s.availableQuantity * (s.purchasePrice || 0)).toLocaleString()}</td>
          </tr>
        )) : (
          <tr><td colSpan={8} className="text-center py-4">No stock data found</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

const StockBatchWisePanel = ({ stocks }: { stocks: any[] }) => (
  <div>
    <div className="hms-section-header">Stock — Batch-Wise Detail</div>
    <table className="hms-table">
      <thead><tr><th>Medicine</th><th>Batch No</th><th>Exp Date</th><th>Qty</th><th>MRP (₹)</th><th>Purchase Price (₹)</th><th>Supplier</th><th>Status</th></tr></thead>
      <tbody>
        {stocks.length > 0 ? stocks.map((s, i) => (
          <tr key={s._id}>
            <td>{s.medicineId?.name}</td>
            <td className="font-mono text-[10px]">{s.batchNumber}</td>
            <td>{new Date(s.expiryDate).toLocaleDateString()}</td>
            <td>{s.availableQuantity}</td>
            <td>{s.sellingPrice}</td>
            <td>{s.purchasePrice}</td>
            <td>{s.supplierId?.supplierName || '-'}</td>
            <td><StatusBadge status={s.status || 'Available'} /></td>
          </tr>
        )) : (
          <tr><td colSpan={8} className="text-center py-4">No batch data found</td></tr>
        )}
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
        {/* Mock data for dispensing log */}
        <tr><td colSpan={9} className="text-center py-4">No dispensing logs found</td></tr>
      </tbody>
    </table>
  </div>
);

const DispenseRecordsPanel = ({ dispenses }: { dispenses: any[] }) => (
  <div>
    <div className="hms-section-header">Pharmacy Dispense Records</div>
    <table className="hms-table">
      <thead><tr><th>Dispense ID</th><th>Patient</th><th>UHID</th><th>Medicine</th><th>Batch</th><th>Qty Dispensed</th><th>Pharmacist</th><th>Time</th><th>Status</th></tr></thead>
      <tbody>
        {dispenses.length > 0 ? dispenses.map((d, i) => (
          <tr key={d._id}>
            <td>{d._id.substring(0, 8)}</td>
            <td className="font-semibold">{d.patientId?.patientName}</td>
            <td>{d.patientId?.uhid}</td>
            <td>{d.medicineId?.name}</td>
            <td>{d.batchNumber}</td>
            <td>{d.quantityDispensed}</td>
            <td>{d.dispensedBy?.name || 'Pharmacist'}</td>
            <td>{new Date(d.createdAt).toLocaleDateString()}</td>
            <td><StatusBadge status={d.status || 'Completed'} /></td>
          </tr>
        )) : (
          <tr><td colSpan={9} className="text-center py-4">No dispense records found</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

const InvoicesPanel = ({ invoices }: { invoices: any[] }) => (
  <div>
    <div className="hms-section-header">Pharmacy Invoices</div>
    <table className="hms-table">
      <thead><tr><th>Invoice No</th><th>Date</th><th>Patient</th><th>UHID</th><th>Net Amt (₹)</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>
        {invoices.length > 0 ? invoices.map(inv => (
          <tr key={inv._id}>
            <td className="font-mono text-[10px]">{inv.invoiceNumber}</td>
            <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
            <td className="font-semibold">{inv.patientId?.patientName}</td>
            <td>{inv.patientId?.uhid}</td>
            <td className="font-bold">₹{inv.netAmount?.toLocaleString()}</td>
            <td><StatusBadge status={inv.paymentStatus} /></td>
            <td><Printer size={13} className="text-primary cursor-pointer" /></td>
          </tr>
        )) : (
          <tr><td colSpan={7} className="text-center py-4">No invoices found</td></tr>
        )}
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
        <tr><td colSpan={10} className="text-center py-4">No billing data found</td></tr>
      </tbody>
    </table>
  </div>
);

const InsuranceClaimsPanel = ({ claims }: { claims: any[] }) => (
  <div>
    <div className="hms-section-header">Insurance Claims</div>
    <table className="hms-table">
      <thead><tr><th>Claim ID</th><th>Patient</th><th>Insurer</th><th>Amount</th><th>Status</th></tr></thead>
      <tbody>
        {claims.length > 0 ? claims.map(c => (
          <tr key={c._id}>
            <td>{c._id.substring(0, 8)}</td>
            <td>{c.patientId?.patientName}</td>
            <td>{c.insuranceCompany}</td>
            <td>₹{c.claimAmount?.toLocaleString()}</td>
            <td><StatusBadge status={c.status} /></td>
          </tr>
        )) : (
          <tr><td colSpan={5} className="text-center py-4">No claims found</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

const PurchaseOrdersPanel = ({ orders }: { orders: any[] }) => (
  <div>
    <div className="hms-section-header">Purchase Orders</div>
    <table className="hms-table">
      <thead><tr><th>PO No</th><th>Supplier</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
      <tbody>
        {orders.length > 0 ? orders.map(o => (
          <tr key={o._id}>
            <td>{o.poNumber}</td>
            <td>{o.supplierId?.supplierName}</td>
            <td>{new Date(o.poDate).toLocaleDateString()}</td>
            <td>₹{o.totalAmount?.toLocaleString()}</td>
            <td><StatusBadge status={o.status} /></td>
          </tr>
        )) : (
          <tr><td colSpan={5} className="text-center py-4">No orders found</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

const POItemsPanel = () => (
  <div>
    <div className="hms-section-header">PO Items Detail</div>
    <p className="text-xs p-4">Select a purchase order to view items</p>
  </div>
);

const GRNPanel = ({ grns }: { grns: any[] }) => (
  <div>
    <div className="hms-section-header">Goods Received Notes (GRN)</div>
    <table className="hms-table">
      <thead><tr><th>GRN No</th><th>Supplier</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
      <tbody>
        {grns.length > 0 ? grns.map(g => (
          <tr key={g._id}>
            <td>{g.grnNumber}</td>
            <td>{g.supplierId?.supplierName}</td>
            <td>{new Date(g.grnDate).toLocaleDateString()}</td>
            <td>₹{g.netAmount?.toLocaleString()}</td>
            <td><StatusBadge status={g.status} /></td>
          </tr>
        )) : (
          <tr><td colSpan={5} className="text-center py-4">No GRNs found</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

const SuppliersPanel = ({ suppliers }: { suppliers: any[] }) => (
  <div>
    <div className="hms-section-header">Supplier Directory</div>
    <table className="hms-table">
      <thead><tr><th>Supplier Name</th><th>Phone</th><th>Email</th><th>Status</th></tr></thead>
      <tbody>
        {suppliers.length > 0 ? suppliers.map(s => (
          <tr key={s._id}>
            <td className="font-bold">{s.supplierName}</td>
            <td>{s.phone}</td>
            <td>{s.email}</td>
            <td><StatusBadge status={s.isActive ? 'Active' : 'Inactive'} /></td>
          </tr>
        )) : (
          <tr><td colSpan={4} className="text-center py-4">No suppliers found</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

const VendorsPanel = ({ suppliers }: { suppliers: any[] }) => <SuppliersPanel suppliers={suppliers} />;

const InterBranchPanel = ({ transfers }: { transfers: any[] }) => (
  <div>
    <div className="hms-section-header">Inter-Branch Transfers</div>
    <table className="hms-table">
      <thead><tr><th>Transfer ID</th><th>From</th><th>To</th><th>Date</th><th>Status</th></tr></thead>
      <tbody>
        {transfers.length > 0 ? transfers.map(t => (
          <tr key={t._id}>
            <td>{t._id.substring(0, 8)}</td>
            <td>{t.fromBranchId?.name}</td>
            <td>{t.toBranchId?.name}</td>
            <td>{new Date(t.transferDate).toLocaleDateString()}</td>
            <td><StatusBadge status={t.status} /></td>
          </tr>
        )) : (
          <tr><td colSpan={5} className="text-center py-4">No transfers found</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

const StockAdjustmentPanel = ({ adjustments }: { adjustments: any[] }) => (
  <div>
    <div className="hms-section-header">Stock Adjustments</div>
    <table className="hms-table">
      <thead><tr><th>Date</th><th>Medicine</th><th>Type</th><th>Qty Adjust</th><th>Status</th></tr></thead>
      <tbody>
        {adjustments.length > 0 ? adjustments.map(a => (
          <tr key={a._id}>
            <td>{new Date(a.adjustmentDate).toLocaleDateString()}</td>
            <td>{a.medicineId?.name}</td>
            <td>{a.adjustmentType}</td>
            <td>{a.adjustmentQuantity}</td>
            <td><StatusBadge status="Completed" /></td>
          </tr>
        )) : (
          <tr><td colSpan={5} className="text-center py-4">No adjustments found</td></tr>
        )}
      </tbody>
    </table>
  </div>
);

const DoctorAnalyticsPanel = () => (
  <div>
    <div className="hms-section-header">Doctor-wise Prescription Analytics</div>
    <p className="text-xs p-4">Analytics dashboards pending integration...</p>
  </div>
);

const ExpiryPanel = ({ stocks }: { stocks: any[] }) => {
  const expiryAlerts = stocks.filter(s => {
    const daysLeft = Math.ceil((new Date(s.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 90;
  });

  return (
    <div>
      <div className="hms-section-header">Expiry & Compliance</div>
      <table className="hms-table">
        <thead><tr><th>Medicine</th><th>Batch</th><th>Expiry Date</th><th>Stock</th><th>Days Left</th></tr></thead>
        <tbody>
          {expiryAlerts.length > 0 ? expiryAlerts.map((e, i) => {
            const daysLeft = Math.ceil((new Date(e.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            return (
              <tr key={i} className={daysLeft <= 30 ? 'text-destructive font-bold' : ''}>
                <td>{e.medicineId?.name}</td><td>{e.batchNumber}</td><td>{new Date(e.expiryDate).toLocaleDateString()}</td><td>{e.availableQuantity}</td><td>{daysLeft}</td>
              </tr>
            );
          }) : (
            <tr><td colSpan={5} className="text-center py-4">No near-expiry items found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const ReportsPanel = () => (
  <div>
    <div className="hms-section-header">Pharmacy Reports</div>
    <p className="text-xs p-4">Report generation pending integration...</p>
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
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({
    prescriptionQueue: [],
    medicines: [],
    invoices: [],
    stocks: [],
    suppliers: [],
    purchaseOrders: [],
    grns: [],
    insuranceClaims: [],
    stockTransfers: [],
    stockAdjustments: [],
    prescriptions: []
  });

  const fetchData = async (tab: string) => {
    setLoading(true);
    try {
      switch (tab) {
        case 'overview':
        case 'prescriptions':
          const dq = await getPharmacyDispenses();
          setData((prev: any) => ({ ...prev, prescriptionQueue: dq.data?.data || dq.data || [] }));
          break;
        case 'medicine-master':
          const m = await listMedicines();
          setData((prev: any) => ({ ...prev, medicines: m.data?.data || m.data || [] }));
          break;
        case 'invoices':
          const inv = await getPharmacyInvoices();
          setData((prev: any) => ({ ...prev, invoices: inv.data?.data || inv.data || [] }));
          break;
        case 'stock':
        case 'inventory':
          const s = await getPharmacyStocks();
          setData((prev: any) => ({ ...prev, stocks: s.data?.data || s.data || [] }));
          break;
        case 'suppliers':
          const sup = await getPharmacySuppliers();
          setData((prev: any) => ({ ...prev, suppliers: sup.data?.data || sup.data || [] }));
          break;
        case 'purchase-orders':
          const po = await getPurchaseOrders();
          setData((prev: any) => ({ ...prev, purchaseOrders: po.data?.data || po.data || [] }));
          break;
        case 'grn':
          const grn = await getGRNs();
          setData((prev: any) => ({ ...prev, grns: grn.data?.data || grn.data || [] }));
          break;
        case 'insurance-claims':
          const ic = await getInsuranceClaims();
          setData((prev: any) => ({ ...prev, insuranceClaims: ic.data?.data || ic.data || [] }));
          break;
        case 'inter-branch':
          const st = await getStockTransfers();
          setData((prev: any) => ({ ...prev, stockTransfers: st.data?.data || st.data || [] }));
          break;
        case 'stock-adjustment':
          const sa = await getStockAdjustments();
          setData((prev: any) => ({ ...prev, stockAdjustments: sa.data?.data || sa.data || [] }));
          break;
        case 'rx-header':
          const pr = await getPharmacyPrescriptions();
          setData((prev: any) => ({ ...prev, prescriptions: pr.data?.data || pr.data || [] }));
          break;
      }
    } catch (error) {
      console.error(`Error fetching data for ${tab}:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const panelMap: Record<string, React.ReactNode> = {
    overview: <OverviewPanel prescriptionQueue={data.prescriptionQueue} />,
    prescriptions: <PrescriptionsPanel prescriptionQueue={data.prescriptionQueue} />,
    'rx-header': <RxHeaderPanel prescriptions={data.prescriptions} />,
    'rx-items': <RxItemsPanel />,
    'medicine-master': <MedicineMasterPanel medicines={data.medicines} />,
    inventory: <InventoryPanel stocks={data.stocks} />,
    stock: <StockPanel stocks={data.stocks} />,
    'stock-batchwise': <StockBatchWisePanel stocks={data.stocks} />,
    dispensing: <DispensingPanel />,
    'dispense-records': <DispenseRecordsPanel dispenses={data.prescriptionQueue} />,
    invoices: <InvoicesPanel invoices={data.invoices} />,
    billing: <BillingPanel />,
    'insurance-claims': <InsuranceClaimsPanel claims={data.insuranceClaims} />,
    'purchase-orders': <PurchaseOrdersPanel orders={data.purchaseOrders} />,
    'po-items': <POItemsPanel />,
    grn: <GRNPanel grns={data.grns} />,
    suppliers: <SuppliersPanel suppliers={data.suppliers} />,
    vendors: <VendorsPanel suppliers={data.suppliers} />,
    'inter-branch': <InterBranchPanel transfers={data.stockTransfers} />,
    'stock-adjustment': <StockAdjustmentPanel adjustments={data.stockAdjustments} />,
    'doctor-analytics': <DoctorAnalyticsPanel />,
    expiry: <ExpiryPanel stocks={data.stocks} />,
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
