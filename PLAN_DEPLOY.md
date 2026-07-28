# Plan de limpieza y deploy — CTP Platanar

Documento de diagnóstico y plan de acción.

**Estado actual: Fases 0, 1, 2, 6 y 7 ya están ejecutadas y probadas localmente.** Faltan las Fases 3-5 (Atlas / Render / Vercel), que requieren las cuentas reales del usuario.

Objetivo final: **frontend en Vercel**, **backend en Render**, **base de datos en MongoDB Atlas**.

---

## 1. Qué pasó (causa raíz)

El commit `0b0b4ca` es un merge entre:
- `ef8f007` → el trabajo reciente, con el backend real en `ctp-platanar-backend/` (Node + Express + **Mongoose/MongoDB**).
- `fe11daa` → una versión **vieja** del proyecto, con un backend distinto en la **raíz** del repo (Node + Express + **Sequelize/MySQL**).

El merge se resolvió aceptando ambos lados sin limpiar, y dejó:

- **Marcadores de conflicto de Git commiteados tal cual** (JSON inválido) en:
  - `package.json` (raíz)
  - `vercel.json` (raíz)
  - `.gitignore` (raíz)
- Una **carpeta duplicada completa en la raíz** que es la versión vieja MySQL: `config/`, `models/`, `routes/`, `data/`, `db.js`, `server.js`, `scripts/`, `test/`, `utils/`.
- Se perdieron `ARQUITECTURA.md`, `DEPLOYMENT.md`, `CAMBIOS.md`, `STARTUP_GUIDE.md`, `render.yaml`, `setup-mysql-service.ps1` (existían antes del merge y no se recuperan solos).

**Conclusión:** hay dos backends mezclados. El que se debe deployar es `ctp-platanar-backend/` (Mongoose/MongoDB), no el de la raíz.

---

## 2. Archivos/carpetas a eliminar (duplicados obsoletos)

| Ruta | Motivo |
|---|---|
| `config/` (raíz) | Config Sequelize/MySQL vieja, no se usa en el backend real |
| `models/` (raíz) | Modelos Sequelize duplicados de `ctp-platanar-backend/models` (Mongoose) |
| `routes/` (raíz) | Rutas Sequelize duplicadas |
| `data/` (raíz, incluye `database.sqlite`) | Binario SQLite de la versión vieja |
| `db.js` (raíz) | Conexión Sequelize/MySQL vieja |
| `server.js` (raíz) | Servidor Express de la versión vieja |
| `scripts/recreateDatabase.js`, `scripts/start-dev.js`, `scripts/start-dev.test.js` (raíz) | Scripts atados a la estructura vieja de mono-repo con MySQL |
| `test/` (raíz) | Tests de la versión vieja (Sequelize) |
| `utils/` (raíz) | Utilidades de la versión vieja |
| `vercel.json` (raíz) | Config para deploy combinado frontend+backend en Vercel; ya no aplica (backend va a Render) |
| `ctp-platanar-backend/vercel.json` | Mismo motivo |
| `ctp-platanar-backend/config/database.js` | Config Sequelize sin uso dentro del backend real (usa Mongoose vía `db.js`) |
| `ctp-platanar-backend/data/database.sqlite` | Binario SQLite, obsoleto con Mongo |
| `.vercel/`, `.vercelignore` | Restos de un intento previo de deploy combinado en Vercel |
| `QUICK_START.md` | Habla de una conversión a app de escritorio (Electron), sin relación con el deploy web |
| `health-check.ps1`, `start-app.ps1`, `start-backend.ps1`, `temp-backend-start.ps1`, `temp-frontend-start.ps1`, `verify-setup.js` | Scripts locales de Windows/dev, no relevantes para Vercel/Render |
| `package-lock.json` (raíz) | Solo tiene sentido si se conserva `package.json` raíz para scripts de desarrollo local; a decidir en Fase 0 |

---

## 3. Bugs que bloquean el deploy (aunque se limpie el merge)

1. **`ctp-platanar-backend/server.js` usa `require()` con mayúsculas/minúsculas incorrectas:**
   ```js
   require('./routes/teachers')   // archivo real: routes/Teacher.js
   require('./routes/students')   // archivo real: routes/Student.js
   ```
   Funciona en macOS/Windows (filesystem insensible a mayúsculas) pero **falla en Render (Linux)** con `Cannot find module`. Hay que corregir los `require` (o renombrar los archivos) para que coincidan exactamente.

2. **Falta `react-router-dom` como dependencia del frontend.** Se usa en `App.js` y 6 páginas más, pero no está en `ctp-platanar-frontend/package.json` ni en el lockfile. `npm install && npm run build` fallará en Vercel con `Module not found`.

3. **CORS:** el backend real (`ctp-platanar-backend/server.js`) no tiene `cors` habilitado (solo lo tenía la versión vieja de la raíz). Sin esto, el frontend en Vercel no podrá llamar al backend en Render (dominios distintos).

4. **`.env` con secretos commiteado al repo** (aunque los valores actuales parecen placeholders). Hay que rotar cualquier secreto real antes de hacerlo público y dejar de trackear `.env`.

---

## 4. Brecha funcional frontend vs. backend (pendiente de decisión)

El frontend (`ctp-platanar-frontend/src/utils/api.js`) llama a endpoints que **no existen** en el backend real:

- `POST /api/teachers/login` (login con JWT — `bcryptjs` y `jsonwebtoken` están en las dependencias del backend pero no se usan en ningún archivo)
- `GET /api/teachers/parents/overview`
- `GET /api/students/teacher/:id` (la ruta real es `GET /api/students/:teacherId`, distinta forma)
- `PUT /api/students/:id/attendance`
- `DELETE /api/students`, `DELETE /api/students/:id`, `DELETE /api/students/parents/:id`
- `GET/POST/DELETE /api/grades`
- `GET/POST/DELETE /api/sections`

Pantallas del frontend que dependen de esto y hoy no funcionarían contra el backend real: login de profesores, `RegistrarDashboard`, `CreateSectionsDashboard`, `ParentPortal`, parte de `StudentsDashboard`.

**Esto quedó marcado como pendiente** — se decidirá en una siguiente conversación si se implementan estos endpoints en el backend o se recorta el frontend a lo que ya existe.

---

## 5. Plan de acción por fases

### Fase 0 — Resolver el merge ✅
- [x] Quitar marcadores de conflicto de `package.json`, `vercel.json`, `.gitignore` (raíz).
- [x] Eliminar la duplicación vieja listada en la sección 2.
- [x] Confirmar que `ctp-platanar-backend/` y `ctp-platanar-frontend/` quedan como única fuente de verdad.
- [x] Eliminar además componentes duplicados y sin uso en el frontend (`LoginTeacher.js`, `RegisterTeacher.js`, `src/AttendanceDashboard.js`, `src/TeacherDashboard.js` y sus `.css` — quedaron del merge, `App.js` usa las versiones de `pages/`/`components/`).

### Fase 1 — Arreglar bugs bloqueantes del backend ✅
- [x] Corregir los `require()` de rutas en `server.js` (mayúsculas/minúsculas: `./routes/Teacher`, `./routes/Student`).
- [x] Agregar `cors` al backend real, configurable con `FRONTEND_ORIGINS` (coma-separado).
- [x] Sacar `.env` del control de versiones (queda solo `.env.example`); se eliminó también el `.env` viejo de la raíz (MySQL, ya no aplica).
- [x] `MONGO_URI` en `ctp-platanar-backend/db.js`, ahora con conexión idempotente (evita doble-conexión al usar el modo `dev:local`).

### Fase 2 — Arreglar bugs bloqueantes del frontend ✅
- [x] Agregar `react-router-dom` a `package.json` (`^6.22.0`) — verificado que `npm run build`/`npm start` compilan sin error.
- [x] `REACT_APP_API_URL`: queda en `.env.production` (`/api`, para cuando se sirven juntos) y se agregó `.env.development` con `http://localhost:5000/api` para desarrollo local. **Pendiente decidir en Fase 5** si en Vercel se usa la URL pública completa de Render (dominios distintos) en vez de `/api`.
- [x] Se agregó un interceptor de axios en `utils/api.js` que adjunta el JWT (`Authorization: Bearer`) guardado en `localStorage` a cada request.
- [x] Se corrigió `ParentPortal.js`: usaba `axios.post('/api/parents/...')` con ruta absoluta, ignorando `REACT_APP_API_URL` — hubiera fallado apenas frontend y backend estuvieran en dominios distintos. Ahora usa `parentAPI` (mismo cliente configurado que el resto de la app).
- [x] Se corrigió un bug de precedencia de operadores en `StudentsDashboard.js` (`!teacher?.role === 'admin'` siempre era `false`, así que la lista de profesores se pedía para cualquier usuario, no solo administradores).

### Fase 3 — Configurar MongoDB Atlas
- [ ] Crear cluster/base de datos en el Atlas ya existente.
- [ ] Generar connection string y guardarlo como `MONGO_URI` (no commitear).
- [ ] Verificar reglas de acceso de red (IP allowlist / 0.0.0.0 si Render usa IPs dinámicas).

### Fase 4 — Deploy backend en Render
- [ ] Crear Web Service apuntando a `ctp-platanar-backend/` como root directory.
- [ ] Build command: `npm install`. Start command: `npm start`.
- [ ] Variables de entorno: `MONGO_URI`, `PORT` (Render la inyecta solo), cualquier `JWT_SECRET` si se implementa login.
- [ ] (Opcional) recrear `render.yaml` para infra-as-code.

### Fase 5 — Deploy frontend en Vercel
- [ ] Root directory: `ctp-platanar-frontend`.
- [ ] Build command: `npm run build`. Output: `build/`.
- [ ] Variable de entorno: `REACT_APP_API_URL` = URL pública del backend en Render.

### Fase 6 — Brecha funcional ✅
Decisión: se implementó **todo** — login/JWT, grades, sections, parents overview y el Parent Portal (auto-registro de padres) — para que el frontend funcione tal como está, sin ocultar pantallas.

- [x] `Teacher`: hash de password con bcryptjs en registro + `POST /api/teachers/login` devolviendo JWT (7 días de expiración). Se simplificó el modelo (se quitó el campo `teacherId` string redundante; ahora se usa el `_id` de Mongo como `teacherId` de cara al frontend, vía `toJSON`).
- [x] `accessCode` opcional en login: si coincide con `ADMIN_ACCESS_CODE` (variable de entorno), el token se emite con rol `admin`.
- [x] Middleware `requireAuth` (JWT) protegiendo las rutas de escritura y las de lectura sensibles. `GET /grades` y `GET /sections` quedaron públicas a propósito (catálogos de referencia, se piden aún antes del login en la pantalla de Registrador/Secciones).
- [x] Modelo + rutas CRUD de `Grade`.
- [x] Modelo + rutas CRUD de `Section`.
- [x] `GET /api/students/parents/overview` y `GET /api/teachers/parents/overview` (estudiantes con datos de contacto de padre/madre registrados). "Eliminar padre" limpia esos campos del estudiante, no borra al estudiante.
- [x] Modelo `Parent` + `POST /api/parents/register` y `GET /api/parents/:id` (Parent Portal de autoservicio, sin login).
- [x] Modelo `Student` ampliado con `studentId` (carné/cédula del estudiante, único) y `firstName`/`lastName` (antes solo tenía `name`, no coincidía con lo que el formulario de registro envía). Se agregó virtual `name` para no romper las pantallas que ya lo usaban directamente.
- [x] `Attendance`: se agregó el estado `'Escapando'` al enum (el frontend lo usa pero el modelo no lo permitía) y se quitó el `.populate('studentId')` que rompía la comparación por id en `JustificationDashboard`.
- [x] Script de seed (`scripts/seedData.js` + `scripts/seed.js`) con profesores (uno admin, uno normal), estudiantes, grados, secciones, asistencia y un padre de prueba.
- [x] Modo `npm run dev:local` (`scripts/dev-local.js`, usa `mongodb-memory-server`): levanta un Mongo en memoria, lo siembra y arranca el servidor — **no necesita Atlas ni un mongod instalado** para desarrollo local.

### Fase 7 — Prueba local ✅
Se levantó el backend (`dev:local`) y el frontend (`npm start`) juntos y se validó con un navegador headless (Playwright): login como profesor sembrado, Panel de Estudiantes, Crear Secciones, Registrador (grados/secciones cargados), Asistencia (2 estudiantes listos para pasar lista) — **sin errores de consola ni requests fallidos**. También se probó por API el flujo completo del Parent Portal (registro + consulta).

---

## 6. Cómo correr la app localmente

**Backend** (`ctp-platanar-backend/`):
```bash
npm install
npm run dev:local   # Mongo en memoria + datos de prueba, sin Atlas
```
Credenciales de prueba que crea el seed:
- Admin: `admin@ctpplatanar.edu.cr` / `admin123`
- Profesor: `carlos.mora@ctpplatanar.edu.cr` / `profesor123`

Si en cambio quieres usar tu MongoDB Atlas real: copia `.env.example` a `.env`, pon tu `MONGO_URI`, y corre `npm run seed` (sí borra y vuelve a poblar esa base) seguido de `npm run dev`.

**Frontend** (`ctp-platanar-frontend/`):
```bash
npm install
npm start   # usa .env.development → http://localhost:5000/api
```

---

## 7. Lo que falta (Fases 3-5: requieren tus cuentas reales)

- [ ] **Fase 3 — MongoDB Atlas:** crear el cluster/base definitiva, generar el `MONGO_URI` de producción.
- [ ] **Fase 4 — Render:** crear el Web Service (root: `ctp-platanar-backend`, build: `npm install`, start: `npm start`), configurar `MONGO_URI`, `JWT_SECRET`, `ADMIN_ACCESS_CODE`, `FRONTEND_ORIGINS` (dominio de Vercel).
- [ ] **Fase 5 — Vercel:** crear el proyecto (root: `ctp-platanar-frontend`), configurar `REACT_APP_API_URL` con la URL pública de Render.

## 8. Checklist de verificación post-deploy

- [ ] `GET /health` responde 200 en el backend de Render.
- [ ] El frontend en Vercel puede hacer login/listar sin errores de CORS en consola.
- [ ] Los datos se guardan y persisten en MongoDB Atlas (no en el Mongo en memoria de `dev:local`).
- [ ] No quedan archivos con marcadores de conflicto de Git en el repo (`grep -r "<<<<<<<" .`).
