import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { parentAPI } from '../utils/api';

export default function ParentPortal() {
  const parentLink = typeof window !== 'undefined' ? `${window.location.origin}/portal-padres` : '/portal-padres';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [children, setChildren] = useState([{ name: '', studentId: '' }]);
  const [parentId, setParentId] = useState('');
  const [portal, setPortal] = useState(null);
  const [message, setMessage] = useState('');
  const [showTeacherLink, setShowTeacherLink] = useState(false);

  useEffect(() => {
    try {
      const savedTeacher = JSON.parse(localStorage.getItem('teacher') || 'null');
      setShowTeacherLink(Boolean(savedTeacher));
    } catch (error) {
      setShowTeacherLink(false);
    }
  }, []);

  const addChild = () => setChildren([...children, { name: '', studentId: '' }]);
  const updateChild = (index, field, value) => {
    const next = [...children];
    next[index][field] = value;
    setChildren(next);
  };

  const registerParent = async (e) => {
    e.preventDefault();
    try {
      const res = await parentAPI.register({ firstName, lastName, children });
      setParentId(res.data.id);
      setMessage('✅ Registro creado correctamente.');
      setPortal(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'No se pudo registrar el acceso.');
    }
  };

  const loadPortal = async (e) => {
    e.preventDefault();
    try {
      const res = await parentAPI.getPortal(parentId);
      setPortal(res.data);
      setMessage('✅ Portal cargado.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'No se pudo abrir el portal.');
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '24px auto', padding: 24, background: '#fff', borderRadius: 16 }}>
      {showTeacherLink && (
        <div style={{ marginBottom: 16 }}>
          <Link to="/" style={{ display: 'inline-block', padding: '10px 14px', background: '#2563eb', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>
            Volver al panel de profesores
          </Link>
        </div>
      )}
      <h2>Portal de Padres</h2>
      <p>Registra tu nombre, apellido y el ID de cada hijo para ver su seguimiento.</p>
      <div style={{ background: '#f7f9fc', padding: 12, borderRadius: 12, marginBottom: 16 }}>
        <strong>Enlace para abrir en el celular:</strong>
        <div style={{ wordBreak: 'break-all', marginTop: 6 }}>{parentLink}</div>
      </div>
      <form onSubmit={registerParent} style={{ display: 'grid', gap: 12 }}>
        <input placeholder="Nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <input placeholder="Apellido" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        {children.map((child, index) => (
          <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8 }}>
            <input placeholder="Nombre del hijo" value={child.name} onChange={(e) => updateChild(index, 'name', e.target.value)} required />
            <input placeholder="ID del hijo" value={child.studentId} onChange={(e) => updateChild(index, 'studentId', e.target.value)} required />
            {index > 0 && <button type="button" onClick={() => setChildren(children.filter((_, i) => i !== index))}>Eliminar</button>}
          </div>
        ))}
        <button type="button" onClick={addChild}>Agregar otro hijo</button>
        <button type="submit">Registrar acceso</button>
      </form>

      <hr />
      <h3>Ingresar con tu ID de portal</h3>
      <form onSubmit={loadPortal} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input placeholder="ID de portal" value={parentId} onChange={(e) => setParentId(e.target.value)} required />
        <button type="submit">Entrar</button>
      </form>

      {message && <p>{message}</p>}

      {portal && (
        <div>
          <h3>{portal.firstName} {portal.lastName}</h3>
          {portal.children.map((child) => (
            <div key={child.studentId} style={{ border: '1px solid #eee', borderRadius: 12, padding: 12, marginBottom: 12 }}>
              <h4>{child.studentName || child.name}</h4>
              <p><strong>ID:</strong> {child.studentId}</p>
              {child.attendance?.length ? (
                <ul>
                  {child.attendance.map((record) => (
                    <li key={record.id} style={{ marginBottom: 8 }}>
                      <strong>{record.status}</strong>
                      <div>Fecha: {new Date(record.date).toLocaleString('es-ES')}</div>
                      {record.teacherName && <div>Profesor: {record.teacherName}</div>}
                      {record.subject && <div>Materia: {record.subject}</div>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Aún no hay registros para este hijo.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
