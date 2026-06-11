import React, { useState } from 'react';
import { Check, X, ShieldCheck, FileText, UploadCloud, AlertCircle, Award } from 'lucide-react';

const MOCK_MANIFESTS = {
  manifestValid: {
    title: 'Manifest 2026-09A (Valid)',
    rawText: `{
  "manifestId": "MNF-2026-09A",
  "exporter": "Valcambi S.A.",
  "exporterRegistryId": "CH-VAL-84920",
  "importer": "London Central Vault",
  "exportLicenseNumber": "EXP-LIC-99321",
  "licenseExpiry": "2028-12-31",
  "totalWeightKg": 24.8,
  "refineryCertification": "LBMA Certified",
  "serialList": ["VAL-88219B", "VAL-88220C"]
}`
  },
  manifestExpiredLicense: {
    title: 'Manifest 2026-12B (Expired License)',
    rawText: `{
  "manifestId": "MNF-2026-12B",
  "exporter": "Rand Refinery",
  "exporterRegistryId": "ZA-RND-11029",
  "importer": "Zurich Alpine Deep Vault",
  "exportLicenseNumber": "EXP-LIC-88210",
  "licenseExpiry": "2025-05-01",
  "totalWeightKg": 12.4,
  "refineryCertification": "LBMA Certified",
  "serialList": ["RND-44210A"]
}`
  },
  manifestFakeSerials: {
    title: 'Manifest 2026-X99 (Fake Serials)',
    rawText: `{
  "manifestId": "MNF-2026-X99",
  "exporter": "Perth Mint",
  "exporterRegistryId": "AU-PRT-30291",
  "importer": "New York Fed Sublevel",
  "exportLicenseNumber": "EXP-LIC-77421",
  "licenseExpiry": "2027-06-30",
  "totalWeightKg": 37.2,
  "refineryCertification": "LBMA Certified",
  "serialList": ["PRT-90021A", "FAKE-SERIAL-99"]
}`
  }
};

export default function CustomsChecker({ goldBars }) {
  const [manifestText, setManifestText] = useState(MOCK_MANIFESTS.manifestValid.rawText);
  const [verificationResults, setVerificationResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const loadPreset = (key) => {
    setManifestText(MOCK_MANIFESTS[key].rawText);
    setVerificationResults(null);
    setErrorMsg('');
  };

  const verifyManifest = () => {
    setErrorMsg('');
    setVerificationResults(null);

    try {
      const data = JSON.parse(manifestText);
      
      const checks = [];
      let allPassed = true;

      // Check 1: Exporter registered
      const isExporterRegistered = data.exporterRegistryId && data.exporterRegistryId.length > 5;
      checks.push({
        id: 'exporter',
        name: 'Exporter Registration Status',
        passed: isExporterRegistered,
        detail: isExporterRegistered ? `Verified registry ID: ${data.exporterRegistryId}` : 'Exporter registry ID missing or invalid'
      });
      if (!isExporterRegistered) allPassed = false;

      // Check 2: Export License Active
      let licenseValid = false;
      let licenseDetail = 'Missing export license details';
      if (data.exportLicenseNumber && data.licenseExpiry) {
        const expiryDate = new Date(data.licenseExpiry);
        const today = new Date();
        if (expiryDate > today) {
          licenseValid = true;
          licenseDetail = `License ${data.exportLicenseNumber} active (expires ${data.licenseExpiry})`;
        } else {
          licenseDetail = `License ${data.exportLicenseNumber} EXPIRED on ${data.licenseExpiry}`;
        }
      }
      checks.push({
        id: 'license',
        name: 'Export License Authorization',
        passed: licenseValid,
        detail: licenseDetail
      });
      if (!licenseValid) allPassed = false;

      // Check 3: Refinery LBMA Certification
      const isCertified = data.refineryCertification === 'LBMA Certified';
      checks.push({
        id: 'refinery',
        name: 'Refinery Compliance Certification',
        passed: isCertified,
        detail: isCertified ? 'Refinery LBMA certification verified' : 'Refinery fails LBMA global compliance listing'
      });
      if (!isCertified) allPassed = false;

      // Check 4: Serial Numbers Check
      let serialsRegistered = true;
      const failedSerials = [];
      if (data.serialList && Array.isArray(data.serialList)) {
        data.serialList.forEach(s => {
          // Check if serial exists in our local registered bars (or if it matches registry mock logic)
          const barExists = goldBars.some(b => b.serialNumber.toLowerCase() === s.toLowerCase());
          
          // For checking simulation purposes, we allow standard preset serials and any registered serials
          const isPresetRegistered = s.startsWith('VAL-88') || s.startsWith('RND-44') || s.startsWith('PRT-90');
          if (!barExists && !isPresetRegistered) {
            serialsRegistered = false;
            failedSerials.push(s);
          }
        });
      } else {
        serialsRegistered = false;
      }
      checks.push({
        id: 'serials',
        name: 'Registry Ledger Matching',
        passed: serialsRegistered,
        detail: serialsRegistered 
          ? `All ${data.serialList?.length || 0} bars match registry database` 
          : `Illegal/unregistered serials found: ${failedSerials.join(', ')}`
      });
      if (!serialsRegistered) allPassed = false;

      // Check 5: Weight Reconciliation
      let weightPassed = false;
      let weightDetail = '';
      if (data.totalWeightKg && data.serialList) {
        const expectedWeight = data.serialList.length * 12.4;
        const diff = Math.abs(data.totalWeightKg - expectedWeight);
        if (diff < 1.0) {
          weightPassed = true;
          weightDetail = `Declared weight of ${data.totalWeightKg} kg matches serial list volume`;
        } else {
          weightDetail = `Weight discrepancy: Declared ${data.totalWeightKg} kg, expected approx ${expectedWeight} kg`;
        }
      } else {
        weightDetail = 'Weight records missing or incomplete';
      }
      checks.push({
        id: 'weight',
        name: 'Weight Balance Reconciliation',
        passed: weightPassed,
        detail: weightDetail
      });
      if (!weightPassed) allPassed = false;

      setVerificationResults({
        manifestId: data.manifestId || 'UNKNOWN',
        checks,
        passed: allPassed
      });

    } catch (e) {
      setErrorMsg('Syntax Error: Manifest must be valid JSON format.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.85rem', marginBottom: '0.4rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
          Customs Paper Checker
        </h2>
        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.92rem' }}>
          Instantly audit import/export legal manifests against LBMA and customs registries.
        </p>
      </div>

      <div className="grid-2">
        
        {/* Manifest Inputs */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'hsl(var(--gold-primary))' }}>
              <div style={{
                background: 'hsl(var(--gold-primary) / 0.08)',
                padding: '0.4rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <FileText size={18} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Edit Manifest Document</h3>
            </div>
          </div>

          {/* Quick presets */}
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => loadPreset('manifestValid')}
              className="badge"
              style={{ 
                padding: '0.45rem 0.9rem', 
                background: 'hsl(var(--bg-tertiary))', 
                border: '1px solid hsl(var(--border-color))', 
                color: '#4ade80',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Load Clean Manifest
            </button>
            <button 
              onClick={() => loadPreset('manifestExpiredLicense')}
              className="badge"
              style={{ 
                padding: '0.45rem 0.9rem', 
                background: 'hsl(var(--bg-tertiary))', 
                border: '1px solid hsl(var(--border-color))', 
                color: '#f87171',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Load Expired License
            </button>
            <button 
              onClick={() => loadPreset('manifestFakeSerials')}
              className="badge"
              style={{ 
                padding: '0.45rem 0.9rem', 
                background: 'hsl(var(--bg-tertiary))', 
                border: '1px solid hsl(var(--border-color))', 
                color: '#fca5a5',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Load Fake Serials
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
            <textarea 
              value={manifestText}
              onChange={(e) => setManifestText(e.target.value)}
              style={{ 
                width: '100%', 
                height: '330px', 
                fontFamily: 'var(--font-mono)', 
                fontSize: '0.85rem', 
                background: 'hsl(var(--bg-secondary) / 0.8)',
                lineHeight: '1.5',
                padding: '1.1rem',
                border: '1px solid hsl(var(--border-color))',
                borderRadius: '8px',
                color: '#a7f3d0' // Code-editor styled color
              }}
            />
          </div>

          {errorMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontSize: '0.82rem', fontWeight: 500 }}>
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          <button 
            onClick={verifyManifest}
            className="btn-primary"
            style={{ 
              padding: '0.85rem', 
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <ShieldCheck size={18} />
            Scan & Verify Manifest
          </button>
        </div>

        {/* Verification Checklist */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'hsl(var(--gold-primary))' }}>
            <div style={{
              background: 'hsl(var(--gold-primary) / 0.08)',
              padding: '0.4rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <ShieldCheck size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Compliance Report HUD</h3>
          </div>

          {verificationResults ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Compliance Header */}
              <div 
                style={{ 
                  padding: '1.25rem', 
                  borderRadius: '10px', 
                  background: verificationResults.passed ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                  border: `1px solid ${verificationResults.passed ? '#22c55e' : '#ef4444'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.15rem'
                }}
              >
                {verificationResults.passed ? (
                  <Check size={38} style={{ color: '#22c55e', background: 'rgba(34, 197, 94, 0.12)', padding: '6px', borderRadius: '50%', border: '1px solid rgba(34, 197, 94, 0.25)' }} />
                ) : (
                  <X size={38} style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.12)', padding: '6px', borderRadius: '50%', border: '1px solid rgba(239, 68, 68, 0.25)' }} />
                )}
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: verificationResults.passed ? '#4ade80' : '#f87171', fontWeight: 700 }}>
                    {verificationResults.passed ? 'MANIFEST COMPLIANT' : 'REGULATORY HOLD / CRITICAL FAILURE'}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted))', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
                    License Reference ID: {verificationResults.manifestId}
                  </p>
                </div>
              </div>

              {/* Individual Checks list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                {verificationResults.checks.map(chk => (
                  <div 
                    key={chk.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '0.85rem',
                      paddingBottom: '0.85rem',
                      borderBottom: '1px solid hsl(var(--border-color) / 0.5)'
                    }}
                  >
                    {chk.passed ? (
                      <div style={{
                        background: 'rgba(34, 197, 94, 0.08)',
                        padding: '0.25rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#22c55e',
                        marginTop: '2px'
                      }}>
                        <Check size={13} style={{ strokeWidth: 3 }} />
                      </div>
                    ) : (
                      <div style={{
                        background: 'rgba(239, 68, 68, 0.08)',
                        padding: '0.25rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#ef4444',
                        marginTop: '2px'
                      }}>
                        <X size={13} style={{ strokeWidth: 3 }} />
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'white' }}>{chk.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'hsl(var(--text-secondary))', marginTop: '0.25rem', lineHeight: '1.4' }}>{chk.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div 
              style={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'hsl(var(--text-muted))',
                padding: '4rem 2rem',
                textAlign: 'center',
                gap: '1.25rem'
              }}
            >
              <div style={{
                background: 'hsl(var(--border-color) / 0.3)',
                padding: '1.25rem',
                borderRadius: '50%',
                color: 'hsl(var(--text-muted))',
                border: '1.5px dashed hsl(var(--text-muted) / 0.3)'
              }}>
                <UploadCloud size={44} />
              </div>
              <div>
                <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))', fontWeight: 600 }}>
                  Regulatory Dossier Loaded
                </p>
                <p style={{ fontSize: '0.78rem', color: 'hsl(var(--text-muted))', marginTop: '0.35rem', lineHeight: '1.5' }}>
                  Click "Scan & Verify Manifest" to run instant regulatory audits against the LBMA Ledger.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
