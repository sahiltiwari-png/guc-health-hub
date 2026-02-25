import React, { useState } from 'react';
import { Shield, Smartphone, Mail, Key, Check, AlertTriangle } from 'lucide-react';

const TwoFactorSetup = () => {
  const [method, setMethod] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [otp, setOtp] = useState('');
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    if (otp.length >= 4) {
      setVerified(true);
      setEnabled(true);
    }
  };

  return (
    <div>
      <div className="hms-section-header flex items-center gap-2">
        <Shield size={14} /> Two-Factor Authentication (2FA)
      </div>

      <div className="bg-card border border-border p-4 mt-2">
        {/* Status */}
        <div className={`flex items-center gap-2 p-3 mb-4 border ${enabled ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300'}`}>
          {enabled ? <Check size={14} className="text-green-700" /> : <AlertTriangle size={14} className="text-yellow-700" />}
          <span className="text-xs font-semibold">
            {enabled ? '2FA is ENABLED — Your account is secured with two-factor authentication' : '2FA is NOT ENABLED — We strongly recommend enabling 2FA for account security'}
          </span>
        </div>

        {!enabled && (
          <>
            <p className="text-xs text-muted-foreground mb-4">
              Two-Factor Authentication adds an extra layer of security. Choose your preferred method below:
            </p>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { id: 'authenticator', icon: Smartphone, label: 'Google Authenticator', desc: 'Use Google Authenticator or Authy app' },
                { id: 'sms', icon: Mail, label: 'SMS OTP', desc: 'Receive OTP via SMS on registered mobile' },
                { id: 'email', icon: Key, label: 'Email OTP', desc: 'Receive OTP via registered email address' },
              ].map(m => (
                <div
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`border p-3 cursor-pointer text-center hover:bg-muted
                    ${method === m.id ? 'border-primary bg-primary/5' : 'border-border'}`}
                >
                  <m.icon size={24} className="mx-auto mb-2 text-primary" />
                  <p className="text-xs font-bold">{m.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{m.desc}</p>
                </div>
              ))}
            </div>

            {method && (
              <div className="border border-border p-4 bg-muted">
                <p className="text-xs font-bold mb-2">
                  {method === 'authenticator' && 'Scan QR Code with Authenticator App'}
                  {method === 'sms' && 'Enter OTP sent to +91 ****7890'}
                  {method === 'email' && 'Enter OTP sent to a****@guchospital.com'}
                </p>

                {method === 'authenticator' && (
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-32 h-32 bg-card border border-border flex items-center justify-center">
                      <div className="text-center">
                        <div className="grid grid-cols-8 gap-[1px] mx-auto w-24">
                          {Array(64).fill(0).map((_, i) => (
                            <div key={i} className={`w-[3px] h-[3px] ${Math.random() > 0.5 ? 'bg-foreground' : 'bg-transparent'}`} />
                          ))}
                        </div>
                        <p className="text-[8px] text-muted-foreground mt-1">QR Code</p>
                      </div>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      <p className="mb-1">1. Open Google Authenticator</p>
                      <p className="mb-1">2. Tap + → Scan QR Code</p>
                      <p className="mb-1">3. Scan the QR code shown here</p>
                      <p>4. Enter the 6-digit code below</p>
                      <p className="mt-2 font-mono text-[10px] bg-card p-1 border border-border">
                        Manual key: JBSW Y3DP EHPK 3PXP
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <label className="hms-form-label">Enter OTP:</label>
                  <input
                    className="hms-input w-40"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                  <button onClick={handleVerify} className="hms-btn-primary">Verify & Enable</button>
                </div>
              </div>
            )}
          </>
        )}

        {enabled && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-border p-3">
                <p className="text-xs font-bold">Active Method</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {method === 'authenticator' ? 'Google Authenticator' : method === 'sms' ? 'SMS OTP' : 'Email OTP'}
                </p>
              </div>
              <div className="border border-border p-3">
                <p className="text-xs font-bold">Recovery Codes</p>
                <p className="text-xs text-muted-foreground mt-1">8 recovery codes generated</p>
                <button className="hms-btn-secondary mt-1 text-[10px]">Download Codes</button>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="hms-btn-secondary" onClick={() => { setEnabled(false); setMethod(null); setOtp(''); setVerified(false); }}>
                Disable 2FA
              </button>
              <button className="hms-btn-secondary">Change Method</button>
              <button className="hms-btn-secondary">Regenerate Recovery Codes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorSetup;
