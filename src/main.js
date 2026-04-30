import { iniciarZona1 } from './zona1.js';
import { iniciarZona2 } from './zona2.js';
import { iniciarZona3 } from './zona3.js';

let puntajeTotal = 0;

// --- CONFIGURACIÓN DE AUDIO GLOBAL ---
const musicaIntro = new Audio('src/sounds/intro.mp3');
musicaIntro.loop = true;
musicaIntro.volume = 0.1; 

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
            musicaIntro.play().catch(error => console.log("Esperando interacción:", error));
            pantallaInicio.classList.add('hidden');
            crearMarcadorPuntos();
            iniciarFlujoZona1(); 
        };
    }

    if (btnInstrucciones) {
        btnInstrucciones.onclick = () => {
            mostrarMensajeGlobal(
                "¿Cómo Jugar?", 
                "<p>• <b>Nivel 1</b>: Encuentra objetos escondidos.<br>• <b>Nivel 2</b>: Resuelve dilemas en la comunidad.<br>• <b>Nivel 3</b>: ¡Corre y recoge corazones!</p>"
            );
        };
    }

    btnCerrarModal.onclick = ocultarModal;

    function ocultarModal() {
        document.getElementById('modal-mensaje').classList.add('hidden');
        document.getElementById('contenedor-opciones').innerHTML = "";
    }

    // --- FLUJO ZONA 1 ---
    function iniciarFlujoZona1() {
        escenario1.classList.remove('hidden');
        mostrarMensajeGlobal(
            "✨ NIVEL 1 ✨", 
            "<div class='badge-mision'>Misión: El Tesoro</div><p>Jesús ha dejado tesoros en el salón. Encuentra los <b>10 objetos</b> para descubrir sus mensajes.</p>", 
            "src/imgs/zona01/cofre.png"
        );
        
        btnCerrarModal.innerHTML = "¡EMPEZAR!";
        btnCerrarModal.onclick = () => {
            ocultarModal();
            iniciarZona1(finalizarZona1, sumarPuntos);
            btnCerrarModal.onclick = ocultarModal;
        };
    }

    function finalizarZona1() {
        mostrarMensajeGlobal("¡Nivel 1 Completado! ✅", "¡Excelente buscador! Ahora vamos al mapa de la comunidad.", true);
        
        btnCerrarModal.innerHTML = "IR AL MAPA";
        btnCerrarModal.onclick = () => {
            ocultarModal();
            escenario1.classList.add('hidden');
            escenario2.classList.remove('hidden');
            iniciarFlujoZona2();
        };
    }

    // --- FLUJO ZONA 2 ---
    function iniciarFlujoZona2() {
        escenario2.classList.remove('hidden');
        setTimeout(() => {
            mostrarMensajeGlobal(
                "🌈 NIVEL 2 🌈", 
                "<div class='badge-mision'>Mapa de Comunidad</div><p>Busca las <b>7 pistas</b> de colores y ayuda a tus amigos resolviendo los dilemas.</p>",
                "src/imgs/zona02/comunidad.png"
            );
            btnCerrarModal.innerHTML = "EXPLORAR";
            btnCerrarModal.onclick = () => {
                ocultarModal();
                iniciarZona2(finalizarZona2, sumarPuntos);
            };
        }, 50); 
    }

    function finalizarZona2() {
        mostrarMensajeGlobal("¡Nivel 2 Completado! ✅", "¡Qué buen corazón tienes! Es hora de correr hacia la meta.", true);
        
        btnCerrarModal.innerHTML = "A LA META";
        btnCerrarModal.onclick = () => {
            ocultarModal();
            escenario2.classList.add('hidden');
            escenario3.classList.remove('hidden');
            iniciarFlujoZona3();
        };
    }

    // --- FLUJO ZONA 3 ---
    function iniciarFlujoZona3() {
        escenario3.classList.remove('hidden');
        setTimeout(() => {
            const marcadorPuntos = document.getElementById('marcador-puntos');
            if (marcadorPuntos) marcadorPuntos.style.top = "90px"; 
            mostrarMensajeGlobal(
                "⚡ NIVEL 3 ⚡", 
                "<div class='badge-mision'>Corre por la Santidad</div><p>¡Rápido! Recoge corazones y evita los obstáculos para llegar al cielo.</p>",
                "src/imgs/zona03/santidad.png"
            );
            btnCerrarModal.innerHTML = "¡CORRER!";
            btnCerrarModal.onclick = () => {
                ocultarModal();
                iniciarZona3(sumarPuntos);
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

    function mostrarMensajeGlobal(titulo, texto, extra = null) {
        const modal = document.getElementById('modal-mensaje');
        const mTitulo = document.getElementById('modal-titulo');
        const mTexto = document.getElementById('modal-texto');
        const contenedorOpciones = document.getElementById('contenedor-opciones');

        mTitulo.innerText = titulo;
        contenedorOpciones.innerHTML = ""; 

        let contenidoHTML = "";

        if (typeof extra === 'string') {
            contenidoHTML += `<img src="${extra}" class="modal-img-nivel">`;
        }

        contenidoHTML += texto;

        if (extra === true) {
            contenidoHTML += `
                <br><br>
                <div style="text-align:center;">
                    <small style="color:#888; text-transform:uppercase; font-weight:bold;">Puntaje Acumulado</small><br>
                    <span id="score-animado" class="score-llamativo" style="font-size:3rem; color:#4caf50; font-weight:bold;">0</span>
                </div>
            `;
            mTexto.innerHTML = contenidoHTML;
            setTimeout(() => {
                animarConteo(puntajeTotal, document.getElementById('score-animado'));
            }, 100);
        } else {
            mTexto.innerHTML = contenidoHTML;
        }

        modal.classList.remove('hidden');
    }

    function animarConteo(objetivo, elemento) {
        if (!elemento) return;
        let inicio = 0;
        const pasos = 30; 
        const incremento = objetivo / pasos;
        let iteracion = 0;

        const timer = setInterval(() => {
            inicio += incremento;
            iteracion++;
            if (iteracion >= pasos) {
                elemento.innerText = Math.floor(objetivo);
                clearInterval(timer);
            } else {
                elemento.innerText = Math.floor(inicio);
            }
        }, 30);
    }
});