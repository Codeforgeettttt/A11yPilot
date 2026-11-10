import { randomBytes, createHash, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { Op } from 'sequelize';
import nodemailer from 'nodemailer';
import { User,Session,PasswordReset } from '../models/index.js';
import { env } from '../config/env.js';
import { bad } from '../utils/validate.js';
const scrypt=promisify(scryptCallback);
const hashToken=value=>createHash('sha256').update(value).digest('hex');
const randomToken=()=>randomBytes(32).toString('hex');
export function cleanEmail(value){return typeof value==='string'?value.trim().toLowerCase():''}
export function publicUser(user){return {id:user.id,name:user.name,email:user.email,createdAt:user.createdAt}}
export async function hashPassword(password){const salt=randomBytes(16).toString('hex');const derived=await scrypt(password,salt,64);return `${salt}:${derived.toString('hex')}`}
export async function checkPassword(password,stored){if(typeof password!=='string'||typeof stored!=='string')return false;const [salt,hex]=stored.split(':');if(!salt||!hex||!/^[a-f0-9]+$/i.test(hex))return false;const actual=Buffer.from(hex,'hex');if(actual.length!==64)return false;const candidate=await scrypt(password,salt,64);return timingSafeEqual(actual,candidate)}
export function validatePassword(value){if(typeof value!=='string'||value.length<12||value.length>128)throw bad('La contraseña debe tener entre 12 y 128 caracteres.');}
export function sessionCookie(res,token){res.cookie('a11y_session',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/api',maxAge:env.sessionDays*86400000})}
export function clearSessionCookie(res){res.clearCookie('a11y_session',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/api'})}
export async function createSession(user,res){const token=randomToken();await Session.create({userId:user.id,tokenHash:hashToken(token),expiresAt:new Date(Date.now()+env.sessionDays*86400000)});sessionCookie(res,token)}
export async function getSession(req){const cookie=req.headers.cookie?.split(';').map(p=>p.trim()).find(p=>p.startsWith('a11y_session='));const token=cookie?.slice('a11y_session='.length);if(!token||!/^[a-f0-9]{64}$/.test(token))return null;return Session.findOne({where:{tokenHash:hashToken(token),expiresAt:{[Op.gt]:new Date()}},include:[User]})}
export async function requireUser(req,_res,next){try{const session=await getSession(req);if(!session||!session.User)return next(bad('Debes iniciar sesión para continuar.',401));req.user=session.User;req.session=session;next()}catch(e){next(e)}}
export async function revokeSession(req){const s=await getSession(req);if(s)await s.destroy()}
export async function createReset(user){const token=randomToken();await PasswordReset.destroy({where:{userId:user.id}});await PasswordReset.create({userId:user.id,tokenHash:hashToken(token),expiresAt:new Date(Date.now()+15*60000)});return token}
export async function resetPassword(token,newPassword){validatePassword(newPassword);if(typeof token!=='string'||!/^[a-f0-9]{64}$/.test(token))throw bad('El enlace de recuperación no es válido o ha vencido.');const record=await PasswordReset.findOne({where:{tokenHash:hashToken(token),expiresAt:{[Op.gt]:new Date()}}});if(!record)throw bad('El enlace de recuperación no es válido o ha vencido.');await record.destroy();await User.update({passwordHash:await hashPassword(newPassword)},{where:{id:record.userId}});await Session.destroy({where:{userId:record.userId}})}
export async function sendResetEmail(email,token){if(!env.smtp.host||!env.smtp.from)return false;const transport=nodemailer.createTransport({host:env.smtp.host,port:env.smtp.port,secure:env.smtp.port===465,auth:env.smtp.user?{user:env.smtp.user,pass:env.smtp.password}:undefined});const link=`${env.origin}/?reset=${encodeURIComponent(token)}`;await transport.sendMail({from:env.smtp.from,to:email,subject:'Restablecer contraseña de A11yPilot',text:`Solicitaste cambiar tu contraseña. El enlace vence en 15 minutos: ${link}
Si no lo solicitaste, ignora este correo.`});return true}
