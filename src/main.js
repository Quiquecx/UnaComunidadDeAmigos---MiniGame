import { iniciarZona1 } from './zona1.js';
import { iniciarZona3 } from './zona3.js';

let puntajeTotal = 0;

document.addEventListener('DOMContentLoaded', () => {
    // --- REFERENCIAS DE ELEMENTOS ---
    const btnJugar = document.getElementById('btn-jugar');
    const btnInstrucciones = document.getElementById('btn-instrucciones');
    const pantallaInicio = document.getElementById('pantalla-inicio');
    const escenario1 = document.getElementById('escenario-juego');
    const escenario3 = document.getElementById('escenario-zona3');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');

    // --- LÓGICA DE ADAPTABILIDAD (RESPONSIVE) ---
    function ajustarEscala() {
        const contenedores = [
            document.getElementById('contenedor-mision'),
            document.getElementById('contenedor-runner')
        ];
        
        const baseW = 1024;
        const baseH = 768;
        
        // Calculamos la proporción disponible
        const escala = Math.min(
            window.innerWidth / baseW,
            window.innerHeight / baseH
        );

        // Si la pantalla es más pequeña que el juego, escalamos
        const valorEscala = escala < 1 ? escala * 0.98 : 1; 
        
        document.documentElement.style.setProperty('--escala-juego', valorEscala);
    }

    // Escuchar cambios de tamaño o rotación de pantalla
    window.addEventListener('resize', ajustarEscala);
    window.addEventListener('orientationchange', ajustarEscala);
    ajustarEscala(); // Ejecutar al inicio

    // --- EVENTOS PRINCIPALES ---

    // Botón Jugar: Inicia la aventura
    if (btnJugar) {
        btnJugar.onclick = () => {
            pantallaInicio.classList.add('hidden');
            escenario1.classList.remove('hidden');
            crearMarcadorPuntos();
            
            // Iniciamos Zona 1 pasándole las funciones de callback
            iniciarZona1(finalizarZona1, sumarPuntos);
        };
    }

    // Botón Instrucciones
    if (btnInstrucciones) {
        btnInstrucciones.onclick = () => {
            mostrarMensajeGlobal(
                "¿Cómo Jugar?", 
                "Nivel 1: Encuentra los objetos perdidos en el salón. \nNivel 3: ¡Corre y salta! Usa espacio o toca la pantalla para recoger corazones y esquivar obstáculos."
            );
        };
    }

    // Botón Cerrar Modal Genérico
    if (btnCerrarModal) {
        btnCerrarModal.onclick = () => {
            const modal = document.getElementById('modal-mensaje');
            modal.classList.add('hidden');
            // Limpiamos opciones extra si las hubiera
            document.getElementById('contenedor-opciones').innerHTML = "";
            btnCerrarModal.classList.remove('hidden');
        };
    }

    // --- FUNCIONES DE FLUJO DEL JUEGO ---

    function sumarPuntos(puntos) {
        puntajeTotal += puntos;
        const pVal = document.getElementById('puntos-val');
        if (pVal) pVal.innerText = puntajeTotal;
    }

    function finalizarZona1() {
        console.log("¡Zona 1 completada! Pasando a la Zona 3...");
        
        // Transición de pantallas
        escenario1.classList.add('hidden');
        escenario3.classList.remove('hidden');
        
        // Ajustar el marcador de puntos para que no estorbe en el runner
        const marcadorPuntos = document.getElementById('marcador-puntos');
        if (marcadorPuntos) marcadorPuntos.style.top = "90px"; 

        // Iniciar la lógica del Runner
        iniciarZona3();
    }

    function crearMarcadorPuntos() {
        if (!document.getElementById('marcador-puntos')) {
            const marcador = document.createElement('div');
            marcador.id = 'marcador-puntos';
            marcador.innerHTML = `Puntos de Bondad: <span id="puntos-val">0</span>`;
            
            // Lo añadimos al body para que sea persistente entre niveles
            document.body.appendChild(marcador);
        }
    }

    function mostrarMensajeGlobal(titulo, texto) {
        const modal = document.getElementById('modal-mensaje');
        const mTitulo = document.getElementById('modal-titulo');
        const mTexto = document.getElementById('modal-texto');
        
        if (mTitulo) mTitulo.innerText = titulo;
        if (mTexto) mTexto.innerText = texto;
        
        modal.classList.remove('hidden');
    }
});