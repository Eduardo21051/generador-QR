const contenedorQR = document.getElementById('contenedorQR');
const formulario = document.getElementById('formularioQR');
const btnDescarga = document.getElementById('btnDescarga');

const QR = new QRCode(contenedorQR);

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const input = document.getElementById('inpQR');
    const texto = input.value;

    if (!texto || texto.trim() === '') {
        alert('Por favor escribe un texto o URL.');
        return;
    }

    try {
        const response = await fetch('/api/generar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto })
        });

        if (!response.ok) {
            throw new Error('Error en la generación del QR');
        }

        const data = await response.json();

        // Mostrar la imagen generada por el backend
        contenedorQR.innerHTML = `<img src="${data.imagen}" alt="QR generado" />`;

    } catch (err) {
        console.error(err);
        alert('Hubo un error al generar el código QR');
    }
});
