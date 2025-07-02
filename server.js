const express = require('express');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para leer JSON y servir archivos
app.use(express.json());
app.use(express.static('public'));
app.use('/qrcodes', express.static(path.join(__dirname, 'qrcodes')));

// Ruta para generar código QR
app.post('/api/generar', async (req, res) => {
    const { texto } = req.body;

    if (!texto) {
        return res.status(400).json({ error: 'Texto requerido' });
    }

    const nombreArchivo = `qr_${Date.now()}.png`;
    const rutaArchivo = path.join(__dirname, 'qrcodes', nombreArchivo);

    try {
        await QRCode.toFile(rutaArchivo, texto, {
            color: {
                dark: '#000',
                light: '#FFF'
            }
        });

        const urlQR = `/qrcodes/${nombreArchivo}`;
        res.json({ mensaje: 'QR generado', url: urlQR });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'No se pudo generar el QR' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
