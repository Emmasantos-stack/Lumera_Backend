require('dotenv').config();

const app = require('./src/app');

const PORT = Number(process.env.PORT || 5000);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Servidor ativo em http://localhost:${PORT}`);
  });
}

module.exports = app;
