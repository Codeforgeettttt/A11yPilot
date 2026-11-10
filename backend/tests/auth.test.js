import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import {app} from '../src/app.js';
import {hashPassword,checkPassword,validatePassword} from '../src/services/auth.js';
test('hash de contraseña: nunca almacena el valor en texto claro',async()=>{
 const pass='Una-clave-larga-2026!';const hash=await hashPassword(pass);
 assert.notEqual(hash,pass);assert.equal(await checkPassword(pass,hash),true);assert.equal(await checkPassword('incorrecta',hash),false);
});
test('rechaza contraseñas cortas',()=>assert.throws(()=>validatePassword('1234567')));
test('la API de proyectos exige sesión, incluso para consultar',async()=>{
 const r=await request(app).get('/api/projects');assert.equal(r.status,401)
});
test('no permite peticiones de otro origen',async()=>{
 const r=await request(app).post('/api/auth/login').set('Origin','https://otra-pagina.example').send({});assert.equal(r.status,403)
});
