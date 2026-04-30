import { DATOS_AVENTURA } from './preguntas.js';

const datos = DATOS_AVENTURA.zona2;
let ctx, canvas;
let pistasObjetos = [];
let fondoImg = new Image();
let callbackFinalizar;
let callbackSumarPuntos; // Callback para actualizar el marcador global

// --- PRECARGA DE SONIDOS ---
const sndCorrecto = new Audio('src/sounds/correcto.mp3');
const sndError = new Audio('src/sounds/error.mp3');

// Coordenadas de las pistas en el mapa
const posicionesPistas = [
    { x: 58,  y: 290 }, // Pista 1 (Amarilla)
    { x: 418, y: 288 }, // Pista 2 (Azul)
    { x: 729, y: 188 }, // Pista 3 (Verde)
    { x: 173, y: 546 }, // Pista 4 (Morada)
    { x: 434, y: 470 }, // Pista 5 (Naranja)
    { x: 729, y: 478 }, // Pista 6 (Roja)
    { x: 933, y: 577 }  // Pista 7 (Cian/Azul claro)
];

/**
 * Inicializa la Zona 2
 * @param {Function} onFinalizar - Callback para pasar al siguiente nivel
 * @param {Function} onSumarPuntos - Callback para sumar puntos al total global
 */
export function iniciarZona2(onFinalizar, onSumarPuntos) {
    callbackFinalizar = onFinalizar;
    callbackSumarPuntos = onSumarPuntos;
    
    canvas = document.getElementById('canvasPistas'); 
    
    if (!canvas) {
        console.error("Error: No se encontró el elemento 'canvasPistas'.");
        return;
    }

    ctx = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 768;

    prepararRecursos();
    canvas.onclick = manejarClick;
}

async function prepararRecursos() {
    const cargarFondo = new Promise((resolve) => {
        fondoImg.src = 'src/imgs/zona02/fondo02.png';
        fondoImg.onload = resolve;
        fondoImg.onerror = () => console.error("No se pudo cargar el fondo de la Zona 2");
    });

    const promesasPistas = datos.pistas.map((pista, index) => {
        return new Promise((resolve) => {
            let img = new Image();
            img.src = `src/imgs/zona02/Pista 0${index + 1}.png`;
            img.onload = () => {
                pistasObjetos[index] = {
                    ...pista,
                    img: img,
                    x: posicionesPistas[index].x,
                    y: posicionesPistas[index].y,
                    w: 50,
                    h: 50,
                    completada: false
                };
                resolve();
            };
            img.onerror = () => {
                console.error(`Error cargando: Pista 0${index + 1}.png`);
                resolve();
            };
        });
    });

    await Promise.all([cargarFondo, ...promesasPistas]);
    dibujarEscena();
}

function dibujarEscena() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(fondoImg, 0, 0, canvas.width, canvas.height);

    pistasObjetos.forEach(pista => {
        if (pista && pista.img) {
            ctx.drawImage(pista.img, pista.x, pista.y, pista.w, pista.h);
            
            // Si la pista ya se resolvió, dibujamos una marca de verificación
            if (pista.completada) {
                ctx.fillStyle = "rgba(76, 175, 80, 0.8)";
                ctx.beginPath();
                ctx.arc(pista.x + pista.w - 10, pista.y + 10, 25, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = "white";
                ctx.font = "bold 30px Arial";
                ctx.textAlign = "center";
                ctx.fillText("✓", pista.x + pista.w - 10, pista.y + 20);
            }
        }
    });
}

function manejarClick(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);

    pistasObjetos.forEach((pista) => {
        if (x > pista.x && x < pista.x + pista.w && y > pista.y && y < pista.y + pista.h) {
            if (!pista.completada) {
                mostrarDilema(pista);
            }
        }
    });
}

function mostrarDilema(pista) {
    const modal = document.getElementById('modal-mensaje');
    const mTitulo = document.getElementById('modal-titulo');
    const mTexto = document.getElementById('modal-texto');
    const contenedorOpciones = document.getElementById('contenedor-opciones');
    const btnCerrar = document.getElementById('btn-cerrar-modal');

    mTitulo.innerText = `${pista.color} ${pista.titulo}`;
    mTexto.innerText = pista.dilema;
    contenedorOpciones.innerHTML = "";
    btnCerrar.classList.add('hidden');

    // --- MEZCLA ALEATORIA DE OPCIONES ---
    const opcionesMezcladas = [...pista.opciones];
    for (let i = opcionesMezcladas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opcionesMezcladas[i], opcionesMezcladas[j]] = [opcionesMezcladas[j], opcionesMezcladas[i]];
    }

    opcionesMezcladas.forEach(opcion => {
        const btn = document.createElement('button');
        btn.className = "btn-opcion";
        btn.innerText = opcion.texto;
        
        btn.onclick = () => {
            if (opcion.correcta) {
                // Éxito: Sonido y Puntos
                sndCorrecto.currentTime = 0;
                sndCorrecto.play();
                
                if (callbackSumarPuntos) callbackSumarPuntos(10); // Sumamos 10 puntos por dilema

                pista.completada = true;
                contenedorOpciones.innerHTML = `
                    <p class="mensaje-exito">¡Excelente decisión! (+10 puntos)</p>
                    <p style="font-style: italic; margin-top:10px; color: #555;">${pista.reto}</p>
                `;
                
                setTimeout(() => {
                    modal.classList.add('hidden');
                    btnCerrar.classList.remove('hidden');
                    dibujarEscena();
                    verificarVictoria();
                }, 3500);
            } else {
                // Error: Sonido y feedback visual
                sndError.currentTime = 0;
                sndError.play();

                btn.style.backgroundColor = "#ffcdd2";
                const textoOriginal = btn.innerText;
                btn.innerText = "❌ Inténtalo de nuevo";
                btn.disabled = true;

                setTimeout(() => {
                    btn.style.backgroundColor = "";
                    btn.innerText = textoOriginal;
                    btn.disabled = false;
                }, 1000);
            }
        };
        contenedorOpciones.appendChild(btn);
    });

    modal.classList.remove('hidden');
}

function verificarVictoria() {
    const todasListas = pistasObjetos.every(p => p.completada);
    if (todasListas) {
        setTimeout(() => {
            if (callbackFinalizar) callbackFinalizar();
        }, 1200);
    }
}