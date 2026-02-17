import React from 'react';

const Certificates = () => (
  <div>
    <div className="hms-section-header">Certificates</div>
    <div className="grid grid-cols-3 gap-3">
      {['Medical Certificate', 'Fitness Certificate', 'Birth Certificate', 'Death Certificate', 'Disability Certificate', 'Vaccination Certificate'].map((cert, i) => (
        <div key={i} className="bg-card border border-border p-3 hover:bg-muted cursor-pointer">
          <span className="text-xs font-semibold">{cert}</span>
        </div>
      ))}
    </div>
  </div>
);

export default Certificates;
