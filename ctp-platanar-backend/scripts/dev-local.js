// Levanta un MongoDB en memoria (sin necesidad de Atlas ni un mongod local),
// lo pobla con datos de prueba y arranca el servidor apuntando a él.
// Los datos se pierden al detener el proceso. Solo para desarrollo local.
require('dotenv').config();
const { MongoMemoryServer } = require('mongodb-memory-server');
const connectDB = require('../db');
const seedDatabase = require('./seedData');

(async () => {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-local-only';
  process.env.FRONTEND_ORIGINS = process.env.FRONTEND_ORIGINS || 'http://localhost:3000';

  await connectDB();
  await seedDatabase();

  console.log('🧪 MongoDB en memoria listo con datos de prueba (se pierden al detener el servidor).');
  require('../server');
})();
