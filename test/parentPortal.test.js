const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeStudentId, parseChildren } = require('../utils/parentPortal');

test('normalizeStudentId trims spaces and keeps a consistent format', () => {
  assert.equal(normalizeStudentId(' 1001 '), '1001');
  assert.equal(normalizeStudentId('A-1002'), 'A-1002');
});

test('parseChildren accepts multiple child entries', () => {
  const result = parseChildren([
    { name: 'Ana', studentId: '1001' },
    { name: 'Luis', studentId: '1002' }
  ]);

  assert.deepStrictEqual(result, [
    { name: 'Ana', studentId: '1001' },
    { name: 'Luis', studentId: '1002' }
  ]);
});
