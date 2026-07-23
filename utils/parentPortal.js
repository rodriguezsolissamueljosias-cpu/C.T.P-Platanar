function normalizeStudentId(value) {
  return String(value ?? '').trim();
}

function parseChildren(children) {
  if (!Array.isArray(children)) {
    return [];
  }

  return children
    .map((child) => ({
      name: String(child?.name ?? '').trim(),
      studentId: normalizeStudentId(child?.studentId ?? child?.id ?? child?.student_id ?? '')
    }))
    .filter((child) => child.name && child.studentId);
}

module.exports = {
  normalizeStudentId,
  parseChildren
};
