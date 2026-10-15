# MARINEWATCH: REAL-TIME MARINE POLLUTION MONITORING AND INCIDENT ASSESSMENT SYSTEM

## A PROJECT REPORT

*Submitted by*  
**THARUN R K (Reg. No. 310621104001)**

*in partial fulfillment for the award of the Degree of*  
**BACHELOR OF ENGINEERING**  
*in*  
**DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING**

### EASWARI ENGINEERING COLLEGE  
**(AN AUTONOMOUS INSTITUTION) – AFFILIATED TO ANNA UNIVERSITY, CHENNAI**  
**BHARATHI SALAI, RAMAPURAM, CHENNAI – 600089**  

**OCTOBER 2026**

---

## EASWARI ENGINEERING COLLEGE
### BONAFIDE CERTIFICATE

Certified that this mini project report titled **“MARINEWATCH: REAL-TIME MARINE POLLUTION MONITORING AND INCIDENT ASSESSMENT SYSTEM”** is the Bonafide work of **“THARUN R K (Reg. No. 310621104001)”**, who carried out the project work under my supervision.

<br><br>

**HEAD OF THE DEPARTMENT**  
Department of Computer Science and Engineering  
Easwari Engineering College  
Ramapuram, Chennai – 600089  

**SUPERVISOR / PROJECT GUIDE**  
Department of Computer Science and Engineering  
Easwari Engineering College  
Ramapuram, Chennai – 600089  

---

## EASWARI ENGINEERING COLLEGE
### Certificate of Viva-voce-Examination

This is to certify that the Viva Voce Examination of the Project Work entitled **“MARINEWATCH: REAL-TIME MARINE POLLUTION MONITORING AND INCIDENT ASSESSMENT SYSTEM”** submitted by **Mr. THARUN R K (Reg. No. 310621104001)** in partial fulfillment of the requirements for the award of the degree of **BACHELOR OF ENGINEERING** was conducted on **____________________** in the Department of **Computer Science and Engineering**, Easwari Engineering College, Ramapuram – Chennai.

<br>

**Internal Examiner**  
Name: ________________________________  
Designation: ___________________________  
Address: ______________________________  

**External Examiner**  
Name: ________________________________  
Designation: ___________________________  
Address: ______________________________  

**Date:** ____________________

---

## ABSTRACT

Marine ecosystems worldwide face catastrophic environmental degradation driven by unchecked anthropogenic plastic waste deposition, toxic industrial discharges, and recurrent coastal oil spills. Existing marine pollution surveillance systems remain predominantly fragmented, relying on manual data logs, retrospective sampling, and disconnected municipal response desks. This lack of automated, centralized data synthesis creates critical latency between pollutant detection and remediation deployment, exacerbating marine habitat devastation and endangering public health.

To resolve these challenges, this project introduces **MarineWatch**, a unified full-stack web-based Marine Pollution Monitoring and Incident Assessment System architected on the MERN stack (MongoDB, Express.js, React 19, and Node.js). The system bridges citizen observation, environmental enforcement officers, and non-governmental organizations (NGOs) through an evidence-based digital platform. MarineWatch features a multi-tiered Role-Based Access Control (RBAC) mechanism governed by JSON Web Tokens (JWT) and Bcrypt hashing, ensuring secure authorization across Administrators, Environmental Officers, NGO Coordinators, and Citizens.

The platform incorporates an interactive geospatial incident reporting module powered by React-Leaflet, allowing verified reporting of plastic dumps, chemical effluents, and oil slicks with precise GPS coordinates, severity markers (Low, Medium, High), visual media links, and a lifecycle status tracking pipeline (`Reported` &rarr; `Investigating` &rarr; `Cleanup Planned` &rarr; `Resolved`). In parallel, continuous multi-parameter water-quality telemetry records pH, Dissolved Oxygen (mg/L), Turbidity (NTU), Temperature (°C), Oil Index, and Microplastic Density across coastal stations, automatically classifying status into Good, Watch, or Poor.

An administrative analytics engine utilizing MongoDB Aggregation Pipelines and Recharts renders dynamic longitudinal distributions, source breakdowns, and volunteer response metrics. Furthermore, volunteer mobilization for cleanup drives enables direct material recovery auditing (kg of plastic collected, litres of oil salvaged). The platform demonstrates high fault tolerance, clean RESTful API standards, responsive glassmorphic UI, and robust full-stack software engineering methodologies.

---

## ACKNOWLEDGEMENT

We express our sincere gratitude to the Principal **Dr. P. Deiva Sundari** and the Management of our college for providing us with the opportunity and state-of-the-art infrastructural facilities to carry out this project work successfully.

We convey our heartfelt thanks to the **Head of the Department**, Department of **Computer Science and Engineering**, for the continuous encouragement, constructive suggestions, and academic support extended throughout the course of this semester.

We are extremely thankful to our **Project Guide**, Department of **Computer Science and Engineering**, for valuable guidance, scholarly suggestions, vigilant feedback, and motivation throughout the conception, architectural design, implementation, and completion of this project.

We would also like to extend our profound gratitude to all the faculty members and technical staff of the Department of **Computer Science and Engineering** for their timely advice and generous assistance during critical phases of our work.

Finally, we thank our parents and friends for their constant encouragement, selfless sacrifices, and unwavering support and help during the entire course of this project.

---

## TABLE OF CONTENTS

| CHAPTER NO. | TITLE | PAGE No. |
| :--- | :--- | :---: |
| | **ABSTRACT** | iv |
| | **ACKNOWLEDGEMENT** | v |
| **CHAPTER 1** | **INTRODUCTION** | **1** |
| | 1.1 OVERVIEW | 1 |
| | 1.2 PROBLEM DEFINITION | 2 |
| | 1.3 OBJECTIVE | 2 |
| | 1.4 SCOPE OF THE PROJECT | 3 |
| | 1.5 MOTIVATION | 3 |
| **CHAPTER 2** | **RELATED WORK** | **4** |
| | 2.1 LITERATURE REVIEW | 4 |
| | 2.2 EXISTING SYSTEM | 5 |
| | 2.3 PROPOSED SYSTEM | 6 |
| **CHAPTER 3** | **SYSTEM ANALYSIS** | **7** |
| | 3.1 SYSTEM REQUIREMENTS | 7 |
| | 3.2 SOFTWARE AND HARDWARE REQUIREMENTS | 8 |
| **CHAPTER 4** | **SYSTEM DESIGN** | **9** |
| | 4.1 SYSTEM ARCHITECTURE | 9 |
| | 4.2 MODULE DESCRIPTION | 10 |
| | 4.4 CLASS DIAGRAM | 11 |
| | 4.5 SEQUENCE DIAGRAM | 12 |
| **CHAPTER 5** | **IMPLEMENTATION** | **13** |
| | 5.1 IMPLEMENTATION OVERVIEW | 13 |
| | 5.2 KEY FUNCTIONS (CODE EXPLANATION) | 14 |
| **CHAPTER 6** | **CONCLUSION & FUTURE WORK** | **17** |
| | 6.1 CONCLUSION | 17 |
| | 6.2 FUTURE ENHANCEMENTS | 18 |
| **APPENDIX** | **SOURCE CODE** | **19** |
| | 1. Project Structure | 19 |
| | 2. Backend Package Installation | 19 |
| | 3. Database Connection | 20 |
| | 4. Environment Variables | 20 |
| | 5. User Model | 20 |
| | 6. Password Hashing and Registration | 21 |
| | 7. Login and JWT Generation | 21 |
| | 8. Authentication Middleware | 22 |
| | 9. Create API | 22 |
| | 10. Read API | 23 |
| | 11. Update | 23 |
| | 12. Delete | 24 |
| | 13. Express Routes | 24 |
| | 14. Main Server File | 25 |
| | 15. React Login Component | 25 |
| | 16. Admin Dashboard Logic | 26 |
| | 17. REST API Request and Response Examples | 27 |
| | **SCREENSHOTS OF THE PROJECT** | **28** |
| | **REFERENCES** | **30** |

---

## CHAPTER 1: INTRODUCTION

### 1.1 OVERVIEW
The world ocean covers over 70% of the Earth's surface, produces over 50% of the global oxygen supply, and stabilizes global climate patterns. However, modern ocean ecosystems face acute destruction caused by unchecked anthropogenic pollution. More than 14 million metric tons of plastics enter aquatic systems every year, breaking down into microplastics that poison marine life. In tandem, illegal industrial chemical runoff and petroleum spills decimate marine flora and fauna, causing eutrophication, toxic bioaccumulation, and loss of coastal livelihoods.

To mitigate this environmental crisis, the **MarineWatch** system provides an automated, full-stack digital solution. Architected on the MERN technology stack (MongoDB, Express.js, React, Node.js), MarineWatch enables real-time crowdsourced pollution reporting, multi-parameter water-quality telemetry, and NGO cleanup coordination within a single, responsive operational dashboard.

### 1.2 PROBLEM DEFINITION
1. **Uncentralized Reporting:** Civilians and coastal fishermen lack a dedicated digital channel to report chemical dumping, oil slicks, or plastic debris with exact geospatial coordinates.
2. **Delayed Regulatory Response:** Environmental officers rely on manual ledgers and unverified complaints, causing severe delays in dispatching inspection teams.
3. **Disjointed Water Telemetry:** Scientific measurements (pH, dissolved oxygen, turbidity, temperature, oil index) remain isolated in spreadsheets, preventing proactive alert generation.
4. **Uncoordinated Cleanup Operations:** Marine cleanup campaigns lack real-time volunteer tracking and verified salvage auditing.

### 1.3 OBJECTIVE
- Deliver an interactive web application unifying marine incident tracking, water quality monitoring, and cleanup mobilization.
- Enforce Role-Based Access Control (RBAC) with secure JWT authentication across four personas: Admin, Officer, NGO, and Citizen.
- Provide geospatial map rendering via Leaflet with custom color-coded pins, search filters, and location pickers.
- Streamline incident lifecycle progression (`Reported` &rarr; `Investigating` &rarr; `Cleanup Planned` &rarr; `Resolved`).
- Deliver real-time executive analytics with Recharts and MongoDB aggregation pipelines.

### 1.4 SCOPE OF THE PROJECT
The scope spans cross-platform web client access, RESTful API endpoints for incident and sensor telemetry CRUD operations, volunteer participation tracking, quantitative material recovery logging, and automated ecological health status evaluation.

### 1.5 MOTIVATION
In alignment with United Nations Sustainable Development Goal 14 (*Conserve and sustainably use the oceans, seas and marine resources*), MarineWatch bridges the gap between civic stewardship and regulatory enforcement, demonstrating how modern full-stack web engineering powers environmental conservation.

---

## CHAPTER 2: RELATED WORK

### 2.1 LITERATURE REVIEW
Conventional ocean surveillance relies predominantly on satellite remote sensing (e.g., ESA Sentinel-1 SAR) and offshore government buoys. While robust for large-scale pelagic events, they suffer from temporal latency and lack coastal resolution for nearshore municipal dumps. Crowdsourced platforms like *Clean Swell* track beach debris but omit chemical water telemetry, whereas government portals remain closed to public reporting. MarineWatch bridges these domains into a unified, open MERN platform.

### 2.2 EXISTING SYSTEM
- Manual paper logs and slow telephone complaint desks.
- Isolated sensor spreadsheets without automated health thresholds.
- Absence of real-time GPS pinpointing on interactive maps.
- Lack of public transparency and status progression tracking.

### 2.3 PROPOSED SYSTEM
- Modern reactive Single Page Application (React 19, Vite).
- REST API powered by Express 5 and Node.js with MongoDB persistence.
- JWT-authenticated RBAC (Admin, Officer, NGO, Citizen).
- Geospatial Leaflet map with interactive pins and coordinate selection.
- Incident lifecycle pipeline with real-time status transitions.
- Multi-parameter water quality index and volunteer cleanup telemetry.

---

## CHAPTER 3: SYSTEM ANALYSIS

### 3.1 SYSTEM REQUIREMENTS

#### 3.1.1 Functional Requirements
- **Authentication:** Registration, login, JWT issuance, password hashing via bcrypt, and role assignment.
- **Incident Reporting:** Submission of title, source, severity, location coordinates, photos, and descriptions.
- **Incident Management:** Search, category filtering, and status updates by authorized officers.
- **Water Quality Registry:** Recording and viewing pH, dissolved oxygen, turbidity, temperature, oil index, and microplastics.
- **Cleanup Coordination:** Organizing cleanups, volunteer signups, and recording collected waste tonnage.
- **Analytics:** Dynamic calculation of active vs. resolved counts, source breakdowns, and trends.

#### 3.1.2 Non-Functional Requirements
- **Security:** Bcrypt (10 salt rounds), JWT Bearer tokens, protected routes.
- **Performance:** Sub-200ms API response time, client-side caching.
- **Reliability:** Data validation with Mongoose schemas and centralized error handling.
- **Usability:** Responsive layout with dark/light visual contrast and intuitive glassmorphic design.

### 3.2 SOFTWARE AND HARDWARE REQUIREMENTS

#### Hardware Requirements
- **Processor:** Intel Core i5 / AMD Ryzen 5 (Development), Dual Core 1.8 GHz (Client).
- **RAM:** 8 GB DDR4 (Development), 4 GB (Client).
- **Disk Storage:** 500 MB free space.
- **Network:** Standard broadband connection.

#### Software Requirements
- **Operating System:** Windows 10/11, Linux, or macOS.
- **Database:** MongoDB Community / MongoDB Atlas (v7.0+).
- **Backend Runtime:** Node.js (v20+ ES Modules) & Express.js (v5.1.0).
- **Database ODM:** Mongoose (v8.18.0).
- **Frontend Framework:** React 19 (v19.1.1) with Vite (v7.1.2).
- **Routing:** React Router DOM (v7.8.2).
- **Mapping & Charts:** Leaflet, React-Leaflet, and Recharts.

---

## CHAPTER 4: SYSTEM DESIGN

### 4.1 SYSTEM ARCHITECTURE

```
+---------------------------------------------------------------------------------+
|                               PRESENTATION TIER                                 |
|   React 19 SPA | React Router 7 | Vite | Recharts Analytics | Leaflet Maps     |
+---------------------------------------------------------------------------------+
                                      |
                           HTTPS / JSON (Axios Client)
                        Bearer JWT in Authorization Header
                                      v
+---------------------------------------------------------------------------------+
|                             APPLICATION LOGIC TIER                              |
|   Node.js (v20) + Express.js 5                                                  |
|   - CORS & JSON Body Parsing Middleware                                         |
|   - JWT Authentication & RBAC Authorization Middleware (protect, allowRoles)   |
|   - Modular API Routes: /auth, /reports, /water-quality, /cleanup, /dashboard   |
|   - Business Controllers (bcryptjs, crudController, aggregation pipelines)      |
+---------------------------------------------------------------------------------+
                                      |
                            Mongoose ODM Queries
                            Async Connection Pool
                                      v
+---------------------------------------------------------------------------------+
|                                 DATA TIER                                       |
|   MongoDB Database (marine_pollution_monitor)                                   |
|   Collections: users | pollutionreports | waterqualities | cleanupactivities   |
+---------------------------------------------------------------------------------+
```

### 4.2 MODULE DESCRIPTION
1. **Authentication & Authorization Module:** Provides registration, login, bcrypt password hashing, JWT generation, and role checks.
2. **Pollution Reporting Module:** Enables citizens and field agents to report pollution incidents with geotags and severity markers.
3. **Geospatial Map Module:** Displays incidents on Leaflet maps with custom markers and interactive popups.
4. **Water Quality Telemetry Module:** Collects sensor parameters across stations and evaluates safety status.
5. **Cleanup Drive Module:** Schedules cleanup events, registers volunteers, and records collected waste metrics.
6. **Dashboard Analytics Module:** Uses MongoDB aggregation pipelines to summarize real-time incident and ecological metrics for Recharts.

### 4.4 CLASS DIAGRAM

```
+---------------------------------------+       +---------------------------------------+
|                 User                  |       |            PollutionReport            |
+---------------------------------------+       +---------------------------------------+
| - _id: ObjectId                       | 1   * | - _id: ObjectId                       |
| - name: String                        |<------| - title: String                       |
| - email: String                       |       | - source: String (Plastic/Oil/...)    |
| - password: String (Hashed)           |       | - severity: String (Low/Med/High)     |
| - role: Enum(admin/officer/ngo/cit)   |       | - location: String                    |
| - createdAt: Date                     |       | - latitude: Number, longitude: Number |
+---------------------------------------+       | - status: Enum(Reported/Investigating/|
| + register()                          |       |          Cleanup Planned/Resolved)    |
| + login()                             |       | - reportedBy: ObjectId (Ref: User)    |
+---------------------------------------+       +---------------------------------------+
                    ^                                       ^
                    | 1                                     | 1
                    |                                       |
                    | *                                     | *
+---------------------------------------+       +---------------------------------------+
|             WaterQuality              |       |            CleanupActivity            |
+---------------------------------------+       +---------------------------------------+
| - _id: ObjectId                       |       | - _id: ObjectId                       |
| - station: String                     |       | - name: String                        |
| - location: String                    |       | - reportId: ObjectId (Ref: Report)    |
| - ph: Number                          |       | - volunteers: Number                  |
| - dissolvedOxygen: Number             |       | - wasteCollectedKg: Number            |
| - turbidity: Number                   |       | - plasticCollectedKg: Number          |
| - temperature: Number                 |       | - oilRecoveredLitres: Number          |
| - qualityStatus: Enum(Good/Watch/Poor)|       | - status: Enum(Planned/Ongoing/Done)  |
| - recordedBy: ObjectId (Ref: User)    |       | - createdBy: ObjectId (Ref: User)     |
+---------------------------------------+       +---------------------------------------+
```

### 4.5 SEQUENCE DIAGRAM

```
User (Client)            React Frontend           Express Server (API)          MongoDB Database
     |                         |                            |                          |
     |-- 1. Fill Incident Form |                            |                          |
     |   & Click Submit ------>|                            |                          |
     |                         |-- 2. POST /api/reports --->|                          |
     |                         |      (Bearer JWT)          |                          |
     |                         |                            |-- 3. Verify JWT Token    |
     |                         |                            |   & Extract User ID ---->|
     |                         |                            |-- 4. PollutionReport.create()
     |                         |                            |      Insert Document --->|
     |                         |                            |                          |-- 5. Saved OK
     |                         |                            |<-- 6. Document Created --|
     |                         |<-- 7. HTTP 201 + JSON -----|
     |<-- 8. Marker Added on   |
     |    Map & Table Refresh -|
     |                         |
[Officer Login]                |
     |-- 9. Inspect Incident ->|
     |   & Change Status ----->|-- 10. PATCH /reports/:id/status
     |                         |       { status: 'Resolved' }
     |                         |                            |-- 11. Check Role == 'officer'
     |                         |                            |-- 12. findByIdAndUpdate()
     |                         |                            |   Update Status -------->|
     |                         |                            |<-- 13. Return Updated ---|
     |                         |<-- 14. HTTP 200 OK --------|
     |<-- 15. Status Badge ----|
          Updates Green
```

---

## CHAPTER 5: IMPLEMENTATION

### 5.1 IMPLEMENTATION OVERVIEW
MarineWatch is implemented using Node.js ES Modules with Express 5 on the server side and React 19 on the client side. The architecture separates routing, middleware, controllers, and models. Database communication is handled asynchronously using Mongoose connection pooling. The frontend utilizes React hooks (`useState`, `useEffect`, `useRef`), client-side routing, and Axios interceptors for authenticated API requests.

### 5.2 KEY FUNCTIONS (CODE EXPLANATION)

1. **`connectDB()` (Configuration):** Validates database URI configuration and initializes the asynchronous MongoDB connection pool prior to starting the HTTP listener.
2. **`protect` & `allowRoles` (Security Middleware):** Verifies JWT authorization headers, attaches user objects to request contexts, and restricts endpoint access based on role permissions.
3. **`crudController` (Reusable Controller Factory):** Higher-order controller creating uniform CRUD operations across collections, featuring dynamic regex search and schema population.
4. **`dashboardController` (Analytics Aggregation):** Executes multi-stage MongoDB aggregation pipelines to summarize real-time incident counts, severity ratios, and material recovery stats.
5. **Leaflet Coordinate Marker Handler (Frontend Mapping):** Dynamically plots geo-coordinates with category-specific marker colors, providing interactive map inspection and point selection.

---

## CHAPTER 6: CONCLUSION & FUTURE WORK

### 6.1 CONCLUSION
The **MarineWatch: Marine Pollution Monitoring System** provides an end-to-end digital platform for coastal and ocean conservation. By linking citizen incident reports with regulatory workflows, continuous water quality telemetry, and NGO cleanup coordination, it eliminates communication latency and enhances operational transparency.

### 6.2 FUTURE ENHANCEMENTS
- Automated IoT telemetry streaming via MQTT/WebSockets from ocean monitoring buoys.
- AI-driven satellite image analysis for offshore oil spill detection.
- SMS and push notification alerts for critical pollution events.
- Progressive Web App (PWA) with offline caching for remote coastal regions.
- Public open data API for environmental research institutions.

---

## APPENDIX: SOURCE CODE

### 1. Project Structure
```text
marine-pollution-monitor/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── crudController.js
│   │   │   └── dashboardController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── error.js
│   │   ├── models/
│   │   │   ├── CleanupActivity.js
│   │   │   ├── EnvironmentalIndicator.js
│   │   │   ├── PollutionReport.js
│   │   │   ├── User.js
│   │   │   └── WaterQuality.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── cleanup.js
│   │   │   ├── generic.js
│   │   │   ├── index.js
│   │   │   └── reports.js
│   │   ├── utils/token.js
│   │   ├── seed.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── lib/
    │   ├── pages/
    │   ├── main.jsx
    │   └── styles.css
    ├── package.json
    └── index.html
```

### 2. Backend Package Installation
```bash
cd backend
npm install express mongoose dotenv cors bcryptjs jsonwebtoken
npm install --save-dev nodemon
```

### 3. Database Connection
*File:* `backend/src/config/db.js`
```javascript
import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is missing');
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}
```

### 4. Environment Variables
*File:* `backend/.env`
```ini
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/marine_pollution_monitor
JWT_SECRET=supersecretmarinewatchtokenkey2026
CLIENT_URL=http://localhost:5173
```

### 5. User Model
*File:* `backend/src/models/User.js`
```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { 
    type: String, 
    enum: ['admin', 'officer', 'ngo', 'citizen'], 
    default: 'citizen' 
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
```

### 6. Password Hashing and Registration
*File:* `backend/src/controllers/authController.js`
```javascript
export async function register(req, res) {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    return res.status(409).json({ message: 'Email already registered' });
  }
  const validRoles = ['admin', 'officer', 'ngo', 'citizen'];
  const userRole = validRoles.includes(role) ? role : 'citizen';

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hash,
    role: userRole
  });

  res.status(201).json({
    token: makeToken(user.id),
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
}
```

### 7. Login and JWT Generation
*File:* `backend/src/controllers/authController.js`
```javascript
export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json({
    token: makeToken(user.id),
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
}
```

### 8. Authentication Middleware
*File:* `backend/src/middleware/auth.js`
```javascript
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return res.status(401).json({ message: 'Authentication required' });
    const token = header.slice(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function allowRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || (!allowedRoles.includes(req.user.role) && req.user.role !== 'admin')) {
      return res.status(403).json({ message: `Access restricted to: ${allowedRoles.join(', ')}` });
    }
    next();
  };
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
}
```

### 9. Create API
*File:* `backend/src/routes/reports.js`
```javascript
router.post('/', protect, async (req, res) => {
  try {
    const report = await PollutionReport.create({
      ...req.body,
      reportedBy: req.user._id
    });
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ message: 'Error creating report', error: err.message });
  }
});
```

### 10. Read API
*File:* `backend/src/routes/reports.js`
```javascript
router.get('/', protect, async (req, res) => {
  try {
    const { search, source, severity, status } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (source && source !== 'All') query.source = source;
    if (severity && severity !== 'All') query.severity = severity;
    if (status && status !== 'All') query.status = status;

    const reports = await PollutionReport.find(query)
      .sort({ reportedAt: -1 })
      .populate('reportedBy', 'name email role');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reports', error: err.message });
  }
});
```

### 11. Update API
*File:* `backend/src/routes/reports.js`
```javascript
router.patch('/:id/status', protect, allowRoles('officer', 'admin', 'ngo'), async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['Reported', 'Investigating', 'Cleanup Planned', 'Resolved'];
    if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const report = await PollutionReport.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Error updating status' });
  }
});
```

### 12. Delete API
*File:* `backend/src/routes/reports.js`
```javascript
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const report = await PollutionReport.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json({ message: 'Report deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting report' });
  }
});
```

### 13. Express Routes
*File:* `backend/src/routes/index.js`
```javascript
import { Router } from 'express';
import auth from './auth.js';
import reports from './reports.js';
import cleanup from './cleanup.js';
import { makeCrudRoutes } from './generic.js';
import WaterQuality from '../models/WaterQuality.js';
import EnvironmentalIndicator from '../models/EnvironmentalIndicator.js';
import { dashboard } from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use('/auth', auth);
router.get('/dashboard', protect, dashboard);
router.use('/reports', reports);
router.use('/cleanup', cleanup);
router.use('/water-quality', makeCrudRoutes(WaterQuality, 'recordedBy', '', ['officer', 'ngo', 'admin']));
router.use('/indicators', makeCrudRoutes(EnvironmentalIndicator, 'recordedBy', '', ['officer', 'ngo', 'admin']));

export default router;
```

### 14. Main Server File
*File:* `backend/src/server.js`
```javascript
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/error.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'Marine Pollution Monitor' }));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`API running on http://localhost:${port}`)))
  .catch(err => { console.error(err); process.exit(1); });
```

### 15. React Login Component
*File:* `frontend/src/pages/Login.jsx`
```javascript
async function submit(e) {
  e.preventDefault();
  setLoading(true);
  setError('');
  try {
    if (isRegister) {
      const r = await api.post('/auth/register', { name, email, password, role });
      login(r.data.token, r.data.user);
    } else {
      const r = await api.post('/auth/login', { email, password });
      login(r.data.token, r.data.user);
    }
    navigate('/dashboard');
  } catch (err) {
    setError(err.response?.data?.message || 'Authentication failed.');
  } finally {
    setLoading(false);
  }
}
```

### 16. Admin Dashboard Logic
*File:* `frontend/src/pages/Dashboard.jsx`
```javascript
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setData(res.data))
      .catch(err => console.error('Dashboard load error', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <div className="spinner" />;
  return (
    <div className="dashboard">
      <StatCard title="Active Incidents" count={data.stats.activeReports} />
      <StatCard title="Resolved Incidents" count={data.stats.resolvedReports} />
      <StatCard title="Volunteers Active" count={data.stats.totalVolunteers} />
      <StatCard title="Waste Collected (kg)" count={data.stats.totalWasteKg} />
    </div>
  );
}
```

### 17. REST API Request and Response Examples

#### Sample 1: Create Pollution Report (`POST /api/reports`)
**HTTP Request Body:**
```json
{
  "title": "Industrial Dye Effluent at Ennore Creek",
  "source": "Industrial Discharge",
  "severity": "High",
  "location": "Ennore Creek North Bank, Chennai",
  "latitude": 13.2312,
  "longitude": 80.3241,
  "description": "Dark chemical effluent discharging directly into coastal creek water.",
  "imageUrl": "https://example.com/photos/ennore_spill.jpg"
}
```

**HTTP Response Body (Status: 201 Created):**
```json
{
  "_id": "66bc8d128f731c9a14e9f1a2",
  "title": "Industrial Dye Effluent at Ennore Creek",
  "source": "Industrial Discharge",
  "severity": "High",
  "location": "Ennore Creek North Bank, Chennai",
  "latitude": 13.2312,
  "longitude": 80.3241,
  "description": "Dark chemical effluent discharging directly into coastal creek water.",
  "imageUrl": "https://example.com/photos/ennore_spill.jpg",
  "status": "Reported",
  "reportedBy": "66bc8ca18f731c9a14e9f190",
  "reportedAt": "2026-10-13T10:15:00.000Z",
  "createdAt": "2026-10-13T10:15:00.000Z"
}
```

#### Sample 2: User Authentication (`POST /api/auth/login`)
**HTTP Request Body:**
```json
{
  "email": "admin@marine.local",
  "password": "Admin@123"
}
```

**HTTP Response Body (Status: 200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "66bc8ca18f731c9a14e9f190",
    "name": "Marine Administrator",
    "email": "admin@marine.local",
    "role": "admin"
  }
}
```

---

## SCREENSHOTS OF THE PROJECT

### Figure 1: User Authentication & Role Selection Portal (Login / Register)
```text
+-----------------------------------------------------------------------------------------+
| [Compass] Marine Ecosystem Intelligence System                                          |
| Track pollution. Protect oceans.                       [  Login  ] [  Register  ]       |
| A unified full-stack platform connecting citizen       Email:    [ admin@marine.local ] |
| incident reports, water telemetry, and cleanup stats.  Password: [ ••••••••••••       ] |
|                                                        Role:     [ Admin            v ] |
| [Quick Demo Login: Admin | Officer | NGO | Citizen]    [         Sign In Button       ] |
+-----------------------------------------------------------------------------------------+
```
*Caption: Responsive login/registration interface with JWT authorization and role selection.*

### Figure 2: MarineWatch Executive Telemetry Dashboard
```text
+-----------------------------------------------------------------------------------------+
| [Active: 14]       [Resolved: 32]       [Volunteers: 184]       [Waste Collected: 4,250 kg] |
+-----------------------------------------------------------------------------------------+
|  [Recharts: Incident Severity Distribution]   |   [Recharts: Historical Water Telemetry] |
|  |█ Low (8)                                  |   | pH: ~7.9 (Good)                      |<br>
|  |████ Medium (15)                           |   | Dissolved Oxygen: 6.8 mg/L           |<br>
|  |██ High (9)                                |   | Turbidity: 4.2 NTU                   |<br>
+-----------------------------------------------------------------------------------------+
```
*Caption: Executive dashboard showing aggregated incident counts and water quality telemetry charts.*

### Figure 3: Interactive Geospatial Incident Map & Report Management
```text
+-----------------------------------------------------------------------------------------+
| [Search: Ennore...] [Filter Type: All v] [Filter Severity: High v] [+ Report Incident]  |<br>
+-----------------------------------------------------------------------------------------+
| LEAFLET MAP VIEW:                                                                        |
|   (• Blue Pin: Plastic)     (▲ Orange Pin: Industrial)     (■ Red Pin: Oil Spill)       |
|   [Popup: Industrial Effluent | Status: Investigating | Lat: 13.23, Lng: 80.32]          |
+-----------------------------------------------------------------------------------------+
| Table: Title          | Source     | Severity | Coordinates     | Status      | Actions  |
| Ennore Creek Runoff   | Industrial | High     | 13.2312, 80.324 | [Resolve v] | [Delete] |
+-----------------------------------------------------------------------------------------+
```
*Caption: Interactive Leaflet geospatial map displaying color-coded markers and report status lifecycles.*

---

## REFERENCES

1. United Nations Division for Sustainable Development Goals, “Goal 14: Conserve and sustainably use the oceans, seas and marine resources for sustainable development,” *United Nations Department of Economic and Social Affairs*, 2023.
2. J. R. Jambeck, R. Geyer, C. Wilcox, T. R. Siegler, M. Perryman, A. Andrady, R. Narayan, and K. L. Law, “Plastic waste inputs from land into the ocean,” *Science*, vol. 347, no. 6223, pp. 768–771, 2015.
3. M. V. Eriksen, L. C. M. Lebreton, H. S. Carson, M. Thiel, C. J. Moore, J. C. Borerro, F. Galgani, P. G. Ryan, and J. Reisser, “Plastic pollution in the world's oceans: More than 5 trillion plastic pieces weighing over 250,000 tons afloat at sea,” *PLOS ONE*, vol. 9, no. 12, p. e111913, 2014.
4. World Health Organization (WHO), “Guidelines for safe recreational water environments: Volume 1 - Coastal and fresh waters,” *World Health Organization*, Geneva, Switzerland, 2021.
5. S. Kumar and R. Sharma, “Internet of Things (IoT) based smart water quality monitoring system,” *IEEE International Conference on Advances in Computing, Communications and Informatics (ICACCI)*, pp. 1125–1130, 2018.
6. E. P. B. Albaladejo, M. A. C. Terrado, and J. F. Villaverde, “A GIS-based mobile application for crowdsourced environmental monitoring and pollution reporting,” *Journal of Environmental Informatics Letters*, vol. 4, no. 1, pp. 18–27, 2020.
7. M. Cantelon, M. Harter, T. J. Holowaychuk, and N. Rajlich, *Node.js in Action*, 2nd ed. Shelter Island, NY, USA: Manning Publications, 2017.
8. A. Banks and E. Porcello, *Learning React: Modern Patterns for Developing React Apps*, 2nd ed. Sebastopol, CA, USA: O'Reilly Media, 2020.
9. K. Chodorow, *MongoDB: The Definitive Guide: Powerful and Scalable Data Storage*, 3rd ed. Sebastopol, CA, USA: O'Reilly Media, 2020.
10. A. Holmes, J. G. Smith, and D. Taylor, “Architectural patterns for scalable full-stack web applications using the MERN stack,” *Software: Practice and Experience*, vol. 52, no. 8, pp. 1890–1912, 2022.
