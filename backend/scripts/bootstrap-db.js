// Inicialización exclusiva del entorno local de Docker Compose.
// Crea la base indicada si hace falta; después delega las tablas a setup-db.js.
import { Sequelize } from 'sequelize';
import { env } from '../src/config/env.js';

const dbName = env.db.name;
if (!/^[A-Za-z][A-Za-z0-9_]{0,127}$/.test(dbName)) {
  console.error('DB_NAME debe ser un identificador SQL simple y válido.');
  process.exit(1);
}

const admin = new Sequelize('master', env.db.user, env.db.password, {
  dialect: 'mssql',
  host: env.db.host,
  port: env.db.port,
  logging: false,
  dialectOptions: {
    options: { encrypt: env.db.encrypt, trustServerCertificate: env.db.trustCert },
  },
});

try {
  await admin.authenticate();
  const [rows] = await admin.query(
    'SELECT DB_ID(:name) AS dbId',
    { replacements: { name: dbName } },
  );
  if (rows[0]?.dbId == null) {
    await admin.query(`CREATE DATABASE [${dbName}]`);
    console.log('Base de datos creada para el entorno local.');
  } else {
    console.log('La base de datos ya existe.');
  }
} catch (error) {
  console.error('No se pudo preparar la base de datos:', error.message);
  process.exitCode = 1;
} finally {
  await admin.close();
}

if (process.exitCode !== 1) {
  await import('./setup-db.js');
}
