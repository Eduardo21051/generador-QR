console.log('🌐 DATABASE_URL:', process.env.DATABASE_URL);

// db.js
const { Pool } = require('pg');

// Render inyecta la variable DATABASE_URL automáticamente si la definiste
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necesario para Render
  }
});

// Crear tabla si no existe
const crearTabla = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS qr_logs (
        id SERIAL PRIMARY KEY,
        texto TEXT NOT NULL,
        ruta_imagen TEXT NOT NULL,
        fecha TIMESTAMP NOT NULL
      );
    `);
    console.log('✅ Tabla qr_logs verificada o creada correctamente.');
  } catch (err) {
    console.error('❌ Error al crear tabla:', err);
  }
};

crearTabla();

module.exports = pool;
