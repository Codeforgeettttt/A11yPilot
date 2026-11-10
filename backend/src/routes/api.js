import { Router } from 'express';
import { sequelize } from '../config/database.js';
import { Project,Site,Analysis,Finding,FindingUpdate } from '../models/index.js';
import { allowedStatuses, bad, intId, textField, validUrl } from '../utils/validate.js';
import { createDemoAnalysis } from '../services/analysis.js';
import { sendPdf } from '../services/reports.js';
import { requireUser } from '../services/auth.js';
const router=Router();const go=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
function requiredId(raw){const id=intId(raw);if(!id)throw bad('Identificador no válido.');return id}
function projectBody(body){if(!textField(body?.name,3,120))throw bad('El nombre del proyecto debe tener de 3 a 120 caracteres.');if(body.description!==undefined&&!textField(body.description,0,700))throw bad('La descripción no debe superar 700 caracteres.');return {name:body.name.trim(),description:(body.description||'').trim()}}
async function ownProject(req,id){const p=await Project.findOne({where:{id:requiredId(id),userId:req.user.id}});if(!p)throw bad('Proyecto no encontrado.',404);return p}
async function ownSite(req,id){const site=await Site.findByPk(requiredId(id),{include:[{model:Project,where:{userId:req.user.id},required:true}]});if(!site)throw bad('Sitio no encontrado.',404);return site}
async function ownAnalysis(req,id){const analysis=await Analysis.findByPk(requiredId(id),{include:[{model:Site,required:true,include:[{model:Project,where:{userId:req.user.id},required:true}]},{model:Finding}]});if(!analysis)throw bad('Análisis no encontrado.',404);return analysis}
async function ownFinding(req,id){const finding=await Finding.findByPk(requiredId(id),{include:[{model:Analysis,required:true,include:[{model:Site,required:true,include:[{model:Project,where:{userId:req.user.id},required:true}]}]}]});if(!finding)throw bad('Hallazgo no encontrado.',404);return finding}
router.get('/health',(_req,res)=>res.json({status:'ok',service:'A11yPilot API',version:'0.6.0',mode:'demo'}));
router.get('/health/database',go(async(_req,res)=>{await sequelize.authenticate();res.json({status:'ok',database:'connected'})}));
router.use(requireUser);
router.get('/dashboard/summary',go(async(req,res)=>{
 const projects=await Project.findAll({where:{userId:req.user.id},attributes:['id']});const ids=projects.map(x=>x.id);
 const sites=await Site.findAll({where:{projectId:ids},attributes:['id']});const siteIds=sites.map(s=>s.id);
 const analyses=await Analysis.findAll({where:{siteId:siteIds},attributes:['id']});const analysisIds=analyses.map(a=>a.id);
 const pendingFindings=await Finding.count({where:{analysisId:analysisIds,status:'Pendiente'}});
 res.json({projects:ids.length,sites:siteIds.length,analyses:analysisIds.length,pendingFindings,demo:true});
}));
router.get('/projects',go(async(req,res)=>res.json(await Project.findAll({where:{userId:req.user.id},order:[['createdAt','DESC']]}))));
router.post('/projects',go(async(req,res)=>res.status(201).json(await Project.create({...projectBody(req.body),userId:req.user.id}))));
router.get('/projects/:id',go(async(req,res)=>{const p=await ownProject(req,req.params.id);res.json(await Project.findByPk(p.id,{include:[Site]}))}));
router.patch('/projects/:id',go(async(req,res)=>{const p=await ownProject(req,req.params.id);await p.update(projectBody(req.body));res.json(p)}));
router.delete('/projects/:id',go(async(req,res)=>{const p=await ownProject(req,req.params.id);await p.destroy();res.status(204).end()}));
router.get('/projects/:id/sites',go(async(req,res)=>{const p=await ownProject(req,req.params.id);res.json(await Site.findAll({where:{projectId:p.id},order:[['createdAt','DESC']]}))}));
router.get('/sites',go(async(req,res)=>res.json(await Site.findAll({include:[{model:Project,where:{userId:req.user.id},required:true,attributes:['id','name']}],order:[['createdAt','DESC']]}))));
router.post('/projects/:id/sites',go(async(req,res)=>{
 const p=await ownProject(req,req.params.id);
 if(!textField(req.body?.name,2,120))throw bad('El nombre del sitio debe tener entre 2 y 120 caracteres.');
 if(!validUrl(req.body?.url))throw bad('Ingresa una URL HTTP o HTTPS válida sin credenciales.');
 if(req.body.authorizationConfirmed!==true)throw bad('Debes confirmar la autorización antes de registrar el sitio.');
 const site=await Site.create({projectId:p.id,name:req.body.name.trim(),url:req.body.url,authorizationConfirmed:true});res.status(201).json(site)
}));
router.delete('/sites/:id',go(async(req,res)=>{const site=await ownSite(req,req.params.id);await site.destroy();res.status(204).end()}));
router.get('/analyses',go(async(req,res)=>{
 const sites=await Site.findAll({include:[{model:Project,where:{userId:req.user.id},required:true,attributes:[]}],attributes:['id']});
 const analyses=await Analysis.findAll({where:{siteId:sites.map(s=>s.id)},include:[{model:Site,attributes:['id','name','url']}],order:[['createdAt','DESC']]});
 res.json(await Promise.all(analyses.map(async a=>({...a.toJSON(),findingCount:await Finding.count({where:{analysisId:a.id}})}))));
}));
router.post('/analyses/demo',go(async(req,res)=>{
 const site=await ownSite(req,req.body?.siteId);
 if(!site.authorizationConfirmed||req.body.authorizationConfirmed!==true)throw bad('Debes confirmar que tienes autorización para evaluar el sitio.');
 const analysis=await createDemoAnalysis(site.id);res.status(201).json({id:analysis.id,status:analysis.status,demo:true,message:'Se guardaron datos de demostración. No se ha visitado el sitio.'});
}));
router.get('/analyses/:id',go(async(req,res)=>res.json(await ownAnalysis(req,req.params.id))));
router.get('/findings',go(async(req,res)=>{
 const where={};if(req.query.impact)where.impact=String(req.query.impact);if(req.query.status)where.status=String(req.query.status);
 const projects=await Project.findAll({where:{userId:req.user.id},attributes:['id']});
 const sites=await Site.findAll({where:{projectId:projects.map(p=>p.id)},attributes:['id']});
 const analyses=await Analysis.findAll({where:{siteId:sites.map(s=>s.id)},attributes:['id']});where.analysisId=analyses.map(a=>a.id);
 res.json(await Finding.findAll({where,include:[{model:Analysis,attributes:['id','siteId'],include:[{model:Site,attributes:['id','name','url']}]}],order:[['createdAt','DESC']]}));
}));
router.patch('/findings/:id/status',go(async(req,res)=>{
 const finding=await ownFinding(req,req.params.id);
 if(!allowedStatuses.includes(req.body?.status))throw bad('Estado de seguimiento no válido.');
 if(req.body.note!==undefined&&!textField(req.body.note,0,500))throw bad('La observación no debe superar 500 caracteres.');
 const result=await sequelize.transaction(async transaction=>{
  const previousStatus=finding.status;
  await finding.update({status:req.body.status},{transaction});
  await FindingUpdate.create({findingId:finding.id,previousStatus,newStatus:req.body.status,note:(req.body.note||'').trim()},{transaction});
  return finding;
 });res.json(result);
}));
router.get('/findings/:id/updates',go(async(req,res)=>{const finding=await ownFinding(req,req.params.id);res.json(await FindingUpdate.findAll({where:{findingId:finding.id},order:[['createdAt','DESC']]}))}));
router.get('/reports/:analysisId',go(async(req,res)=>{const analysis=await ownAnalysis(req,req.params.analysisId);sendPdf(res,analysis)}));
export default router;
