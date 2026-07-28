import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI, sectionAPI, teacherAPI } from '../utils/api';
import './StudentsDashboard.css';

export default function StudentsDashboard({ teacher, setSection, section }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sections, setSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [parentsOverview, setParentsOverview] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  const filteredStudents = (() => {
    const q = (searchTerm || '').toLowerCase();
    if (!q) return students;
    return students.filter(s => {
      const fullName = (s.name || `${s.firstName || ''} ${s.lastName || ''}`).trim();
      return fullName.toLowerCase().includes(q);
    });
  })();

  useEffect(() => {
    const fetch = async () => {
      if (!teacher) return;
      setLoading(true);
      try {
        const teacherId = teacher.teacherId || teacher.id;
        const res = await studentAPI.getByTeacher(teacherId);
        setStudents(res.data.filter(s => !section || s.section === section));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [teacher, section]);

  useEffect(() => {
    const fetchSections = async () => {
      setSectionsLoading(true);
      try {
        const res = await sectionAPI.getAll();
        setSections(res.data || []);
        if ((!section || !res.data.find(s => s.name === section)) && res.data && res.data.length > 0) {
          setSection(res.data[0].name);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSectionsLoading(false);
      }
    };
    fetchSections();
  }, [setSection, section]);

  useEffect(() => {
    const fetchParents = async () => {
      if (!teacher) return;
      try {
        const res = await studentAPI.getParentsOverview();
        setParentsOverview(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchParents();
  }, [teacher]);

  useEffect(() => {
    const fetchTeachers = async () => {
      if (teacher?.role !== 'admin') return;
      try {
        const res = await teacherAPI.getAll();
        setTeachers(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTeachers();
  }, [teacher]);

  const handleDelete = async (studentId) => {
    try {
      await studentAPI.delete(studentId);
      setStudents(prev => prev.filter(s => s.id !== studentId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteParent = async (parentId) => {
    try {
      await studentAPI.deleteParent(parentId);
      setParentsOverview(prev => prev.filter(item => item.id !== parentId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleTeacherStatusChange = async (teacherId, isActive) => {
    try {
      await teacherAPI.update(teacherId, { isActive, role: 'teacher' });
      setTeachers(prev => prev.map(item => item.id === teacherId ? { ...item, isActive } : item));
      alert(isActive ? 'Profesor activado' : 'Profesor bloqueado');
    } catch (err) {
      console.error(err);
      alert('No se pudo actualizar el profesor');
    }
  };

  const handleDeleteTeacher = async (teacherId) => {
    try {
      await teacherAPI.delete(teacherId);
      setTeachers(prev => prev.filter(item => item.id !== teacherId));
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="students-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h2>📚 Panel de Estudiantes</h2>
            <p className="header-subtitle">Profesor: {teacher ? `${teacher.firstName || teacher.name || 'Profesor'} ${teacher.lastName || ''}`.trim() : 'No identificado - por favor inicia sesión'}</p>
          </div>
        </div>

        <div className="section-selector">
          <label>Selecciona Sección:</label>
          <select value={section} onChange={(e) => setSection(e.target.value)} className="section-select">
            {sectionsLoading ? (
              <option>Loading...</option>
            ) : (
              sections.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))
            )}
          </select>
          <div className="search-field">
            <label htmlFor="student-search">Buscar estudiante:</label>
            <input
              id="student-search"
              className="search-input"
              type="text"
              placeholder="Deiby Samir"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="btn-primary"
            onClick={() => navigate('/registrar')}
          >
            📝 Registrador de Estudiantes
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/sections')}
          >
            🏗️ Crear Secciones
          </button>
          <button 
            className="btn-success"
            onClick={() => navigate('/attendance')}
          >
            ✓ Pasar Asistencia
          </button>
          <button 
            className="btn-success"
            onClick={() => navigate('/justifications')}
          >
            📋 Justificaciones
          </button>
        </div>

        <div className="students-info">
          <h3>📊 Total de Estudiantes: <span className="count">{students.length}</span></h3>
          <h3>👨‍👩‍👧‍👦 Padres registrados: <span className="count">{parentsOverview.filter(p => p.parentEmail || p.parentPhone).length}</span></h3>
          {searchTerm && (
            <p className="search-info">Filtrando por: "{searchTerm}"</p>
          )}
        </div>

        {teacher?.role === 'admin' && (
          <>
            <div className="table-wrapper" style={{ marginTop: 16 }}>
              <h3>Gestión de padres</h3>
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Sección</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {parentsOverview.filter(item => item.parentEmail || item.parentPhone).map(item => (
                    <tr key={item.id}>
                      <td>{item.firstName} {item.lastName}</td>
                      <td>{item.section}</td>
                      <td>{item.parentEmail || '—'}</td>
                      <td>{item.parentPhone || '—'}</td>
                      <td><button onClick={() => handleDeleteParent(item.id)}>Eliminar padre</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-wrapper" style={{ marginTop: 16 }}>
              <h3>Gestión de profesores</h3>
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Profesor</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map(item => (
                    <tr key={item.id}>
                      <td>{item.firstName} {item.lastName}</td>
                      <td>{item.email}</td>
                      <td>{item.role}</td>
                      <td>{item.isActive ? 'Activo' : 'Bloqueado'}</td>
                      <td>
                        <button onClick={() => handleTeacherStatusChange(item.id, !item.isActive)}>{item.isActive ? 'Bloquear' : 'Activar'}</button>
                        <button style={{ marginLeft: 8, background: '#f5576c', color: '#fff' }} onClick={() => handleDeleteTeacher(item.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {loading ? (
          <div className="loading">
            <p>⏳ Cargando estudiantes...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <p>🎓 No hay estudiantes registrados en esta sección</p>
            <button className="btn-primary" onClick={() => navigate('/registrar')}>
              Agregar Primer Estudiante
            </button>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="empty-state">
            <p>🔎 No se encontraron estudiantes con ese nombre.</p>
            <button className="btn-primary" onClick={() => setSearchTerm('')}>
              Mostrar todos
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="students-table">
              <thead>
                <tr>
                  <th>👤 Nombre</th>
                  <th>📖 Grado</th>
                  <th>🏢 Sección</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, idx) => (
                  <tr key={s.id} className={idx % 2 === 0 ? 'even' : 'odd'}>
                    <td className="student-name">{s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim()}</td>
                    <td>{s.grade}</td>
                    <td>
                      <span className="section-badge">{s.section}</span>
                    </td>
                    <td>
                      <button style={{ background: '#f5576c', color: '#fff' }} onClick={() => handleDelete(s.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
