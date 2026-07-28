import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  try {
    const teacher = JSON.parse(localStorage.getItem('teacher') || 'null');
    if (teacher?.token) {
      config.headers.Authorization = `Bearer ${teacher.token}`;
    }
  } catch (error) {
    // localStorage corrupto o no disponible: continuar sin token
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404) {
      console.warn('Endpoint no encontrado en el backend:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

// ==================== TEACHERS ====================
export const teacherAPI = {
  register: (teacherData) => apiClient.post('/teachers', teacherData),
  login: (email, password, accessCode) => apiClient.post('/teachers/login', { email, password, accessCode }),
  getAll: () => apiClient.get('/teachers'),
  update: (id, data) => apiClient.put(`/teachers/${id}`, data),
  delete: (id) => apiClient.delete(`/teachers/${id}`),
  getParentsOverview: () => apiClient.get('/teachers/parents/overview')
};

// ==================== STUDENTS ====================
export const studentAPI = {
  create: (studentData) => apiClient.post('/students', studentData),
  getByTeacher: (teacherId) => apiClient.get(`/students/teacher/${teacherId}`),
  markAttendance: (studentId, attendanceData) => apiClient.put(`/students/${studentId}/attendance`, attendanceData),
  deleteAll: () => apiClient.delete('/students'),
  delete: (id) => apiClient.delete(`/students/${id}`),
  getParentsOverview: () => apiClient.get('/students/parents/overview'),
  deleteParent: (id) => apiClient.delete(`/students/parents/${id}`)
};

// ==================== ATTENDANCE ====================
export const attendanceAPI = {
  getAll: () => apiClient.get('/attendance'),
  create: (attendanceData) => apiClient.post('/attendance', attendanceData),
  update: (id, attendanceData) => apiClient.put(`/attendance/${id}`, attendanceData)
};

// ==================== GRADES ====================
export const gradeAPI = {
  getAll: () => apiClient.get('/grades'),
  create: (data) => apiClient.post('/grades', data),
  delete: (id) => apiClient.delete(`/grades/${id}`)
};

// ==================== SECTIONS ====================
export const sectionAPI = {
  getAll: () => apiClient.get('/sections'),
  create: (data) => apiClient.post('/sections', data),
  delete: (id) => apiClient.delete(`/sections/${id}`)
};

// ==================== PARENT PORTAL ====================
export const parentAPI = {
  register: (data) => apiClient.post('/parents/register', data),
  getPortal: (parentId) => apiClient.get(`/parents/${parentId}`)
};

export default apiClient;
