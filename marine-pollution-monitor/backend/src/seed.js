import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import PollutionReport from './models/PollutionReport.js';
import WaterQuality from './models/WaterQuality.js';
import CleanupActivity from './models/CleanupActivity.js';
import EnvironmentalIndicator from './models/EnvironmentalIndicator.js';

await connectDB();
await Promise.all([PollutionReport.deleteMany({}), WaterQuality.deleteMany({}), CleanupActivity.deleteMany({}), EnvironmentalIndicator.deleteMany({})]);
let admin = await User.findOne({ email: 'admin@marine.local' });
if (!admin) admin = await User.create({ name: 'Marine Admin', email: 'admin@marine.local', password: await bcrypt.hash('Admin@123', 10), role: 'admin' });
const researcher = await User.findOneAndUpdate({ email: 'researcher@marine.local' }, { name: 'Dr. Asha', email: 'researcher@marine.local', password: await bcrypt.hash('Research@123', 10), role: 'researcher' }, { upsert: true, new: true });

await PollutionReport.insertMany([
  { title: 'Beach plastic accumulation', source: 'Plastic', severity: 'High', location: 'Marina Beach, Chennai', latitude: 13.0500, longitude: 80.2824, description: 'Post-monsoon plastic debris along the intertidal zone.', status: 'Investigating', reportedBy: researcher._id },
  { title: 'Outfall discoloration', source: 'Industrial Discharge', severity: 'Critical', location: 'Ennore Creek', latitude: 13.2146, longitude: 80.3210, description: 'Suspended solids and unusual discoloration observed near an industrial outfall.', status: 'Contained', reportedBy: admin._id },
  { title: 'Harbor sheen', source: 'Oil Spill', severity: 'Medium', location: 'Chennai Port', latitude: 13.0982, longitude: 80.2976, description: 'Thin surface sheen detected during morning patrol.', status: 'Resolved', reportedBy: researcher._id },
  { title: 'Fishing-net litter', source: 'Plastic', severity: 'Medium', location: 'Pulicat Lake', latitude: 13.4163, longitude: 80.3167, description: 'Discarded fishing nets and packaging in shoreline vegetation.', status: 'Reported', reportedBy: researcher._id }
]);

await WaterQuality.insertMany([
  { station: 'ST-01', location: 'Marina', measuredAt: new Date('2026-08-01'), ph: 8.1, dissolvedOxygen: 6.8, turbidity: 4.2, oilIndex: 1.2, microplasticCount: 72, temperature: 28.6, qualityStatus: 'Good', notes: 'Stable conditions', recordedBy: researcher._id },
  { station: 'ST-02', location: 'Ennore Creek', measuredAt: new Date('2026-08-08'), ph: 7.5, dissolvedOxygen: 3.8, turbidity: 16.4, oilIndex: 9.1, microplasticCount: 188, temperature: 30.1, qualityStatus: 'Poor', notes: 'High turbidity and oil index', recordedBy: researcher._id },
  { station: 'ST-03', location: 'Pulicat', measuredAt: new Date('2026-08-15'), ph: 7.9, dissolvedOxygen: 5.7, turbidity: 8.3, oilIndex: 3.8, microplasticCount: 104, temperature: 29.1, qualityStatus: 'Watch', notes: 'Microplastic count requires monitoring', recordedBy: admin._id }
]);

await CleanupActivity.insertMany([
  { name: 'Marina Coastal Sweep', location: 'Marina Beach', date: new Date('2026-07-28'), team: 'EEC Eco Club', volunteers: 46, wasteCollectedKg: 318, plasticCollectedKg: 246, oilRecoveredLitres: 12, status: 'Completed', summary: 'Segregated plastic, fishing line and mixed litter.', createdBy: admin._id },
  { name: 'Ennore Mangrove Recovery', location: 'Ennore Creek', date: new Date('2026-08-10'), team: 'Blue Shore Volunteers', volunteers: 28, wasteCollectedKg: 184, plasticCollectedKg: 101, oilRecoveredLitres: 38, status: 'Completed', summary: 'Removed contaminated debris around mangroves.', createdBy: researcher._id },
  { name: 'Pulicat Shoreline Drive', location: 'Pulicat Lake', date: new Date('2026-08-27'), team: 'Student Research Cell', volunteers: 35, wasteCollectedKg: 220, plasticCollectedKg: 152, oilRecoveredLitres: 4, status: 'Planned', summary: 'Next scheduled monthly cleanup.', createdBy: researcher._id }
]);

await EnvironmentalIndicator.insertMany([
  { indicator: 'Coastal water quality score', category: 'Water', period: '2026-Q2', value: 76, unit: '%', target: 90, trend: 'Improving', notes: 'Driven by recovery at Marina station.', recordedBy: admin._id },
  { indicator: 'Marine plastic load', category: 'Pollution', period: '2026-Q2', value: 38, unit: 'kg/km', target: 20, trend: 'Worsening', notes: 'Seasonal increase near urban shorelines.', recordedBy: researcher._id },
  { indicator: 'Cleanup recovery rate', category: 'Cleanup', period: '2026-Q2', value: 64, unit: '%', target: 75, trend: 'Improving', notes: 'Better segregation during recent drives.', recordedBy: researcher._id },
  { indicator: 'Biodiversity observation index', category: 'Biodiversity', period: '2026-Q2', value: 81, unit: 'index', target: 85, trend: 'Stable', notes: 'Intertidal indicator species remained stable.', recordedBy: researcher._id }
]);

console.log('Seed complete. Admin: admin@marine.local / Admin@123');
process.exit(0);
