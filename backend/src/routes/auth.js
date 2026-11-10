import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { User,Session } from '../models/index.js';
import { bad, textField } from '../utils/validate.js';
import {cleanEmail,publicUser,hashPassword,checkPassword,validatePassword,createSession,requireUser,revokeSession,clearSessionCookie,createReset,sendResetEmail,resetPassword} from '../services/auth.js';
import {env} from '../config/env.js';
const router=Router();const go=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
const authLimit=rateLimit({windowMs:15*60*1000,limit:10,standardHeaders:'draft-7',legacyHeaders:false,message:{error:{message:'Demasiados intentos. Inténtalo más tarde.'}}});
const emailOk=value=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)&&value.length<=254;
router.post('/register',authLimit,go(async(req,res)=>{
 const name=req.body?.name,email=cleanEmail(req.body?.email),password=req.body?.password;
 if(!textField(name,2,120)||!emailOk(email))throw bad('Revisa el nombre y el correo electrónico.');validatePassword(password);
 if(await User.findOne({where:{email}}))throw bad('Ese correo ya está registrado.',409);
 const user=await User.create({name:name.trim(),email,passwordHash:await hashPassword(password)});
 await createSession(user,res);res.status(201).json({user:publicUser(user)});
}));
router.post('/login',authLimit,go(async(req,res)=>{
 const email=cleanEmail(req.body?.email),password=req.body?.password;
 if(!emailOk(email)||typeof password!=='string')throw bad('Correo o contraseña incorrectos.',401);
 const user=await User.findOne({where:{email}});
 if(!user||!(await checkPassword(password,user.passwordHash)))throw bad('Correo o contraseña incorrectos.',401);
 await createSession(user,res);res.json({user:publicUser(user)});
}));
router.get('/me',requireUser,(req,res)=>res.json({user:publicUser(req.user)}));
router.patch('/me',requireUser,go(async(req,res)=>{
 const name=req.body?.name;if(!textField(name,2,120))throw bad('El nombre debe tener entre 2 y 120 caracteres.');
 await req.user.update({name:name.trim()});res.json({user:publicUser(req.user)});
}));
router.post('/change-password',requireUser,authLimit,go(async(req,res)=>{
 if(!(await checkPassword(req.body?.currentPassword,req.user.passwordHash)))throw bad('La contraseña actual no coincide.',400);
 validatePassword(req.body?.newPassword);await req.user.update({passwordHash:await hashPassword(req.body.newPassword)});
 await Session.destroy({where:{userId:req.user.id}});await createSession(req.user,res);
 res.json({message:'Contraseña actualizada.'});
}));
router.post('/logout',go(async(req,res)=>{await revokeSession(req);clearSessionCookie(res);res.status(204).end()}));
router.post('/forgot-password',authLimit,go(async(req,res)=>{
 const email=cleanEmail(req.body?.email),answer={message:'Si el correo está registrado, recibirás las instrucciones para recuperar el acceso.'};
 if(!emailOk(email))throw bad('Ingresa un correo electrónico válido.');
 const user=await User.findOne({where:{email}});
 if(user){const token=await createReset(user);const sent=await sendResetEmail(email,token);if(!sent&&env.devShowResetLink)answer.devResetLink=`${env.origin}/?reset=${token}`;}
 res.json(answer);
}));
router.post('/reset-password',authLimit,go(async(req,res)=>{await resetPassword(req.body?.token,req.body?.password);res.json({message:'Contraseña actualizada. Inicia sesión de nuevo.'})}));
export default router;
