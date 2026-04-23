import { DATOS_AVENTURA } from './preguntas.js';

const datos = DATOS_AVENTURA.zona3;
let juegoActivo = false;
let ctx, canvas;
let animationId;

// --- SONIDOS ---
const sndCorazon = new Audio('src/sounds/correcto.mp3');
const sndChoque = new Audio('src/sounds/error.mp3');
const sndSalto = new Audio('src/sounds/correcto.mp3'); // Puedes usar el mismo o uno de salto si tienes
sndCorazon.volume = 0.6;
sndChoque.volume = 0.8;

// --- IMÁGENES ---
let fondoImg = new Image();
let imgDer = new Image();
let imgIzq = new Image();

imgDer.src = 'src/imgs/zona03/personaje_derecho.png';
imgIzq.src = 'src/imgs/zona03/personaje_izquierdo.png';

let fondoX = 0;
let velocidad = 7; 
let corazonesRecogidos = 0;
let frameCount = 0;

let personaje = {
    x: 100,
    y: 500, 
    w: 120, 
    h: 150, 
    dy: 0,
    salto: -18,   
    gravedad: 0.9, 
    enSuelo: false,
    frameAnim: 0 
};

let obstaculos = [];
let corazones = [];

export function iniciarZona3() {
    canvas = document.getElementById('canvasRunner');
    ctx = canvas.getContext('2d');
    
    canvas.width = 1024;
    canvas.height = 768;

    fondoImg.src = datos.fondo;
    
    window.removeEventListener('keydown', manejarEntrada);
    window.addEventListener('keydown', manejarEntrada);
    
    canvas.onmousedown = saltar;
    canvas.ontouchstart = (e) => {
        e.preventDefault(); 
        saltar();
    };

    fondoImg.onload = () => {
        if (!juegoActivo) {
            juegoActivo = true;
            resetJuego();
            loopRunner();
        }
    };
    
    if (fondoImg.complete) {
        juegoActivo = true;
        resetJuego();
        loopRunner();
    }
}

function manejarEntrada(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        saltar();
    }
}

function resetJuego() {
    corazonesRecogidos = 0;
    const marcador = document.getElementById('corazones-val');
    if(marcador) marcador.innerText = "0";
    
    obstaculos = [];
    corazones = [];
    velocidad = 7; 
    personaje.y = 500;
    personaje.dy = 0;
    frameCount = 0;
    if (animationId) cancelAnimationFrame(animationId);
}

function saltar() {
    if (personaje.enSuelo) {
        // --- SONIDO DE SALTO ---
        sndSalto.currentTime = 0;
        sndSalto.play().catch(() => {});

        personaje.dy = personaje.salto;
        personaje.enSuelo = false;
    }
}

function loopRunner() {
    if (!juegoActivo) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(fondoImg, fondoX, 0, canvas.width, canvas.height);
    ctx.drawImage(fondoImg, fondoX + canvas.width, 0, canvas.width, canvas.height);

    personaje.dy += personaje.gravedad;
    personaje.y += personaje.dy;

    let limiteSuelo = 610 - personaje.h; 
    if (personaje.y > limiteSuelo) {
        personaje.y = limiteSuelo;
        personaje.dy = 0;
        personaje.enSuelo = true;
    }

    if (personaje.enSuelo) {
        if (frameCount % 10 === 0) {
            personaje.frameAnim = personaje.frameAnim === 0 ? 1 : 0;
        }
    } else {
        personaje.frameAnim = 0; 
    }

    let imagenActual = personaje.frameAnim === 0 ? imgDer : imgIzq;
    ctx.drawImage(imagenActual, personaje.x, personaje.y, personaje.w, personaje.h);

    frameCount++;
    if (frameCount % 100 === 0) generarObstaculo();
    if (frameCount % 150 === 0) generarCorazon();

    obstaculos.forEach((obs, index) => {
        obs.x -= velocidad;
        
        // Dibujo simplificado de Valla
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#333";
        ctx.beginPath();
        ctx.moveTo(obs.x - 10, obs.y + obs.h);
        ctx.lineTo(obs.x + obs.w + 10, obs.y + obs.h);
        ctx.stroke();
        ctx.fillStyle = "#FFD600";
        ctx.fillRect(obs.x, obs.y, obs.w, 25);

        if (rectIntersect(personaje, obs)) {
            // --- SONIDO DE CHOQUE ---
            sndChoque.currentTime = 0;
            sndChoque.play();
            perder();
        }
        if (obs.x < -100) obstaculos.splice(index, 1);
    });

    corazones.forEach((cor, index) => {
        cor.x -= velocidad;
        ctx.font = "50px serif"; 
        ctx.textAlign = "center";
        ctx.fillText("❤️", cor.x, cor.y);

        if (rectIntersect(personaje, {x: cor.x - 25, y: cor.y - 25, w: 50, h: 50})) {
            // --- SONIDO DE CORAZÓN ---
            sndCorazon.currentTime = 0;
            sndCorazon.play();

            corazonesRecogidos++;
            const marcador = document.getElementById('corazones-val');
            if(marcador) marcador.innerText = corazonesRecogidos;
            corazones.splice(index, 1);
            
            if (corazonesRecogidos >= 20) ganarJuego();
        }
        if (cor.x < -100) corazones.splice(index, 1);
    });

    fondoX -= velocidad;
    if (fondoX <= -canvas.width) fondoX = 0;
    velocidad += 0.001; 

    animationId = requestAnimationFrame(loopRunner);
}

function generarObstaculo() {
    obstaculos.push({ x: 1100, y: 520, w: 80, h: 90 });
}

function generarCorazon() {
    const alturaAleatoria = 250 + Math.random() * 200;
    corazones.push({ x: 1100, y: alturaAleatoria });
}

function rectIntersect(a, b) {
    return a.x + 30 < b.x + b.w && a.x + a.w - 30 > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function perder() {
    juegoActivo = false;
    cancelAnimationFrame(animationId);
    mostrarModalFinal("¡Sigue intentándolo!", `Te has distraído del camino.\nRecogiste ${corazonesRecogidos} corazones.`, true);
}

function ganarJuego() {
    juegoActivo = false;
    cancelAnimationFrame(animationId);
    mostrarModalFinal("¡Misión Cumplida!", `¡Increíble! Has demostrado que una comunidad unida llega lejos.\nLograste la meta de corazones.`, false);
}

function mostrarModalFinal(titulo, texto, reintentar) {
    const modal = document.getElementById('modal-mensaje');
    const mTitulo = document.getElementById('modal-titulo');
    const mTexto = document.getElementById('modal-texto');
    const contenedor = document.getElementById('contenedor-opciones');
    const btnCerrar = document.getElementById('btn-cerrar-modal');

    mTitulo.innerText = titulo;
    mTexto.innerText = texto;
    btnCerrar.classList.add('hidden');
    contenedor.innerHTML = "";

    const btnPrincipal = document.createElement('button');
    btnPrincipal.className = "btn-opcion";
    btnPrincipal.innerText = reintentar ? "Reintentar Nivel 3" : "Jugar de nuevo";
    btnPrincipal.onclick = () => {
        modal.classList.add('hidden');
        iniciarZona3();
    };

    const btnMenu = document.createElement('button');
    btnMenu.className = "btn-opcion";
    btnMenu.style.backgroundColor = "#9e9e9e";
    btnMenu.innerText = "Salir al Menú";
    btnMenu.onclick = () => location.reload();

    contenedor.appendChild(btnPrincipal);
    contenedor.appendChild(btnMenu);
    modal.classList.remove('hidden');
}