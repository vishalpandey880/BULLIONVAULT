import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Cpu, Activity, Globe, Database, Compass, CheckCircle, Wifi, AlertTriangle } from 'lucide-react';

export default function Overview({ goldBars, accessLogs, transportRequests, marketPrice }) {
  const [vaults, setVaults] = useState([
    { id: 'london', name: 'London Central Vault (UK)', status: 'SECURE', reserves: 14250, securityLevel: 'LEVEL 5', threatIndex: 0.02, ping: 42 },
    { id: 'zurich', name: 'Zurich Alpine Deep Vault (CH)', status: 'SECURE', reserves: 9840, securityLevel: 'LEVEL 5', threatIndex: 0.01, ping: 38 },
    { id: 'ny', name: 'New York Fed Sublevel (US)', status: 'WARNING', reserves: 18120, securityLevel: 'LEVEL 4', threatIndex: 0.15, ping: 65 },
    { id: 'singapore', name: 'Singapore Changi Secure Hub (SG)', status: 'SECURE', reserves: 7650, securityLevel: 'LEVEL 5', threatIndex: 0.04, ping: 84 },
    { id: 'tokyo', name: 'Tokyo Underground Depository (JP)', status: 'SECURE', reserves: 5120, securityLevel: 'LEVEL 5', threatIndex: 0.03, ping: 51 },
  ]);

  // Simulate real-time ping fluctuation and minor reserve updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVaults(prev => prev.map(v => {
        const pingDiff = Math.floor(Math.random() * 9) - 4;
        const newPing = Math.max(10, Math.min(200, v.ping + pingDiff));
        return {
          ...v,
          ping: newPing
        };
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const totalVaultsValue = vaults.reduce((acc, v) => acc + (v.reserves * 400 * marketPrice), 0);
  const currentVaultValue = goldBars.reduce((acc, bar) => acc + (bar.weight * 32.1507 * marketPrice), 0); // convert kg to oz

  const toggleVaultStatus = (id) => {
    setVaults(prev => prev.map(v => {
      if (v.id === id) {
        const nextStatus = v.status === 'SECURE' ? 'WARNING' : v.status === 'WARNING' ? 'CRITICAL' : 'SECURE';
        const threat = nextStatus === 'SECURE' ? 0.03 : nextStatus === 'WARNING' ? 0.35 : 0.88;
        const level = nextStatus === 'SECURE' ? 'LEVEL 5' : nextStatus === 'WARNING' ? 'LEVEL 3' : 'LEVEL 1';
        return { ...v, status: nextStatus, threatIndex: threat, securityLevel: level };
      }
      return v;
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Welcome & Summary Metrics */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.4rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            Security Headquarters
          </h2>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.92rem' }}>
            Centralized operational overview and global vault status indicators.
          </p>
        </div>
        <div className="badge badge-gold" style={{ padding: '0.5rem 0.9rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Activity size={13} style={{ animation: 'radar-spin 2s linear infinite' }} />
          LIVE VAULT FEED ACTIVE
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid-3">
        
        {/* Active Vault Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{
              background: 'hsl(var(--gold-primary) / 0.08)',
              padding: '0.6rem',
              borderRadius: '10px',
              border: '1px solid hsl(var(--gold-primary) / 0.2)',
              color: 'hsl(var(--gold-primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={22} />
            </div>
            <span className="badge badge-gold" style={{ fontSize: '0.62rem' }}>Vault Registry</span>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'white', letterSpacing: '-0.02em' }}>
              {goldBars.length} Bars
            </div>
            <div style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.85rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Current Reserves: <strong style={{ color: 'white' }}>{(goldBars.reduce((sum, b) => sum + b.weight, 0)).toFixed(1)} kg</strong>
            </div>
          </div>
          <div style={{ borderTop: '1px solid hsl(var(--border-color))', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', fontWeight: 600, letterSpacing: '0.05em' }}>NET VALUE DEPOSITED</span>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'hsl(var(--gold-primary))', fontFamily: 'var(--font-display)' }}>
              ${currentVaultValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Secure Perimeter Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{
              background: 'hsl(var(--accent-blue) / 0.08)',
              padding: '0.6rem',
              borderRadius: '10px',
              border: '1px solid hsl(var(--accent-blue) / 0.2)',
              color: 'hsl(var(--accent-blue))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={22} />
            </div>
            <span className="badge badge-blue" style={{ fontSize: '0.62rem' }}>Perimeter Security</span>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '-0.02em' }}>
              SECURE <CheckCircle size={22} style={{ color: '#4ade80', filter: 'drop-shadow(0 0 6px rgba(74,222,128,0.3))' }} />
            </div>
            <div style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.85rem', marginTop: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Staff scan: <span style={{ color: 'white', fontWeight: 500 }}>{accessLogs.length > 0 ? accessLogs[0].personnel : 'No logs'}</span>
            </div>
          </div>
          <div style={{ borderTop: '1px solid hsl(var(--border-color))', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', fontWeight: 600, letterSpacing: '0.05em' }}>AUTHORIZED PASSES TODAY</span>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', fontFamily: 'var(--font-display)' }}>
              {accessLogs.filter(l => !l.undone && l.status.includes('GRANTED')).length} Entries
            </span>
          </div>
        </div>

        {/* Global Network Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{
              background: 'rgba(168, 85, 247, 0.08)',
              padding: '0.6rem',
              borderRadius: '10px',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              color: '#c084fc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Globe size={22} />
            </div>
            <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.12)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', fontSize: '0.62rem' }}>Global Network</span>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'white', letterSpacing: '-0.02em' }}>
              ${(totalVaultsValue / 1e9).toFixed(3)} B
            </div>
            <div style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.85rem', marginTop: '0.35rem' }}>
              Global Reserves Valuation
            </div>
          </div>
          <div style={{ borderTop: '1px solid hsl(var(--border-color))', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', fontWeight: 600, letterSpacing: '0.05em' }}>MONITORED REGIONAL VAULTS</span>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#c084fc', fontFamily: 'var(--font-display)' }}>
              {vaults.length} Facilities
            </span>
          </div>
        </div>
      </div>

      {/* Global Vault Status Hub */}
      <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Globe style={{ color: 'hsl(var(--gold-primary))' }} size={20} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Global Vault Status Hub</h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', fontWeight: 500 }}>
            Click status badge to simulate security breach drill / warnings
          </span>
        </div>

        {/* Worldwide Vault Network Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {vaults.map(vault => {
            const val = vault.reserves * 400 * marketPrice;
            const isSecure = vault.status === 'SECURE';
            const isWarning = vault.status === 'WARNING';
            const isCritical = vault.status === 'CRITICAL';

            return (
              <div 
                key={vault.id} 
                className="glass-card" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '1.15rem 1.5rem',
                  borderLeft: `4px solid ${isSecure ? '#22c55e' : isWarning ? '#eab308' : '#ef4444'}`,
                  background: isSecure 
                    ? 'hsl(var(--bg-card) / 0.4)' 
                    : isWarning ? 'rgba(234, 179, 8, 0.03)' : 'rgba(239, 68, 68, 0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
                  
                  {/* Status Indicator circle with breathing ring */}
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: isSecure ? '#22c55e' : isWarning ? '#eab308' : '#ef4444',
                      boxShadow: isSecure 
                        ? '0 0 10px #22c55e' 
                        : isWarning ? '0 0 10px #eab308' : '0 0 10px #ef4444'
                    }}></div>
                  </div>

                  {/* Vault Specs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1 }}>
                    <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'white' }}>{vault.name}</h4>
                    <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.78rem', color: 'hsl(var(--text-secondary))', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        Reserves: <strong style={{ color: 'white', fontWeight: 600 }}>{vault.reserves.toLocaleString()} bars</strong>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Wifi size={12} style={{ color: 'hsl(var(--text-muted))' }} />
                        Ping: <strong style={{ color: 'white', fontWeight: 600 }}>{vault.ping}ms</strong>
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <AlertTriangle size={12} style={{ color: 'hsl(var(--text-muted))' }} />
                        Threat Level: <strong style={{ color: isSecure ? 'white' : isWarning ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>{(vault.threatIndex * 100).toFixed(0)}%</strong>
                      </span>
                    </div>
                  </div>

                </div>

                {/* Vault Valuation & Button controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.62rem', color: 'hsl(var(--text-muted))', fontWeight: 600, letterSpacing: '0.04em' }}>EST. SECURITY NET WORTH</div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'hsl(var(--gold-primary))', fontFamily: 'var(--font-display)', marginTop: '0.15rem' }}>
                      ${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleVaultStatus(vault.id)}
                    className={`badge ${isSecure ? 'badge-success' : isWarning ? 'badge-gold' : 'badge-danger'}`}
                    style={{ 
                      border: '1px solid transparent', 
                      cursor: 'pointer', 
                      padding: '0.45rem 0.9rem', 
                      fontWeight: 700, 
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      minWidth: '95px',
                      textAlign: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  >
                    {isSecure ? 'SECURE' : isWarning ? 'WARNING' : 'CRITICAL'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
