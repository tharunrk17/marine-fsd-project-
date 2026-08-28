# Architecture

```mermaid
flowchart LR
  U[User] --> R[React + React Router]
  R -->|Axios REST/JSON| E[Express API]
  E --> N[Node.js]
  N --> M[(MongoDB / Mongoose)]
  E --> J[JWT Auth]
  R --> C[Recharts Analytics]
```

## Core entities

- **User** → authentication and role
- **PollutionReport** → incident source, severity, coordinates and response status
- **WaterQuality** → station measurements and quality status
- **CleanupActivity** → field operations and recovered material
- **EnvironmentalIndicator** → target-based environmental trends

## Recommended future additions

- Map visualization using Leaflet/OpenStreetMap
- Image/file upload for field evidence
- Email alerts for critical incidents
- CSV import/export for research datasets
- Scheduled water-quality reminders
- Public read-only transparency portal
