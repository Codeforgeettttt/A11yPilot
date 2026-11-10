import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import router from './routes/api.js';
import authRouter from './routes/auth.js';
import { env } from './config/env.js';
export const app=express();
app.disable('x-powered-by');app.use(helmet());app.use(cors({origin:env.origin}));
app.use(express.json({limit:'100kb'}));
app.use('/api',(req,res,next)=>{
 if(['POST','PATCH','PUT','DELETE'].includes(req.method)){
  const origin=req.get('Origin');
  if(origin&&origin!==env.origin)return res.status(403).json({error:{message:'Origen no permitido.'}});
  if(!origin&&process.env.NODE_ENV==='production')return res.status(403).json({error:{message:'Falta el encabezado Origin.'}});
 }
 next();
});
app.use('/api/auth',authRouter);
app.use('/api',rateLimit({windowMs:15*60*1000,limit:250,standardHeaders:'draft-7',legacyHeaders:false}),router);
app.use((_req,res)=>res.status(404).json({error:{message:'Ruta no encontrada.'}}));
app.use((error,_req,res,_next)=>{
 const status=Number.isInteger(error.status)?error.status:500;
 if(status===500)console.error('[API]',error.message);
 res.status(status).json({error:{message:status===500?'No fue posible completar la solicitud.':error.message}});
});
