// stub
global.import = { meta: { env: { VITE_API_URL: '' } } };
Object.assign(globalThis, {
  import: { meta: { env: { VITE_API_URL: '' } } },
});

import { renderToString } from 'react-dom/server';
import React from 'react';

// Stub out lucide-react to prevent errors
jest.mock('lucide-react', () => ({
  Skull: () => 'Skull',
  FileText: () => 'FileText',
  Clock: () => 'Clock',
  Eye: () => 'Eye',
  Printer: () => 'Printer',
  Plus: () => 'Plus',
  AlertTriangle: () => 'AlertTriangle',
  BedDouble: () => 'BedDouble',
  Search: () => 'Search',
  RefreshCw: () => 'RefreshCw',
  Filter: () => 'Filter',
  CheckCircle2: () => 'CheckCircle2',
  XCircle: () => 'XCircle',
  AlertCircle: () => 'AlertCircle',
  Bed: () => 'Bed'
}));

import DeathPostmortem from './src/pages/DeathPostmortem';
import BedManagement from './src/pages/BedManagement';

try {
  renderToString(React.createElement(DeathPostmortem));
  console.log("DeathPostmortem rendered successfully");
} catch (e) {
  console.error("DeathPostmortem Error:", e);
}

try {
  renderToString(React.createElement(BedManagement));
  console.log("BedManagement rendered successfully");
} catch (e) {
  console.error("BedManagement Error:", e);
}
