import mongoose from 'mongoose';

const cleanupActivitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  team: { type: String, required: true },
  volunteers: { type: Number, required: true, min: 0 },
  wasteCollectedKg: { type: Number, required: true, min: 0 },
  plasticCollectedKg: { type: Number, required: true, min: 0 },
  oilRecoveredLitres: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['Planned', 'Ongoing', 'Completed'], default: 'Planned' },
  summary: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('CleanupActivity', cleanupActivitySchema);
