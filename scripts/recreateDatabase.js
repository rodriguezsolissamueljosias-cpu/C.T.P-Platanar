const mysql = require('mysql2/promise');

async function recreateDatabase() {
  try {
    // Conectar sin especificar BD
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'sam2904',
    });

    console.log('✓ Conectado a MySQL');

    // Eliminar BD
    await connection.execute('DROP DATABASE IF EXISTS ctp_platanar');
    console.log('✓ Base de datos eliminada');

    // Crear BD
    await connection.execute('CREATE DATABASE ctp_platanar');
    console.log('✓ Base de datos creada');

    await connection.end();
    console.log('✓ Listo para sincronizar');
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

recreateDatabase();
