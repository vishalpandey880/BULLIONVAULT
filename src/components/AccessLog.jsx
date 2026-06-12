import React, { useState, useEffect, useRef } from 'react';
import { Shield, Users, UserCheck, AlertTriangle, Fingerprint, Eye, RotateCcw, Unlock, ShieldAlert } from 'lucide-react';

export default function AccessLog({ accessLogs, onAddLog, onUndoLog }) {
  const [selectedStaff, setSelectedStaff] = useState('agent-1');
  const [scanType, setScanType] = useState('Fingerprint');
  const [scanStatus, setScanStatus] = useState('READY'); // READY, SCANNING, GRANTED, DENIED
  const [errorMessage, setErrorMessage] = useState('');
  const [holdProgress, setHoldProgress] = useState(0);

  const scanIntervalRef = useRef(null);

  const staffOptions = {
    'agent-1': { name: 'Director Marcus Vance', role: 'Security Chief', clearance: 'Level 5 (Super)', active: true },
    'agent-2': { name: 'Auditor Elena Rostov', role: 'Compliance Officer', clearance: 'Level 4 (Audit)', active: true },
    'agent-3': { name: 'Guard Jameson Kael', role: 'Armored Truck Escort', clearance: 'Level 2 (Transit)', active: true },
    'agent-4': { name: 'Tech Silas Thorne', role: 'Maintenance Engineer', clearance: 'Level 3 (Systems)', active: true },
    'agent-5': { name: 'Dr. Evelyn Carter', role: 'External Assay Expert', clearance: 'Level 4 (Valuation)', active: true },
    'unauthorized': { name: 'Unknown Intruder', role: 'Unauthorized Personnel', clearance: 'None', active: false },
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(scanIntervalRef.current);
    };
  }, []);

  const startAutomatedScan = () => {
    clearInterval(scanIntervalRef.current);
    setScanStatus('SCANNING');
    setHoldProgress(0);
    setErrorMessage('');

    // Automate progress bar from 0 to 100 over 1.2 seconds (12 ticks * 100ms)
    let progress = 0;
    scanIntervalRef.current = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(scanIntervalRef.current);
        setHoldProgress(100);
        completeVerification();
      } else {
        setHoldProgress(progress);
      }
    }, 100);
  };

  const completeVerification = () => {
    const staff = staffOptions[selectedStaff];
    const time = new Date().toLocaleTimeString();

    if (selectedStaff === 'unauthorized') {
      setScanStatus('DENIED');
      onAddLog({
        id: 'log-' + Date.now(),
        time,
        personnel: staff.name,
        role: staff.role,
        clearance: staff.clearance,
        scanType,
        status: 'DENIED / BREACH ALERT',
        undone: false,
        color: 'danger'
      });
    } else {
      setScanStatus('GRANTED');
      onAddLog({
        id: 'log-' + Date.now(),
        time,
        personnel: staff.name,
        role: staff.role,
        clearance: staff.clearance,
        scanType,
        status: 'GRANTED / AUTHORIZED',
        undone: false,
        color: 'success'
      });
    }

    // Reset scanner to READY state after 3 seconds
    setTimeout(() => {
      setScanStatus('READY');
      setHoldProgress(0);
    }, 3000);
  };

  const getScannerClass = () => {
    switch(scanStatus) {
      case 'SCANNING': return 'biometric-scanning';
      case 'GRANTED': return 'biometric-granted';
      case 'DENIED': return 'biometric-denied';
      default: return 'biometric-ready';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.85rem', marginBottom: '0.4rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
          Biometric Security & Access Control
        </h2>
        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.92rem' }}>
          Manage vault entry permissions, simulate scans, and audit logs with rollback (undo) capabilities.
        </p>
      </div>

      {/* Split grid: Scanner Simulator & Log */}
      <div className="grid-2">
        
        {/* Scanner Panel */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'hsl(var(--gold-primary))' }}>
            <div style={{
              background: 'hsl(var(--gold-primary) / 0.08)',
              padding: '0.4rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Shield size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Biometric Vault Lock Simulator</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Select Personnel Profile</label>
              <select 
                value={selectedStaff} 
                onChange={(e) => setSelectedStaff(e.target.value)} 
                disabled={scanStatus === 'SCANNING'}
                style={{ width: '100%' }}
              >
                {Object.entries(staffOptions).map(([key, opt]) => (
                  <option key={key} value={key}>{opt.name} ({opt.role})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Security Scanner Modality</label>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.15rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.9rem', cursor: 'pointer', color: 'white', fontWeight: 500 }}>
                  <input 
                    type="radio" 
                    name="scanType" 
                    value="Fingerprint" 
                    checked={scanType === 'Fingerprint'} 
                    onChange={() => setScanType('Fingerprint')}
                    disabled={scanStatus === 'SCANNING'}
                    style={{ cursor: 'pointer', accentColor: 'hsl(var(--gold-primary))' }}
                  />
                  Fingerprint ID
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.9rem', cursor: 'pointer', color: 'white', fontWeight: 500 }}>
                  <input 
                    type="radio" 
                    name="scanType" 
                    value="Retinal Scan" 
                    checked={scanType === 'Retinal Scan'} 
                    onChange={() => setScanType('Retinal Scan')}
                    disabled={scanStatus === 'SCANNING'}
                    style={{ cursor: 'pointer', accentColor: 'hsl(var(--gold-primary))' }}
                  />
                  Retinal Iris Scan
                </label>
              </div>
            </div>

            {/* Visual Scanner HUD */}
            <div 
              className={`glass-panel ${getScannerClass()}`}
              style={{ 
                height: '240px', 
                background: 'hsl(var(--bg-tertiary) / 0.5)', 
                borderRadius: '12px', 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s ease',
                userSelect: 'none'
              }}
            >
              {/* Scanline beam visual for scan states */}
              {scanStatus === 'SCANNING' && (
                <div className="laser-line" />
              )}

              {/* Ready State */}
              {scanStatus === 'READY' && (
                <>
                  <div style={{
                    background: 'hsl(var(--border-color) / 0.4)',
                    padding: '1.25rem',
                    borderRadius: '50%',
                    border: '1.5px dashed hsl(var(--text-muted) / 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.75rem',
                    color: 'hsl(var(--text-muted))'
                  }}>
                    {scanType === 'Fingerprint' ? <Fingerprint size={48} /> : <Eye size={48} />}
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', fontWeight: 600 }}>SCANNER ONLINE</span>
                  <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '0.2rem' }}>Ready to capture biometric signature</span>
                </>
              )}

              {/* Scanning State */}
              {scanStatus === 'SCANNING' && (
                <div 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    background: 'hsl(var(--accent-blue) / 0.03)'
                  }}
                >
                  <div style={{
                    background: 'hsl(var(--accent-blue) / 0.08)',
                    padding: '1.15rem',
                    borderRadius: '50%',
                    border: '2px solid hsl(var(--accent-blue))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.75rem',
                    boxShadow: '0 0 20px hsl(var(--accent-blue) / 0.25)',
                    color: 'hsl(var(--accent-blue))'
                  }}>
                    {scanType === 'Fingerprint' ? (
                      <Fingerprint size={48} />
                    ) : (
                      <Eye size={48} />
                    )}
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'hsl(var(--accent-blue))', fontWeight: 700, letterSpacing: '0.04em' }}>
                    {scanType === 'Fingerprint' ? 'ANALYZING WHORLS...' : 'ALIGNING IRIS MESH...'} {holdProgress}%
                  </span>
                  
                  {/* Progress gauge */}
                  <div style={{ width: '60%', height: '5px', background: 'hsl(var(--border-color))', borderRadius: '3px', marginTop: '12px', overflow: 'hidden' }}>
                    <div style={{ width: `${holdProgress}%`, height: '100%', background: 'hsl(var(--gold-primary))', transition: 'width 0.1s linear' }} />
                  </div>
                </div>
              )}

              {/* Access Granted State */}
              {scanStatus === 'GRANTED' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#4ade80' }}>
                  <div style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    padding: '1rem',
                    borderRadius: '50%',
                    border: '2px solid #22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.75rem',
                    boxShadow: '0 0 25px rgba(34,197,94,0.3)',
                    color: '#22c55e'
                  }}>
                    <Unlock size={44} />
                  </div>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '0.05em' }}>ACCESS GRANTED</span>
                  <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', marginTop: '0.2rem' }}>Vault locking pins disengaged</span>
                </div>
              )}

              {/* Access Denied State */}
              {scanStatus === 'DENIED' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#ef4444' }}>
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    padding: '1rem',
                    borderRadius: '50%',
                    border: '2px solid #ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.75rem',
                    boxShadow: '0 0 25px rgba(239,68,68,0.3)',
                    color: '#ef4444'
                  }}>
                    <ShieldAlert size={44} style={{ animation: 'pulse-light 1.5s infinite' }} />
                  </div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.05em' }}>VAULT LOCKDOWN ACTIVE</span>
                  <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', marginTop: '0.2rem' }}>Unauthorized signature reported to HQ</span>
                </div>
              )}
            </div>

            {errorMessage && (
              <div style={{ color: '#f87171', fontSize: '0.82rem', textAlign: 'center', fontWeight: 500 }}>
                {errorMessage}
              </div>
            )}

            <button 
              onClick={startAutomatedScan}
              disabled={scanStatus === 'SCANNING' || scanStatus === 'GRANTED' || scanStatus === 'DENIED'}
              className="btn-primary"
              style={{
                padding: '0.85rem',
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {scanStatus === 'READY' ? 'Initialize Biometric Scan' : 'Scanner Processing...'}
            </button>
          </div>
        </div>

        {/* Access History Log & Undo */}
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
                <Users size={18} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Live Vault Access Log</h3>
            </div>
            <span className="badge badge-blue" style={{ fontSize: '0.62rem' }}>Secure Feed</span>
          </div>

          {/* Ledger feed list */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem', 
            maxHeight: '410px', 
            overflowY: 'auto', 
            paddingRight: '0.35rem' 
          }}>
            {accessLogs.length === 0 ? (
              <p style={{ color: 'hsl(var(--text-muted))', textAlign: 'center', padding: '3.5rem' }}>No entry records logged.</p>
            ) : (
              accessLogs.map((log) => {
                const isDenied = log.status.includes('DENIED') || log.color === 'danger';
                return (
                  <div 
                    key={log.id} 
                    className="glass-card" 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '1.1rem',
                      opacity: log.undone ? 0.45 : 1,
                      textDecoration: log.undone ? 'line-through' : 'none',
                      borderLeft: `4px solid ${log.undone ? '#6b7280' : isDenied ? '#ef4444' : '#22c55e'}`,
                      background: log.undone 
                        ? 'transparent' 
                        : isDenied ? 'rgba(239, 68, 68, 0.02)' : 'rgba(34, 197, 94, 0.02)',
                      flexShrink: 0,
                      minHeight: '88px'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1, paddingRight: '1rem', flexShrink: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', flexShrink: 0 }}>
                        <strong style={{ fontSize: '0.98rem', color: 'white' }}>{log.personnel}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>({log.role})</span>
                      </div>
                      
                      <div style={{ fontSize: '0.78rem', color: 'hsl(var(--text-secondary))', flexShrink: 0 }}>
                        Scan: <span style={{ color: 'white', fontWeight: 500 }}>{log.scanType}</span> • Clearance: <span style={{ color: 'white', fontWeight: 500 }}>{log.clearance}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-muted))', fontFamily: 'var(--font-mono)' }}>{log.time}</span>
                        <span className={`badge ${log.undone ? 'badge-muted' : isDenied ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: '0.62rem', padding: '0.15rem 0.45rem' }}>
                          {log.undone ? 'ROLLBACK / UNDONE' : log.status}
                        </span>
                      </div>
                    </div>

                    {!log.undone && (
                      <button 
                        onClick={() => onUndoLog(log.id)}
                        className="badge"
                        style={{
                          background: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.35)',
                          color: '#f87171',
                          cursor: 'pointer',
                          padding: '0.35rem 0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '0.68rem',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 10px rgba(239, 68, 68, 0.05)',
                          flexShrink: 0
                        }}
                        title="Rollback Access Authorization (Undo Lock Release)"
                      >
                        <RotateCcw size={11} />
                        Undo
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
