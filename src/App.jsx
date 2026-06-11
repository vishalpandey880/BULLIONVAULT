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
  DollarSign
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
  const [tickerNews, setTickerNews] = useState([
    'LONDON: SECURE TRANSIT ARMORED AR-4 READY FOR ROUTE COMPLIANCE',
    'ZURICH: ALPINE STACK COMPLETE. SHELVING MARGINS NOMINAL',
    'SINGAPORE: LBMA REGISTRY COMPLETED WITH ZERO REPORTED ANOMALIES',
    'NEW YORK: FED SUBLEVEL UPGRADE STAGE 4 COMPLETE',
  ]);

  // Handle updates
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

  // Compute stats
  const totalWeight = goldBars.reduce((sum, b) => sum + b.weight, 0);
  const totalValue = totalWeight * 32.1507 * marketPrice;

  const getNavButtonStyle = (tabName) => {
    const isActive = activeTab === tabName;
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '0.9rem',
      width: '100%',
      padding: '0.85rem 1.15rem',
      background: isActive ? 'linear-gradient(90deg, hsl(var(--gold-primary) / 0.15) 0%, transparent 100%)' : 'transparent',
      border: 'none',
      borderLeft: isActive ? '3px solid hsl(var(--gold-primary))' : '3px solid transparent',
      color: isActive ? 'white' : 'hsl(var(--text-secondary))',
      borderRadius: '0 8px 8px 0',
      fontWeight: isActive ? 600 : 400,
      textAlign: 'left',
      fontSize: '0.92rem',
      cursor: 'pointer',
      transition: 'all 0.25s ease',
      boxShadow: isActive ? '0 4px 12px hsl(var(--gold-primary) / 0.02)' : 'none'
    };
  };

  return (
    <div className="app-container">
      
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        
        {/* Brand/Logo */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.85rem', 
          marginBottom: '2.5rem', 
          paddingBottom: '1.5rem', 
          borderBottom: '1px solid hsl(var(--border-color))' 
        }}>
          <div style={{
            background: 'hsl(var(--gold-primary) / 0.1)',
            padding: '0.5rem',
            borderRadius: '10px',
            border: '1px solid hsl(var(--gold-primary) / 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px hsl(var(--gold-primary) / 0.08)'
          }}>
            <Shield style={{ color: 'hsl(var(--gold-primary))', filter: 'drop-shadow(0 0 8px hsl(var(--gold-primary) / 0.45))' }} size={28} />
          </div>
          <div>
            <h1 className="title-neon" style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '0.06em' }}>BULLIONVAULT</h1>
            <span style={{ fontSize: '0.65rem', color: 'hsl(var(--text-muted))', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>High-Security Console</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexGrow: 1 }}>
          <button 
            onClick={() => setActiveTab('overview')}
            style={getNavButtonStyle('overview')}
          >
            <Activity size={18} style={{ color: activeTab === 'overview' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
            Overview & Status Hub
          </button>

          <button 
            onClick={() => setActiveTab('registry')}
            style={getNavButtonStyle('registry')}
          >
            <Database size={18} style={{ color: activeTab === 'registry' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
            Gold Bar Registry
          </button>

          <button 
            onClick={() => setActiveTab('access')}
            style={getNavButtonStyle('access')}
          >
            <UserCheck size={18} style={{ color: activeTab === 'access' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
            Biometric Access Log
          </button>

          <button 
            onClick={() => setActiveTab('logistics')}
            style={getNavButtonStyle('logistics')}
          >
            <Truck size={18} style={{ color: activeTab === 'logistics' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
            Transit Organizer
          </button>

          <button 
            onClick={() => setActiveTab('customs')}
            style={getNavButtonStyle('customs')}
          >
            <FileCheck size={18} style={{ color: activeTab === 'customs' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
            Customs Paper Checker
          </button>

          <button 
            onClick={() => setActiveTab('shelves')}
            style={getNavButtonStyle('shelves')}
          >
            <Grid size={18} style={{ color: activeTab === 'shelves' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
            Shelf Load Manager
          </button>
        </nav>

        {/* Sidebar Footer Info */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid hsl(var(--border-color))', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
            <span style={{ color: 'hsl(var(--text-muted))', fontWeight: 500 }}>Vault Status</span>
            <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem' }}>ACTIVE</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
            <span style={{ color: 'hsl(var(--text-muted))', fontWeight: 500 }}>Spot Gold</span>
            <span style={{ fontWeight: 'bold', color: 'hsl(var(--gold-primary))', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <DollarSign size={11} style={{ strokeWidth: 2.5 }} />
              {marketPrice.toFixed(2)} /oz
            </span>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        
        {/* Header Ribbon / Broadcast Ticker */}
        <header style={{ 
          height: '65px', 
          borderBottom: '1px solid hsl(var(--border-color))', 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 2rem',
          background: 'hsl(var(--bg-secondary) / 0.45)',
          backdropFilter: 'blur(8px)',
          justifyContent: 'space-between',
          overflow: 'hidden',
          zIndex: 5
        }}>
          {/* Live broadcast ticker feed */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '68%' }}>
            <span className="badge badge-gold" style={{ fontSize: '0.68rem', padding: '0.35rem 0.75rem', flexShrink: 0, zIndex: 2 }}>
              <Globe size={11} style={{ marginRight: '0.25rem', animation: 'radar-spin 4s linear infinite' }} /> Global Telex
            </span>
            
            <div style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
              <div 
                style={{ 
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                  animation: 'ticker 40s linear infinite',
                  color: 'hsl(var(--text-secondary))',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.06em'
                }}
              >
                {tickerNews.join('   •   ')} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {tickerNews.join('   •   ')}
              </div>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexShrink: 0 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.62rem', color: 'hsl(var(--text-muted))', fontWeight: 700, letterSpacing: '0.05em' }}>VAULT NET WORTH</div>
              <div className="title-neon" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '1px', justifyContent: 'flex-end' }}>
                <span style={{ color: 'hsl(var(--gold-primary))', fontSize: '0.9rem' }}>$</span>
                {totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>
            <div style={{ height: '28px', width: '1px', background: 'hsl(var(--border-color))' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: '#4ade80', 
                boxShadow: '0 0 10px #22c55e',
                animation: 'pulse-light 2s infinite'
              }}></div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'hsl(var(--text-secondary))', letterSpacing: '0.05em' }}>SECURE NET</span>
            </div>
          </div>
        </header>

        {/* Content Body Rendering active tab */}
        <section className="content-body">
          {activeTab === 'overview' && (
            <Overview 
              goldBars={goldBars} 
              accessLogs={accessLogs} 
              transportRequests={transportRequests} 
              marketPrice={marketPrice} 
            />
          )}

          {activeTab === 'registry' && (
            <GoldRegistry 
              goldBars={goldBars} 
              onAddGoldBar={addGoldBar} 
              marketPrice={marketPrice}
              onUpdateMarketPrice={setMarketPrice}
            />
          )}

          {activeTab === 'access' && (
            <AccessLog 
              accessLogs={accessLogs} 
              onAddLog={addAccessLog} 
              onUndoLog={undoAccessLog} 
            />
          )}

          {activeTab === 'logistics' && (
            <Logistics 
              transportRequests={transportRequests} 
              onAddTransportRequest={addTransportRequest} 
            />
          )}

          {activeTab === 'customs' && (
            <CustomsChecker 
              goldBars={goldBars} 
            />
          )}

          {activeTab === 'shelves' && (
            <ShelfLoadManager />
          )}
        </section>

      </main>

    </div>
  );
}

export default App;
