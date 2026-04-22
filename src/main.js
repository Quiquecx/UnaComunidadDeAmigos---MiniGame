import { iniciarZona1 } from './zona1.js';
import { iniciarZona2 } from './zona2.js';
import { iniciarZona3 } from './zona3.js';

let puntajeTotal = 0;

// --- CONFIGURACIÓN DE AUDIO GLOBAL ---
const musicaIntro = new Audio('src/sounds/intro.mp3');
musicaIntro.loop = true;
musicaIntro.volume = 0.1; // Ajustado al 40% para que no opaque los efectos

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
            // INICIAR MÚSICA (Esto cumple con la política de interacción del navegador)
            musicaIntro.play().catch(error => console.log("Esperando interacción para audio:", error));
            
            pantallaInicio.classList.add('hidden');
            crearMarcadorPuntos();
            iniciarFlujoZona1(); 
        };
    }

    if (btnInstrucciones) {
        btnInstrucciones.onclick = () => {
            mostrarMensajeGlobal("¿Cómo Jugar?", "Nivel 1: Encuentra objetos.\nNivel 2: Resuelve dilemas en el mapa.\nNivel 3: ¡Corre y recoge corazones!");
        };
    }

    // Comportamiento base del botón cerrar
    btnCerrarModal.onclick = ocultarModal;

    function ocultarModal() {
        document.getElementById('modal-mensaje').classList.add('hidden');
        document.getElementById('contenedor-opciones').innerHTML = "";
    }

    // --- FLUJO ZONA 1 ---
    function iniciarFlujoZona1() {
        escenario1.classList.remove('hidden');
        mostrarMensajeGlobal("🔍 Misión: El Tesoro", "Jesús ha dejado tesoros en el salón. Encuentra los 10 objetos para descubrir sus mensajes.");
        
        btnCerrarModal.onclick = () => {
            ocultarModal();
            iniciarZona1(finalizarZona1, sumarPuntos);
            btnCerrarModal.onclick = ocultarModal;
        };
    }

    function finalizarZona1() {
        mostrarMensajeGlobal("¡Nivel 1 Completado! ✅", "¡Excelente buscador! Ahora vamos al mapa de la comunidad.");
        
        btnCerrarModal.onclick = () => {
            ocultarModal();
            escenario1.classList.add('hidden');
            escenario2.classList.remove('hidden');
            iniciarFlujoZona2();
            btnCerrarModal.onclick = ocultarModal;
        };
    }

    // --- FLUJO ZONA 2 ---
    function iniciarFlujoZona2() {
        escenario2.classList.remove('hidden');
        
        setTimeout(() => {
            mostrarMensajeGlobal(
                "🗺️ Mapa de Comunidad", 
                "Busca las 7 pistas de colores en el mapa y resuelve los dilemas para aprender a vivir unidos."
            );

            btnCerrarModal.onclick = () => {
                ocultarModal();
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
            iniciarFlujoZona3();
            btnCerrarModal.onclick = ocultarModal;
        };
    }

    // --- FLUJO ZONA 3 ---
    function iniciarFlujoZona3() {
        escenario3.classList.remove('hidden');

        setTimeout(() => {
            const marcadorPuntos = document.getElementById('marcador-puntos');
            if (marcadorPuntos) marcadorPuntos.style.top = "90px"; 

            mostrarMensajeGlobal(
                "🏃 Corre por la Santidad", 
                "Recoge corazones y evita los obstáculos. ¡Usa Espacio o clic para saltar!"
            );

            btnCerrarModal.onclick = () => {
                ocultarModal();
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