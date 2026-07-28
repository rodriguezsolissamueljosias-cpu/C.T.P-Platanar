// Vacía y vuelve a poblar la base de datos configurada en MONGO_URI (.env) con datos de prueba.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../db');
const seedDatabase = require('./seedData');

(async () => {
  await connectDB();
  await seedDatabase();
  await mongoose.disconnect();
  process.exit(0);
})().catch((error) => {
  console.error('❌ Error al poblar datos:', error);
  process.exit(1);
});
