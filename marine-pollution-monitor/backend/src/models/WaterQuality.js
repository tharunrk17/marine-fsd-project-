import mongoose from 'mongoose';

const waterQualitySchema = new mongoose.Schema({
  station: { type: String, required: true },
  location: { type: String, required: true },
  measuredAt: { type: Date, default: Date.now },
  ph: { type: Number, required: true },
  dissolvedOxygen: { type: Number, required: true }, // in mg/L
  turbidity: { type: Number, required: true },        // in NTU
  temperature: { type: Number, required: true },      // in °C
  oilIndex: { type: Number, default: 0 },
  microplasticCount: { type: Number, default: 0 },
  qualityStatus: { type: String, enum: ['Good', 'Watch', 'Poor'], default: 'Good' },
  notes: { type: String, default: '' },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('WaterQuality', waterQualitySchema);
