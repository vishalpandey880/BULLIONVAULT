import React, { useState, useEffect, useRef } from 'react';
import { Shield, Fingerprint, Eye, TrendingUp, DollarSign, Activity, AlertTriangle, ShieldCheck, Lock, Unlock, Compass } from 'lucide-react';

export default function Overview({ goldBars, accessLogs, transportRequests, marketPrice }) {
  // Biometric verification scanner state
  const [scanProgress, setScanProgress] = useState(84);
  const [scanTime, setScanTime] = useState('01:14s');
  const [scanStatus, setScanStatus] = useState('IN PROGRESS'); // IN PROGRESS, COMPLIANT, WARNING
  const [scannerActive, setScannerActive] = useState(true);
  
  // Radar degree rotation
  const [radarDegree, setRadarDegree] = useState(0);

  // Computed values from real state data
  const registryTotalWeight = goldBars.reduce((sum, b) => sum + b.weight, 0);
  const registryTotalValue = registryTotalWeight * marketPrice;

  // Simulate progress bar fluctuation slightly to make it look alive
  useEffect(() => {
    const progressTimer = setInterval(() => {
      setScanProgress(prev => {
        if (!scannerActive) return prev;
        const delta = Math.floor(Math.random() * 3) - 1;
        const nextVal = Math.min(99, Math.max(70, prev + delta));
        
        // update simulated countdown time based on progress
        const remainingSecs = Math.max(1, Math.floor((100 - nextVal) * 1.2));
        setScanTime(`00:${remainingSecs.toString().padStart(2, '0')}s`);
        
        return nextVal;
      });
    }, 3000);
    return () => clearInterval(progressTimer);
  }, [scannerActive]);

  // Simulate scan override trigger
  const runSecurityScan = () => {
    setScannerActive(false);
    setScanProgress(0);
    setScanTime('01:30s');
    setScanStatus('SCANNING');

    let current = 0;
    const interval = setInterval(() => {
      current += 4;
      if (current >= 100) {
        clearInterval(interval);
        setScanProgress(100);
        setScanTime('00:00s');
        setScanStatus('COMPLIANT');
        setScannerActive(true);
      } else {
        setScanProgress(current);
        const rem = Math.max(0, Math.floor((100 - current) * 0.9));
        setScanTime(`00:${rem.toString().padStart(2, '0')}s`);
      }
    }, 100);
  };

  // Generate Segmented Progress Bar characters
  const renderSegments = (percent) => {
    const totalBars = 28;
    const filledBars = Math.floor((percent / 100) * totalBars);
    const emptyBars = totalBars - filledBars;
    return (
      <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '2px', color: 'hsl(var(--gold-primary))' }}>
        {'█'.repeat(filledBars)}
        <span style={{ color: 'hsl(var(--border-color))' }}>{'█'.repeat(emptyBars)}</span>
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Upper Grid Layout: 2 Columns */}
      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Left Column: STATISTIC INDICATORS */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <h3 style={{ fontSize: '0.82rem', color: 'hsl(var(--text-muted))', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.65rem' }}>
            Statistic Indicators
          </h3>

          {/* Vault Asset Value Card (Full Width in left column) */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'hsl(var(--bg-secondary))' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-muted))', fontWeight: 700, letterSpacing: '0.04em' }}>VAULT ASSET VALUE</span>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'hsl(var(--text-primary))', fontFamily: 'var(--font-display)', marginTop: '0.2rem' }} className="title-neon">
                  ₹14,780 Cr
                </div>
                {/* Small indicator of live active registry */}
                <div style={{ fontSize: '0.68rem', color: 'hsl(var(--text-muted))', marginTop: '0.15rem' }}>
                  Registry Deposit: <span style={{ color: 'hsl(var(--gold-primary))', fontWeight: 650 }}>₹{(registryTotalValue / 1e7).toFixed(2)}Cr</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'hsl(var(--gold-primary))', fontSize: '0.75rem', fontWeight: 600 }}>
                <TrendingUp size={14} /> Gold trend
              </div>
            </div>

            {/* SVG Area Chart (Gold trend line) */}
            <div style={{ height: '95px', marginTop: '0.5rem', position: 'relative' }}>
              <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--gold-primary))" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="hsl(var(--gold-primary))" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Glowing area */}
                <path 
                  d="M 0 80 Q 50 70 80 50 T 160 55 T 240 35 T 320 40 T 400 15 L 400 95 L 0 95 Z" 
                  fill="url(#chartGradient)"
                />
                {/* Trend line */}
                <path 
                  d="M 0 80 Q 50 70 80 50 T 160 55 T 240 35 T 320 40 T 400 15" 
                  fill="none" 
                  stroke="hsl(var(--gold-primary))" 
                  strokeWidth="2.5" 
                  filter="drop-shadow(0 0 4px hsl(var(--gold-primary) / 0.4))"
                />
                {/* Vertices/Nodes */}
                <circle cx="80" cy="50" r="3.5" fill="white" stroke="hsl(var(--gold-primary))" strokeWidth="1.5" />
                <circle cx="160" cy="55" r="3.5" fill="white" stroke="hsl(var(--gold-primary))" strokeWidth="1.5" />
                <circle cx="240" cy="35" r="3.5" fill="white" stroke="hsl(var(--gold-primary))" strokeWidth="1.5" />
                <circle cx="320" cy="40" r="3.5" fill="white" stroke="hsl(var(--gold-primary))" strokeWidth="1.5" />
                <circle cx="400" cy="15" r="3.5" fill="white" stroke="hsl(var(--gold-primary))" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Sub Row: Secure Inventory & Transaction Volume */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.15rem' }}>
            
            {/* Secure Inventory (Left Sub-card) */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', background: 'hsl(var(--bg-secondary))' }}>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'hsl(var(--text-muted))', fontWeight: 700, letterSpacing: '0.04em' }}>SECURE INVENTORY</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'hsl(var(--text-primary))', fontFamily: 'var(--font-display)', marginTop: '0.15rem' }}>
                  4,128 BARS
                </div>
                <div style={{ fontSize: '0.62rem', color: 'hsl(var(--text-muted))', marginTop: '0.1rem' }}>
                  Ledger active: <span style={{ color: 'hsl(var(--text-primary))' }}>{goldBars.length} Bars</span>
                </div>
              </div>

              {/* Donut chart SVG */}
              <div style={{ display: 'flex', justifyContent: 'center', height: '62px' }}>
                <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="30" cy="30" r="22" fill="none" stroke="hsl(var(--border-color))" strokeWidth="6" />
                  <circle 
                    cx="30" 
                    cy="30" 
                    r="22" 
                    fill="none" 
                    stroke="hsl(var(--gold-primary))" 
                    strokeWidth="6" 
                    strokeDasharray="138" 
                    strokeDashoffset="38" 
                    strokeLinecap="round"
                    filter="drop-shadow(0 0 2px hsl(var(--gold-primary) / 0.3))"
                  />
                  <text 
                    x="30" 
                    y="-26" 
                    transform="rotate(90)" 
                    fill="white" 
                    fontSize="10px" 
                    fontWeight="bold" 
                    textAnchor="middle"
                  >
                    72%
                  </text>
                </svg>
              </div>
            </div>

            {/* Transaction Volume (Right Sub-card) */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', background: 'hsl(var(--bg-secondary))' }}>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'hsl(var(--text-muted))', fontWeight: 700, letterSpacing: '0.04em' }}>TRANSACTION VOLUME</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'hsl(var(--text-primary))', fontFamily: 'var(--font-display)', marginTop: '0.15rem' }}>
                  ₹24.5 Cr (24H)
                </div>
                <div style={{ fontSize: '0.62rem', color: 'hsl(var(--text-muted))', marginTop: '0.1rem' }}>
                  Active queue: <span style={{ color: 'hsl(var(--text-primary))' }}>{transportRequests.length} Transits</span>
                </div>
              </div>

              {/* Bar chart indicator rows */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '60px', padding: '0 0.5rem' }}>
                <div style={{ width: '5px', height: '35%', background: 'hsl(var(--border-color))', borderRadius: '2px' }} />
                <div style={{ width: '5px', height: '55%', background: 'hsl(var(--gold-primary))', borderRadius: '2px', boxShadow: '0 0 6px hsl(var(--gold-primary) / 0.3)' }} />
                <div style={{ width: '5px', height: '42%', background: 'hsl(var(--gold-primary))', borderRadius: '2px', boxShadow: '0 0 6px hsl(var(--gold-primary) / 0.3)' }} />
                <div style={{ width: '5px', height: '70%', background: 'hsl(var(--gold-primary))', borderRadius: '2px', boxShadow: '0 0 6px hsl(var(--gold-primary) / 0.3)' }} />
                <div style={{ width: '5px', height: '85%', background: 'hsl(var(--gold-primary))', borderRadius: '2px', boxShadow: '0 0 6px hsl(var(--gold-primary) / 0.3)' }} />
                <div style={{ width: '5px', height: '60%', background: 'hsl(var(--gold-primary))', borderRadius: '2px', boxShadow: '0 0 6px hsl(var(--gold-primary) / 0.3)' }} />
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: BIOMETRIC AUTHENTICATION SIMULATION */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.65rem' }}>
            <h3 style={{ fontSize: '0.82rem', color: 'hsl(var(--text-muted))', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Biometric Authentication Simulation
            </h3>
            <button 
              onClick={runSecurityScan}
              style={{
                background: 'rgba(217, 172, 42, 0.08)',
                border: '1px solid hsl(var(--gold-primary) / 0.3)',
                color: 'hsl(var(--gold-primary))',
                fontSize: '0.65rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                fontWeight: 700
              }}
            >
              SIMULATE SCAN
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.65rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>TERMINAL METADATA</span>
            <div style={{ fontSize: '0.88rem', color: 'hsl(var(--text-primary))', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              ACCESS TERMINAL: <span style={{ color: 'hsl(var(--gold-primary))' }}>VT-4A - {scanStatus}</span>
            </div>
          </div>

          {/* Biometric Circular Scanning Target */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: 'hsl(var(--bg-secondary))',
            padding: '1rem',
            borderRadius: '10px',
            border: '1px solid hsl(var(--border-color))'
          }}>
            
            {/* Visual concentric radial vector circle scanner */}
            <div style={{ position: 'relative', width: '110px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="110" height="110" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                {/* Background Track ring */}
                <circle cx="55" cy="55" r="46" fill="none" stroke="hsl(var(--border-color))" strokeWidth="1.5" />
                {/* Glowing scan ring progress */}
                <circle 
                  cx="55" 
                  cy="55" 
                  r="46" 
                  fill="none" 
                  stroke="hsl(var(--gold-primary))" 
                  strokeWidth="2.5" 
                  strokeDasharray="289" 
                  strokeDashoffset={289 - (289 * scanProgress) / 100}
                  strokeLinecap="round"
                  filter="drop-shadow(0 0 3px hsl(var(--gold-primary) / 0.4))"
                />
                {/* Dotted target ring */}
                <circle cx="55" cy="55" r="38" fill="none" stroke="hsl(var(--border-color))" strokeDasharray="3, 4" strokeWidth="1" />
              </svg>
              {/* Central Fingerprint Icon with scanline sweep */}
              <div style={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: scanStatus === 'COMPLIANT' ? '#4ade80' : 'hsl(var(--gold-primary))'
              }}>
                <Fingerprint size={42} style={{ filter: 'drop-shadow(0 0 6px currentColor)' }} />
                {scanStatus === 'SCANNING' && (
                  <div style={{
                    position: 'absolute',
                    top: '0px',
                    left: '-10px',
                    width: '60px',
                    height: '2px',
                    background: 'hsl(var(--gold-primary))',
                    boxShadow: '0 0 10px hsl(var(--gold-primary))',
                    animation: 'scan-line 1.2s ease-in-out infinite'
                  }} />
                )}
              </div>
              
              {/* Progress tag */}
              <div style={{
                position: 'absolute',
                bottom: '-5px',
                background: 'hsl(var(--bg-secondary))',
                border: '1px solid hsl(var(--border-color))',
                padding: '0.1rem 0.4rem',
                borderRadius: '4px',
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                color: 'hsl(var(--text-primary))',
                fontWeight: 'bold'
              }}>
                {scanProgress}%
              </div>
            </div>

            {/* Metadata parameter text list details (Match Mockup exactly) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, paddingLeft: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid hsl(var(--border-color) / 0.4)', paddingBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.68rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>RETINAL SCAN</span>
                <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>ENCRYPTED</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid hsl(var(--border-color) / 0.4)', paddingBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.68rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>FINGERPRINT</span>
                <span style={{ fontSize: '0.72rem', color: 'hsl(var(--gold-primary))', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {scanStatus === 'COMPLIANT' ? 'VERIFIED' : 'VERIFYING...'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid hsl(var(--border-color) / 0.4)', paddingBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.68rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>STATUS</span>
                <span style={{ fontSize: '0.72rem', color: scanStatus === 'COMPLIANT' ? '#4ade80' : 'hsl(var(--gold-primary))', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {scanStatus}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid hsl(var(--border-color) / 0.4)', paddingBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.68rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>OPERATOR ID</span>
                <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-primary))', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>A77-DLY</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.68rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>BIOMETRIC LEVEL</span>
                <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-primary))', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>ALPHA-1</span>
              </div>
            </div>

          </div>

          {/* Segmented Progress bar & Timer row */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            background: 'hsl(var(--bg-secondary))',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid hsl(var(--border-color))'
          }}>
            {/* Horizontal segments */}
            <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
              {renderSegments(scanProgress)}
            </div>
            
            {/* Ticking countdown timer */}
            <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-primary))', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {scanTime}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Area: TACTICAL RADAR OVERLAY (SVG ROUTE MAPPING) */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Title bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.65rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>TACTICAL RADAR OVERLAY (SVG ROUTE MAPPING)</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'hsl(var(--text-primary))', fontFamily: 'var(--font-display)', marginTop: '0.15rem' }}>
              VAULT ZONE 7 - SECURE PATHS
            </h3>
          </div>
          <span className="badge badge-success" style={{ fontSize: '0.62rem', padding: '0.2rem 0.5rem' }}>
            SECURE TRANSPORT: ACTIVE
          </span>
        </div>

        {/* Visual Map row */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          
          {/* Left: Circular Sweeping Radar */}
          <div style={{ 
            width: '180px', 
            height: '180px', 
            background: 'hsl(var(--bg-secondary))', 
            border: '1px solid hsl(var(--border-color))',
            borderRadius: '50%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {/* Concentric grids circles */}
            <div style={{ position: 'absolute', width: '140px', height: '140px', border: '1px solid hsl(var(--border-color) / 0.5)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', width: '90px', height: '90px', border: '1px solid hsl(var(--border-color) / 0.4)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', width: '40px', height: '40px', border: '1px solid hsl(var(--border-color) / 0.3)', borderRadius: '50%' }} />
            
            {/* Crosshairs lines */}
            <div style={{ position: 'absolute', width: '100%', height: '1px', background: 'hsl(var(--border-color) / 0.5)' }} />
            <div style={{ position: 'absolute', height: '100%', width: '1px', background: 'hsl(var(--border-color) / 0.5)' }} />
            
            {/* Animated Rotating Sweep Sector (Gold Gradient) */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'conic-gradient(from 0deg at 50% 50%, transparent 270deg, hsl(var(--gold-primary) / 0.2) 350deg, hsl(var(--gold-primary) / 0.5) 360deg)',
              borderRadius: '50%',
              animation: 'radar-spin 4s linear infinite',
              pointerEvents: 'none'
            }} />

            {/* Sweep radar center point */}
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'hsl(var(--text-primary))',
              boxShadow: '0 0 8px white',
              zIndex: 3
            }} />
          </div>

          {/* Right: Vector Blueprint Map Layout (Full Room View) */}
          <div style={{ 
            flex: 1, 
            height: '200px',
            background: 'hsl(var(--bg-secondary))',
            border: '1px solid hsl(var(--border-color))',
            borderRadius: '10px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <svg style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} viewBox="0 0 400 180" preserveAspectRatio="xMidYMid meet">
              <defs>
                {/* Hexagon Pattern */}
                <pattern id="hex" x="0" y="0" width="24" height="41.5" patternUnits="userSpaceOnUse">
                  <path d="M12 0 L24 7 L24 20 L12 27 L0 20 L0 7 Z" fill="none" stroke="hsl(var(--border-color) / 0.3)" strokeWidth="0.5" />
                  <path d="M12 41.5 L24 34.5 L24 20 L12 27 L0 20 L0 34.5 Z" fill="none" stroke="hsl(var(--border-color) / 0.3)" strokeWidth="0.5" />
                </pattern>
                {/* Arrowhead Marker */}
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--gold-primary))" />
                </marker>
                {/* Glow Filter */}
                <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Hex Grid */}
              <rect width="100%" height="100%" fill="url(#hex)" />

              {/* Architectural Rooms (Filled Polygons) */}
              <g fill="hsl(var(--gold-primary) / 0.15)" stroke="hsl(var(--gold-primary) / 0.6)" strokeWidth="1.5">
                {/* Entrance Corridor */}
                <rect x="-10" y="75" width="90" height="30" />
                <rect x="20" y="115" width="40" height="30" /> {/* Side room */}
                {/* Main Isle Vertical */}
                <rect x="80" y="30" width="40" height="120" />
                <rect x="30" y="30" width="40" height="30" /> {/* Top left room */}
                {/* Guard Station Complex */}
                <rect x="120" y="40" width="70" height="40" />
                <rect x="190" y="20" width="50" height="40" /> {/* Upper right room */}
                {/* Storage Unit 4 Complex */}
                <rect x="120" y="100" width="90" height="50" />
                <rect x="210" y="130" width="60" height="30" /> {/* Bottom right room */}
                {/* Exit Point Area */}
                <rect x="230" y="60" width="80" height="60" />
                <rect x="310" y="75" width="50" height="30" /> {/* Exit tunnel */}
              </g>

              {/* Internal Walls/Details */}
              <g stroke="hsl(var(--gold-primary) / 0.4)" strokeWidth="1">
                <line x1="100" y1="30" x2="100" y2="150" strokeDasharray="4 2" />
                <line x1="155" y1="40" x2="155" y2="80" />
                <line x1="155" y1="100" x2="155" y2="150" />
                <line x1="270" y1="60" x2="270" y2="120" />
              </g>

              {/* Tactical Movement Path (Arrows) */}
              <g stroke="hsl(var(--gold-primary))" strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" filter="url(#neon-glow)">
                {/* Main Path */}
                <path d="M -5 90 L 100 90 L 100 60 L 140 60" />
                <path d="M 170 60 L 250 60 L 250 90 L 320 90" />
                <path d="M 100 90 L 100 125 L 150 125" />
              </g>

              {/* Node Markers & Labels */}
              {/* Vault Entrance */}
              <circle cx="40" cy="90" r="4" fill="hsl(var(--bg-card))" stroke="hsl(var(--gold-primary))" strokeWidth="2" />
              <circle cx="40" cy="90" r="1.5" fill="hsl(var(--gold-primary))" />
              <text x="40" y="112" fill="hsl(var(--text-secondary))" fontSize="8px" fontWeight="bold" textAnchor="middle">V7-ENT</text>

              {/* Main Isle Node */}
              <circle cx="100" cy="90" r="4" fill="hsl(var(--bg-card))" stroke="hsl(var(--gold-primary))" strokeWidth="2" />
              <circle cx="100" cy="90" r="1.5" fill="hsl(var(--gold-primary))" />
              <text x="100" y="24" fill="hsl(var(--text-secondary))" fontSize="8px" fontWeight="bold" textAnchor="middle">MAIN ISLE</text>

              {/* Guard Station Node */}
              <circle cx="155" cy="60" r="4" fill="hsl(var(--bg-card))" stroke="hsl(var(--gold-primary))" strokeWidth="2" />
              <circle cx="155" cy="60" r="1.5" fill="hsl(var(--gold-primary))" />
              <text x="155" y="36" fill="hsl(var(--text-primary))" fontSize="8px" fontWeight="bold" textAnchor="middle">GUARD STATION</text>

              {/* Storage Unit 4 Node */}
              <circle cx="160" cy="125" r="4" fill="hsl(var(--bg-card))" stroke="hsl(var(--gold-primary))" strokeWidth="2" />
              <circle cx="160" cy="125" r="1.5" fill="hsl(var(--gold-primary))" />
              <text x="175" y="128" fill="hsl(var(--text-primary))" fontSize="8px" fontWeight="bold">STORAGE S4-B2</text>

              {/* Exit Point Node */}
              <circle cx="270" cy="90" r="4" fill="hsl(var(--bg-card))" stroke="hsl(var(--gold-primary))" strokeWidth="2" />
              <circle cx="270" cy="90" r="1.5" fill="hsl(var(--gold-primary))" />
              <text x="270" y="105" fill="hsl(var(--text-primary))" fontSize="8px" fontWeight="bold" textAnchor="middle">EXIT POINT</text>
            </svg>
          </div>

        </div>

      </div>

    </div>
  );
}
