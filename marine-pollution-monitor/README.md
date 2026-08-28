# MarineWatch – Marine Pollution Monitor

A full-stack MERN college project for tracking how **plastic pollution, industrial discharge, and oil spills** affect marine ecosystems. The platform stores structured environmental data and turns it into an interactive operational dashboard.

## Features

- JWT authentication with roles (`admin`, `researcher`, `student`)
- MongoDB persistence using Mongoose schemas
- RESTful Express API with protected CRUD routes
- Pollution incident reporting with source, severity, GPS coordinates and status
- Water-quality monitoring: pH, dissolved oxygen, turbidity, oil index, microplastics and temperature
- Cleanup activity tracking: volunteers, waste, plastic and oil recovered
- Environmental indicators with targets and trend direction
- Dashboard statistics and charts using Recharts
- Search/filter-ready reporting workflow
- Responsive UI for desktop, tablet and mobile
- Seed script with realistic sample data

## MERN topics demonstrated

**MongoDB:** database, collections, documents, ObjectId references, aggregation pipelines, CRUD.

**Express.js:** API routing, middleware, CORS, error handling, REST endpoints.

**React.js:** components, props, state, effects, routing, controlled forms, protected routes, responsive UI.

**Node.js:** ES modules, environment variables, HTTP server, async database/API operations.

**Full-stack concepts:** JWT auth, API client with Axios, role-based route protection, validation, reusable CRUD architecture, data aggregation, charts, local storage token handling.

## Project structure

```text
marine-pollution-monitor/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   └── pages/
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## Run locally

### 1. Start MongoDB

Use a local MongoDB instance or a free MongoDB Atlas database.

### 2. Backend

```bash
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
```

On macOS/Linux replace `copy .env.example .env` with `cp .env.example .env`.

Default API: `http://localhost:5000/api`

### 3. Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`.

## Demo login

```text
Email:    admin@marine.local
Password: Admin@123
```

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login + JWT |
| GET | `/api/auth/me` | Current user |
| GET | `/api/dashboard` | Aggregated monitoring data |
| GET/POST | `/api/reports` | List/create pollution reports |
| GET/PUT/DELETE | `/api/reports/:id` | Manage a report |
| GET/POST | `/api/water-quality` | List/create measurements |
| GET/POST | `/api/cleanup` | List/create cleanup activities |
| GET/POST | `/api/indicators` | List/create indicators |

Delete endpoints are restricted to admin users.

## GitHub workflow

1. Create a new GitHub repository.
2. Put this project at the repository root.
3. Keep `.env` files out of GitHub; only commit `.env.example`.
4. Push with:

```bash
git init
git add .
git commit -m "Initial MERN marine pollution monitor"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

## Deployment idea

- Frontend: Vercel or Netlify
- Backend: Render / Railway / similar Node hosting
- Database: MongoDB Atlas
- Set `VITE_API_URL`, `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` in the deployment environment.

## Academic project scope

The project is suitable for demonstrating software engineering concepts in a college viva: requirements, UI/UX, React componentization, REST API design, authentication, database modeling, CRUD operations, aggregation, data visualization, validation, responsive design, and deployment architecture.
