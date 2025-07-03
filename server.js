const express = require('express');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const pool = require('./db'); // Conexión a PostgreSQL

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Asegurar que la carpeta 'qrcodes/' exista
const rutaCarpetaQR = path.join(__dirname, 'qrcodes');
if (!fs.existsSync(rutaCarpetaQR)) {
  fs.mkdirSync(rutaCarpetaQR);
}

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/qrcodes', express.static(path.join(__dirname, 'qrcodes')));

// Generar código QR y guardar en BD
app.post('/api/generar', async (req, res) => {
  try {
    const texto = req.body.texto;

    if (!texto || texto.trim() === '') {
      return res.status(400).send('Texto no válido');
    }

    const nombreArchivo = `qr_${Date.now()}.png`;
    const rutaArchivo = path.join(__dirname, 'qrcodes', nombreArchivo);

    // Generar QR
    await QRCode.toFile(rutaArchivo, texto, { type: 'png' });

    // Guardar en la base de datos
    const fecha = new Date().toISOString();
    await pool.query(
      `INSERT INTO qr_logs (texto, ruta_imagen, fecha)
       VALUES ($1, $2, $3)`,
      [texto, nombreArchivo, fecha]
    );

    // Responder con la ruta del QR
    res.json({ imagen: `/qrcodes/${nombreArchivo}` });
  } catch (err) {
    console.error('Error en /api/generar:', err);
    res.status(500).send('Error al generar el código QR');
  }
});

// Obtener historial de códigos QR
app.get('/api/historial', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM qr_logs ORDER BY id DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error('Error en /api/historial:', err);
    res.status(500).send('Error al obtener historial');
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
