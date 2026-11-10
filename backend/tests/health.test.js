import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/app.js';
test('GET /api/health responde sin necesitar SQL Server',async()=>{
 const response=await request(app).get('/api/health');
 assert.equal(response.status,200);assert.equal(response.body.mode,'demo');
});
test('rutas inexistentes devuelven 404',async()=>{
 const response=await request(app).get('/ruta-no-existente');assert.equal(response.status,404);
});
