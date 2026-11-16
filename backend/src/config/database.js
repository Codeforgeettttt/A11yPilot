import { Sequelize } from 'sequelize';
import { env } from './env.js';

// Para las pruebas automáticas se usa SQLite en memoria (DB_DIALECT=sqlite):
// no necesita servidor, empieza vacía y desaparece al terminar.
// En desarrollo y en Docker se usa SQL Server.
export const sequelize =
  env.db.dialect === 'sqlite'
    ? new Sequelize({ dialect: 'sqlite', storage: env.db.storage, logging: false })
    : new Sequelize(env.db.name, env.db.user, env.db.password, {
        dialect: 'mssql',
        host: env.db.host,
        port: env.db.port,
        logging: false,
        dialectOptions: { options: { encrypt: env.db.encrypt, trustServerCertificate: env.db.trustCert } },
        pool: { max: 5, min: 0, acquire: 15000, idle: 10000 },
      });