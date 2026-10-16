# Marine Pollution Monitor

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/tharunrk17/marine-fsd-project-)

A comprehensive full-stack MERN application for monitoring and analyzing marine pollution incidents, water quality parameters, environmental indicators, and cleanup initiatives.

---

## 🚀 1-Click Deployment to Render

Click the button above or visit:
👉 **[Deploy on Render](https://render.com/deploy?repo=https://github.com/tharunrk17/marine-fsd-project-)**

Render will automatically detect `render.yaml` and configure:
- **`marine-pollution-backend`** (Node.js API Web Service)
- **`marine-pollution-frontend`** (React/Vite Static Site)

### Environment Variables to enter when prompted:
- **`MONGO_URI`**:
  ```text
  mongodb+srv://tharunabd017_db_user:dgab0T8S2c7fXoJ9@cluster0.d8dm9u1.mongodb.net/marine_pollution_monitor?retryWrites=true&w=majority&appName=Cluster0
  ```
- **`VITE_API_URL`**:
  ```text
  https://marine-pollution-backend.onrender.com/api
  ```
- **`CLIENT_URL`**:
  ```text
  https://marine-pollution-frontend.onrender.com
  ```

> **Important:** In your MongoDB Atlas dashboard under **Network Access**, ensure `0.0.0.0/0` is added so Render can communicate with your database.

---

## 💻 Local Development

```bash
# 1. Install root dependencies
npm install

# 2. Run backend & frontend concurrently
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
