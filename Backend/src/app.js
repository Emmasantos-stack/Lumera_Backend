const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initializeDatabase } = require('./bootstrap');
const empresaRoutes = require('./Routes/EmpresaRoute');
const authRoutes = require('./Routes/AuthRoute');
const userRoutes = require('./Routes/UserRoute');
const ticketRoutes = require('./Routes/TicketRoute');
const chatRoutes = require('./Routes/ChatRoute');
const logRoutes = require('./Routes/LogRoute');
const reportRoutes = require('./Routes/ReportRoute');
const monitoringRoutes = require('./Routes/MonitoringRoute');
const statsRoutes = require('./Routes/StatsRoute');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowVercelPreviews = process.env.CORS_ALLOW_VERCEL_PREVIEWS === 'true';

app.use(
  cors({
    origin(origin, callback) {
      const isAllowedPreview = allowVercelPreviews && origin?.endsWith('.vercel.app');

      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin) || isAllowedPreview) {
        return callback(null, true);
      }

      return callback(new Error('CORS origin not allowed'));
    },
  })
);

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    message: 'Lumera backend online',
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    message: 'API online',
    databaseConfigured: Boolean(process.env.DATABASE_URL || process.env.DB_HOST),
  });
});

app.use('/api', async (_req, _res, next) => {
  try {
    await initializeDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

app.use('/api/empresas', empresaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/stats', statsRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  const statusCode = error.message === 'CORS origin not allowed' ? 403 : 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Erro interno no servidor',
  });
});

module.exports = app;
