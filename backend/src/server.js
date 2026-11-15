import { app } from './app.js';
import { sequelize } from './config/database.js';
import { env } from './config/env.js';
import './models/index.js';

// Se usa 127.0.0.1 localmente; en contenedores, configurar HOST=0.0.0.0.
const host = process.env.HOST || '127.0.0.1';

try {
  await sequelize.authenticate();
  app.listen(env.port, host, () => console.log(`A11yPilot API: http://${host}:${env.port}`));
} catch (error) {
  console.error('No se pudo conectar con SQL Server:', error.message);
  process.exitCode = 1;
}
