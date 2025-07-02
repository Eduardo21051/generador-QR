const contenedorQR = document.getElementById('contenedorQR');
const formulario = document.getElementById('formularioQR');
const btnDescarga = document.getElementById('btnDescarga');

const QR = new QRCode(contenedorQR);

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('inpQR');
    QR.makeCode(input.value);
});

btnDescarga.addEventListener('click', () => {
    const img = contenedorQR.querySelector('img');
    const canvas = contenedorQR.querySelector('canvas');

    let url = '';
    if (img) {
        url = img.src;
    } else if (canvas) {
        url = canvas.toDataURL('image/png'); 
    } else {
        alert('No hay código QR generado.');
        return;
    }

    const enlace = document.createElement('a'); 
    enlace.href = url;                          
    enlace.download = 'codigo-qr.png';          
    enlace.click();
});