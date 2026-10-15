import { useEffect, useState, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  MapPin, 
  Filter, 
  ExternalLink, 
  ShieldAlert, 
  Eye, 
  Check, 
  Camera,
  Layers,
  ChevronDown,
  Navigation,
  Crosshair
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../lib/api.js';
import Modal from '../components/Modal.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAuth } from '../lib/AuthContext.jsx';

// Color map for pollution types
const TYPE_COLORS = {
  'Plastic': '#2563eb',             // Blue
  'Industrial Discharge': '#ea580c', // Orange
  'Oil Spill': '#dc2626',            // Red
  'Other': '#7c3aed'                 // Purple
};

// Create custom pin icons using L.divIcon
function createPinIcon(source = 'Plastic') {
  const color = TYPE_COLORS[source] || '#2563eb';
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid #ffffff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: #ffffff;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28]
  });
}

// Selected pin icon (green)
function createSelectedPinIcon() {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: #10b981;
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid #ffffff;
        box-shadow: 0 4px 14px rgba(16,185,129,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse-marker 1.5s ease-in-out infinite;
      ">
        <div style="
          width: 12px;
          height: 12px;
          background: #ffffff;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32]
  });
}

// Click listener to pick GPS coordinates from the map
function MapClickSetter({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5)));
    }
  });
  return null;
}

// Mini-map click handler for modal
function ModalMapClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5)));
    }
  });
  return null;
}

// Component to fly to a position on the mini-map
function FlyToPosition({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 14, { duration: 0.8 });
    }
  }, [position, map]);
  return null;
}

// Well-known coastal locations for quick selection
const POPULAR_LOCATIONS = [
  { name: 'Marina Beach, Chennai', lat: 13.0500, lng: 80.2824 },
  { name: 'Besant Nagar Beach, Chennai', lat: 13.0002, lng: 80.2707 },
  { name: 'Kovalam Beach, Chennai', lat: 12.7900, lng: 80.2500 },
  { name: 'Mahabalipuram Beach', lat: 12.6166, lng: 80.1999 },
  { name: 'Adyar Estuary', lat: 13.0070, lng: 80.2650 },
  { name: 'Ennore Creek', lat: 13.2200, lng: 80.3200 },
  { name: 'Pulicat Lake', lat: 13.4167, lng: 80.3167 },
  { name: 'Muttukadu Backwaters', lat: 12.8130, lng: 80.2440 },
];

const initialForm = {
  title: '',
  source: 'Plastic',
  severity: 'Medium',
  location: '',
  latitude: 13.0500,
  longitude: 80.2824,
  description: '',
  imageUrl: '',
  status: 'Reported'
};

const SAMPLE_IMAGES = [
  { label: 'Plastic on beach', url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80' },
  { label: 'Dirty water', url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=600&q=80' },
  { label: 'Oil in water', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80' },
  { label: 'Fishing nets', url: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=600&q=80' }
];

export default function Reports() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [filterSource, setFilterSource] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationMethod, setLocationMethod] = useState('map'); // 'map', 'popular', 'gps'

  const canManageStatus = ['officer', 'admin', 'ngo'].includes(user?.role);
  const canDelete = user?.role === 'admin';

  const load = () => {
    api.get('/reports', {
      params: {
        search,
        source: filterSource,
        severity: filterSeverity,
        status: filterStatus
      }
    })
    .then(r => setRows(r.data))
    .catch(err => console.error('Error fetching reports', err));
  };

  useEffect(() => {
    load();
  }, [search, filterSource, filterSeverity, filterStatus]);

  const handleMapClick = (lat, lng) => {
    setForm(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      location: prev.location || `Coast (${lat}, ${lng})`
    }));
  };

  const handleModalMapPick = (lat, lng) => {
    setForm(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      location: prev.location || `Pinned Location`
    }));
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Your browser does not support location access. Please pick a location on the map instead.');
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(5));
        const lng = Number(position.coords.longitude.toFixed(5));
        setForm(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          location: prev.location || 'My Current Location'
        }));
        setGettingLocation(false);
      },
      (error) => {
        setGettingLocation(false);
        alert('Could not get your location. Please allow location access in your browser, or pick a spot on the map.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePopularLocationPick = (loc) => {
    setForm(prev => ({
      ...prev,
      latitude: loc.lat,
      longitude: loc.lng,
      location: loc.name
    }));
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/reports', {
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude)
      });
      setOpen(false);
      setForm(initialForm);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving report');
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    setStatusUpdating(id);
    try {
      await api.patch(`/reports/${id}/status`, { status: newStatus });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusUpdating(null);
    }
  };

  const remove = async (id) => {
    if (confirm('Are you sure you want to permanently delete this report?')) {
      await api.delete('/reports/' + id);
      load();
    }
  };

  // Center map around first report or Chennai baseline
  const mapCenter = rows.length > 0 ? [rows[0].latitude, rows[0].longitude] : [13.0500, 80.2824];

  return (
    <div className="reports-page-wrapper">
      <SectionHeader 
        title="Pollution Reports & Map" 
        description="See all reported pollution on the map. Anyone can report — just click the button below!"
        action={
          <button className="primary" onClick={() => setOpen(true)}>
            <Plus size={17} /> Report Pollution
          </button>
        }
      />

      {/* Map Legend Banner */}
      <div className="map-legend-bar">
        <div className="legend-items">
          <span className="legend-label"><Layers size={16} /> Marker Colors:</span>
          <span className="map-legend-chip">
            <span className="dot-pin" style={{ backgroundColor: TYPE_COLORS['Plastic'] }} />
            Plastic
          </span>
          <span className="map-legend-chip">
            <span className="dot-pin" style={{ backgroundColor: TYPE_COLORS['Industrial Discharge'] }} />
            Factory Waste
          </span>
          <span className="map-legend-chip">
            <span className="dot-pin" style={{ backgroundColor: TYPE_COLORS['Oil Spill'] }} />
            Oil Spill
          </span>
          <span className="map-legend-chip">
            <span className="dot-pin" style={{ backgroundColor: TYPE_COLORS['Other'] }} />
            Other
          </span>
        </div>
        <div className="map-hint">
          Click any pin on the map to see details
        </div>
      </div>

      {/* Interactive Leaflet Map */}
      <div className="map-container-card">
        <MapContainer 
          center={mapCenter} 
          zoom={9} 
          scrollWheelZoom={true} 
          className="leaflet-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickSetter onMapClick={handleMapClick} />
          {rows.map(r => (
            <Marker 
              key={r._id} 
              position={[r.latitude, r.longitude]} 
              icon={createPinIcon(r.source)}
            >
              <Popup className="incident-popup">
                <div className="popup-card">
                  {r.imageUrl && (
                    <img src={r.imageUrl} alt={r.title} className="popup-img" />
                  )}
                  <h4>{r.title}</h4>
                  <div className="popup-tags">
                    <span className="tag source" style={{ backgroundColor: TYPE_COLORS[r.source], color: '#fff' }}>
                      {r.source}
                    </span>
                    <span className={`tag severity-${r.severity.toLowerCase()}`}>
                      {r.severity} Severity
                    </span>
                    <span className={`status status-${r.status.toLowerCase().replace(' ', '-')}`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="popup-loc"><MapPin size={13} /> {r.location}</p>
                  <p className="popup-desc">{r.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Filter and Search Bar */}
      <div className="filters-card">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search reports by name or place…" 
          />
        </div>

        <div className="filter-group">
          <label>
            Type:
            <select value={filterSource} onChange={e => setFilterSource(e.target.value)}>
              <option value="All">All Types</option>
              <option value="Plastic">Plastic</option>
              <option value="Industrial Discharge">Factory Waste</option>
              <option value="Oil Spill">Oil Spill</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            How Bad:
            <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
              <option value="All">All Levels</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>

          <label>
            Status:
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="All">All</option>
              <option value="Reported">Reported</option>
              <option value="Investigating">Being Checked</option>
              <option value="Cleanup Planned">Cleanup Planned</option>
              <option value="Resolved">Resolved</option>
            </select>
          </label>
        </div>

        <span className="results-count">{rows.length} reports found</span>
      </div>

      {/* Reports Table with Action Controls */}
      <div className="table-panel">
        <table>
          <thead>
            <tr>
              <th>Report & Photo</th>
              <th>Pollution Type</th>
              <th>How Bad</th>
              <th>Location</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r._id}>
                <td>
                  <div className="incident-cell">
                    {r.imageUrl && (
                      <img src={r.imageUrl} alt={r.title} className="thumb-preview" />
                    )}
                    <div>
                      <strong>{r.title}</strong>
                      <span className="cell-sub">{r.description.slice(0, 65)}{r.description.length > 65 ? '…' : ''}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="tag source-badge" style={{ borderColor: TYPE_COLORS[r.source], color: TYPE_COLORS[r.source] }}>
                    {r.source}
                  </span>
                </td>
                <td>
                  <span className={`tag severity-${r.severity.toLowerCase()}`}>
                    {r.severity}
                  </span>
                </td>
                <td>
                  <div>{r.location}</div>
                </td>
                <td>
                  {canManageStatus ? (
                    <select
                      className={`status-select ${r.status.toLowerCase().replace(' ', '-')}`}
                      value={r.status}
                      disabled={statusUpdating === r._id}
                      onChange={e => updateStatus(r._id, e.target.value)}
                    >
                      <option value="Reported">Reported</option>
                      <option value="Investigating">Being Checked</option>
                      <option value="Cleanup Planned">Cleanup Planned</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  ) : (
                    <span className={`status status-${r.status.toLowerCase().replace(' ', '-')}`}>
                      {r.status}
                    </span>
                  )}
                </td>
                <td>{new Date(r.reportedAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons-cell">
                    {canDelete && (
                      <button 
                        className="icon-btn danger" 
                        title="Delete this report"
                        onClick={() => remove(r._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <EmptyState text="No pollution reports found." />}
      </div>

      {/* New Report Modal — Simplified with Map Picker + GPS Button */}
      {open && (
        <Modal title="Report Pollution" onClose={() => setOpen(false)}>
          <form className="form-grid" onSubmit={save}>
            <label className="span-2">
              What did you see? (Title)
              <input 
                type="text"
                value={form.title} 
                onChange={e => setForm({ ...form, title: e.target.value })} 
                placeholder="e.g. Plastic bottles piled up on beach" 
                required 
              />
            </label>

            <label>
              Type of Pollution
              <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
                <option value="Plastic">🥤 Plastic / Trash</option>
                <option value="Industrial Discharge">🏭 Factory / Chemical Waste</option>
                <option value="Oil Spill">🛢️ Oil Spill</option>
                <option value="Other">❓ Something Else</option>
              </select>
            </label>

            <label>
              How bad is it?
              <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}>
                <option value="Low">🟢 Low — Small amount, limited area</option>
                <option value="Medium">🟡 Medium — Noticeable, spreading</option>
                <option value="High">🔴 High — Severe, needs urgent help</option>
              </select>
            </label>

            {/* Location Section — Simplified */}
            <div className="span-2 location-picker-section">
              <div className="location-picker-header">
                <MapPin size={18} />
                <span><strong>Where is the pollution?</strong> Pick a method below:</span>
              </div>

              <div className="location-method-tabs">
                <button 
                  type="button" 
                  className={`method-tab ${locationMethod === 'gps' ? 'active' : ''}`}
                  onClick={() => { setLocationMethod('gps'); handleUseMyLocation(); }}
                >
                  <Crosshair size={16} />
                  {gettingLocation ? 'Finding you…' : 'Use My Location'}
                </button>
                <button 
                  type="button"
                  className={`method-tab ${locationMethod === 'popular' ? 'active' : ''}`}
                  onClick={() => setLocationMethod('popular')}
                >
                  <MapPin size={16} />
                  Pick from List
                </button>
                <button 
                  type="button"
                  className={`method-tab ${locationMethod === 'map' ? 'active' : ''}`}
                  onClick={() => setLocationMethod('map')}
                >
                  <Navigation size={16} />
                  Tap on Map
                </button>
              </div>

              {/* Popular locations grid */}
              {locationMethod === 'popular' && (
                <div className="popular-locations-grid">
                  {POPULAR_LOCATIONS.map((loc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`popular-loc-btn ${form.latitude === loc.lat && form.longitude === loc.lng ? 'selected' : ''}`}
                      onClick={() => handlePopularLocationPick(loc)}
                    >
                      <MapPin size={14} />
                      {loc.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Mini map for picking location */}
              {locationMethod === 'map' && (
                <div className="mini-map-picker">
                  <div className="mini-map-hint">👆 Tap anywhere on this map to set the location</div>
                  <MapContainer 
                    center={[form.latitude, form.longitude]} 
                    zoom={12} 
                    scrollWheelZoom={true} 
                    className="modal-leaflet-map"
                    style={{ height: '220px', borderRadius: '12px' }}
                  >
                    <TileLayer
                      attribution='&copy; OpenStreetMap'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ModalMapClickHandler onPick={handleModalMapPick} />
                    <FlyToPosition position={[form.latitude, form.longitude]} />
                    <Marker 
                      position={[form.latitude, form.longitude]} 
                      icon={createSelectedPinIcon()}
                    />
                  </MapContainer>
                </div>
              )}

              {/* Show picked location summary */}
              <div className="picked-location-display">
                <span className="picked-label">📍 Selected:</span>
                <span className="picked-value">
                  {form.location || `${form.latitude}, ${form.longitude}`}
                </span>
              </div>
            </div>

            <label className="span-2">
              Location Name (optional — auto-filled)
              <input 
                type="text"
                value={form.location} 
                onChange={e => setForm({ ...form, location: e.target.value })} 
                placeholder="e.g. Marina Beach near the lifeguard tower" 
              />
            </label>

            <label className="span-2">
              Add a Photo (paste a link or pick below)
              <input 
                type="url"
                value={form.imageUrl} 
                onChange={e => setForm({ ...form, imageUrl: e.target.value })} 
                placeholder="https://example.com/photo.jpg" 
              />
            </label>

            <div className="span-2 sample-photo-picker">
              <span>Or pick a sample photo:</span>
              <div className="preset-buttons">
                {SAMPLE_IMAGES.map((img, idx) => (
                  <button 
                    key={idx} 
                    type="button" 
                    className="preset-btn"
                    onClick={() => setForm({ ...form, imageUrl: img.url })}
                  >
                    <Camera size={13} /> {img.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="span-2">
              Describe what you saw
              <textarea 
                rows="3" 
                value={form.description} 
                onChange={e => setForm({ ...form, description: e.target.value })} 
                placeholder="e.g. Lots of plastic bags and bottles washed up near the rocks. Smells bad. Some dead fish nearby."
                required 
              />
            </label>

            <div className="modal-actions span-2">
              <button type="button" className="secondary" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="primary" disabled={saving}>
                {saving ? 'Submitting…' : '📤 Submit Report'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
