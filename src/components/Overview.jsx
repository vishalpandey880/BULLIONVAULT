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
  const registryTotalValue = registryTotalWeight * 32.1507 * marketPrice;

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
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#0a0d14 / 0.5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-muted))', fontWeight: 700, letterSpacing: '0.04em' }}>VAULT ASSET VALUE</span>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)', marginTop: '0.2rem' }} className="title-neon">
                  $14.78 BILLION
                </div>
                {/* Small indicator of live active registry */}
                <div style={{ fontSize: '0.68rem', color: 'hsl(var(--text-muted))', marginTop: '0.15rem' }}>
                  Registry Deposit: <span style={{ color: 'hsl(var(--gold-primary))', fontWeight: 650 }}>${(registryTotalValue / 1e6).toFixed(2)}M</span>
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
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', background: '#0a0d14 / 0.5' }}>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'hsl(var(--text-muted))', fontWeight: 700, letterSpacing: '0.04em' }}>SECURE INVENTORY</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)', marginTop: '0.15rem' }}>
                  4,128 BARS
                </div>
                <div style={{ fontSize: '0.62rem', color: 'hsl(var(--text-muted))', marginTop: '0.1rem' }}>
                  Ledger active: <span style={{ color: 'white' }}>{goldBars.length} Bars</span>
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
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', background: '#0a0d14 / 0.5' }}>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'hsl(var(--text-muted))', fontWeight: 700, letterSpacing: '0.04em' }}>TRANSACTION VOLUME</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)', marginTop: '0.15rem' }}>
                  $24.5M (24H)
                </div>
                <div style={{ fontSize: '0.62rem', color: 'hsl(var(--text-muted))', marginTop: '0.1rem' }}>
                  Active queue: <span style={{ color: 'white' }}>{transportRequests.length} Transits</span>
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
            <div style={{ fontSize: '0.88rem', color: 'white', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              ACCESS TERMINAL: <span style={{ color: 'hsl(var(--gold-primary))' }}>VT-4A - {scanStatus}</span>
            </div>
          </div>

          {/* Biometric Circular Scanning Target */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: 'rgba(10, 13, 20, 0.3)',
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
                color: 'white',
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
                <span style={{ fontSize: '0.72rem', color: 'white', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>A77-DLY</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.68rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>BIOMETRIC LEVEL</span>
                <span style={{ fontSize: '0.72rem', color: 'white', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>ALPHA-1</span>
              </div>
            </div>

          </div>

          {/* Segmented Progress bar & Timer row */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            background: 'rgba(10, 13, 20, 0.3)',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid hsl(var(--border-color))'
          }}>
            {/* Horizontal segments */}
            <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
              {renderSegments(scanProgress)}
            </div>
            
            {/* Ticking countdown timer */}
            <div style={{ fontSize: '0.85rem', color: 'white', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
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
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)', marginTop: '0.15rem' }}>
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
              background: 'white',
              boxShadow: '0 0 8px white',
              zIndex: 3
            }} />
          </div>

          {/* Right: Vector Blueprint Map Layout (SVG corridors) */}
          <div style={{ 
            flex: 1, 
            height: '180px', 
            background: 'rgba(10, 13, 20, 0.2)',
            border: '1px solid hsl(var(--border-color))',
            borderRadius: '10px',
            position: 'relative',
            overflow: 'hidden'
          }} className="radar-grid">
            <svg style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
              {/* Corridor corridor paths lines (Neon Gold) */}
              <g stroke="hsl(var(--gold-primary) / 0.3)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none">
                {/* Vault Entrance -> Main Isle -> Guard Station -> Exit Point */}
                <path d="M 60 90 L 150 90 L 150 50 L 290 50 L 290 90 L 360 90" />
                {/* Branches */}
                <path d="M 150 90 L 150 140 L 290 140 L 290 90" />
                <path d="M 230 50 L 230 140" />
              </g>

              {/* Glowing active path line on top */}
              <g stroke="hsl(var(--gold-primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="drop-shadow(0 0 2px hsl(var(--gold-primary) / 0.6))">
                <path d="M 60 90 L 150 90 L 150 50 L 290 50 L 290 90 L 360 90" style={{ strokeDasharray: '8, 8', animation: 'scan-line 3s linear infinite' }} />
              </g>

              {/* Labeled City/Corridor Nodes */}
              {/* Vault Entrance */}
              <circle cx="60" cy="90" r="5" fill="white" stroke="hsl(var(--gold-primary))" strokeWidth="2" />
              <text x="60" y="112" fill="hsl(var(--text-secondary))" fontSize="9px" fontWeight="bold" textAnchor="middle">VAULT ENTRANCE (V7-ENT)</text>

              {/* Main Isle */}
              <circle cx="150" cy="50" r="5" fill="white" stroke="hsl(var(--gold-primary))" strokeWidth="2" />
              <text x="150" y="36" fill="hsl(var(--text-secondary))" fontSize="9px" fontWeight="bold" textAnchor="middle">MAIN ISLE</text>

              {/* Guard Station */}
              <circle cx="230" cy="50" r="5" fill="white" stroke="hsl(var(--gold-primary))" strokeWidth="2" />
              <text x="230" y="36" fill="hsl(var(--text-secondary))" fontSize="9px" fontWeight="bold" textAnchor="middle">GUARD STATION</text>

              {/* Storage Unit 4 */}
              <circle cx="290" cy="140" r="5" fill="white" stroke="hsl(var(--gold-primary))" strokeWidth="2" />
              <text x="290" y="156" fill="hsl(var(--text-secondary))" fontSize="9px" fontWeight="bold" textAnchor="middle">STORAGE UNIT 4 (S4-B2)</text>

              {/* Exit Point */}
              <circle cx="360" cy="90" r="5" fill="white" stroke="hsl(var(--gold-primary))" strokeWidth="2" />
              <text x="360" y="112" fill="hsl(var(--text-secondary))" fontSize="9px" fontWeight="bold" textAnchor="middle">EXIT POINT</text>
            </svg>
          </div>

        </div>

      </div>

    </div>
  );
}
