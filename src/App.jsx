import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Grid, 
  FileCheck, 
  Truck, 
  Database, 
  UserCheck, 
  Activity, 
  Globe,
  Calendar,
  DollarSign,
  Compass,
  Moon,
  Sun
} from 'lucide-react';

// Import Feature Components
import Overview from './components/Overview';
import GoldRegistry from './components/GoldRegistry';
import AccessLog from './components/AccessLog';
import Logistics from './components/Logistics';
import CustomsChecker from './components/CustomsChecker';
import ShelfLoadManager from './components/ShelfLoadManager';
import LandingPage from './components/LandingPage';

const INITIAL_GOLD_BARS = [
  { serialNumber: 'MMTC-88219B', purity: '99.99', refinery: 'MMTC-PAMP', weight: 1.0, palletId: 'PALLET-01' }, // 1kg bars are standard in India
  { serialNumber: 'MMTC-88220C', purity: '99.99', refinery: 'MMTC-PAMP', weight: 1.0, palletId: 'PALLET-01' },
  { serialNumber: 'KUN-44210A', purity: '99.95', refinery: 'Kundan Refinery', weight: 1.0, palletId: 'PALLET-02' },
  { serialNumber: 'BAN-90021A', purity: '99.99', refinery: 'Bangalore Refinery', weight: 1.0, palletId: 'PALLET-03' },
  { serialNumber: 'AUG-50029X', purity: '99.90', refinery: 'Augmont Gold', weight: 1.0, palletId: 'PALLET-04' },
];

const INITIAL_ACCESS_LOGS = [
  { id: 'log-1', time: '14:22:10', personnel: 'Director Vikram Singh', role: 'Security Chief', clearance: 'Level 5 (Super)', scanType: 'Retinal Scan', status: 'GRANTED / AUTHORIZED', undone: false, color: 'success' },
  { id: 'log-2', time: '13:05:41', personnel: 'Guard Arjun Patel', role: 'Armored Truck Escort', clearance: 'Level 2 (Transit)', scanType: 'Fingerprint', status: 'GRANTED / AUTHORIZED', undone: false, color: 'success' },
  { id: 'log-3', time: '11:15:00', personnel: 'Unknown Intruder', role: 'Unauthorized Personnel', clearance: 'None', scanType: 'Fingerprint', status: 'DENIED / BREACH ALERT', undone: false, color: 'danger' },
];

const INITIAL_TRANSPORT_REQUESTS = [
  { id: 'tr-1', origin: 'Mumbai', destination: 'Delhi', time: '2026-06-09T08:00', barCount: 40, escort: 'MAXIMUM', status: 'READY FOR TRANSIT' },
  { id: 'tr-2', origin: 'Chennai', destination: 'Bangalore', time: '2026-06-10T14:30', barCount: 15, escort: 'HIGH', status: 'PENDING DISPATCH' },
  { id: 'tr-3', origin: 'Delhi', destination: 'Kolkata', time: '2026-06-12T10:00', barCount: 80, escort: 'MAXIMUM', status: 'SCHEDULING ESCORT' },
];

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('overview');
  
  const [goldBars, setGoldBars] = useState(INITIAL_GOLD_BARS);
  const [accessLogs, setAccessLogs] = useState(INITIAL_ACCESS_LOGS);
  const [transportRequests, setTransportRequests] = useState(INITIAL_TRANSPORT_REQUESTS);
  
  // Real market price simulation (Approx ₹71,000 per 10g => ₹7,100,000 per kg)
  const [marketPrice, setMarketPrice] = useState(7100000); 
  
  // Apply theme to body
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Real-time ticking IST clock
  const [timeString, setTimeString] = useState('');
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setTimeString(`${hrs}:${mins}:${secs}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate market price fluctuations slightly (in INR)
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketPrice(prev => {
        // Fluctuate by ₹100 to ₹500 per kg randomly
        const delta = (Math.random() * 1000 - 500);
        return Math.floor(prev + delta);
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
  const totalWeight = goldBars.reduce((sum, b) => sum + b.weight, 0); // in kg
  const totalValue = totalWeight * marketPrice; // Market price is per kg now

  // Format currency in Indian format
  const formatINR = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

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
            viewMode="registry"
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
      case 'organizer':
        return (
          <Logistics 
            transportRequests={transportRequests} 
            onAddTransportRequest={addTransportRequest} 
            viewMode="organizer"
            theme={theme}
          />
        );
      case 'customs':
        return (
          <CustomsChecker goldBars={goldBars} />
        );
      case 'value_sorter':
        return (
          <GoldRegistry 
            goldBars={goldBars} 
            onAddGoldBar={addGoldBar} 
            marketPrice={marketPrice}
            onUpdateMarketPrice={setMarketPrice}
            viewMode="sorter"
          />
        );
      case 'safest_route':
        return (
          <Logistics 
            transportRequests={transportRequests} 
            onAddTransportRequest={addTransportRequest} 
            viewMode="route"
            theme={theme}
          />
        );
      case 'shelves':
        return (
          <ShelfLoadManager />
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
      gap: '0.8rem',
      width: '100%',
      padding: '0.7rem 0.95rem',
      background: isActive ? 'linear-gradient(90deg, hsl(var(--gold-primary) / 0.1) 0%, transparent 100%)' : 'transparent',
      border: 'none',
      borderLeft: isActive ? '3px solid hsl(var(--gold-primary))' : '3px solid transparent',
      color: isActive ? 'hsl(var(--text-primary))' : 'hsl(var(--text-secondary))',
      borderRadius: '0 6px 6px 0',
      fontWeight: isActive ? 600 : 400,
      textAlign: 'left',
      fontSize: '0.88rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    };
  };

  // Compute active alerts
  const alertCount = accessLogs.filter(l => !l.undone && l.status.includes('DENIED')).length;

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <div className="app-container">
      
      {/* Top Status Ribbon (First Level) */}
      <div style={{
        height: '45px',
        backgroundColor: 'hsl(var(--bg-card))',
        borderBottom: '1px solid hsl(var(--border-color))',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        justifyContent: 'space-between',
        fontSize: '0.78rem',
        color: 'hsl(var(--text-secondary))',
        fontWeight: 500,
        zIndex: 20,
        transition: 'all 0.3s ease'
      }}>
        {/* Left Side Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={18} style={{ color: 'hsl(var(--gold-primary))' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.06em', color: 'hsl(var(--text-primary))', fontSize: '0.9rem' }}>
            AURUMSEC
          </span>
          <span style={{ color: 'hsl(var(--text-muted))' }}>|</span>
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.72rem', fontWeight: 600 }}>
            India Node
          </span>
        </div>

        {/* Right Side Clock/Log/Theme */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', fontFamily: 'var(--font-mono)' }}>
          <span>Logged: <strong style={{ color: 'hsl(var(--gold-primary))' }}>OPERATOR A77</strong></span>
          <span style={{ color: 'hsl(var(--text-primary))', fontWeight: 600 }}>{timeString} IST</span>
          
          <button 
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: '1px solid hsl(var(--border-color))',
              color: 'hsl(var(--text-primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.4rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
            title="Toggle Light/Dark Mode"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      {/* Main Framework Layout */}
      <div className="app-main">
        
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flexGrow: 1 }}>
            
            <button onClick={() => setActiveTab('overview')} style={getNavButtonStyle('overview')}>
              <Globe size={15} style={{ color: activeTab === 'overview' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
              Global Vault Status Hub
            </button>

            <button onClick={() => setActiveTab('registry')} style={getNavButtonStyle('registry')}>
              <Database size={15} style={{ color: activeTab === 'registry' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
              Gold Bar Detail View
            </button>

            <button onClick={() => setActiveTab('access')} style={getNavButtonStyle('access')}>
              <UserCheck size={15} style={{ color: activeTab === 'access' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
              Access History Log
            </button>

            <button onClick={() => setActiveTab('organizer')} style={getNavButtonStyle('organizer')}>
              <Calendar size={15} style={{ color: activeTab === 'organizer' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
              Transport Organizer
            </button>

            <button onClick={() => setActiveTab('customs')} style={getNavButtonStyle('customs')}>
              <FileCheck size={15} style={{ color: activeTab === 'customs' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
              Customs Paper Checker
            </button>

            <button onClick={() => setActiveTab('value_sorter')} style={getNavButtonStyle('value_sorter')}>
              <DollarSign size={15} style={{ color: activeTab === 'value_sorter' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
              Value Sorter
            </button>

            <button onClick={() => setActiveTab('safest_route')} style={getNavButtonStyle('safest_route')}>
              <Compass size={15} style={{ color: activeTab === 'safest_route' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
              Safest Delivery Route
            </button>

            <button onClick={() => setActiveTab('shelves')} style={getNavButtonStyle('shelves')}>
              <Grid size={15} style={{ color: activeTab === 'shelves' ? 'hsl(var(--gold-primary))' : 'inherit' }} />
              Shelf Load Manager
            </button>

          </nav>

          {/* Sidebar Spot Valuation footer */}
          <div style={{ borderTop: '1px solid hsl(var(--border-color))', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'hsl(var(--text-muted))' }}>
              <span>SPOT (1KG)</span>
              <span style={{ color: 'hsl(var(--gold-primary))', fontWeight: 'bold' }}>{formatINR(marketPrice)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'hsl(var(--text-muted))' }}>
              <span>NET WORTH</span>
              <span style={{ color: 'hsl(var(--text-primary))', fontWeight: 'bold' }}>{formatINR(totalValue)}</span>
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
            {/* Left title matching exact tab name */}
            <h2 style={{ 
              fontSize: '0.9rem', 
              fontWeight: 800, 
              fontFamily: 'var(--font-display)', 
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'hsl(var(--text-primary))'
            }}>
              {activeTab === 'overview' && 'Global Vault Status Hub'}
              {activeTab === 'registry' && 'Gold Bar Detail View'}
              {activeTab === 'access' && 'Access History Log (Undo)'}
              {activeTab === 'organizer' && 'Transport Organizer'}
              {activeTab === 'customs' && 'Customs Paper Checker'}
              {activeTab === 'value_sorter' && 'Value Sorter'}
              {activeTab === 'safest_route' && 'Safest Delivery Route'}
              {activeTab === 'shelves' && 'Shelf Load Manager'}
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
                color: alertCount > 0 ? 'hsl(var(--danger))' : 'hsl(var(--text-muted))',
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
