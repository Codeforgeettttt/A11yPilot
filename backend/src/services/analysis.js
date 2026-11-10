import { sequelize } from '../config/database.js';
import { Analysis, AnalysisEvent, Finding } from '../models/index.js';
import { sampleFindings } from './demo.js';
export async function createDemoAnalysis(siteId){
 return sequelize.transaction(async transaction=>{
  const now=new Date();
  const analysis=await Analysis.create({siteId,demo:true,status:'Completado',startedAt:now,finishedAt:now},{transaction});
  await AnalysisEvent.bulkCreate([{analysisId:analysis.id,state:'En cola',note:'Solicitud de demostración recibida'},{analysisId:analysis.id,state:'Ejecutándose',note:'Preparando casos de ejemplo'},{analysisId:analysis.id,state:'Completado',note:'Hallazgos simulados guardados'}],{transaction});
  await Finding.bulkCreate(sampleFindings.map(x=>({...x,analysisId:analysis.id,status:'Pendiente'})),{transaction});
  return analysis;
 });
}
