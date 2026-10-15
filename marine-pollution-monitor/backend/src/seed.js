import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import PollutionReport from './models/PollutionReport.js';
import WaterQuality from './models/WaterQuality.js';
import CleanupActivity from './models/CleanupActivity.js';
import EnvironmentalIndicator from './models/EnvironmentalIndicator.js';

await connectDB();

// Clear collections for a fresh demonstration state
await Promise.all([
  User.deleteMany({}),
  PollutionReport.deleteMany({}),
  WaterQuality.deleteMany({}),
  CleanupActivity.deleteMany({}),
  EnvironmentalIndicator.deleteMany({})
]);

// 1. Create demo users for each of the 4 roles
const [admin, officer, ngo, citizen] = await Promise.all([
  User.create({
    name: 'Chief Admin Sarah',
    email: 'admin@marine.local',
    password: await bcrypt.hash('Admin@123', 10),
    role: 'admin'
  }),
  User.create({
    name: 'Officer Rajesh Kumar',
    email: 'officer@marine.local',
    password: await bcrypt.hash('Officer@123', 10),
    role: 'officer'
  }),
  User.create({
    name: 'CleanSeas NGO Lead',
    email: 'ngo@marine.local',
    password: await bcrypt.hash('Ngo@123', 10),
    role: 'ngo'
  }),
  User.create({
    name: 'Ananya Sharma (Citizen)',
    email: 'citizen@marine.local',
    password: await bcrypt.hash('Citizen@123', 10),
    role: 'citizen'
  })
]);

// 2. Create realistic pollution reports
const reports = await PollutionReport.insertMany([
  {
    title: 'Severe plastic debris buildup on intertidal sands',
    source: 'Plastic',
    severity: 'High',
    location: 'Marina Beach, Chennai',
    latitude: 13.0500,
    longitude: 80.2824,
    description: 'Post-monsoon accumulation of single-use bottles, packaging, and microplastic fragments along a 1.2km stretch.',
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80',
    status: 'Resolved',
    reportedBy: citizen._id,
    reportedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Industrial chemical outfall discoloration',
    source: 'Industrial Discharge',
    severity: 'High',
    location: 'Ennore Creek, North Chennai',
    latitude: 13.2146,
    longitude: 80.3210,
    description: 'Dark foamy discharge observed coming from factory drainage pipes with strong sulfuric odor.',
    imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=600&q=80',
    status: 'Investigating',
    reportedBy: citizen._id,
    reportedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Harbor oil slick from cargo vessel refueling',
    source: 'Oil Spill',
    severity: 'High',
    location: 'Chennai Port Outer Anchorage',
    latitude: 13.0982,
    longitude: 80.2976,
    description: 'Rainbow surface sheen and fuel smell spreading across a 400m radius near berth 4.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    status: 'Cleanup Planned',
    reportedBy: officer._id,
    reportedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Discarded nylon ghost nets entangling reef',
    source: 'Plastic',
    severity: 'Medium',
    location: 'Pulicat Lagoon Estuary',
    latitude: 13.4163,
    longitude: 80.3167,
    description: 'Abandoned commercial fishing nets trapped on rocky sandbars, hazardous to juvenile fish and crabs.',
    imageUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=600&q=80',
    status: 'Reported',
    reportedBy: citizen._id,
    reportedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Microplastic pellet washup along tourist shoreline',
    source: 'Plastic',
    severity: 'Low',
    location: 'Besant Nagar Elliot Beach',
    latitude: 12.9992,
    longitude: 80.2723,
    description: 'White industrial resin nurdles concentrated in wave drift line.',
    imageUrl: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=600&q=80',
    status: 'Investigating',
    reportedBy: citizen._id,
    reportedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Thermal boiler effluent entering coastal channel',
    source: 'Industrial Discharge',
    severity: 'Medium',
    location: 'Tuticorin Harbor Channel',
    latitude: 8.7642,
    longitude: 78.1348,
    description: 'Elevated water temperatures and localized fish distress observed near plant cooling outlet.',
    imageUrl: 'https://images.unsplash.com/photo-1569060139402-99128894bd96?auto=format&fit=crop&w=600&q=80',
    status: 'Reported',
    reportedBy: officer._id,
    reportedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
]);

// 3. Create Cleanup Drives linked to reports
await CleanupActivity.insertMany([
  {
    name: 'Operation Marina Ocean Restore',
    location: 'Marina Beach, Chennai',
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    team: 'CleanSeas Coastal Network',
    reportId: reports[0]._id,
    volunteers: 64,
    registeredVolunteers: [
      { user: citizen._id, registeredAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { user: officer._id, registeredAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) }
    ],
    wasteCollectedKg: 420,
    plasticCollectedKg: 310,
    oilRecoveredLitres: 15,
    status: 'Completed',
    summary: 'Mass mobilization with coastal college students. Sifted sand line and cleared all high-density plastic refuse.',
    createdBy: ngo._id
  },
  {
    name: 'Chennai Port Fuel Skim & Containment Drive',
    location: 'Chennai Port Anchorage',
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    team: 'Maritime Eco Volunteers & Port Trust',
    reportId: reports[2]._id,
    volunteers: 25,
    registeredVolunteers: [
      { user: citizen._id, registeredAt: new Date() }
    ],
    wasteCollectedKg: 120,
    plasticCollectedKg: 20,
    oilRecoveredLitres: 85,
    status: 'Planned',
    summary: 'Deploying absorbent booms and skimmers around anchorage to trap dispersing fuel oil.',
    createdBy: ngo._id
  },
  {
    name: 'Ennore Creek Mangrove Filter & Cleanup',
    location: 'Ennore Creek',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    team: 'Wetland Protection Taskforce',
    reportId: reports[1]._id,
    volunteers: 38,
    registeredVolunteers: [
      { user: citizen._id, registeredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) }
    ],
    wasteCollectedKg: 290,
    plasticCollectedKg: 180,
    oilRecoveredLitres: 42,
    status: 'Completed',
    summary: 'Removed toxic residue bags and trapped plastic from aerial mangrove roots.',
    createdBy: ngo._id
  }
]);

// 4. Create Water Quality measurements spanning 60 days
// Prior 30-60 days: Lower DO (average ~5.4 mg/L)
// Recent 0-30 days: Higher DO (average ~6.9 mg/L) => Trend will calculate as "Improving"!
const baseDate = Date.now();
const dayMs = 24 * 60 * 60 * 1000;

await WaterQuality.insertMany([
  // Prior period: 31-60 days ago
  {
    station: 'ST-01',
    location: 'Marina Beach South',
    measuredAt: new Date(baseDate - 55 * dayMs),
    ph: 7.7,
    dissolvedOxygen: 5.3,
    turbidity: 9.2,
    temperature: 29.8,
    oilIndex: 2.1,
    microplasticCount: 95,
    qualityStatus: 'Watch',
    notes: 'Low dissolved oxygen after urban stormwater runoff.',
    recordedBy: officer._id
  },
  {
    station: 'ST-02',
    location: 'Ennore Creek Channel',
    measuredAt: new Date(baseDate - 45 * dayMs),
    ph: 7.3,
    dissolvedOxygen: 4.8,
    turbidity: 18.5,
    temperature: 30.5,
    oilIndex: 8.4,
    microplasticCount: 160,
    qualityStatus: 'Poor',
    notes: 'Severe oxygen depletion and high turbidity from industrial effluents.',
    recordedBy: officer._id
  },
  {
    station: 'ST-03',
    location: 'Pulicat Lagoon Inlet',
    measuredAt: new Date(baseDate - 38 * dayMs),
    ph: 7.9,
    dissolvedOxygen: 5.8,
    turbidity: 7.1,
    temperature: 28.9,
    oilIndex: 1.5,
    microplasticCount: 65,
    qualityStatus: 'Watch',
    notes: 'Moderate water circulation.',
    recordedBy: officer._id
  },
  // Recent period: 0-30 days ago (Post cleanup and tide aeration)
  {
    station: 'ST-01',
    location: 'Marina Beach South',
    measuredAt: new Date(baseDate - 20 * dayMs),
    ph: 8.1,
    dissolvedOxygen: 6.6,
    turbidity: 5.4,
    temperature: 28.5,
    oilIndex: 1.1,
    microplasticCount: 52,
    qualityStatus: 'Good',
    notes: 'Dissolved oxygen improved markedly following beach cleanup drive.',
    recordedBy: officer._id
  },
  {
    station: 'ST-02',
    location: 'Ennore Creek Channel',
    measuredAt: new Date(baseDate - 12 * dayMs),
    ph: 7.6,
    dissolvedOxygen: 5.9,
    turbidity: 11.2,
    temperature: 29.4,
    oilIndex: 4.2,
    microplasticCount: 110,
    qualityStatus: 'Watch',
    notes: 'Effluent controls instituted; dissolved oxygen rising.',
    recordedBy: officer._id
  },
  {
    station: 'ST-03',
    location: 'Pulicat Lagoon Inlet',
    measuredAt: new Date(baseDate - 5 * dayMs),
    ph: 8.2,
    dissolvedOxygen: 7.3,
    turbidity: 3.8,
    temperature: 28.0,
    oilIndex: 0.8,
    microplasticCount: 38,
    qualityStatus: 'Good',
    notes: 'Healthy coastal water column with strong photosynthetic activity.',
    recordedBy: officer._id
  },
  {
    station: 'ST-04',
    location: 'Elliot Beach Coast',
    measuredAt: new Date(baseDate - 1 * dayMs),
    ph: 8.2,
    dissolvedOxygen: 7.1,
    turbidity: 4.1,
    temperature: 28.2,
    oilIndex: 0.6,
    microplasticCount: 41,
    qualityStatus: 'Good',
    notes: 'Clear waters and high oxygen levels.',
    recordedBy: officer._id
  }
]);

// 5. Create Environmental Indicators
await EnvironmentalIndicator.insertMany([
  {
    indicator: 'Dissolved Oxygen Health Index',
    category: 'Water',
    period: 'Current Month',
    value: 6.9,
    unit: 'mg/L',
    target: 6.5,
    trend: 'Improving',
    notes: '30-day average has crossed minimum marine standard (>6.0 mg/L).',
    recordedBy: officer._id
  },
  {
    indicator: 'Coastal Waste Removal Velocity',
    category: 'Cleanup',
    period: 'Current Month',
    value: 830,
    unit: 'kg',
    target: 1000,
    trend: 'Improving',
    notes: 'High volunteer turnout drove strong debris recovery.',
    recordedBy: ngo._id
  },
  {
    indicator: 'Turbidity Index',
    category: 'Water',
    period: 'Current Month',
    value: 6.1,
    unit: 'NTU',
    target: 5.0,
    trend: 'Improving',
    notes: 'Water clarity improved as industrial discharges subsided.',
    recordedBy: officer._id
  }
]);

console.log('----------------------------------------------------');
console.log('Seed completed successfully!');
console.log('Available Demo Accounts:');
console.log('1. Admin:   admin@marine.local   / Admin@123   (Role: admin)');
console.log('2. Officer: officer@marine.local / Officer@123 (Role: officer)');
console.log('3. NGO:     ngo@marine.local     / Ngo@123     (Role: ngo)');
console.log('4. Citizen: citizen@marine.local / Citizen@123 (Role: citizen)');
console.log('----------------------------------------------------');
process.exit(0);
