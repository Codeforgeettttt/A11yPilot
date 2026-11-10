import { sequelize } from '../src/config/database.js';
import { User,Project,Site,Analysis } from '../src/models/index.js';
import { hashPassword } from '../src/services/auth.js';
import { createDemoAnalysis } from '../src/services/analysis.js';
try{
 await sequelize.authenticate();await sequelize.sync();
 const email=process.env.SEED_USER_EMAIL, password=process.env.SEED_USER_PASSWORD;
 if(!email||!password)throw new Error('Define SEED_USER_EMAIL y SEED_USER_PASSWORD en backend/.env para usar db:seed.');
 const [user]=await User.findOrCreate({where:{email:email.toLowerCase()},defaults:{name:'Usuario de demostración',passwordHash:await hashPassword(password)}});
 const [project]=await Project.findOrCreate({where:{name:'Portal de demostración',userId:user.id},defaults:{description:'Proyecto de ejemplo para Ingeniería Web II.'}});
 const [site]=await Site.findOrCreate({where:{projectId:project.id,url:'https://example.com'},defaults:{name:'Sitio de ejemplo',authorizationConfirmed:true}});
 const existing=await Analysis.count({where:{siteId:site.id}});
 if(!existing)await createDemoAnalysis(site.id);
 console.log('Datos de ejemplo preparados. No se ha visitado example.com.');
}catch(error){console.error('Error al crear datos de ejemplo:',error.message);process.exitCode=1}
finally{await sequelize.close()}
