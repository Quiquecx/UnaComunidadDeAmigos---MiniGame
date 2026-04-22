import { iniciarZona1 } from './zona1.js';
import { iniciarZona2 } from './zona2.js';
import { iniciarZona3 } from './zona3.js';

let puntajeTotal = 0;

document.addEventListener('DOMContentLoaded', () => {
    // --- REFERENCIAS ---
    const pantallaInicio = document.getElementById('pantalla-inicio');
    const escenario1 = document.getElementById('escenario-juego');
    const escenario2 = document.getElementById('escenario-zona2');
    const escenario3 = document.getElementById('escenario-zona3');
    
    const btnJugar = document.getElementById('btn-jugar');
    const btnInstrucciones = document.getElementById('btn-instrucciones');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');

    // --- ADAPTABILIDAD ---
    function ajustarEscala() {
        const baseW = 1024;
        const baseH = 768;
        const escala = Math.min(window.innerWidth / baseW, window.innerHeight / baseH);
        document.documentElement.style.setProperty('--escala-juego', escala < 1 ? escala * 0.98 : 1);
    }
    window.addEventListener('resize', ajustarEscala);
    ajustarEscala();

    // --- EVENTOS DE INICIO ---
    if (btnJugar) {
        btnJugar.onclick = () => {
            pantallaInicio.classList.add('hidden');
            crearMarcadorPuntos();
            iniciarFlujoZona1(); // Paso 1: Intro + Juego 1
        };
    }

    if (btnInstrucciones) {
        btnInstrucciones.onclick = () => {
            mostrarMensajeGlobal("¿Cómo Jugar?", "Nivel 1: Encuentra objetos.\nNivel 2: Resuelve dilemas en el mapa.\nNivel 3: ¡Corre y recoge corazones!");
        };
    }

    // Comportamiento base del botón cerrar (limpia y oculta)
    btnCerrarModal.onclick = ocultarModal;

    function ocultarModal() {
        document.getElementById('modal-mensaje').classList.add('hidden');
        document.getElementById('contenedor-opciones').innerHTML = "";
    }

    // --- FLUJO ZONA 1 ---
    function iniciarFlujoZona1() {
        escenario1.classList.remove('hidden');
        mostrarMensajeGlobal("🔍 Misión: El Tesoro", "Jesús ha dejado tesoros en el salón. Encuentra los 10 objetos para descubrir sus mensajes.");
        
        // Al cerrar esta intro, inicia el juego 1
        btnCerrarModal.onclick = () => {
            ocultarModal();
            iniciarZona1(finalizarZona1, sumarPuntos);
            btnCerrarModal.onclick = ocultarModal; // Restaurar
        };
    }

    function finalizarZona1() {
        mostrarMensajeGlobal("¡Nivel 1 Completado! ✅", "¡Excelente buscador! Ahora vamos al mapa de la comunidad.");
        
        btnCerrarModal.onclick = () => {
            ocultarModal();
            escenario1.classList.add('hidden');
            escenario2.classList.remove('hidden');
            iniciarFlujoZona2(); // Paso 2: Intro + Juego 2
            btnCerrarModal.onclick = ocultarModal;
        };
    }

    // --- FLUJO ZONA 2 ---
function iniciarFlujoZona2() {
    // 1. Mostramos el escenario primero
    escenario2.classList.remove('hidden');
    
    // 2. Esperamos un instante antes de mostrar el mensaje e iniciar la lógica
    setTimeout(() => {
        mostrarMensajeGlobal(
            "🗺️ Mapa de Comunidad", 
            "Busca las 7 pistas de colores en el mapa y resuelve los dilemas para aprender a vivir unidos."
        );

        btnCerrarModal.onclick = () => {
            ocultarModal();
            // 3. Iniciamos la zona 2 solo cuando el canvas ya es visible en el DOM
            iniciarZona2(finalizarZona2);
            btnCerrarModal.onclick = ocultarModal;
        };
    }, 50); 
}

    function finalizarZona2() {
        mostrarMensajeGlobal("¡Nivel 2 Completado! ✅", "¡Qué buen corazón tienes! Es hora de correr hacia la meta.");
        
        btnCerrarModal.onclick = () => {
            ocultarModal();
            escenario2.classList.add('hidden');
            escenario3.classList.remove('hidden');
            iniciarFlujoZona3(); // Paso 3: Intro + Juego 3
            btnCerrarModal.onclick = ocultarModal;
        };
    }

    // --- FLUJO ZONA 3 ---
    function iniciarFlujoZona3() {
        // 1. Aseguramos visibilidad primero
        escenario3.classList.remove('hidden');

        // 2. Pequeño respiro para que el navegador dimensione el canvasRunner
        setTimeout(() => {
            const marcadorPuntos = document.getElementById('marcador-puntos');
            if (marcadorPuntos) marcadorPuntos.style.top = "90px"; 

            mostrarMensajeGlobal(
                "🏃 Corre por la Santidad", 
                "Recoge corazones y evita los obstáculos. ¡Usa Espacio o clic para saltar!"
            );

            btnCerrarModal.onclick = () => {
                ocultarModal();
                // 3. Ahora sí, iniciamos el motor del juego
                iniciarZona3();
                btnCerrarModal.onclick = ocultarModal;
            };
        }, 60); 
    }

    // --- UTILIDADES ---
    function sumarPuntos(puntos) {
        puntajeTotal += puntos;
        const pVal = document.getElementById('puntos-val');
        if (pVal) pVal.innerText = puntajeTotal;
    }

    function crearMarcadorPuntos() {
        if (!document.getElementById('marcador-puntos')) {
            const marcador = document.createElement('div');
            marcador.id = 'marcador-puntos';
            marcador.innerHTML = `Puntos: <span id="puntos-val">0</span>`;
            document.body.appendChild(marcador);
        }
    }

    function mostrarMensajeGlobal(titulo, texto) {
        const modal = document.getElementById('modal-mensaje');
        document.getElementById('modal-titulo').innerText = titulo;
        document.getElementById('modal-texto').innerText = texto;
        modal.classList.remove('hidden');
    }
});