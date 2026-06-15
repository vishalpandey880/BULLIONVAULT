import React, { useState } from 'react';
import { Weight, Scale, AlertTriangle, ShieldCheck, Zap, RefreshCw, Layers } from 'lucide-react';

export default function ShelfLoadManager() {
  // 4 shelves, each starts with some initial gold bars (weight = 1.0kg each in India)
  const [shelves, setShelves] = useState([
    { id: 1, name: 'Top Shelf (Level 4)', maxLoad: 500, bars: 400 },   // 400 kg
    { id: 2, name: 'Upper Shelf (Level 3)', maxLoad: 800, bars: 950 }, // 950 kg (OVERLOADED initially to demonstrate)
    { id: 3, name: 'Lower Shelf (Level 2)', maxLoad: 1200, bars: 855 }, // 855 kg
    { id: 4, name: 'Base Shelf (Level 1)', maxLoad: 1500, bars: 1100 }, // 1100 kg
  ]);

  const [balancing, setBalancing] = useState(false);

  const barWeight = 1.0; // standard 1kg gold bar in India

  const incrementBars = (id) => {
    setShelves(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, bars: s.bars + 50 }; // increment by 50 bars (50 kg)
      }
      return s;
    }));
  };

  const decrementBars = (id) => {
    setShelves(prev => prev.map(s => {
      if (s.id === id && s.bars >= 50) {
        return { ...s, bars: s.bars - 50 };
      }
      return s;
    }));
  };

  // Run the auto-balance optimizer
  const autoBalance = () => {
    setBalancing(true);

    setTimeout(() => {
      setShelves(prev => {
        const totalBars = prev.reduce((sum, s) => sum + s.bars, 0);
        
        // Allocate bars proportionally based on each shelf's maxLoad
        const totalCapacity = prev.reduce((sum, s) => sum + s.maxLoad, 0);
        
        let allocated = 0;
        const newShelves = prev.map((s, idx) => {
          if (idx === prev.length - 1) {
            // Last shelf gets the remainder
            return { ...s, bars: totalBars - allocated };
          }
          // Proportionate distribution
          const targetBars = Math.floor((s.maxLoad / totalCapacity) * totalBars);
          allocated += targetBars;
          return { ...s, bars: targetBars };
        });

        return newShelves;
      });
      setBalancing(false);
    }, 1200);
  };

  const totalBarsInUnit = shelves.reduce((sum, s) => sum + s.bars, 0);
  const totalWeightInUnit = totalBarsInUnit * barWeight;
  const isAnyOverloaded = shelves.some(s => (s.bars * barWeight) > s.maxLoad);

  // Compute centers of gravity: Stable if center of mass is lower
  // Formula: Sum of (Height_Index * Weight) / Total_Weight
  // Level 4 (Top) has height index 4, Level 1 (Base) has height index 1
  const heightWeights = shelves.reduce((sum, s) => {
    const heightIndex = 5 - s.id; // Top shelf (id 1) is height index 4, Base shelf (id 4) is height index 1
    return sum + (heightIndex * s.bars * barWeight);
  }, 0);
  
  const centerOfGravityIndex = totalWeightInUnit > 0 ? (heightWeights / totalWeightInUnit) : 1;
  const isCenterOfGravityHigh = centerOfGravityIndex > 2.5;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.4rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            Shelf Load & Structural Integrity Manager
          </h2>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.92rem' }}>
            Monitor structural stresses on heavy gold shelving units and balance load distributions.
          </p>
        </div>

        <button 
          onClick={autoBalance}
          disabled={balancing}
          className="btn-primary"
          style={{
            padding: '0.65rem 1.25rem',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={15} style={{ animation: balancing ? 'radar-spin 1.2s linear infinite' : 'none' }} />
          Auto-Balance Distribution
        </button>
      </div>

      <div className="grid-2">
        
        {/* Left: Shelves List Stack (Top Shelf at the top, Base at the bottom) */}
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
                <Layers size={18} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Shelving Unit: Rack-Alpha</h3>
            </div>
            <span className="badge badge-gold" style={{ fontSize: '0.62rem' }}>Structural Stack</span>
          </div>

          {/* Shelves Stack Render */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {shelves.map(shelf => {
              const currentWeight = shelf.bars * barWeight;
              const loadPercentage = Math.min(100, (currentWeight / shelf.maxLoad) * 100);
              const isOverloaded = currentWeight > shelf.maxLoad;

              let progressColor = 'hsl(var(--gold-primary))';
              if (loadPercentage > 85) progressColor = '#f59e0b'; // orange
              if (isOverloaded) progressColor = 'hsl(var(--danger))'; // red

              return (
                <div 
                  key={shelf.id} 
                  className="glass-card" 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.85rem',
                    padding: '1.25rem',
                    animation: isOverloaded ? 'pulse-danger 2s infinite' : 'none',
                    border: isOverloaded ? '1px solid hsl(var(--danger))' : '1px solid hsl(var(--border-color))',
                    background: isOverloaded ? 'hsl(var(--danger) / 0.02)' : 'hsl(var(--bg-card) / 0.4)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <strong style={{ fontSize: '1rem', color: 'hsl(var(--text-primary))' }}>{shelf.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '0.15rem', fontWeight: 500 }}>
                        Capacity: <span style={{ color: 'hsl(var(--text-primary))' }}>{shelf.maxLoad} kg</span> • Count: <span style={{ color: 'hsl(var(--text-primary))' }}>{shelf.bars} bars</span>
                      </div>
                    </div>

                    {/* Shelf controls styled as miniature security adjustments */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button 
                        onClick={() => decrementBars(shelf.id)}
                        className="badge btn-secondary"
                        style={{ padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold', borderRadius: '4px' }}
                      >
                        -50
                      </button>
                      <button 
                        onClick={() => incrementBars(shelf.id)}
                        className="badge btn-secondary"
                        style={{ padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold', borderRadius: '4px' }}
                      >
                        +50
                      </button>
                    </div>
                  </div>

                  {/* Weight Gauge */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', marginBottom: '0.35rem' }}>
                      <span>Current Mass: <strong style={{ color: 'hsl(var(--text-primary))', fontWeight: 600 }}>{currentWeight.toFixed(1)} kg</strong></span>
                      <span style={{ color: isOverloaded ? 'hsl(var(--danger))' : 'hsl(var(--text-secondary))', fontWeight: 600 }}>
                        {loadPercentage.toFixed(0)}% Stressed
                      </span>
                    </div>
                    
                    <div style={{ width: '100%', height: '7px', background: 'hsl(var(--bg-tertiary))', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${loadPercentage}%`, 
                          height: '100%', 
                          background: progressColor,
                          borderRadius: '4px',
                          transition: 'width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' 
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Balance Physics & Metrics */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'hsl(var(--gold-primary))' }}>
            <div style={{
              background: 'hsl(var(--gold-primary) / 0.08)',
              padding: '0.4rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Scale size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Stress Analysis HUD</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Overall status warning */}
            <div 
              style={{ 
                padding: '1.25rem', 
                borderRadius: '10px', 
                background: isAnyOverloaded ? 'hsl(var(--danger) / 0.05)' : 'hsl(var(--success) / 0.05)',
                border: `1px solid ${isAnyOverloaded ? 'hsl(var(--danger))' : 'hsl(var(--success))'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '1.15rem'
              }}
            >
              {isAnyOverloaded ? (
                <AlertTriangle size={36} style={{ color: 'hsl(var(--danger))', animation: 'pulse-light 1.5s infinite', padding: '6px', background: 'hsl(var(--danger) / 0.12)', borderRadius: '50%', border: '1px solid hsl(var(--danger) / 0.25)' }} />
              ) : (
                <ShieldCheck size={36} style={{ color: 'hsl(var(--success))', padding: '6px', background: 'hsl(var(--success) / 0.12)', borderRadius: '50%', border: '1px solid hsl(var(--success) / 0.25)' }} />
              )}
              <div>
                <h4 style={{ fontSize: '1.05rem', color: isAnyOverloaded ? 'hsl(var(--danger))' : 'hsl(var(--success))', fontWeight: 700 }}>
                  {isAnyOverloaded ? 'WARNING: STRUCTURAL OVERLOAD' : 'UNIT STABILITY: NOMINAL'}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', marginTop: '0.2rem', lineHeight: '1.4' }}>
                  {isAnyOverloaded 
                    ? 'A structural level has exceeded safe design load factors. Risk of frame warp or shear.' 
                    : 'All shelves are operating safely within engineered load tolerances.'}
                </p>
              </div>
            </div>

            {/* General metrics grid */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'hsl(var(--text-secondary))' }}>Total Gold Bars Loaded:</span>
                <strong style={{ color: 'hsl(var(--text-primary))' }}>{totalBarsInUnit} bars</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'hsl(var(--text-secondary))' }}>Total Mass on Rack:</span>
                <strong style={{ color: 'hsl(var(--text-primary))' }}>{totalWeightInUnit.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'hsl(var(--text-secondary))' }}>Unit Safety Margin Factor:</span>
                <strong style={{ color: isAnyOverloaded ? 'hsl(var(--danger))' : 'hsl(var(--success))' }}>
                  {isAnyOverloaded ? '0.74 (CRITICAL RISK)' : '1.38 (NOMINAL STABLE)'}
                </strong>
              </div>
            </div>

            {/* Center of Gravity analysis visualization */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'hsl(var(--text-primary))', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Weight size={14} style={{ color: 'hsl(var(--gold-primary))' }} />
                CENTER OF GRAVITY MONITOR
              </div>
              <p style={{ fontSize: '0.78rem', color: 'hsl(var(--text-secondary))', lineHeight: '1.4' }}>
                Balanced load metrics dictate placing bulk weight on lower shelves to anchor the frame structure.
              </p>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                background: 'hsl(var(--bg-tertiary))',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid hsl(var(--border-color))',
                marginTop: '0.25rem'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.72rem', color: 'hsl(var(--text-muted))', fontWeight: 600 }}>METRIC COG HEIGHT</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 750, color: isCenterOfGravityHigh ? 'hsl(var(--danger))' : 'hsl(var(--success))', marginTop: '0.15rem' }}>
                    {centerOfGravityIndex.toFixed(2)} Index (L{centerOfGravityIndex.toFixed(0)})
                  </div>
                </div>
                <div className="badge" style={{ 
                  background: isCenterOfGravityHigh ? 'hsl(var(--danger) / 0.12)' : 'hsl(var(--success) / 0.12)', 
                  color: isCenterOfGravityHigh ? 'hsl(var(--danger))' : 'hsl(var(--success))',
                  borderColor: isCenterOfGravityHigh ? 'hsl(var(--danger) / 0.25)' : 'hsl(var(--success) / 0.25)',
                  fontSize: '0.62rem'
                }}>
                  {isCenterOfGravityHigh ? 'HIGH HEAVY (RISK)' : 'STABLE BASE (SECURE)'}
                </div>
              </div>
            </div>

            {/* Balancer explanation */}
            <div className="glass-card" style={{ background: 'hsl(var(--bg-secondary) / 0.2)', borderStyle: 'dashed', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'hsl(var(--gold-primary))', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Zap size={13} /> Proportional Balancing Logic
              </div>
              <p style={{ fontSize: '0.76rem', color: 'hsl(var(--text-muted))', lineHeight: '1.45' }}>
                The Auto-Balance optimizer calculates the overall loaded bars, then re-allocates them proportionally based on each shelf's max rated capacity. This automatically relocates center of gravity down to secure structural safety factors.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
