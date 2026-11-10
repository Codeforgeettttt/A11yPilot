import test from 'node:test';
import assert from 'node:assert/strict';
import { validUrl,intId,textField,allowedStatuses } from '../src/utils/validate.js';
test('acepta una URL válida',()=>assert.equal(validUrl('https://example.com'),true));
test('rechaza protocolos no permitidos',()=>assert.equal(validUrl('file:///etc/passwd'),false));
test('rechaza credenciales en URL',()=>assert.equal(validUrl('https://x:y@example.com'),false));
test('acepta identificadores positivos',()=>{assert.equal(intId('3'),3);assert.equal(intId('-1'),null)});
test('valida longitud de nombre',()=>{assert.equal(textField('Sitio',2,120),true);assert.equal(textField('',2,120),false)});
test('estados admitidos',()=>assert.ok(allowedStatuses.includes('En revisión')));
