import { app } from './app.js';
import { sequelize } from './config/database.js';
import { env } from './config/env.js';
import './models/index.js';
// La API no inicia sin una conexión funcional. Así evitamos mostrar datos inexistentes.
try{
 await sequelize.authenticate();
 app.listen(env.port,'127.0.0.1',()=>console.log(`A11yPilot API: http://127.0.0.1:${env.port}`));
}catch(error){console.error('No se pudo conectar con SQL Server:',error.message);process.exitCode=1}
