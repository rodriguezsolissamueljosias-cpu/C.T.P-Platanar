function getStatusAction(status) {
  switch (status) {
    case 'Tarde':
      return 'Llegada tarde al aula';
    case 'Ausente':
      return 'Falta por ausencia';
    case 'Escapando':
      return 'Se reporta que el estudiante está escapando';
    case 'Justificado':
      return 'Justificación registrada';
    default:
      return 'Asistencia registrada';
  }
}

function buildNotificationEmail({ studentName, status, teacherName, subject, markedAt, parentEmail }) {
  const formattedDate = new Date(markedAt).toLocaleString('es-ES');
  const actionText = getStatusAction(status);

  const subjectLine = `Aviso de asistencia: ${studentName} marcado/a como ${status}`;
  const text = `Estimado/a padre o madre,

Le informamos que su hijo/a ${studentName} ha sido marcado/a como *${status}* el día ${formattedDate}.

Materia: ${subject || 'No registrada'}
Profesor: ${teacherName || 'No registrado'}
Acción registrada: ${actionText}

Si tiene alguna duda, por favor contacte a la institución.

Saludos cordiales,
CTP Platanar`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color:#1f4e79">Aviso de asistencia</h2>
      <p>Estimado/a padre o madre,</p>
      <p>Le informamos que su hijo/a <strong>${studentName}</strong> ha sido marcado/a como <strong>${status}</strong> el día <strong>${formattedDate}</strong>.</p>
      <ul>
        <li><strong>Materia:</strong> ${subject || 'No registrada'}</li>
        <li><strong>Profesor:</strong> ${teacherName || 'No registrado'}</li>
        <li><strong>Acción registrada:</strong> ${actionText}</li>
      </ul>
      <p>Si tiene alguna duda, por favor contacte a la institución.</p>
      <p>Saludos cordiales,<br />CTP Platanar</p>
    </div>
  `;

  return {
    to: parentEmail,
    from: process.env.SMTP_FROM || 'CTP Platanar <no-reply@ctp-platanar.edu>',
    subject: subjectLine,
    text,
    html
  };
}

module.exports = { buildNotificationEmail };
