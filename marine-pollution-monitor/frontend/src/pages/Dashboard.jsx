import { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Droplets, 
  HelpCircle, 
  Recycle, 
  ShieldAlert, 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  ArrowUpRight,
  Info,
  Waves
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  CartesianGrid, 
  Cell, 
  Legend, 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import api from '../lib/api.js';
import { Link } from 'react-router-dom';

const SOURCE_COLORS = {
  'Plastic': '#2563eb',
  'Industrial Discharge': '#ea580c',
  'Oil Spill': '#dc2626',
  'Other': '#7c3aed'
};

const STATUS_COLORS = {
  'Reported': '#ef4444',
  'Investigating': '#f59e0b',
  'Cleanup Planned': '#3b82f6',
  'Resolved': '#10b981'
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setData(res.data))
      .catch(err => console.error('Dashboard load error', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="loading-block">
        <div className="spinner" />
        <p>Loading real-time marine analytics…</p>
      </div>
    );
  }

  const { summary, reportsByType, reportsByStatus, waterTrends, recentCleanups } = data;
  const trend = summary?.trend30Day || { trend: 'Stable', recentAvgDO: 6.8, priorAvgDO: 6.0 };

  const getTrendIcon = (t) => {
    if (t === 'Improving') return <TrendingUp size={20} className="text-success" />;
    if (t === 'Worsening') return <TrendingDown size={20} className="text-danger" />;
    return <Minus size={20} className="text-warning" />;
  };

  const getTrendBadgeClass = (t) => {
    if (t === 'Improving') return 'trend-badge improving';
    if (t === 'Worsening') return 'trend-badge worsening';
    return 'trend-badge stable';
  };

  return (
    <div className="dashboard-container">
      {/* Hero Welcome Banner */}
      <div className="hero-banner">
        <div>
          <div className="eyebrow">MARINE POLLUTION TRACKER · DASHBOARD</div>
          <h2>Ocean & Beach Pollution Overview</h2>
          <p>
            See all pollution reports, water quality, and cleanup progress in one place.
          </p>
        </div>
        <div className="hero-badge-box">
          <div className="hero-trend-pill">
            <span className="dot pulse" />
            <span>Water Health (30 days): <strong>{trend.trend}</strong></span>
          </div>
          <small>Oxygen: {trend.recentAvgDO} mg/L (was {trend.priorAvgDO} mg/L before)</small>
        </div>
      </div>

      {/* 4 Required Summary Cards */}
      <div className="summary-grid">
        {/* Card 1: Total Reports */}
        <div className="summary-card">
          <div className="card-top">
            <span className="card-label">Total Reports</span>
            <div className="icon-wrapper blue">
              <ShieldAlert size={20} />
            </div>
          </div>
          <div className="card-val">{summary.totalReports}</div>
          <div className="card-sub">
            All pollution reports submitted so far
          </div>
        </div>

        {/* Card 2: Percentage Resolved */}
        <div className="summary-card">
          <div className="card-top">
            <span className="card-label">Problems Fixed</span>
            <div className="icon-wrapper green">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="card-val">{summary.percentageResolved}%</div>
          <div className="card-sub">
            {summary.resolvedReports} out of {summary.totalReports} problems have been cleaned up
          </div>
        </div>

        {/* Card 3: Total Waste Collected in KG */}
        <div className="summary-card">
          <div className="card-top">
            <span className="card-label">Waste Cleaned Up</span>
            <div className="icon-wrapper purple">
              <Recycle size={20} />
            </div>
          </div>
          <div className="card-val">{summary.totalWasteKg.toLocaleString()} <small>kg</small></div>
          <div className="card-sub">
            Including {summary.totalPlasticKg} kg plastic and {summary.totalOilLitres} liters of oil
          </div>
        </div>

        {/* Card 4: 30-Day Water Quality Trend */}
        <div className="summary-card trend-card">
          <div className="card-top">
            <span className="card-label">Water Health Trend</span>
            <div className="icon-wrapper teal">
              <Droplets size={20} />
            </div>
          </div>
          <div className="trend-row">
            <div className="card-val">{trend.trend}</div>
            <div className={getTrendBadgeClass(trend.trend)}>
              {getTrendIcon(trend.trend)}
              <span>{trend.difference > 0 ? `+${trend.difference}` : trend.difference} mg/L</span>
            </div>
          </div>
          <div className="card-sub">
            Is the water getting healthier or worse? Based on oxygen levels over the past month.
          </div>
        </div>
      </div>

      {/* Reports Breakdown Charts Row */}
      <div className="charts-double-grid">
        {/* Chart 1: Reports by Type */}
        <div className="panel chart-panel">
          <div className="panel-header">
            <div>
              <h3>What's Polluting Our Water?</h3>
              <p>Types of pollution people have reported.</p>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={reportsByType} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px' }} 
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {reportsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SOURCE_COLORS[entry.name] || '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend-custom">
            {reportsByType.map(t => (
              <span key={t.name} className="legend-chip">
                <span className="legend-color-dot" style={{ backgroundColor: SOURCE_COLORS[t.name] || '#3b82f6' }} />
                {t.name}: <strong>{t.count}</strong>
              </span>
            ))}
          </div>
        </div>

        {/* Chart 2: Reports by Status */}
        <div className="panel chart-panel">
          <div className="panel-header">
            <div>
              <h3>Where Are We With Fixing Them?</h3>
              <p>How many reports have been addressed vs still pending.</p>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={reportsByStatus} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px' }} 
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {reportsByStatus.map((entry, index) => (
                    <Cell key={`status-${index}`} fill={STATUS_COLORS[entry.name] || '#64748b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend-custom">
            {reportsByStatus.map(s => (
              <span key={s.name} className="legend-chip">
                <span className="legend-color-dot" style={{ backgroundColor: STATUS_COLORS[s.name] || '#64748b' }} />
                {s.name}: <strong>{s.count}</strong>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Water Quality Multi-Line Chart */}
      <div className="panel full-width-panel">
        <div className="panel-header">
          <div>
            <h3>Is the Water Getting Better or Worse?</h3>
            <p>Water quality measurements over time — oxygen, acidity, clarity, and temperature.</p>
          </div>
          <Link to="/water-quality" className="panel-link-btn">
            See All Readings <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="chart-wrapper large-chart">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={waterTrends} margin={{ top: 15, right: 30, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }} 
              />
              <Legend verticalAlign="top" height={36} />
              <Line 
                type="monotone" 
                name="Dissolved Oxygen (mg/L)" 
                dataKey="dissolvedOxygen" 
                stroke="#0284c7" 
                strokeWidth={3} 
                dot={{ r: 5 }} 
              />
              <Line 
                type="monotone" 
                name="pH Level" 
                dataKey="ph" 
                stroke="#10b981" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
              />
              <Line 
                type="monotone" 
                name="Turbidity (NTU)" 
                dataKey="turbidity" 
                stroke="#f59e0b" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
              />
              <Line 
                type="monotone" 
                name="Temperature (°C)" 
                dataKey="temperature" 
                stroke="#ef4444" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Decision Maker Indicator Guide Section */}
      <div className="panel guide-panel">
        <div className="panel-header">
          <div className="guide-title">
            <Info size={20} className="text-primary" />
            <div>
              <h3>What Do These Numbers Mean?</h3>
              <p>A simple guide to understanding water quality readings.</p>
            </div>
          </div>
        </div>

        <div className="indicator-explanation-grid">
          <div className="indicator-box">
            <div className="indicator-box-top">
              <span className="dot-indicator blue" />
              <h4>💧 Oxygen in Water</h4>
            </div>
            <p className="benchmark">Good: above 6.5 · Danger: below 4.0</p>
            <p className="desc">
              Fish and sea creatures need oxygen in the water to breathe. When oxygen drops too low, they can't survive — creating dead zones where nothing lives.
            </p>
          </div>

          <div className="indicator-box">
            <div className="indicator-box-top">
              <span className="dot-indicator amber" />
              <h4>🌊 Water Clarity</h4>
            </div>
            <p className="benchmark">Clear: below 5 · Murky: above 15</p>
            <p className="desc">
              How clear or cloudy the water is. If water is too murky, sunlight can't reach plants and corals, and it clogs fish gills.
            </p>
          </div>

          <div className="indicator-box">
            <div className="indicator-box-top">
              <span className="dot-indicator green" />
              <h4>⚗️ pH (Acidity)</h4>
            </div>
            <p className="benchmark">Normal: 7.8 – 8.3 · Warning: below 7.4 or above 8.8</p>
            <p className="desc">
              Sea water is slightly alkaline. If it becomes too acidic (from pollution), it harms shells, corals, and sea creatures.
            </p>
          </div>

          <div className="indicator-box">
            <div className="indicator-box-top">
              <span className="dot-indicator red" />
              <h4>🌡️ Temperature</h4>
            </div>
            <p className="benchmark">Normal: 26°C – 29°C · Too hot: above 32°C</p>
            <p className="desc">
              Warmer water holds less oxygen. If factories dump hot water, it can cause algae blooms and kill coral.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="quick-actions-row">
        <div className="quick-card">
          <ShieldAlert size={24} className="text-primary" />
          <div>
            <h4>Pollution Map</h4>
            <p>See all pollution reports on an interactive map with color-coded pins.</p>
          </div>
          <Link to="/reports" className="button secondary">Open Map</Link>
        </div>

        <div className="quick-card">
          <Recycle size={24} className="text-success" />
          <div>
            <h4>Cleanups & Volunteering</h4>
            <p>Join a beach cleanup, see upcoming events, or check how much waste was collected.</p>
          </div>
          <Link to="/cleanup" className="button secondary">View Cleanups</Link>
        </div>
      </div>
    </div>
  );
}
