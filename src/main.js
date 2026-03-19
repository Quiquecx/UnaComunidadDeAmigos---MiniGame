import { DATOS_AVENTURA } from './preguntas.js';

const zona1 = DATOS_AVENTURA.zona1;
// Asegúrate de que esta ruta termine en / y coincida con tu carpeta
const RUTA_IMGS = "src/imgs/zona01/"; 
let encontradas = 0;

document.addEventListener('DOMContentLoaded', () => {
    const btnJugar = document.getElementById('btn-jugar');
    const pantallaInicio = document.getElementById('pantalla-inicio');
    const escenarioJuego = document.getElementById('escenario-juego');
    const capaIconos = document.getElementById('capa-iconos');

    if (btnJugar) {
        btnJugar.onclick = () => {
            pantallaInicio.classList.add('hidden');
            escenarioJuego.classList.remove('hidden');
            iniciarZona1();
        };
    }

    function iniciarZona1() {
        capaIconos.innerHTML = "";
        encontradas = 0;
        document.getElementById('contador').innerText = encontradas;
        
        zona1.pistas.forEach(pista => {
            const div = document.createElement('div');
            div.className = 'pista-icono';
            
            // Posicionamiento
            div.style.top = `${pista.top}px`;
            div.style.left = `${pista.left}px`;
            
            // Creamos el elemento imagen para poder capturar errores de carga
            const imgElement = document.createElement('img');
            imgElement.src = `${RUTA_IMGS}${pista.img}`;
            imgElement.alt = pista.id;

            // Si la imagen falla al cargar, te avisará en la consola (F12)
            imgElement.onerror = () => {
                console.error(`❌ Error al cargar: ${RUTA_IMGS}${pista.img}. Revisa si el nombre o extensión (.jpg/.png) es correcto.`);
            };

            div.appendChild(imgElement);

            div.onclick = () => {
                if (div.classList.contains('encontrado')) return;
                
                div.classList.add('encontrado'); 
                encontradas++;
                document.getElementById('contador').innerText = encontradas;
                
                mostrarMensaje("¡Pista Encontrada!", pista.mensaje);

                if (encontradas === zona1.pistas.length) {
                    setTimeout(() => {
                        mostrarMensaje("¡Nivel Completado!", "¡Has encontrado todos los tesoros de la comunidad!");
                    }, 500);
                }
            };

            capaIconos.appendChild(div);
        });
    }

    function mostrarMensaje(titulo, texto) {
        const modal = document.getElementById('modal-mensaje');
        const mTitulo = document.getElementById('modal-titulo');
        const mTexto = document.getElementById('modal-texto');
        
        if (modal && mTitulo && mTexto) {
            mTitulo.innerText = titulo;
            mTexto.innerText = texto;
            modal.classList.remove('hidden');
        }
    }

    const btnCerrar = document.getElementById('btn-cerrar-modal');
    if (btnCerrar) {
        btnCerrar.onclick = () => {
            document.getElementById('modal-mensaje').classList.add('hidden');
        };
    }
});