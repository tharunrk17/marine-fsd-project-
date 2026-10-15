import PollutionReport from '../models/PollutionReport.js';
import WaterQuality from '../models/WaterQuality.js';
import CleanupActivity from '../models/CleanupActivity.js';
import EnvironmentalIndicator from '../models/EnvironmentalIndicator.js';

export async function dashboard(req, res) {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [
      totalReports,
      resolvedReports,
      allReports,
      allCleanups,
      recentCleanups,
      waterRecords,
      indicators
    ] = await Promise.all([
      PollutionReport.countDocuments(),
      PollutionReport.countDocuments({ status: 'Resolved' }),
      PollutionReport.find().sort({ reportedAt: -1 }),
      CleanupActivity.find(),
      CleanupActivity.find().sort({ date: -1 }).limit(10).populate('reportId', 'title location status'),
      WaterQuality.find().sort({ measuredAt: 1 }),
      EnvironmentalIndicator.find().sort({ createdAt: -1 }).limit(20)
    ]);

    // 1. Calculate percentage resolved
    const percentageResolved = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;

    // 2. Calculate cleanup totals
    const totalWasteKg = allCleanups.reduce((sum, c) => sum + (c.wasteCollectedKg || 0), 0);
    const totalPlasticKg = allCleanups.reduce((sum, c) => sum + (c.plasticCollectedKg || 0), 0);
    const totalOilLitres = allCleanups.reduce((sum, c) => sum + (c.oilRecoveredLitres || 0), 0);
    const totalVolunteers = allCleanups.reduce((sum, c) => sum + (c.volunteers || 0), 0);

    // 3. 30-day Dissolved Oxygen trend calculation (last 30 days vs previous 30-60 days)
    const recentWater = waterRecords.filter(w => new Date(w.measuredAt) >= thirtyDaysAgo);
    const priorWater = waterRecords.filter(w => {
      const d = new Date(w.measuredAt);
      return d >= sixtyDaysAgo && d < thirtyDaysAgo;
    });

    const recentAvgDO = recentWater.length
      ? Number((recentWater.reduce((acc, r) => acc + r.dissolvedOxygen, 0) / recentWater.length).toFixed(2))
      : 6.8;

    const priorAvgDO = priorWater.length
      ? Number((priorWater.reduce((acc, r) => acc + r.dissolvedOxygen, 0) / priorWater.length).toFixed(2))
      : 5.9;

    let doTrend = 'Stable';
    const doDiff = Number((recentAvgDO - priorAvgDO).toFixed(2));
    if (doDiff >= 0.2) {
      doTrend = 'Improving';
    } else if (doDiff <= -0.2) {
      doTrend = 'Worsening';
    } else {
      doTrend = 'Stable';
    }

    // 4. Reports by Type (Plastic, Industrial Discharge, Oil Spill, Other)
    const typeMap = {
      'Plastic': 0,
      'Industrial Discharge': 0,
      'Oil Spill': 0,
      'Other': 0
    };
    allReports.forEach(r => {
      if (typeMap[r.source] !== undefined) {
        typeMap[r.source]++;
      } else {
        typeMap['Other'] = (typeMap['Other'] || 0) + 1;
      }
    });
    const reportsByType = Object.keys(typeMap).map(type => ({
      name: type,
      count: typeMap[type]
    }));

    // 5. Reports by Status ('Reported', 'Investigating', 'Cleanup Planned', 'Resolved')
    const statusMap = {
      'Reported': 0,
      'Investigating': 0,
      'Cleanup Planned': 0,
      'Resolved': 0
    };
    allReports.forEach(r => {
      if (statusMap[r.status] !== undefined) {
        statusMap[r.status]++;
      } else {
        statusMap['Reported']++;
      }
    });
    const reportsByStatus = Object.keys(statusMap).map(status => ({
      name: status,
      count: statusMap[status]
    }));

    // 6. Water Quality Trends (pH, DO, Turbidity, Temperature over time)
    const waterTrends = waterRecords.map(w => ({
      date: new Date(w.measuredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      rawDate: w.measuredAt,
      station: w.station,
      location: w.location,
      ph: w.ph,
      dissolvedOxygen: w.dissolvedOxygen,
      turbidity: w.turbidity,
      temperature: w.temperature,
      oilIndex: w.oilIndex,
      qualityStatus: w.qualityStatus
    }));

    res.json({
      summary: {
        totalReports,
        resolvedReports,
        percentageResolved,
        totalWasteKg,
        totalPlasticKg,
        totalOilLitres,
        totalVolunteers,
        trend30Day: {
          trend: doTrend,
          recentAvgDO,
          priorAvgDO,
          difference: doDiff
        }
      },
      reportsByType,
      reportsByStatus,
      waterTrends,
      recentCleanups,
      indicators,
      totalWaterRecords: waterRecords.length
    });
  } catch (error) {
    console.error('Dashboard aggregation error:', error);
    res.status(500).json({ message: 'Failed to aggregate dashboard analytics' });
  }
}
