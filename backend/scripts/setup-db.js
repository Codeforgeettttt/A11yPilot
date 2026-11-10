import { sequelize } from '../src/config/database.js';
import {Project} from '../src/models/index.js';
import {DataTypes} from 'sequelize';
try{
 await sequelize.authenticate();
 // Crear tablas si no existen; no se usa force ni alter para proteger los datos.
 // Para producción se necesitarán migraciones versionadas.
 // Al actualizar desde la versión sin usuarios, agregar la columna sin borrar registros.
 const qi=sequelize.getQueryInterface();
 const tables=await qi.showAllTables();
 if(tables.some(t=>String(typeof t==='string'?t:t.tableName).toLowerCase()==='projects')){
  const fields=await qi.describeTable('Projects');
  if(!fields.userId)await qi.addColumn('Projects','userId',{type:DataTypes.INTEGER,allowNull:true});
 }
 await sequelize.sync();
 console.log('Tablas del MVP creadas/verificadas en SQL Server.');
}catch(error){console.error('Error al preparar SQL Server:',error.message);process.exitCode=1}
finally{await sequelize.close()}
