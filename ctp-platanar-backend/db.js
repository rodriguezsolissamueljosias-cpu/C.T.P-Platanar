const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conexión a MongoDB Atlas establecida correctamente.');
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB Atlas:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
