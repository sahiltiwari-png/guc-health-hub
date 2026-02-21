import React, { useState } from 'react';
import { FileText, Printer, X } from 'lucide-react';

const certificateTemplates = [
  {
    name: 'Medical Certificate',
    content: `MEDICAL CERTIFICATE\n\nGUC HOSPITAL MANAGEMENT SYSTEM\nDate: 15-Jan-2023\n\nThis is to certify that Mr./Mrs./Ms. ___________________\nAge: _____ years, Gender: _____\nUHID: _____________\n\nHas been examined on __________ and found to be suffering from:\n__________________________________________________\n\nThe patient is advised rest for _____ days from __________ to __________.\n\nDiagnosis: __________________________________________________\nTreatment Given: __________________________________________________\n\nThis certificate is issued on the request of the patient for the purpose of:\n__________________________________________________\n\nDoctor: Dr. ALOK MEHTA\nRegistration No: 12345\nDepartment: GENERAL MEDICINE\n\nSignature & Stamp\nGUC HMS`,
  },
  {
    name: 'Fitness Certificate',
    content: `FITNESS CERTIFICATE\n\nGUC HOSPITAL MANAGEMENT SYSTEM\nDate: 15-Jan-2023\n\nThis is to certify that Mr./Mrs./Ms. ___________________\nAge: _____ years, Gender: _____\nUHID: _____________\n\nHas been thoroughly examined on __________ and is found to be:\n\n[  ] Fit for duty / work\n[  ] Fit for travel\n[  ] Fit for sports / physical activities\n[  ] Fit for joining service\n\nRemarks: __________________________________________________\n\nBlood Pressure: ___/___  |  Pulse: ___  |  Weight: ___ kg  |  Height: ___ cm\nVision: R - 6/__  L - 6/__\n\nDoctor: Dr. PRIYA SINGH\nRegistration No: 23456\nDepartment: GENERAL MEDICINE\n\nSignature & Stamp\nGUC HMS`,
  },
  {
    name: 'Birth Certificate',
    content: `BIRTH CERTIFICATE\n\nGUC HOSPITAL MANAGEMENT SYSTEM\nCertificate No: BC-2023-001\nDate: 15-Jan-2023\n\nThis is to certify that a live born:\n\nChild's Name: ___________________\nSex: _____\nDate of Birth: __________\nTime of Birth: __________\nPlace of Birth: GUC Hospital, Noida\nWeight at Birth: _____ kg\n\nMother's Name: ___________________\nFather's Name: ___________________\nMother's Age: _____ years\nAddress: __________________________________________________\n\nType of Delivery: [  ] Normal  [  ] LSCS  [  ] Assisted\nAttending Doctor: Dr. ARTI MEHTA\nRegistration No: 34567\n\nSignature & Stamp\nGUC HMS`,
  },
  {
    name: 'Death Certificate',
    content: `DEATH CERTIFICATE\n\nGUC HOSPITAL MANAGEMENT SYSTEM\nCertificate No: DC-2023-001\nDate: 15-Jan-2023\n\nName of Deceased: ___________________\nAge: _____ years  |  Gender: _____\nUHID: _____________\nDate of Death: __________\nTime of Death: __________\nPlace of Death: GUC Hospital, Noida\n\nCause of Death:\nImmediate Cause: __________________________________________________\nAntecedent Cause: __________________________________________________\nOther Conditions: __________________________________________________\n\nAddress: __________________________________________________\nFather/Husband Name: ___________________\n\nAttending Doctor: Dr. ALOK MEHTA\nRegistration No: 12345\n\nSignature & Stamp\nGUC HMS`,
  },
  {
    name: 'Disability Certificate',
    content: `DISABILITY CERTIFICATE\n\nGUC HOSPITAL MANAGEMENT SYSTEM\nCertificate No: DIS-2023-001\nDate: 15-Jan-2023\n\nThis is to certify that Mr./Mrs./Ms. ___________________\nAge: _____ years, Gender: _____\nUHID: _____________\nAddress: __________________________________________________\n\nHas been examined by the Medical Board on __________.\n\nType of Disability: __________________________________________________\nPercentage of Disability: _____%\nPermanent / Temporary: __________\n\nAffected Body Part: __________________________________________________\nDiagnosis: __________________________________________________\n\nThis certificate is valid for _____ years from the date of issue.\n\nMedical Board:\n1. Dr. ALOK MEHTA - GENERAL MEDICINE\n2. Dr. RAHUL VERMA - ORTHOPEDICS\n3. Dr. PRIYA SINGH - SURGERY\n\nSignature & Stamp\nGUC HMS`,
  },
  {
    name: 'Vaccination Certificate',
    content: `VACCINATION CERTIFICATE\n\nGUC HOSPITAL MANAGEMENT SYSTEM\nCertificate No: VAC-2023-001\nDate: 15-Jan-2023\n\nPatient Name: ___________________\nAge: _____ years  |  Gender: _____\nUHID: _____________\n\nVaccination Record:\n--------------------------------------------------------------\nS.No  |  Vaccine          |  Date        |  Dose  |  Batch No.\n--------------------------------------------------------------\n1     |  COVID-19 (Covaxin)|  10-Jan-2023 |  1st   |  BV-2023-01\n2     |  COVID-19 (Covaxin)|  10-Feb-2023 |  2nd   |  BV-2023-02\n3     |  Influenza         |  15-Mar-2023 |  Annual|  IF-2023-01\n4     |  Hepatitis B       |  20-Apr-2023 |  1st   |  HB-2023-01\n--------------------------------------------------------------\n\nNext Vaccination Due: __________\n\nAdministered By: Nurse REKHA\nDoctor: Dr. NEHA GUPTA\nDepartment: PEDIATRICS\n\nSignature & Stamp\nGUC HMS`,
  },
];

const Certificates = () => {
  const [selectedCert, setSelectedCert] = useState<number | null>(null);

  return (
    <div>
      <div className="hms-section-header">Certificates</div>

      {selectedCert === null ? (
        <div className="grid grid-cols-3 gap-3 mt-2">
          {certificateTemplates.map((cert, i) => (
            <div
              key={i}
              className="bg-card border border-border p-4 hover:bg-muted cursor-pointer flex items-center gap-3"
              onClick={() => setSelectedCert(i)}
            >
              <FileText size={20} className="text-primary" />
              <span className="text-xs font-semibold">{cert.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">{certificateTemplates[selectedCert].name}</h3>
            <div className="flex gap-2">
              <button className="hms-btn-primary flex items-center gap-1"><Printer size={12} /> Print</button>
              <button className="hms-btn-secondary flex items-center gap-1" onClick={() => setSelectedCert(null)}><X size={12} /> Close</button>
            </div>
          </div>
          <div className="bg-card border border-border p-6">
            <pre className="text-xs whitespace-pre-wrap font-[inherit] leading-relaxed">
              {certificateTemplates[selectedCert].content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certificates;
