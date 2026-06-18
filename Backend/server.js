const express = require('express');
const cors = require('cors');
const sequelize = require('./src/Config/database');
const empresaRoutes = require('./src/Routes/EmpresaRoute');
const authRoutes = require('./src/Routes/AuthRoute');
const userRoutes = require('./src/Routes/UserRoute');
const ticketRoutes = require('./src/Routes/TicketRoute');
const chatRoutes = require('./src/Routes/ChatRoute');
const logRoutes = require('./src/Routes/LogRoute');
const reportRoutes = require('./src/Routes/ReportRoute');
const monitoringRoutes = require('./src/Routes/MonitoringRoute');
const statsRoutes = require('./src/Routes/StatsRoute');
const User = require('./src/Model/User');
require('./src/Model/Ticket');
require('./src/Model/ChatMessage');
require('./src/Model/Log');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'API online' });
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

const PORT = Number(process.env.PORT || 5000);

sequelize
  .authenticate()
  .then(async () => {
    await sequelize.sync({ alter: true });
    await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        nome: 'Administrador',
        username: 'admin',
        password: 'admin',
        classe: 'admin',
        email: 'admin@cyberboxsecurity.pt',
        telefone: '+351 900 000 001',
        departamento: 'Administração',
        team_size: 0,
        status: 'online',
      },
    });
    console.log('PostgreSQL conectado com Sequelize e tabelas sincronizadas.');
    app.listen(PORT, () => {
      console.log(`Servidor ativo em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao ligar ao PostgreSQL:', error.message);
    process.exit(1);
  });
