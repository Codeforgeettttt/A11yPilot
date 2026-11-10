import { Sequelize } from 'sequelize';
import { env } from './env.js';
export const sequelize = new Sequelize(env.db.name,env.db.user,env.db.password,{
 dialect:'mssql',host:env.db.host,port:env.db.port,logging:false,
 dialectOptions:{options:{encrypt:env.db.encrypt,trustServerCertificate:env.db.trustCert}},
 pool:{max:5,min:0,acquire:15000,idle:10000}
});
