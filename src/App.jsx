import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Grid, 
  FileCheck, 
  Truck, 
  Database, 
  UserCheck, 
  Activity, 
  Lock, 
  Globe,
  Settings as SettingsIcon,
  Bell,
  ClipboardList
} from 'lucide-react';

// Import Feature Components
import Overview from './components/Overview';
import GoldRegistry from './components/GoldRegistry';
import AccessLog from './components/AccessLog';
import Logistics from './components/Logistics';
import CustomsChecker from './components/CustomsChecker';
import ShelfLoadManager from './components/ShelfLoadManager';

const INITIAL_GOLD_BARS = [
  { serialNumber: 'VAL-88219B', purity: '99.99', refinery: 'Valcambi', weight: 12.4, palletId: 'PALLET-01' },
  { serialNumber: 'VAL-88220C', purity: '99.99', refinery: 'Valcambi', weight: 12.4, palletId: 'PALLET-01' },
  { serialNumber: 'RND-44210A', purity: '99.95', refinery: 'Rand Refinery', weight: 12.4, palletId: 'PALLET-02' },
  { serialNumber: 'PRT-90021A', purity: '99.99', refinery: 'Perth Mint', weight: 12.4, palletId: 'PALLET-03' },
  { serialNumber: 'RCM-50029X', purity: '99.90', refinery: 'Royal Canadian Mint', weight: 12.5, palletId: 'PALLET-04' },
];

const INITIAL_ACCESS_LOGS = [
  { id: 'log-1', time: '14:22:10', personnel: 'Director Marcus Vance', role: 'Security Chief', clearance: 'Level 5 (Super)', scanType: 'Retinal Scan', status: 'GRANTED / AUTHORIZED', undone: false, color: 'success' },
  { id: 'log-2', time: '13:05:41', personnel: 'Guard Jameson Kael', role: 'Armored Truck Escort', clearance: 'Level 2 (Transit)', scanType: 'Fingerprint', status: 'GRANTED / AUTHORIZED', undone: false, color: 'success' },
  { id: 'log-3', time: '11:15:00', personnel: 'Unknown Intruder', role: 'Unauthorized Personnel', clearance: 'None', scanType: 'Fingerprint', status: 'DENIED / BREACH ALERT', undone: false, color: 'danger' },
];

const INITIAL_TRANSPORT_REQUESTS = [
  { id: 'tr-1', origin: 'Paris', destination: 'Zurich', time: '2026-06-09T08:00', barCount: 40, escort: 'MAXIMUM', status: 'READY FOR TRANSIT' },
  { id: 'tr-2', origin: 'London', destination: 'Brussels', time: '2026-06-10T14:30', barCount: 15, escort: 'HIGH', status: 'PENDING DISPATCH' },
  { id: 'tr-3', origin: 'Zurich', destination: 'Frankfurt', time: '2026-06-12T10:00', barCount: 80, escort: 'MAXIMUM', status: 'SCHEDULING ESCORT' },
];

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [goldBars, setGoldBars] = useState(INITIAL_GOLD_BARS);
  const [accessLogs, setAccessLogs] = useState(INITIAL_ACCESS_LOGS);
  const [transportRequests, setTransportRequests] = useState(INITIAL_TRANSPORT_REQUESTS);
  const [marketPrice, setMarketPrice] = useState(2350.50); // initial spot price per oz
  
  // Real-time ticking UTC clock
  const [timeString, setTimeString] = useState('');
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hrs = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      setTimeString(`${hrs}:${mins}:${secs}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate market price fluctuations slightly
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketPrice(prev => {
        const delta = (Math.random() * 4 - 2);
        return parseFloat((prev + delta).toFixed(2));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle state updates
  const addGoldBar = (newBar) => {
    setGoldBars(prev => [newBar, ...prev]);
  };

  const addAccessLog = (newLog) => {
    setAccessLogs(prev => [newLog, ...prev]);
  };

  const undoAccessLog = (id) => {
    setAccessLogs(prev => prev.map(log => {
      if (log.id === id) {
        return { ...log, undone: true };
      }
      return log;
    }));
  };

  const addTransportRequest = (newRequest) => {
    setTransportRequests(prev => [newRequest, ...prev]);
  };

  // Compute stats
  const totalWeight = goldBars.reduce((sum, b) => sum + b.weight, 0);
  const totalValue = totalWeight * 32.1507 * marketPrice;

  // Render content based on sidebar tab
  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <Overview 
            goldBars={goldBars} 
            accessLogs={accessLogs} 
            transportRequests={transportRequests} 
            marketPrice={marketPrice} 
          />
        );
      case 'registry':
        return (
          <GoldRegistry 
            goldBars={goldBars} 
            onAddGoldBar={addGoldBar} 
            marketPrice={marketPrice}
            onUpdateMarketPrice={setMarketPrice}
          />
        );
      case 'access':
        return (
          <AccessLog 
            accessLogs={accessLogs} 
            onAddLog={addAccessLog} 
            onUndoLog={undoAccessLog} 
          />
        );
      case 'shelves':
        return (
          <ShelfLoadManager />
        );
      case 'activity_logs':
        return (
          <Logistics 
            transportRequests={transportRequests} 
            onAddTransportRequest={addTransportRequest} 
          />
        );
      case 'alerts':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.85rem', marginBottom: '0.4rem', fontWeight: 700 }}>Active System Alerts</h2>
            <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid hsl(var(--success))', background: 'rgba(34,197,94,0.02)' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#4ade80', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={18} /> Network Security Status: Active
              </h3>
              <p style={{ fontSize: '0.88rem' }}>No perimeter intrusion signatures or active system bypasses reported in the last 24 hours.</p>
            </div>
            {accessLogs.some(l => l.status.includes('DENIED')) && (
              <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid hsl(var(--danger))', background: 'rgba(239,68,68,0.02)' }}>
                <h3 style={{ fontSize: '1.1rem', color: '#f87171', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bell size={18} /> Security Alerts Ledger
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                  {accessLogs.filter(l => l.status.includes('DENIED')).map((log, idx) => (
                    <div key={idx} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', borderLeft: '4px solid hsl(var(--danger))' }}>
                      <span>Unauthorized Biometric Scan: <strong style={{ color: 'white' }}>{log.personnel}</strong> ({log.role})</span>
                      <span style={{ color: '#f87171', fontWeight: 600 }}>{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 'reports':
        return (
          <CustomsChecker goldBars={goldBars} />
        );
      case 'settings':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.85rem', marginBottom: '0.4rem', fontWeight: 700 }}>System Settings & Calibration</h2>
            <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Market Pricing</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>Gold Spot Market Value (USD/oz)</label>
                <input 
                  type="number" 
                  value={marketPrice}
                  onChange={(e) => setMarketPrice(Number(e.target.value))}
                  style={{ width: '200px' }}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getNavButtonStyle = (tabName) => {
    const isActive = activeTab === tabName;
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '0.85rem',
      width: '100%',
      padding: '0.75rem 1rem',
      background: isActive ? 'linear-gradient(90deg, hsl(var(--gold-primary) / 0.1) 0%, transparent 100%)' : 'transparent',
      border: 'none',
      borderLeft: isActive ? '3px solid hsl(var(--gold-primary))' : '3px solid transparent',
      color: isActive ? 'white' : 'hsl(var(--text-secondary))',
      borderRadius: '0 6px 6px 0',
      fontWeight: isActive ? 600 : 400,
      textAlign: 'left',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.25s ease'
    };
  };

  // Compute active alerts
  const alertCount = accessLogs.filter(l => !l.undone && l.status.includes('DENIED')).length;

  return (
    <div className="app-container">
      
      {/* Top Status Ribbon (First Level) */}
      <div style={{
        height: '40px',
        backgroundColor: '#0a0d14',
        borderBottom: '1px solid hsl(var(--border-color))',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        justifyContent: 'space-between',
        fontSize: '0.78rem',
        color: 'hsl(var(--text-secondary))',
        fontWeight: 500,
        zIndex: 20
      }}>
        {/* Left Side Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={16} style={{ color: 'hsl(var(--gold-primary))' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.06em', color: 'white' }}>
            AURUMSEC
          </span>
          <span style={{ color: 'hsl(var(--text-muted))' }}>|</span>
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.72rem', fontWeight: 600 }}>
            Vault Management System
          </span>
        </div>

        {/* Right Side Clock/Log */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'var(--font-mono)' }}>
          <span>Logged: <strong style={{ color: 'hsl(var(--gold-primary))' }}>OPERATOR A77</strong> (ACTIVE)</span>
          <span style={{ color: 'hsl(var(--text-muted))' }}>-</span>
          <span style={{ color: 'white', fontWeight: 600 }}>{timeString} UTC</span>
        </div>
      </div>

      {/* Main Framework Layout */}
      <div className="app-main">
        
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flexGrow: 1 }}>
            <button onClick={() => setActiveTab('overview')} style={getNavButtonStyle('overview')}>
              <Activity size={16} style={{ color: activeTab === 'overview' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
              Overview
            </button>

            <button onClick={() => setActiveTab('registry')} style={getNavButtonStyle('registry')}>
              <Database size={16} style={{ color: activeTab === 'registry' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
              Vaults
            </button>

            <button onClick={() => setActiveTab('access')} style={getNavButtonStyle('access')}>
              <UserCheck size={16} style={{ color: activeTab === 'access' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
              Biometrics
            </button>

            <button onClick={() => setActiveTab('shelves')} style={getNavButtonStyle('shelves')}>
              <Grid size={16} style={{ color: activeTab === 'shelves' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
              Assets
            </button>

            <button onClick={() => setActiveTab('activity_logs')} style={getNavButtonStyle('activity_logs')}>
              <ClipboardList size={16} style={{ color: activeTab === 'activity_logs' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
              Activity Logs
            </button>

            <button onClick={() => setActiveTab('alerts')} style={getNavButtonStyle('alerts')}>
              <Bell size={16} style={{ color: activeTab === 'alerts' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
              Alerts
            </button>

            <button onClick={() => setActiveTab('reports')} style={getNavButtonStyle('reports')}>
              <FileCheck size={16} style={{ color: activeTab === 'reports' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
              Reports
            </button>

            <button onClick={() => setActiveTab('settings')} style={getNavButtonStyle('settings')}>
              <SettingsIcon size={16} style={{ color: activeTab === 'settings' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
              Settings
            </button>
          </nav>

          {/* Sidebar Spot Valuation footer */}
          <div style={{ borderTop: '1px solid hsl(var(--border-color))', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'hsl(var(--text-muted))' }}>
              <span>SPOT GOLD</span>
              <span style={{ color: 'hsl(var(--gold-primary))', fontWeight: 'bold' }}>${marketPrice.toFixed(2)}/oz</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'hsl(var(--text-muted))' }}>
              <span>NET WORTH</span>
              <span style={{ color: 'white', fontWeight: 'bold' }}>${(totalValue / 1e6).toFixed(2)}M</span>
            </div>
          </div>

        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          
          {/* Sub-Header Ribbon (Second Level) */}
          <header style={{ 
            height: '50px', 
            borderBottom: '1px solid hsl(var(--border-color))', 
            display: 'flex', 
            alignItems: 'center', 
            padding: '0 1.5rem',
            background: 'hsl(var(--bg-secondary) / 0.5)',
            justifyContent: 'space-between',
            flexShrink: 0
          }}>
            {/* Left title */}
            <h2 style={{ 
              fontSize: '1rem', 
              fontWeight: 800, 
              fontFamily: 'var(--font-display)', 
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'white'
            }}>
              {activeTab === 'overview' ? 'DASHBOARD' : activeTab.replace('_', ' ')}
            </h2>

            {/* Right Status Badge Grid */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="badge badge-success" style={{ fontSize: '0.62rem', padding: '0.2rem 0.5rem', border: '1px solid hsl(var(--success) / 0.2)' }}>
                SYSTEM SECURE
              </span>
              <span className="badge badge-blue" style={{ fontSize: '0.62rem', padding: '0.2rem 0.5rem', border: '1px solid hsl(var(--accent-blue) / 0.2)' }}>
                NETWORK: ENCRYPTED
              </span>
              <span className="badge" style={{ 
                fontSize: '0.62rem', 
                padding: '0.2rem 0.5rem', 
                background: alertCount > 0 ? 'hsl(var(--danger) / 0.1)' : 'hsl(var(--text-muted) / 0.08)',
                color: alertCount > 0 ? '#f87171' : 'hsl(var(--text-muted))',
                border: alertCount > 0 ? '1px solid hsl(var(--danger) / 0.2)' : '1px solid hsl(var(--border-color))'
              }}>
                ALERTS: {alertCount}
              </span>
            </div>
          </header>

          {/* Render Active Component Tab */}
          <section className="content-body">
            {renderContent()}
          </section>

        </main>
      </div>

    </div>
  );
}

export default App;
