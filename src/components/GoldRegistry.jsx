import React, { useState } from 'react';
import { Database, Plus, Search, Filter, TrendingUp, DollarSign, Scale } from 'lucide-react';

export default function GoldRegistry({ goldBars, onAddGoldBar, marketPrice, onUpdateMarketPrice, viewMode }) {
  const [search, setSearch] = useState('');
  const [purityFilter, setPurityFilter] = useState('');
  const [refineryFilter, setRefineryFilter] = useState('');
  
  // Form State
  const [serialNumber, setSerialNumber] = useState('');
  const [purity, setPurity] = useState('99.99');
  const [refinery, setRefinery] = useState('Valcambi');
  const [weight, setWeight] = useState('12.4'); // Standard 400 oz bar is approx 12.4 kg
  const [palletId, setPalletId] = useState('PALLET-01');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Extract unique purities and refineries for filter dropdowns
  const uniquePurities = [...new Set(goldBars.map(bar => bar.purity))].sort();
  const uniqueRefineries = [...new Set(goldBars.map(bar => bar.refinery))].sort();

  // Handler to add a bar
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!serialNumber.trim()) {
      setFormError('Serial number is required.');
      return;
    }
    
    // Check for duplicate serial number
    if (goldBars.some(bar => bar.serialNumber.toLowerCase() === serialNumber.trim().toLowerCase())) {
      setFormError('Serial number already exists in registry.');
      return;
    }

    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) {
      setFormError('Weight must be a positive number.');
      return;
    }

    const newBar = {
      serialNumber: serialNumber.trim().toUpperCase(),
      purity,
      refinery,
      weight: w,
      palletId: palletId.trim().toUpperCase()
    };

    onAddGoldBar(newBar);
    setSerialNumber('');
    setFormSuccess('Gold bar successfully registered and logged to vault.');
    setTimeout(() => setFormSuccess(''), 3000);
  };

  // Filter bars
  const filteredBars = goldBars.filter(bar => {
    const matchesSearch = bar.serialNumber.toLowerCase().includes(search.toLowerCase()) || 
                          bar.refinery.toLowerCase().includes(search.toLowerCase());
    const matchesPurity = purityFilter === '' || bar.purity === purityFilter;
    const matchesRefinery = refineryFilter === '' || bar.refinery === refineryFilter;
    return matchesSearch && matchesPurity && matchesRefinery;
  });

  // Calculate pallet valuations and rank them
  const pallets = {};
  goldBars.forEach(bar => {
    const value = bar.weight * 32.1507 * marketPrice; // Convert kg to oz and multiply by price
    if (!pallets[bar.palletId]) {
      pallets[bar.palletId] = {
        id: bar.palletId,
        barCount: 0,
        totalWeight: 0,
        totalValue: 0
      };
    }
    pallets[bar.palletId].barCount += 1;
    pallets[bar.palletId].totalWeight += bar.weight;
    pallets[bar.palletId].totalValue += value;
  });

  const rankedPallets = Object.values(pallets).sort((a, b) => b.totalValue - a.totalValue);
  const maxPalletValue = rankedPallets.length > 0 ? rankedPallets[0].totalValue : 1;

  // Render Sub-Cards to avoid duplicate code blocks
  const renderFormCard = () => (
    <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'hsl(var(--gold-primary))' }}>
        <div style={{
          background: 'hsl(var(--gold-primary) / 0.08)',
          padding: '0.4rem',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Plus size={18} />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Log New Gold Bar</h3>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Serial Number</label>
            <input 
              type="text" 
              value={serialNumber} 
              onChange={(e) => setSerialNumber(e.target.value)} 
              placeholder="e.g. VAL-88221D" 
              required
            />
          </div>
          <div style={{ flex: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Purity (%)</label>
            <select value={purity} onChange={(e) => setPurity(e.target.value)}>
              <option value="99.99">99.99% (Pure Gold)</option>
              <option value="99.95">99.95%</option>
              <option value="99.90">99.90%</option>
              <option value="99.50">99.50%</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Origin Refinery</label>
            <select value={refinery} onChange={(e) => setRefinery(e.target.value)}>
              <option value="Valcambi">Valcambi (Switzerland)</option>
              <option value="PAMP Suisse">PAMP Suisse (Switzerland)</option>
              <option value="Argor-Heraeus">Argor-Heraeus (Switzerland)</option>
              <option value="Rand Refinery">Rand Refinery (South Africa)</option>
              <option value="Perth Mint">Perth Mint (Australia)</option>
              <option value="Royal Canadian Mint">Royal Canadian Mint (Canada)</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Weight (kg)</label>
            <input 
              type="number" 
              step="0.01"
              value={weight} 
              onChange={(e) => setWeight(e.target.value)} 
              placeholder="12.4" 
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Storage Pallet Location</label>
          <select value={palletId} onChange={(e) => setPalletId(e.target.value)}>
            <option value="PALLET-01">PALLET-01 (Zone A)</option>
            <option value="PALLET-02">PALLET-02 (Zone A)</option>
            <option value="PALLET-03">PALLET-03 (Zone B)</option>
            <option value="PALLET-04">PALLET-04 (Zone B)</option>
            <option value="PALLET-05">PALLET-05 (Zone C)</option>
          </select>
        </div>

        {formError && <div style={{ color: '#f87171', fontSize: '0.82rem', fontWeight: 500 }}>{formError}</div>}
        {formSuccess && <div style={{ color: '#4ade80', fontSize: '0.82rem', fontWeight: 500 }}>{formSuccess}</div>}

        <button 
          type="submit" 
          className="btn-primary"
          style={{ 
            padding: '0.85rem', 
            fontSize: '0.92rem',
            marginTop: '0.5rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Secure & Register Gold Bar
        </button>
      </form>
    </div>
  );

  const renderSorterCard = () => (
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
            <DollarSign size={18} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Value Sorter (Pallet Rankings)</h3>
        </div>
        <span className="badge badge-gold" style={{ fontSize: '0.62rem' }}>Asset Sorter</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', maxHeight: '380px', overflowY: 'auto', paddingRight: '0.35rem' }}>
        {rankedPallets.length === 0 ? (
          <p style={{ color: 'hsl(var(--text-muted))', textAlign: 'center', padding: '3rem' }}>No pallets logged in system.</p>
        ) : (
          rankedPallets.map((pallet, index) => {
            const ratio = (pallet.totalValue / maxPalletValue) * 100;
            return (
              <div 
                key={pallet.id} 
                className="glass-card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.65rem',
                  padding: '1.1rem',
                  borderLeft: index === 0 ? '4px solid hsl(var(--gold-primary))' : '1px solid hsl(var(--border-color))' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'hsl(var(--gold-primary))', fontWeight: 'bold' }}>#{index + 1}</span>
                    <strong style={{ fontSize: '0.95rem', color: 'white' }}>{pallet.id}</strong>
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 750, color: 'white' }}>
                    ${pallet.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'hsl(var(--text-secondary))' }}>
                  <span>Capacity: <strong style={{ color: 'white' }}>{pallet.barCount} Bars</strong></span>
                  <span>Weight: <strong style={{ color: 'white' }}>{pallet.totalWeight.toFixed(1)} kg</strong></span>
                </div>

                {/* Progress Bar for relative valuation */}
                <div style={{ width: '100%', height: '5px', background: 'hsl(var(--bg-tertiary))', borderRadius: '3px', overflow: 'hidden', marginTop: '0.2rem' }}>
                  <div style={{ 
                    width: `${ratio}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, hsl(var(--gold-secondary)), hsl(var(--gold-primary)))',
                    borderRadius: '3px' 
                  }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const renderTableCard = () => (
    <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'hsl(var(--gold-primary))' }}>
          <div style={{
            background: 'hsl(var(--gold-primary) / 0.08)',
            padding: '0.4rem',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Database size={18} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Registered Gold Bars Ledger</h3>
        </div>

        {/* Search and Filters */}
        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', color: 'hsl(var(--text-muted))' }} />
            <input 
              type="text" 
              placeholder="Search serial or refinery..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '34px', width: '220px' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={13} style={{ color: 'hsl(var(--text-muted))' }} />
            <select value={purityFilter} onChange={(e) => setPurityFilter(e.target.value)} style={{ padding: '0.55rem 0.8rem', minWidth: '120px' }}>
              <option value="">All Purities</option>
              {uniquePurities.map(p => <option key={p} value={p}>{p}%</option>)}
            </select>
          </div>

          <select value={refineryFilter} onChange={(e) => setRefineryFilter(e.target.value)} style={{ padding: '0.55rem 0.8rem', minWidth: '140px' }}>
            <option value="">All Refineries</option>
            {uniqueRefineries.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Table representation */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid hsl(var(--border-color))', color: 'hsl(var(--text-secondary))' }}>
              <th style={{ padding: '1rem 0.85rem', fontWeight: 700, letterSpacing: '0.02em', fontSize: '0.78rem' }}>SERIAL NUMBER</th>
              <th style={{ padding: '1rem 0.85rem', fontWeight: 700, letterSpacing: '0.02em', fontSize: '0.78rem' }}>PURITY</th>
              <th style={{ padding: '1rem 0.85rem', fontWeight: 700, letterSpacing: '0.02em', fontSize: '0.78rem' }}>ORIGIN REFINERY</th>
              <th style={{ padding: '1rem 0.85rem', fontWeight: 700, letterSpacing: '0.02em', fontSize: '0.78rem' }}>WEIGHT</th>
              <th style={{ padding: '1rem 0.85rem', fontWeight: 700, letterSpacing: '0.02em', fontSize: '0.78rem' }}>LOCATION</th>
              <th style={{ padding: '1rem 0.85rem', fontWeight: 700, letterSpacing: '0.02em', fontSize: '0.78rem', textAlign: 'right' }}>VALUATION (USD)</th>
            </tr>
          </thead>
          <tbody>
            {filteredBars.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '3rem 1rem', textAlign: 'center', color: 'hsl(var(--text-muted))' }}>
                  No matching gold bars registered in secure database.
                </td>
              </tr>
            ) : (
              filteredBars.map((bar) => {
                const val = bar.weight * 32.1507 * marketPrice;
                return (
                  <tr key={bar.serialNumber} style={{ transition: 'all 0.2s' }} className="registry-row">
                    <td style={{ padding: '1.1rem 0.85rem', fontWeight: 750, fontFamily: 'var(--font-display)', color: 'white', fontSize: '0.95rem' }}>
                      {bar.serialNumber}
                    </td>
                    <td style={{ padding: '1.1rem 0.85rem' }}>
                      <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>{bar.purity}%</span>
                    </td>
                    <td style={{ padding: '1.1rem 0.85rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>
                      {bar.refinery}
                    </td>
                    <td style={{ padding: '1.1rem 0.85rem', color: 'hsl(var(--text-secondary))' }}>
                      <span style={{ color: 'white', fontWeight: 600 }}>{bar.weight.toFixed(2)} kg</span>
                    </td>
                    <td style={{ padding: '1.1rem 0.85rem' }}>
                      <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{bar.palletId}</span>
                    </td>
                    <td style={{ padding: '1.1rem 0.85rem', textAlign: 'right', fontWeight: 750, color: 'hsl(var(--gold-primary))', fontSize: '0.98rem' }}>
                      ${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.4rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            {viewMode === 'registry' ? 'Gold Bar Detail View & Ledger' : viewMode === 'sorter' ? 'Pallet Value Sorter Rankings' : 'Gold Bar Registry & Valuations'}
          </h2>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.92rem' }}>
            {viewMode === 'registry' && 'Inspect registered gold bar specifications and log new precious metal deposits.'}
            {viewMode === 'sorter' && 'Real-time sorting of storage pallets based on the total market value of gold bars stored.'}
            {!viewMode && 'Manage metal integrity records and inspect storage pallet values.'}
          </p>
        </div>
        
        {/* Spot Price Control */}
        <div className="glass-panel" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          padding: '0.65rem 1.15rem',
          borderRadius: '10px',
          background: 'hsl(var(--bg-secondary) / 0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'hsl(var(--gold-primary))' }}>
            <TrendingUp size={16} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Gold Spot Price (oz):</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ color: 'hsl(var(--text-muted))', fontWeight: 'bold', fontSize: '0.9rem' }}>$</span>
            <input 
              type="number" 
              value={marketPrice}
              onChange={(e) => onUpdateMarketPrice(Number(e.target.value))}
              style={{ 
                width: '105px', 
                padding: '0.4rem 0.6rem', 
                background: 'hsl(var(--bg-primary))', 
                border: '1px solid hsl(var(--border-color))', 
                borderRadius: '6px', 
                textAlign: 'right', 
                fontWeight: 700,
                color: 'white',
                fontSize: '0.9rem'
              }}
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Conditional layouts based on viewMode */}
      {viewMode === 'registry' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="grid-2">
            {renderFormCard()}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem', gap: '1rem', borderStyle: 'dashed' }}>
              <div style={{
                background: 'hsl(var(--gold-primary) / 0.08)',
                padding: '0.75rem',
                borderRadius: '50%',
                color: 'hsl(var(--gold-primary))',
                border: '1.5px solid hsl(var(--gold-primary) / 0.2)'
              }}>
                <Scale size={32} />
              </div>
              <h4 style={{ fontSize: '1.05rem', color: 'white', fontWeight: 700 }}>Vault Registry Guidelines</h4>
              <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))', maxWidth: '280px', lineHeight: '1.45' }}>
                All registered bars must correspond to London Bullion Market Association (LBMA) standards. Ensure origin refineries are certified before executing vault entries.
              </p>
            </div>
          </div>
          {renderTableCard()}
        </div>
      )}

      {viewMode === 'sorter' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {renderSorterCard()}
        </div>
      )}

      {!viewMode && (
        <>
          <div className="grid-2">
            {renderFormCard()}
            {renderSorterCard()}
          </div>
          {renderTableCard()}
        </>
      )}

    </div>
  );
}
