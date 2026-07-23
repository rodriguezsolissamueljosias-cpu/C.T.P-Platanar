const test = require('node:test');
const assert = require('node:assert/strict');
const { buildNotificationEmail } = require('../utils/emailNotifications');

test('buildNotificationEmail incluye profesor, materia, fecha y acción', () => {
  const email = buildNotificationEmail({
    studentName: 'Ana Pérez',
    status: 'Escapando',
    teacherName: 'Prof. López',
    subject: 'Matemáticas',
    markedAt: '2026-06-30T08:15:00.000Z'
  });

  assert.match(email.subject, /Ana Pérez/);
  assert.match(email.text, /Prof\. López/);
  assert.match(email.text, /Matemáticas/);
  assert.match(email.text, /2026/);
  assert.match(email.text, /Escapando/);
  assert.match(email.html, /Prof\. López/);
});
