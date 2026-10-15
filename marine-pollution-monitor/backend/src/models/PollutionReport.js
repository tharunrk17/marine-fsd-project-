import mongoose from 'mongoose';

const pollutionReportSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  source: { 
    type: String, 
    enum: ['Plastic', 'Industrial Discharge', 'Oil Spill', 'Other'], 
    required: true 
  },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Medium',
    required: true 
  },
  location: { type: String, required: true, trim: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Reported', 'Investigating', 'Cleanup Planned', 'Resolved'], 
    default: 'Reported' 
  },
  reportedAt: { type: Date, default: Date.now },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('PollutionReport', pollutionReportSchema);
