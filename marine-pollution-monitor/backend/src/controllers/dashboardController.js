import PollutionReport from '../models/PollutionReport.js';
import WaterQuality from '../models/WaterQuality.js';
import CleanupActivity from '../models/CleanupActivity.js';
import EnvironmentalIndicator from '../models/EnvironmentalIndicator.js';

export async function dashboard(req, res) {
  const [reports, water, cleanup, indicators] = await Promise.all([
    PollutionReport.countDocuments(),
    WaterQuality.find().sort({ measuredAt: -1 }).limit(12),
    CleanupActivity.find().sort({ date: -1 }).limit(12),
    EnvironmentalIndicator.find().sort({ createdAt: -1 }).limit(24)
  ]);
  const bySource = await PollutionReport.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
  const bySeverity = await PollutionReport.aggregate([{ $group: { _id: '$severity', count: { $sum: 1 } } }]);
  const cleanupTotals = await CleanupActivity.aggregate([{ $group: { _id: null, waste: { $sum: '$wasteCollectedKg' }, plastic: { $sum: '$plasticCollectedKg' }, oil: { $sum: '$oilRecoveredLitres' }, volunteers: { $sum: '$volunteers' } } }]);
  const qualityScore = water.length ? Math.round(water.reduce((s, x) => s + (x.qualityStatus === 'Good' ? 100 : x.qualityStatus === 'Watch' ? 70 : 40), 0) / water.length) : 0;
  res.json({ stats: { reports, waterRecords: await WaterQuality.countDocuments(), cleanupActivities: await CleanupActivity.countDocuments(), qualityScore, ...({ cleanupTotals: cleanupTotals[0] || { waste: 0, plastic: 0, oil: 0, volunteers: 0 } }) }, bySource, bySeverity, water, cleanup, indicators });
}
