import mongoose from 'mongoose';

const cleanupActivitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  team: { type: String, required: true },
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'PollutionReport' },
  volunteers: { type: Number, default: 0, min: 0 },
  registeredVolunteers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    registeredAt: { type: Date, default: Date.now }
  }],
  wasteCollectedKg: { type: Number, default: 0, min: 0 },
  plasticCollectedKg: { type: Number, default: 0, min: 0 },
  oilRecoveredLitres: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ['Planned', 'Ongoing', 'Completed'], default: 'Planned' },
  summary: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('CleanupActivity', cleanupActivitySchema);
