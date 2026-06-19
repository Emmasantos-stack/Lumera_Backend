const sequelize = require('./Config/database');
const User = require('./Model/User');
require('./Model/Ticket');
require('./Model/ChatMessage');
require('./Model/Log');
require('./Model/Empresa');
require('./Model/AtivoTecnologico');

let initializationPromise;

async function seedDefaultAdmin() {
  const shouldSeed =
    process.env.SEED_DEFAULT_ADMIN === 'true' ||
    (process.env.SEED_DEFAULT_ADMIN !== 'false' && process.env.NODE_ENV !== 'production');

  if (!shouldSeed) {
    return;
  }

  await User.findOrCreate({
    where: { username: process.env.DEFAULT_ADMIN_USERNAME || 'admin' },
    defaults: {
      nome: process.env.DEFAULT_ADMIN_NAME || 'Administrador',
      username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
      password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin',
      classe: 'admin',
      email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@cyberboxsecurity.pt',
      telefone: process.env.DEFAULT_ADMIN_PHONE || '+351 900 000 001',
      departamento: process.env.DEFAULT_ADMIN_DEPARTMENT || 'Administracao',
      team_size: 0,
      status: 'online',
    },
  });
}

function initializeDatabase() {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      await sequelize.authenticate();

      const syncOptions =
        process.env.DB_SYNC_ALTER === 'true' && process.env.NODE_ENV !== 'production'
          ? { alter: true }
          : {};

      await sequelize.sync(syncOptions);
      await seedDefaultAdmin();
      return sequelize;
    })().catch((error) => {
      initializationPromise = null;
      throw error;
    });
  }

  return initializationPromise;
}

module.exports = {
  initializeDatabase,
};
