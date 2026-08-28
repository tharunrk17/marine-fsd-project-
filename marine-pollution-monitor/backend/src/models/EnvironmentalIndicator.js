import mongoose from 'mongoose';

const indicatorSchema = new mongoose.Schema({
  indicator: { type: String, required: true },
  category: { type: String, enum: ['Biodiversity', 'Water', 'Pollution', 'Cleanup'], required: true },
  period: { type: String, required: true },
  value: { type: Number, required: true },
  unit: { type: String, required: true },
  target: { type: Number, default: 0 },
  trend: { type: String, enum: ['Improving', 'Stable', 'Worsening'], required: true },
  notes: { type: String, default: '' },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('EnvironmentalIndicator', indicatorSchema);
