import test from 'node:test';
import assert from 'node:assert/strict';
import { Project } from '../src/models/index.js';

// validate() revisa las reglas del modelo sin conectarse a la base de datos.
test('un proyecto no se puede guardar sin dueño', async () => {
  await assert.rejects(Project.build({ name: 'Proyecto huérfano' }).validate(), /userId cannot be null/);
});

test('un proyecto con dueño es válido', async () => {
  await assert.doesNotReject(Project.build({ name: 'Proyecto con dueño', userId: 1 }).validate());
});