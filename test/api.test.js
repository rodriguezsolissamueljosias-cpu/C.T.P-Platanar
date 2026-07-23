const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

const { startServer } = require('../server');

test('health endpoint responds successfully', async () => {
  const server = startServer(0);

  await new Promise((resolve) => server.once('listening', resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;

  const response = await fetch(`http://127.0.0.1:${port}/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, 'ok');

  await new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

test('teachers endpoint creates and lists teachers', async () => {
  const server = startServer(0);

  await new Promise((resolve) => server.once('listening', resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;

  const created = await fetch(`http://127.0.0.1:${port}/api/teachers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      teacherId: 't1',
      name: 'Ana',
      subject: 'Matemática',
      email: 'ana@example.com',
      phone: '8888',
      password: 'secret'
    })
  });

  assert.equal(created.status, 201);

  const listed = await fetch(`http://127.0.0.1:${port}/api/teachers`);
  const data = await listed.json();

  assert.equal(listed.status, 200);
  assert.ok(Array.isArray(data));
  assert.equal(data[0].name, 'Ana');

  await new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

test('admin login succeeds and teacher login requires access code', async () => {
  const server = startServer(0);

  await new Promise((resolve) => server.once('listening', resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;

  const adminResponse = await fetch(`http://127.0.0.1:${port}/api/teachers/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'rodriguezsolissamueljosias@gmail.com',
      password: 'admin2904'
    })
  });

  assert.equal(adminResponse.status, 200);
  const adminData = await adminResponse.json();
  assert.equal(adminData.role, 'admin');

  const teacherResponse = await fetch(`http://127.0.0.1:${port}/api/teachers/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'ana@example.com',
      password: 'secret'
    })
  });

  assert.equal(teacherResponse.status, 401);

  const teacherWithCode = await fetch(`http://127.0.0.1:${port}/api/teachers/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'ana@example.com',
      password: 'secret',
      accessCode: 'coligioctp2026'
    })
  });

  assert.equal(teacherWithCode.status, 200);

  await new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});
