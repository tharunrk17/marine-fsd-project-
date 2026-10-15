import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/error.js';

const app = express();

// Allow any localhost/127.0.0.1 port or client domain for seamless local development
app.use(cors({
  origin: (origin, callback) => {
    // Requests with no origin (curl, mobile, server-to-server)
    if (!origin) return callback(null, true);
    // Any localhost or 127.0.0.1 port
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    // Local network IPs (192.168.x.x, 10.x.x.x)
    if (/^https?:\/\/(192\.168|10)\.\d+\.\d+(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    // Configured client URL
    if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) {
      return callback(null, true);
    }
    // Fallback: allow origin
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'Marine Pollution Monitor' }));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`API running on http://localhost:${port}`))).catch(err => { console.error(err); process.exit(1); });
