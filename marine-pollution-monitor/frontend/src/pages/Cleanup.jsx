import { useEffect, useState } from 'react';
import { 
  Plus, 
  Recycle, 
  Users, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  ShieldCheck, 
  UserPlus, 
  Scale, 
  Droplet, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import api from '../lib/api.js';
import Modal from '../components/Modal.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAuth } from '../lib/AuthContext.jsx';

const initialDriveForm = {
  name: '',
  location: '',
  date: '',
  team: '',
  reportId: '',
  volunteers: 0,
  wasteCollectedKg: 0,
  plasticCollectedKg: 0,
  oilRecoveredLitres: 0,
  status: 'Planned',
  summary: ''
};

export default function Cleanup() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [openReports, setOpenReports] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openLogModal, setOpenLogModal] = useState(false);
  const [activeDrive, setActiveDrive] = useState(null);
  const [form, setForm] = useState(initialDriveForm);
  const [wasteForm, setWasteForm] = useState({ wasteCollectedKg: '', plasticCollectedKg: '', oilRecoveredLitres: '', status: 'Completed' });
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const canCreateDrive = ['ngo', 'admin'].includes(user?.role);
  const canLogWaste = ['ngo', 'admin', 'officer'].includes(user?.role);

  const loadData = async () => {
    try {
      const [cleanupsRes, reportsRes] = await Promise.all([
        api.get('/cleanup'),
        api.get('/reports')
      ]);
      setRows(cleanupsRes.data);
      setOpenReports(reportsRes.data);
    } catch (err) {
      console.error('Error fetching cleanups', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/cleanup', {
        ...form,
        volunteers: Number(form.volunteers) || 0,
        wasteCollectedKg: Number(form.wasteCollectedKg) || 0,
        plasticCollectedKg: Number(form.plasticCollectedKg) || 0,
        oilRecoveredLitres: Number(form.oilRecoveredLitres) || 0,
        reportId: form.reportId || undefined
      });
      setOpenCreateModal(false);
      setForm(initialDriveForm);
      showNotification('Cleanup drive successfully planned and linked!');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating cleanup');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterVolunteer = async (driveId) => {
    try {
      await api.post(`/cleanup/${driveId}/register`);
      showNotification('Congratulations! You are officially registered as a volunteer.');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not register for this drive');
    }
  };

  const openLogWasteModal = (drive) => {
    setActiveDrive(drive);
    setWasteForm({
      wasteCollectedKg: drive.wasteCollectedKg || '',
      plasticCollectedKg: drive.plasticCollectedKg || '',
      oilRecoveredLitres: drive.oilRecoveredLitres || '',
      status: 'Completed'
    });
    setOpenLogModal(true);
  };

  const handleSaveWaste = async (e) => {
    e.preventDefault();
    if (!activeDrive) return;
    setSubmitting(true);
    try {
      await api.patch(`/cleanup/${activeDrive._id}/waste`, wasteForm);
      setOpenLogModal(false);
      showNotification('Recovery metrics logged and linked report resolved!');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update metrics');
    } finally {
      setSubmitting(false);
    }
  };

  const showNotification = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 5000);
  };

  return (
    <div className="cleanup-page-wrapper">
      <SectionHeader 
        title="Beach Cleanups & Volunteering" 
        description="Join a cleanup drive, sign up as a volunteer, or organize one yourself. Let's keep our beaches clean!"
        action={
          canCreateDrive && (
            <button className="primary" onClick={() => setOpenCreateModal(true)}>
              <Plus size={17} /> Plan a Cleanup
            </button>
          )
        }
      />

      {actionSuccess && (
        <div className="alert success-banner">
          <CheckCircle size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Role duties banner */}
      <div className="role-guidance-pill">
        <Users size={16} />
        <span>
          <strong>You're signed in as {user?.role?.toUpperCase()}:</strong> {
            user?.role === 'citizen'
              ? 'You can sign up as a volunteer for any cleanup below!'
              : user?.role === 'ngo'
              ? 'You can plan new cleanups and record how much waste was collected.'
              : user?.role === 'officer'
              ? 'You can check cleanup results and verify waste collected.'
              : 'You have full access to manage everything.'
          }
        </span>
      </div>

      {/* Drives Grid */}
      <div className="cleanup-cards-grid">
        {rows.map(drive => {
          const isUserRegistered = drive.registeredVolunteers?.some(
            v => v.user?._id === user?._id || v.user === user?._id
          );

          return (
            <div className="cleanup-card" key={drive._id}>
              <div className="cleanup-card-header">
                <div>
                  <span className={`status status-${drive.status.toLowerCase()}`}>
                    {drive.status}
                  </span>
                  <h3>{drive.name}</h3>
                  <p className="team-lead">Organized by <strong>{drive.team}</strong></p>
                </div>
                <div className="date-badge">
                  <span className="month">{new Date(drive.date).toLocaleString('en', { month: 'short' })}</span>
                  <strong className="day">{new Date(drive.date).getDate()}</strong>
                </div>
              </div>

              <div className="cleanup-details">
                <div className="detail-item">
                  <MapPin size={16} className="text-muted" />
                  <span>{drive.location}</span>
                </div>
                <div className="detail-item">
                  <Calendar size={16} className="text-muted" />
                  <span>Scheduled: {new Date(drive.date).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Linked Incident Badge */}
              <div className="linked-incident-box">
                <span className="linked-label">Linked Pollution Incident:</span>
                {drive.reportId ? (
                  <div className="linked-info">
                    <strong>{drive.reportId.title || 'Reported Incident'}</strong>
                    <span className="linked-sub">{drive.reportId.location} · Status: {drive.reportId.status}</span>
                  </div>
                ) : (
                  <span className="text-muted italic">General Coastal Zone Drive</span>
                )}
              </div>

              {/* Waste Recovery Stats */}
              <div className="recovery-metrics-row">
                <div className="metric-box">
                  <Scale size={16} className="text-primary" />
                  <div>
                    <strong>{drive.wasteCollectedKg} kg</strong>
                    <span>Total Waste</span>
                  </div>
                </div>
                <div className="metric-box">
                  <Recycle size={16} className="text-success" />
                  <div>
                    <strong>{drive.plasticCollectedKg} kg</strong>
                    <span>Plastic</span>
                  </div>
                </div>
                <div className="metric-box">
                  <Droplet size={16} className="text-danger" />
                  <div>
                    <strong>{drive.oilRecoveredLitres} L</strong>
                    <span>Oil</span>
                  </div>
                </div>
                <div className="metric-box">
                  <Users size={16} className="text-purple" />
                  <div>
                    <strong>{drive.volunteers}</strong>
                    <span>Volunteers</span>
                  </div>
                </div>
              </div>

              {drive.summary && (
                <p className="cleanup-summary-note">"{drive.summary}"</p>
              )}

              {/* Action Buttons */}
              <div className="cleanup-card-actions">
                {isUserRegistered ? (
                  <span className="registered-badge">
                    <ShieldCheck size={16} /> Registered Volunteer
                  </span>
                ) : (
                  <button 
                    className="button primary outline full-width"
                    onClick={() => handleRegisterVolunteer(drive._id)}
                  >
                    <UserPlus size={16} /> Join as Volunteer
                  </button>
                )}

                {canLogWaste && (
                  <button 
                    className="button secondary full-width"
                    onClick={() => openLogWasteModal(drive)}
                  >
                    <Scale size={16} /> Log Collected Waste
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {rows.length === 0 && <EmptyState text="No cleanup drives scheduled yet." />}

      {/* Modal: Schedule Drive (NGO & Admin) */}
      {openCreateModal && (
        <Modal title="Plan a Beach Cleanup" onClose={() => setOpenCreateModal(false)}>
          <form className="form-grid" onSubmit={handleCreate}>
            <label className="span-2">
              Give it a name
              <input 
                type="text" 
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })} 
                placeholder="e.g. Marina Beach Saturday Cleanup" 
                required 
              />
            </label>

            <label>
              Where?
              <input 
                type="text" 
                value={form.location} 
                onChange={e => setForm({ ...form, location: e.target.value })} 
                placeholder="e.g. Marina Beach near the lighthouse" 
                required 
              />
            </label>

            <label>
              When?
              <input 
                type="date" 
                value={form.date} 
                onChange={e => setForm({ ...form, date: e.target.value })} 
                required 
              />
            </label>

            <label>
              Who's organizing?
              <input 
                type="text" 
                value={form.team} 
                onChange={e => setForm({ ...form, team: e.target.value })} 
                placeholder="e.g. CleanSeas Foundation or your name" 
                required 
              />
            </label>

            <label>
              Related pollution report (optional)
              <select 
                value={form.reportId} 
                onChange={e => setForm({ ...form, reportId: e.target.value })}
              >
                <option value="">-- No specific report, just a general cleanup --</option>
                {openReports.map(r => (
                  <option key={r._id} value={r._id}>
                    {r.title} ({r.location})
                  </option>
                ))}
              </select>
            </label>

            <label className="span-2">
              How many volunteers do you expect?
              <input 
                type="number" 
                min="0" 
                value={form.volunteers} 
                onChange={e => setForm({ ...form, volunteers: e.target.value })} 
                placeholder="e.g. 20"
              />
            </label>

            <label className="span-2">
              Any extra details? (optional)
              <textarea 
                rows="3" 
                value={form.summary} 
                onChange={e => setForm({ ...form, summary: e.target.value })} 
                placeholder="e.g. Meet at the entrance gate at 7 AM. Bring gloves and bags." 
              />
            </label>

            <div className="modal-actions span-2">
              <button type="button" className="secondary" onClick={() => setOpenCreateModal(false)}>
                Cancel
              </button>
              <button className="primary" disabled={submitting}>
                {submitting ? 'Creating…' : '📋 Create Cleanup'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Log Waste Collected (NGO, Officer, Admin) */}
      {openLogModal && activeDrive && (
        <Modal title={`Log Collected Waste for: ${activeDrive.name}`} onClose={() => setOpenLogModal(false)}>
          <form className="form-grid" onSubmit={handleSaveWaste}>
            <div className="modal-banner-tip span-2">
              <Scale size={16} />
              <span>When you mark this as <strong>Completed</strong>, the related pollution report will also be marked as <strong>Resolved</strong> automatically.</span>
            </div>

            <label>
              Total Waste Collected (kg)
              <input 
                type="number" 
                step="any" 
                value={wasteForm.wasteCollectedKg} 
                onChange={e => setWasteForm({ ...wasteForm, wasteCollectedKg: e.target.value })} 
                required 
              />
            </label>

            <label>
              Plastic Debris Recovered (kg)
              <input 
                type="number" 
                step="any" 
                value={wasteForm.plasticCollectedKg} 
                onChange={e => setWasteForm({ ...wasteForm, plasticCollectedKg: e.target.value })} 
                required 
              />
            </label>

            <label>
              Fuel / Oil Recovered (Litres)
              <input 
                type="number" 
                step="any" 
                value={wasteForm.oilRecoveredLitres} 
                onChange={e => setWasteForm({ ...wasteForm, oilRecoveredLitres: e.target.value })} 
                required 
              />
            </label>

            <label>
              Operation Status
              <select 
                value={wasteForm.status} 
                onChange={e => setWasteForm({ ...wasteForm, status: e.target.value })}
              >
                <option value="Planned">Planned</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </label>

            <div className="modal-actions span-2">
              <button type="button" className="secondary" onClick={() => setOpenLogModal(false)}>
                Cancel
              </button>
              <button className="primary" disabled={submitting}>
                {submitting ? 'Saving…' : '💾 Save Waste Data'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
