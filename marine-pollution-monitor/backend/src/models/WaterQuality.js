import mongoose from 'mongoose';

const waterQualitySchema = new mongoose.Schema({
  station: { type: String, required: true },
  location: { type: String, required: true },
  measuredAt: { type: Date, default: Date.now },
  ph: { type: Number, required: true },
  dissolvedOxygen: { type: Number, required: true },
  turbidity: { type: Number, required: true },
  oilIndex: { type: Number, required: true },
  microplasticCount: { type: Number, required: true },
  temperature: { type: Number, required: true },
  qualityStatus: { type: String, enum: ['Good', 'Watch', 'Poor'], required: true },
  notes: { type: String, default: '' },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('WaterQuality', waterQualitySchema);
