import { useEffect, useState } from 'react';
import { 
  Plus, 
  Droplets, 
  Thermometer, 
  Activity, 
  Eye, 
  ShieldCheck, 
  AlertTriangle,
  Info,
  Calendar,
  HelpCircle
} from 'lucide-react';
import api from '../lib/api.js';
import Modal from '../components/Modal.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAuth } from '../lib/AuthContext.jsx';

const initialForm = {
  station: '',
  location: '',
  ph: 8.1,
  dissolvedOxygen: 6.8,
  turbidity: 4.5,
  temperature: 28.5,
  oilIndex: 0.5,
  microplasticCount: 45,
  qualityStatus: 'Good',
  notes: ''
};

// Helper to get a human-friendly label for pH
function phLabel(val) {
  if (val < 7.4) return '⚠️ Too acidic';
  if (val > 8.8) return '⚠️ Too alkaline';
  if (val >= 7.8 && val <= 8.3) return '✅ Normal';
  return '🔶 Slightly off';
}

// Helper to get a human-friendly label for DO
function doLabel(val) {
  if (val >= 6.5) return '✅ Healthy';
  if (val >= 4.0) return '🔶 Low';
  return '⚠️ Very low (danger)';
}

// Helper for turbidity
function turbLabel(val) {
  if (val < 5) return '✅ Clear';
  if (val <= 15) return '🔶 Slightly murky';
  return '⚠️ Very murky';
}

// Helper for temp
function tempLabel(val) {
  if (val >= 26 && val <= 29) return '✅ Normal';
  if (val > 32) return '⚠️ Too hot';
  if (val < 20) return '⚠️ Too cold';
  return '🔶 Slightly unusual';
}

export default function WaterQuality() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const canRecord = ['officer', 'ngo', 'admin'].includes(user?.role);

  const loadData = () => {
    api.get('/water-quality')
      .then(r => setRows(r.data))
      .catch(err => console.error('Error fetching water quality data', err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/water-quality', {
        ...form,
        ph: Number(form.ph),
        dissolvedOxygen: Number(form.dissolvedOxygen),
        turbidity: Number(form.turbidity),
        temperature: Number(form.temperature),
        oilIndex: Number(form.oilIndex) || 0,
        microplasticCount: Number(form.microplasticCount) || 0
      });
      setOpen(false);
      setForm(initialForm);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving measurement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="water-page-wrapper">
      <SectionHeader 
        title="Water Quality Check" 
        description="See how clean or polluted the water is at different locations. Green = good, yellow = watch out, red = bad."
        action={
          canRecord && (
            <button className="primary" onClick={() => setOpen(true)}>
              <Plus size={17} /> Add Reading
            </button>
          )
        }
      />

      {/* Simple Explanation Strip */}
      <div className="water-parameters-banner">
        <div className="param-guide-col">
          <strong>💧 Oxygen in Water</strong>
          <span>Good: above 6.5 · Bad: below 4.0</span>
        </div>
        <div className="param-guide-col">
          <strong>🌊 Water Clarity</strong>
          <span>Clear: below 5 · Murky: above 15</span>
        </div>
        <div className="param-guide-col">
          <strong>⚗️ pH (Acidity)</strong>
          <span>Normal sea water: 7.8 – 8.3</span>
        </div>
        <div className="param-guide-col">
          <strong>🌡️ Temperature</strong>
          <span>Normal: 26°C – 29°C</span>
        </div>
      </div>

      {/* Stations Cards Grid */}
      <div className="quality-cards-grid">
        {rows.map(r => (
          <div className="quality-card" key={r._id}>
            <div className="quality-card-header">
              <div>
                <span className="station-code">{r.station}</span>
                <h3>{r.location}</h3>
              </div>
              <span className={`status status-${r.qualityStatus.toLowerCase()}`}>
                {r.qualityStatus === 'Good' ? '✅ Good' : r.qualityStatus === 'Watch' ? '⚠️ Watch' : '🔴 Poor'}
              </span>
            </div>

            {/* Health Bar Meter */}
            <div className="health-meter-bar">
              <div 
                className={`health-meter-fill ${r.qualityStatus.toLowerCase()}`}
                style={{
                  width: `${r.qualityStatus === 'Good' ? 95 : r.qualityStatus === 'Watch' ? 65 : 35}%`
                }} 
              />
            </div>

            {/* Metric Parameter Grid - Simplified labels */}
            <div className="metric-parameter-grid">
              <div className="param-box">
                <span className="param-name">💧 Oxygen</span>
                <strong className={`param-value ${r.dissolvedOxygen >= 6.5 ? 'text-success' : r.dissolvedOxygen < 4.5 ? 'text-danger' : 'text-warning'}`}>
                  {r.dissolvedOxygen} <small>mg/L</small>
                </strong>
              </div>

              <div className="param-box">
                <span className="param-name">⚗️ pH Level</span>
                <strong className="param-value text-primary">
                  {r.ph}
                </strong>
              </div>

              <div className="param-box">
                <span className="param-name">🌊 Clarity</span>
                <strong className={`param-value ${r.turbidity > 10 ? 'text-danger' : 'text-primary'}`}>
                  {r.turbidity} <small>NTU</small>
                </strong>
              </div>

              <div className="param-box">
                <span className="param-name">🌡️ Temp</span>
                <strong className="param-value text-primary">
                  {r.temperature} <small>°C</small>
                </strong>
              </div>
            </div>

            <div className="quality-card-footer">
              <div className="measured-date">
                <Calendar size={14} />
                <span>Checked: {new Date(r.measuredAt).toLocaleDateString()}</span>
              </div>
              {r.notes && (
                <p className="card-notes">"{r.notes}"</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {rows.length === 0 && <EmptyState text="No water quality readings yet." />}

      {/* New Measurement Modal — Simplified */}
      {open && (
        <Modal title="Add Water Quality Reading" onClose={() => setOpen(false)}>
          <form className="form-grid" onSubmit={save}>
            <label>
              Station Name / Code
              <input 
                type="text" 
                value={form.station} 
                onChange={e => setForm({ ...form, station: e.target.value })} 
                placeholder="e.g. Station 5 or ST-05" 
                required 
              />
            </label>

            <label>
              Where was this measured?
              <input 
                type="text" 
                value={form.location} 
                onChange={e => setForm({ ...form, location: e.target.value })} 
                placeholder="e.g. Marina Beach near the pier" 
                required 
              />
            </label>

            {/* pH with slider and live feedback */}
            <label className="slider-label">
              <div className="slider-header">
                <span>⚗️ pH Level (acidity)</span>
                <span className="slider-value">{form.ph} — {phLabel(Number(form.ph))}</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="10" 
                step="0.1" 
                value={form.ph} 
                onChange={e => setForm({ ...form, ph: e.target.value })} 
                className="styled-slider"
              />
              <div className="slider-range-labels">
                <span>5 (acidic)</span>
                <span>7.8–8.3 (normal)</span>
                <span>10 (alkaline)</span>
              </div>
            </label>

            {/* Dissolved Oxygen with slider */}
            <label className="slider-label">
              <div className="slider-header">
                <span>💧 Oxygen in Water (mg/L)</span>
                <span className="slider-value">{form.dissolvedOxygen} — {doLabel(Number(form.dissolvedOxygen))}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="14" 
                step="0.1" 
                value={form.dissolvedOxygen} 
                onChange={e => setForm({ ...form, dissolvedOxygen: e.target.value })} 
                className="styled-slider"
              />
              <div className="slider-range-labels">
                <span>0 (no oxygen)</span>
                <span>6.5+ (healthy)</span>
                <span>14</span>
              </div>
            </label>

            {/* Turbidity with slider */}
            <label className="slider-label">
              <div className="slider-header">
                <span>🌊 Water Clarity (NTU)</span>
                <span className="slider-value">{form.turbidity} — {turbLabel(Number(form.turbidity))}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50" 
                step="0.5" 
                value={form.turbidity} 
                onChange={e => setForm({ ...form, turbidity: e.target.value })} 
                className="styled-slider"
              />
              <div className="slider-range-labels">
                <span>0 (crystal clear)</span>
                <span>5 (normal)</span>
                <span>50 (very dirty)</span>
              </div>
            </label>

            {/* Temperature with slider */}
            <label className="slider-label">
              <div className="slider-header">
                <span>🌡️ Water Temperature (°C)</span>
                <span className="slider-value">{form.temperature} — {tempLabel(Number(form.temperature))}</span>
              </div>
              <input 
                type="range" 
                min="15" 
                max="40" 
                step="0.5" 
                value={form.temperature} 
                onChange={e => setForm({ ...form, temperature: e.target.value })} 
                className="styled-slider"
              />
              <div className="slider-range-labels">
                <span>15°C</span>
                <span>26–29°C (normal)</span>
                <span>40°C</span>
              </div>
            </label>

            <label>
              Overall Water Quality
              <select 
                value={form.qualityStatus} 
                onChange={e => setForm({ ...form, qualityStatus: e.target.value })}
              >
                <option value="Good">✅ Good — Water looks healthy</option>
                <option value="Watch">⚠️ Watch — Something seems off</option>
                <option value="Poor">🔴 Poor — Water is visibly polluted</option>
              </select>
            </label>

            <label className="span-2">
              Any notes? (optional)
              <textarea 
                rows="3" 
                value={form.notes} 
                onChange={e => setForm({ ...form, notes: e.target.value })} 
                placeholder="e.g. Water smells bad, no fish visible, brown foam on surface…" 
              />
            </label>

            <div className="modal-actions span-2">
              <button type="button" className="secondary" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="primary" disabled={submitting}>
                {submitting ? 'Saving…' : '💾 Save Reading'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
