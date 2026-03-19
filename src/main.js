import { DATOS_AVENTURA } from './preguntas.js';

// Configuración de rutas y estado global
const zona1 = DATOS_AVENTURA.zona1;
const RUTA_IMGS = "src/imgs/zona01/"; 

let encontradas = 0;
let puntajeTotal = 0; // Variable para acumular los puntos de bondad

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const btnJugar = document.getElementById('btn-jugar');
    const pantallaInicio = document.getElementById('pantalla-inicio');
    const escenarioJuego = document.getElementById('escenario-juego');
    const capaIconos = document.getElementById('capa-iconos');
    
    // Referencias del Modal
    const modal = document.getElementById('modal-mensaje');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalTexto = document.getElementById('modal-texto');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');

    // --- INICIO DEL JUEGO ---
    if (btnJugar) {
        btnJugar.onclick = () => {
            pantallaInicio.classList.add('hidden');
            escenarioJuego.classList.remove('hidden');
            // Creamos el marcador de puntos dinámicamente si no existe
            crearMarcadorPuntos();
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
            div.style.top = `${pista.top}px`;
            div.style.left = `${pista.left}px`;
            
            const imgElement = document.createElement('img');
            imgElement.src = `${RUTA_IMGS}${pista.img}`;
            imgElement.alt = pista.id;

            imgElement.onerror = () => {
                console.error(`❌ Error al cargar: ${RUTA_IMGS}${pista.img}.`);
            };

            div.appendChild(imgElement);

            div.onclick = () => {
                if (div.classList.contains('encontrado')) return;
                
                div.classList.add('encontrado'); 
                encontradas++;
                document.getElementById('contador').innerText = encontradas;
                
                // Lógica: ¿Es una pista normal o tiene dilema?
                if (pista.dilema) {
                    lanzarDilema(pista.mensaje, pista.dilema);
                } else {
                    mostrarMensaje("¡Pista Encontrada!", pista.mensaje);
                }

                // Verificar si terminó el nivel
                if (encontradas === zona1.pistas.length) {
                    setTimeout(() => {
                        finalizarNivel();
                    }, 1000);
                }
            };

            capaIconos.appendChild(div);
        });
    }

    // --- MANEJO DE DILEMAS Y PUNTOS ---

    function lanzarDilema(mensajeInicial, datosDilema) {
        modalTitulo.innerText = "¡Momento de Decidir!";
        modalTexto.innerText = `${mensajeInicial}\n\n${datosDilema.pregunta}`;
        
        // Ocultar botón "Continuar" normal para obligar a elegir una opción
        btnCerrarModal.classList.add('hidden');

        // Crear contenedor de opciones si no existe
        let contenedorOpciones = document.getElementById('contenedor-opciones');
        if (!contenedorOpciones) {
            contenedorOpciones = document.createElement('div');
            contenedorOpciones.id = 'contenedor-opciones';
            modalTexto.after(contenedorOpciones);
        }
        contenedorOpciones.innerHTML = ""; // Limpiar opciones previas

        // Crear botones para cada opción del dilema
        datosDilema.opciones.forEach(opcion => {
            const btn = document.createElement('button');
            btn.className = "btn-opcion";
            btn.innerText = opcion.texto;
            
            btn.onclick = () => {
                puntajeTotal += opcion.puntos;
                actualizarInterfazPuntos();
                
                // Feedback rápido al usuario
                contenedorOpciones.innerHTML = `<p style="color:green; font-weight:bold;">¡Buena elección! +${opcion.puntos} puntos.</p>`;
                
                setTimeout(() => {
                    modal.classList.add('hidden');
                    btnCerrarModal.classList.remove('hidden');
                    contenedorOpciones.innerHTML = "";
                }, 1500);
            };
            contenedorOpciones.appendChild(btn);
        });

        modal.classList.remove('hidden');
    }

    // --- FUNCIONES AUXILIARES ---

    function mostrarMensaje(titulo, texto) {
        modalTitulo.innerText = titulo;
        modalTexto.innerText = texto;
        // Limpiar opciones por si quedaron de un dilema previo
        const extra = document.getElementById('contenedor-opciones');
        if (extra) extra.innerHTML = "";
        
        btnCerrarModal.classList.remove('hidden');
        modal.classList.remove('hidden');
    }

    function crearMarcadorPuntos() {
        if (!document.getElementById('marcador-puntos')) {
            const marcador = document.createElement('div');
            marcador.id = 'marcador-puntos';
            marcador.innerHTML = `Puntos de Bondad: <span id="puntos-val">0</span>`;
            // Insertar antes del marcador de pistas o donde prefieras
            document.getElementById('marcador').after(marcador);
        }
    }

    function actualizarInterfazPuntos() {
        const pVal = document.getElementById('puntos-val');
        if (pVal) pVal.innerText = puntajeTotal;
    }

    function finalizarNivel() {
        mostrarMensaje("¡Nivel Completado!", `¡Increíble! Has encontrado todos los tesoros. \nTu puntaje total de bondad es: ${puntajeTotal}`);
    }

    if (btnCerrarModal) {
        btnCerrarModal.onclick = () => {
            modal.classList.add('hidden');
        };
    }
});