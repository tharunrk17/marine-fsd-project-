import mongoose from 'mongoose';

const pollutionReportSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  source: { type: String, enum: ['Plastic', 'Industrial Discharge', 'Oil Spill', 'Other'], required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
  location: { type: String, required: true, trim: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Reported', 'Investigating', 'Contained', 'Resolved'], default: 'Reported' },
  reportedAt: { type: Date, default: Date.now },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('PollutionReport', pollutionReportSchema);
