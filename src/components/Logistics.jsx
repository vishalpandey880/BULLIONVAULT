import React, { useState } from 'react';
import { Calendar, Plus, MapPin, AlertTriangle, ShieldCheck, Compass, Route, ShieldAlert, Award } from 'lucide-react';

// Cities graph definition for Safest Delivery Route
const CITIES = {
  Zurich: { x: 400, y: 320, label: 'Zurich (CH)' },
  Munich: { x: 500, y: 220, label: 'Munich (DE)' },
  Frankfurt: { x: 380, y: 150, label: 'Frankfurt (DE)' },
  Paris: { x: 180, y: 250, label: 'Paris (FR)' },
  Brussels: { x: 230, y: 120, label: 'Brussels (BE)' },
  London: { x: 80, y: 80, label: 'London (UK)' },
  Geneva: { x: 300, y: 350, label: 'Geneva (CH)' }
};

const EDGES = [
  { u: 'London', v: 'Brussels', dist: 320, threat: 0.12 },
  { u: 'London', v: 'Paris', dist: 450, threat: 0.08 },
  { u: 'Brussels', v: 'Paris', dist: 310, threat: 0.15 },
  { u: 'Brussels', v: 'Frankfurt', dist: 400, threat: 0.05 },
  { u: 'Paris', v: 'Frankfurt', dist: 570, threat: 0.22 },
  { u: 'Paris', v: 'Geneva', dist: 540, threat: 0.06 },
  { u: 'Frankfurt', v: 'Munich', dist: 390, threat: 0.18 },
  { u: 'Frankfurt', v: 'Zurich', dist: 410, threat: 0.04 },
  { u: 'Munich', v: 'Zurich', dist: 310, threat: 0.11 },
  { u: 'Geneva', v: 'Zurich', dist: 280, threat: 0.02 },
];

export default function Logistics({ transportRequests, onAddTransportRequest }) {
  // Transport Organizer state
  const [origin, setOrigin] = useState('Zurich');
  const [destination, setDestination] = useState('Munich');
  const [shipmentTime, setShipmentTime] = useState('');
  const [barCount, setBarCount] = useState(10);
  const [escortLevel, setEscortLevel] = useState('HIGH');
  const [logisticsMessage, setLogisticsMessage] = useState('');

  // Routing Planner state
  const [routeStart, setRouteStart] = useState('London');
  const [routeEnd, setRouteEnd] = useState('Zurich');

  // Add transport request
  const handleAddRequest = (e) => {
    e.preventDefault();
    if (!shipmentTime) {
      setLogisticsMessage('Please select a shipment time.');
      return;
    }
    if (origin === destination) {
      setLogisticsMessage('Origin and destination cannot be the same.');
      return;
    }

    const newRequest = {
      id: 'tr-' + Date.now(),
      origin,
      destination,
      time: shipmentTime,
      barCount: Number(barCount),
      escort: escortLevel,
      status: 'PENDING DISPATCH'
    };

    onAddTransportRequest(newRequest);
    setShipmentTime('');
    setLogisticsMessage('Shipment successfully scheduled.');
    setTimeout(() => setLogisticsMessage(''), 3000);
  };

  // Graph Calculations
  // Find paths using simple DFS path search for all routes, then sorting to find "safest" vs "fastest".
  const getAllPaths = (start, end) => {
    const paths = [];
    const adj = {};
    Object.keys(CITIES).forEach(c => adj[c] = []);
    EDGES.forEach(e => {
      adj[e.u].push({ node: e.v, dist: e.dist, threat: e.threat });
      adj[e.v].push({ node: e.u, dist: e.dist, threat: e.threat });
    });

    const findPathsDFS = (curr, target, visited, currentPath, currentDist, currentThreat) => {
      visited.add(curr);
      currentPath.push(curr);

      if (curr === target) {
        paths.push({
          nodes: [...currentPath],
          totalDist: currentDist,
          totalThreat: currentThreat,
          avgThreat: currentThreat / Math.max(1, currentPath.length - 1)
        });
      } else {
        adj[curr].forEach(neighbor => {
          if (!visited.has(neighbor.node)) {
            findPathsDFS(
              neighbor.node,
              target,
              visited,
              currentPath,
              currentDist + neighbor.dist,
              currentThreat + neighbor.threat
            );
          }
        });
      }

      currentPath.pop();
      visited.delete(curr);
    };

    findPathsDFS(start, end, new Set(), [], 0, 0);
    return paths;
  };

  const paths = getAllPaths(routeStart, routeEnd);

  // Safest Path = Path with lowest totalThreat
  // Fastest Path = Path with lowest totalDist
  const safestPath = paths.length > 0 ? [...paths].sort((a, b) => a.totalThreat - b.totalThreat)[0] : null;
  const fastestPath = paths.length > 0 ? [...paths].sort((a, b) => a.totalDist - b.totalDist)[0] : null;

  // Sorting Transport Requests by Shipment Time
  const sortedRequests = [...transportRequests].sort((a, b) => new Date(a.time) - new Date(b.time));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.85rem', marginBottom: '0.4rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
          Logistics & Secure Route Planner
        </h2>
        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.92rem' }}>
          Organize armored transport timelines and plan delivery routes that minimize tactical threats.
        </p>
      </div>

      <div className="grid-2">
        
        {/* Left: Transport Organizer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Create Request Form */}
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
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Schedule Armored Shipment</h3>
            </div>

            <form onSubmit={handleAddRequest} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Origin Vault</label>
                  <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
                    {Object.keys(CITIES).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Destination</label>
                  <select value={destination} onChange={(e) => setDestination(e.target.value)}>
                    {Object.keys(CITIES).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Shipment Time</label>
                  <input 
                    type="datetime-local" 
                    value={shipmentTime} 
                    onChange={(e) => setShipmentTime(e.target.value)} 
                    required 
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Quantity (Bars)</label>
                  <input 
                    type="number" 
                    value={barCount} 
                    onChange={(e) => setBarCount(e.target.value)} 
                    min="1" 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Escort Security Level</label>
                <select value={escortLevel} onChange={(e) => setEscortLevel(e.target.value)}>
                  <option value="MAXIMUM">MAXIMUM (Triple Armored + Air Support)</option>
                  <option value="HIGH">HIGH (Dual Armored Carrier + 4 Guards)</option>
                  <option value="STANDARD">STANDARD (Single Carrier + 2 Guards)</option>
                </select>
              </div>

              {logisticsMessage && <div style={{ fontSize: '0.82rem', color: '#4ade80', fontWeight: 500 }}>{logisticsMessage}</div>}

              <button 
                type="submit" 
                className="btn-primary"
                style={{ 
                  padding: '0.85rem', 
                  fontSize: '0.92rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Log Transport Request
              </button>
            </form>
          </div>

          {/* Transport Timeline Organizer */}
          <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'hsl(var(--gold-primary))' }}>
              <div style={{
                background: 'hsl(var(--gold-primary) / 0.08)',
                padding: '0.4rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Calendar size={18} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Transport Queue (Sorted by Time)</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '335px', overflowY: 'auto', paddingRight: '0.35rem' }}>
              {sortedRequests.length === 0 ? (
                <p style={{ color: 'hsl(var(--text-muted))', textAlign: 'center', padding: '3rem' }}>No pending transport requests.</p>
              ) : (
                sortedRequests.map((req, index) => {
                  const sTime = new Date(req.time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
                  return (
                    <div 
                      key={req.id} 
                      className="glass-card" 
                      style={{ 
                        borderLeft: index === 0 ? '4px solid hsl(var(--accent-blue))' : '1px solid hsl(var(--border-color))',
                        padding: '1.1rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span className="badge badge-gold" style={{ fontSize: '0.62rem', padding: '0.15rem 0.45rem' }}>{req.escort} ESCORT</span>
                          <span className="badge badge-blue" style={{ fontSize: '0.62rem', padding: '0.15rem 0.45rem' }}>{req.status}</span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{sTime}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.9rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <MapPin size={13} style={{ color: 'hsl(var(--gold-primary))' }} />
                          <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'white' }}>{req.origin} → {req.destination}</span>
                        </div>
                        <span style={{ fontSize: '0.82rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>
                          <strong style={{ color: 'white' }}>{req.barCount}</strong> Bars ({(req.barCount * 12.4).toFixed(1)} kg)
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* Right: Safest Delivery Route */}
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
                <Route size={18} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Tactical Delivery Route Planner</h3>
            </div>
            <span className="badge badge-blue" style={{ fontSize: '0.62rem' }}>Radar Vector HUD</span>
          </div>

          {/* Route selectors */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '130px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Origin City</label>
              <select value={routeStart} onChange={(e) => setRouteStart(e.target.value)}>
                {Object.keys(CITIES).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: '130px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>Destination City</label>
              <select value={routeEnd} onChange={(e) => setRouteEnd(e.target.value)}>
                {Object.keys(CITIES).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Graphical Map Representation (SVG) */}
          <div className="radar-grid" style={{ 
            border: '1px solid hsl(var(--border-color))', 
            borderRadius: '12px', 
            background: 'hsl(var(--bg-tertiary) / 0.45)', 
            height: '365px', 
            position: 'relative', 
            overflow: 'hidden'
          }}>
            <svg style={{ width: '100%', height: '100%' }}>
              <defs>
                <filter id="glow-vector" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Draw Edges */}
              {EDGES.map((e, index) => {
                const uNode = CITIES[e.u];
                const vNode = CITIES[e.v];
                if (!uNode || !vNode) return null;

                // Check if this edge is in safest or fastest paths
                const isSafestEdge = safestPath && safestPath.nodes.includes(e.u) && safestPath.nodes.includes(e.v) && 
                  Math.abs(safestPath.nodes.indexOf(e.u) - safestPath.nodes.indexOf(e.v)) === 1;
                const isFastestEdge = fastestPath && fastestPath.nodes.includes(e.u) && fastestPath.nodes.includes(e.v) && 
                  Math.abs(fastestPath.nodes.indexOf(e.u) - fastestPath.nodes.indexOf(e.v)) === 1;

                let strokeColor = 'rgba(255, 255, 255, 0.08)';
                let strokeWidth = '1.5';
                let filterGlow = 'none';

                if (isSafestEdge && isFastestEdge) {
                  strokeColor = 'hsl(var(--gold-primary))';
                  strokeWidth = '3.5';
                  filterGlow = 'url(#glow-vector)';
                } else if (isSafestEdge) {
                  strokeColor = '#22c55e'; // Green for safest
                  strokeWidth = '3.5';
                  filterGlow = 'url(#glow-vector)';
                } else if (isFastestEdge) {
                  strokeColor = 'hsl(var(--accent-blue))'; // Blue for fastest
                  strokeWidth = '3.5';
                  filterGlow = 'url(#glow-vector)';
                }

                return (
                  <g key={index}>
                    <line 
                      x1={uNode.x} 
                      y1={uNode.y} 
                      x2={vNode.x} 
                      y2={vNode.y} 
                      stroke={strokeColor} 
                      strokeWidth={strokeWidth} 
                      filter={filterGlow}
                      style={{ transition: 'all 0.4s ease' }}
                    />
                    <text 
                      x={(uNode.x + vNode.x) / 2} 
                      y={(uNode.y + vNode.y) / 2 - 6}
                      fill="hsl(var(--text-muted))" 
                      fontSize="9px" 
                      fontFamily="var(--font-mono)"
                      textAnchor="middle"
                    >
                      {e.dist}km / {(e.threat * 100).toFixed(0)}%
                    </text>
                  </g>
                );
              })}

              {/* Draw Nodes */}
              {Object.entries(CITIES).map(([key, city]) => {
                const isSelected = key === routeStart || key === routeEnd;
                const isInSafest = safestPath && safestPath.nodes.includes(key);
                
                return (
                  <g key={key}>
                    {/* Glowing pulse ring behind selected cities */}
                    {isSelected && (
                      <circle 
                        cx={city.x} 
                        cy={city.y} 
                        r="18" 
                        fill="none" 
                        stroke="hsl(var(--gold-primary) / 0.35)"
                        strokeWidth="1.5"
                        style={{ animation: 'pulse-light 2s infinite' }}
                      />
                    )}
                    <circle 
                      cx={city.x} 
                      cy={city.y} 
                      r={isSelected ? '9' : isInSafest ? '6.5' : '5'} 
                      fill={isSelected ? 'hsl(var(--gold-primary))' : isInSafest ? '#22c55e' : 'hsl(var(--bg-secondary))'}
                      stroke={isSelected ? 'white' : 'hsl(var(--border-color))'}
                      strokeWidth="2"
                      style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                    />
                    <text 
                      x={city.x} 
                      y={city.y - 15} 
                      fill={isSelected ? 'white' : 'hsl(var(--text-secondary))'} 
                      fontSize="10.5px" 
                      fontWeight={isSelected ? 800 : 600} 
                      fontFamily="var(--font-display)"
                      textAnchor="middle"
                    >
                      {city.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Tactical Path Comparison Panel */}
          {paths.length > 0 && safestPath && fastestPath ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              
              {/* Safest route dossier */}
              <div 
                className="glass-card" 
                style={{ borderLeft: '4px solid #22c55e', padding: '1rem', background: 'rgba(34, 197, 94, 0.03)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#4ade80', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', letterSpacing: '0.04em' }}>
                    <Compass size={14} /> SAFEST TACTICAL VECTOR
                  </strong>
                  <span className="badge badge-success" style={{ fontSize: '0.62rem', padding: '0.15rem 0.45rem' }}>Threat Index: {(safestPath.totalThreat * 100).toFixed(0)}%</span>
                </div>
                <p style={{ fontSize: '0.88rem', marginTop: '0.4rem', color: 'white', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  {safestPath.nodes.join(' → ')}
                </p>
                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '0.3rem' }}>
                  <span>Distance: <strong style={{ color: 'white' }}>{safestPath.totalDist} km</strong></span>
                  <span>Est. Travel Time: <strong style={{ color: 'white' }}>{(safestPath.totalDist / 80).toFixed(1)} hrs</strong></span>
                </div>
              </div>

              {/* Fastest route dossier */}
              <div 
                className="glass-card" 
                style={{ borderLeft: '4px solid hsl(var(--accent-blue))', padding: '1rem', background: 'rgba(59, 130, 246, 0.03)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#60a5fa', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', letterSpacing: '0.04em' }}>
                    <Route size={14} /> FASTEST DIRECT VECTOR
                  </strong>
                  <span className="badge badge-blue" style={{ fontSize: '0.62rem', padding: '0.15rem 0.45rem' }}>Threat Index: {(fastestPath.totalThreat * 100).toFixed(0)}%</span>
                </div>
                <p style={{ fontSize: '0.88rem', marginTop: '0.4rem', color: 'white', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  {fastestPath.nodes.join(' → ')}
                </p>
                <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '0.3rem' }}>
                  <span>Distance: <strong style={{ color: 'white' }}>{fastestPath.totalDist} km</strong></span>
                  <span>Est. Travel Time: <strong style={{ color: 'white' }}>{(fastestPath.totalDist / 80).toFixed(1)} hrs</strong></span>
                </div>
              </div>

            </div>
          ) : (
            <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.82rem', textAlign: 'center' }}>No pathways found between these coordinates.</p>
          )}

        </div>

      </div>

    </div>
  );
}
