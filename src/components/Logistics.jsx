import React, { useState } from 'react';
import { Calendar, Plus, MapPin, Compass, Route, ShieldAlert, Award } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Indian Cities Graph Definition with Real Geographic Coordinates
const CITIES = {
  Delhi: { lat: 28.6139, lng: 77.2090, label: 'New Delhi (DL)' },
  Mumbai: { lat: 19.0760, lng: 72.8777, label: 'Mumbai (MH)' },
  Bangalore: { lat: 12.9716, lng: 77.5946, label: 'Bangalore (KA)' },
  Chennai: { lat: 13.0827, lng: 80.2707, label: 'Chennai (TN)' },
  Kolkata: { lat: 22.5726, lng: 88.3639, label: 'Kolkata (WB)' },
  Hyderabad: { lat: 17.3850, lng: 78.4867, label: 'Hyderabad (TG)' },
  Ahmedabad: { lat: 23.0225, lng: 72.5714, label: 'Ahmedabad (GJ)' }
};

const EDGES = [
  { u: 'Delhi', v: 'Ahmedabad', dist: 940, threat: 0.08 },
  { u: 'Delhi', v: 'Kolkata', dist: 1530, threat: 0.15 },
  { u: 'Delhi', v: 'Hyderabad', dist: 1580, threat: 0.12 },
  { u: 'Ahmedabad', v: 'Mumbai', dist: 530, threat: 0.05 },
  { u: 'Mumbai', v: 'Hyderabad', dist: 710, threat: 0.11 },
  { u: 'Mumbai', v: 'Bangalore', dist: 980, threat: 0.18 },
  { u: 'Hyderabad', v: 'Kolkata', dist: 1490, threat: 0.22 },
  { u: 'Hyderabad', v: 'Bangalore', dist: 570, threat: 0.07 },
  { u: 'Hyderabad', v: 'Chennai', dist: 630, threat: 0.09 },
  { u: 'Bangalore', v: 'Chennai', dist: 350, threat: 0.04 },
];

export default function Logistics({ transportRequests, onAddTransportRequest, viewMode, theme }) {
  // Transport Organizer state
  const [origin, setOrigin] = useState('Mumbai');
  const [destination, setDestination] = useState('Delhi');
  const [shipmentTime, setShipmentTime] = useState('');
  const [barCount, setBarCount] = useState(10);
  const [escortLevel, setEscortLevel] = useState('HIGH');
  const [logisticsMessage, setLogisticsMessage] = useState('');

  // Routing Planner state
  const [routeStart, setRouteStart] = useState('Mumbai');
  const [routeEnd, setRouteEnd] = useState('Kolkata');

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

  // Safest Path = lowest totalThreat
  const safestPath = paths.length > 0 ? [...paths].sort((a, b) => a.totalThreat - b.totalThreat)[0] : null;
  // Fastest Path = lowest totalDist
  const fastestPath = paths.length > 0 ? [...paths].sort((a, b) => a.totalDist - b.totalDist)[0] : null;

  // Sorting Transport Requests by Shipment Time
  const sortedRequests = [...transportRequests].sort((a, b) => new Date(a.time) - new Date(b.time));

  // Determine Leaflet Tile Layer URL based on theme
  const mapTileUrl = theme === 'light' 
    ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  const renderOrganizerSection = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
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
                style={{ colorScheme: theme === 'light' ? 'light' : 'dark' }}
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

          {logisticsMessage && <div style={{ fontSize: '0.82rem', color: 'hsl(var(--success))', fontWeight: 500 }}>{logisticsMessage}</div>}

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

      {/* Transport Timeline Queue */}
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
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Transport Queue Timeline</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.35rem' }}>
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
                      <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'hsl(var(--text-primary))' }}>{req.origin} → {req.destination}</span>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>
                      <strong style={{ color: 'hsl(var(--text-primary))' }}>{req.barCount}</strong> Bars ({(req.barCount * 1.0).toFixed(1)} kg)
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );

  const renderRouteSection = () => (
    <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
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
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Geographic Route Planner</h3>
        </div>
        <span className="badge badge-blue" style={{ fontSize: '0.62rem' }}>Leaflet Mapping Active</span>
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

      {/* Leaflet Map Integration */}
      <div style={{ 
        border: '1px solid hsl(var(--border-color))', 
        borderRadius: '12px', 
        overflow: 'hidden',
        height: '420px', 
        position: 'relative', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <MapContainer 
          center={[22.5, 78.5]} 
          zoom={4.5} 
          style={{ height: '100%', width: '100%', background: theme === 'light' ? '#f5f5f7' : '#0a0d14' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={mapTileUrl}
          />

          {/* Render All Background Edges */}
          {EDGES.map((e, index) => {
            const uNode = CITIES[e.u];
            const vNode = CITIES[e.v];
            if (!uNode || !vNode) return null;

            return (
              <Polyline 
                key={`edge-${index}`}
                positions={[[uNode.lat, uNode.lng], [vNode.lat, vNode.lng]]}
                pathOptions={{ color: 'hsl(var(--text-muted))', weight: 1.5, opacity: 0.3 }}
              />
            );
          })}

          {/* Render Safest Path */}
          {safestPath && safestPath.nodes.length > 1 && (
            <Polyline 
              positions={safestPath.nodes.map(n => [CITIES[n].lat, CITIES[n].lng])}
              pathOptions={{ color: '#22c55e', weight: 4, opacity: 0.8 }}
            />
          )}

          {/* Render Fastest Path (if different from safest) */}
          {fastestPath && fastestPath.nodes.length > 1 && fastestPath.totalDist !== safestPath?.totalDist && (
            <Polyline 
              positions={fastestPath.nodes.map(n => [CITIES[n].lat, CITIES[n].lng])}
              pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.8, dashArray: '8, 8' }}
            />
          )}

          {/* Render City Nodes */}
          {Object.entries(CITIES).map(([key, city]) => {
            const isSelected = key === routeStart || key === routeEnd;
            const isInSafest = safestPath && safestPath.nodes.includes(key);

            let markerColor = 'hsl(var(--bg-secondary))';
            let strokeColor = 'hsl(var(--border-color))';
            if (isSelected) {
              markerColor = 'hsl(var(--gold-primary))';
              strokeColor = '#fff';
            } else if (isInSafest) {
              markerColor = '#22c55e'; // Success Green
              strokeColor = '#fff';
            }

            return (
              <CircleMarker 
                key={key}
                center={[city.lat, city.lng]}
                radius={isSelected ? 8 : isInSafest ? 6 : 5}
                pathOptions={{ 
                  fillColor: markerColor, 
                  color: strokeColor, 
                  weight: 2, 
                  fillOpacity: 1 
                }}
              >
                <Popup>
                  <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                    {city.label}
                  </div>
                </Popup>
                <Tooltip direction="bottom" offset={[0, 10]} opacity={0.9} permanent={isSelected}>
                  <span style={{ fontWeight: 'bold' }}>{key}</span>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Tactical Path Comparison Panel */}
      {paths.length > 0 && safestPath && fastestPath ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          {/* Safest route dossier */}
          <div 
            className="glass-card" 
            style={{ borderLeft: '4px solid hsl(var(--success))', padding: '1rem', background: 'hsl(var(--success) / 0.03)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: 'hsl(var(--success))', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', letterSpacing: '0.04em' }}>
                <Compass size={14} /> SAFEST TACTICAL ROUTE (LOWEST RISK)
              </strong>
              <span className="badge badge-success" style={{ fontSize: '0.62rem', padding: '0.15rem 0.45rem' }}>Threat Index: {(safestPath.totalThreat * 100).toFixed(0)}%</span>
            </div>
            <p style={{ fontSize: '0.88rem', marginTop: '0.4rem', color: 'hsl(var(--text-primary))', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              {safestPath.nodes.join(' → ')}
            </p>
            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '0.3rem' }}>
              <span>Distance: <strong style={{ color: 'hsl(var(--text-primary))' }}>{safestPath.totalDist} km</strong></span>
              <span>Est. Travel Time: <strong style={{ color: 'hsl(var(--text-primary))' }}>{(safestPath.totalDist / 80).toFixed(1)} hrs</strong></span>
            </div>
          </div>

          {/* Fastest route dossier */}
          <div 
            className="glass-card" 
            style={{ borderLeft: '4px solid hsl(var(--accent-blue))', padding: '1rem', background: 'hsl(var(--accent-blue) / 0.03)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: 'hsl(var(--accent-blue))', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', letterSpacing: '0.04em' }}>
                <Route size={14} /> FASTEST DIRECT VECTOR (MINIMUM DISTANCE)
              </strong>
              <span className="badge badge-blue" style={{ fontSize: '0.62rem', padding: '0.15rem 0.45rem' }}>Threat Index: {(fastestPath.totalThreat * 100).toFixed(0)}%</span>
            </div>
            <p style={{ fontSize: '0.88rem', marginTop: '0.4rem', color: 'hsl(var(--text-primary))', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              {fastestPath.nodes.join(' → ')}
            </p>
            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '0.3rem' }}>
              <span>Distance: <strong style={{ color: 'hsl(var(--text-primary))' }}>{fastestPath.totalDist} km</strong></span>
              <span>Est. Travel Time: <strong style={{ color: 'hsl(var(--text-primary))' }}>{(fastestPath.totalDist / 80).toFixed(1)} hrs</strong></span>
            </div>
          </div>

        </div>
      ) : (
        <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.82rem', textAlign: 'center' }}>No pathways found between these coordinates.</p>
      )}

    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.85rem', marginBottom: '0.4rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
          {viewMode === 'organizer' ? 'Transport Organizer Queue' : viewMode === 'route' ? 'Safest Delivery Route Planner' : 'Logistics & Secure Route Planner'}
        </h2>
        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.92rem' }}>
          {viewMode === 'organizer' && 'Lining up armored cargo transport requests and organizing them chronologically.'}
          {viewMode === 'route' && 'Tactical planning systems calculating the most secure paths between storage locations.'}
          {!viewMode && 'Organize armored transport timelines and plan delivery routes that minimize tactical threats.'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {viewMode === 'organizer' && renderOrganizerSection()}
        {viewMode === 'route' && renderRouteSection()}
        {!viewMode && (
          <div className="grid-2">
            {renderOrganizerSection()}
            {renderRouteSection()}
          </div>
        )}
      </div>

    </div>
  );
}
