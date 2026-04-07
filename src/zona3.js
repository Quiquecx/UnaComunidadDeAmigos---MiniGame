import { DATOS_AVENTURA } from './preguntas.js';

const datos = DATOS_AVENTURA.zona3;
let juegoActivo = false;
let ctx, canvas;

// --- IMÁGENES ---
let fondoImg = new Image();
let imgDer = new Image();
let imgIzq = new Image();

imgDer.src = 'src/imgs/zona03/personaje_derecho.png';
imgIzq.src = 'src/imgs/zona03/personaje_izquierdo.png';

// Variables de Juego
let fondoX = 0;
let velocidad = 8; // --- AUMENTADA: Empieza más rápido ---
let corazonesRecogidos = 0;
let frameCount = 0;

// Físicas del Personaje
let personaje = {
    x: 100,
    y: 500, 
    w: 120, 
    h: 150, 
    dy: 0,
    salto: -18,   // --- AJUSTADO: Salto más potente ---
    gravedad: 0.9, // --- AJUSTADO: Cae un poco más rápido (menos "gravity" lunar) ---
    enSuelo: false,
    frameAnim: 0 
};

// Listas de objetos
let obstaculos = [];
let corazones = [];

export function iniciarZona3() {
    canvas = document.getElementById('canvasRunner');
    ctx = canvas.getContext('2d');
    
    canvas.width = 1024;
    canvas.height = 768;

    fondoImg.src = datos.fondo;
    
    window.addEventListener('keydown', manejarEntrada);
    canvas.addEventListener('mousedown', saltar);
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault(); 
        saltar();
    }, { passive: false });

    fondoImg.onload = () => {
        juegoActivo = true;
        resetJuego();
        loopRunner();
    };
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
    velocidad = 8; // Reset a la nueva velocidad rápida
    personaje.y = 500;
    personaje.dy = 0;
    frameCount = 0;
}

function saltar() {
    if (personaje.enSuelo) {
        personaje.dy = personaje.salto;
        personaje.enSuelo = false;
    }
}

function loopRunner() {
    if (!juegoActivo) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(fondoImg, fondoX, 0, canvas.width, canvas.height);
    ctx.drawImage(fondoImg, fondoX + canvas.width, 0, canvas.width, canvas.height);

    // LÓGICA DEL PERSONAJE
    personaje.dy += personaje.gravedad;
    personaje.y += personaje.dy;

    let limiteSuelo = 610 - personaje.h; 
    if (personaje.y > limiteSuelo) {
        personaje.y = limiteSuelo;
        personaje.dy = 0;
        personaje.enSuelo = true;
    }

    // ANIMACIÓN DE CAMINADO (Adaptada a la velocidad)
    // Usamos frameCount % 10 porque al ir más rápido, la animación debe ser más ágil
    if (personaje.enSuelo) {
        if (frameCount % 10 === 0) {
            personaje.frameAnim = personaje.frameAnim === 0 ? 1 : 0;
        }
    } else {
        personaje.frameAnim = 0; 
    }

    let imagenActual = personaje.frameAnim === 0 ? imgDer : imgIzq;
    ctx.drawImage(imagenActual, personaje.x, personaje.y, personaje.w, personaje.h);

    // GENERAR OBJETOS
    frameCount++;
    // Generación un poco más frecuente para compensar la velocidad
    if (frameCount % 100 === 0) generarObstaculo();
    if (frameCount % 150 === 0) generarCorazon();

    // 4. DIBUJAR VALLAS
    obstaculos.forEach((obs, index) => {
        obs.x -= velocidad;
        
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#333";
        
        ctx.beginPath();
        ctx.moveTo(obs.x - 10, obs.y + obs.h);
        ctx.lineTo(obs.x + obs.w + 10, obs.y + obs.h);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(obs.x + 5, obs.y);
        ctx.lineTo(obs.x + 5, obs.y + obs.h);
        ctx.moveTo(obs.x + obs.w - 5, obs.y);
        ctx.lineTo(obs.x + obs.w - 5, obs.y + obs.h);
        ctx.stroke();

        ctx.fillStyle = "#FFD600";
        ctx.fillRect(obs.x, obs.y, obs.w, 25);
        
        ctx.fillStyle = "#000";
        ctx.fillRect(obs.x + 10, obs.y, 10, 25);
        ctx.fillRect(obs.x + obs.w - 20, obs.y, 10, 25);

        if (rectIntersect(personaje, obs)) perder();
        if (obs.x < -100) obstaculos.splice(index, 1);
    });

    // 5. CORAZONES
    corazones.forEach((cor, index) => {
        cor.x -= velocidad;
        ctx.font = "50px serif"; 
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("❤️", cor.x, cor.y);

        if (rectIntersect(personaje, {x: cor.x - 25, y: cor.y - 25, w: 50, h: 50})) {
            corazonesRecogidos++;
            const marcador = document.getElementById('corazones-val');
            if(marcador) marcador.innerText = corazonesRecogidos;
            corazones.splice(index, 1);
        }
        if (cor.x < -100) corazones.splice(index, 1);
    });

    fondoX -= velocidad;
    if (fondoX <= -canvas.width) fondoX = 0;
    
    // Aceleración constante
    velocidad += 0.001; 

    requestAnimationFrame(loopRunner);
}

function generarObstaculo() {
    obstaculos.push({ x: 1100, y: 520, w: 80, h: 90 });
}

function generarCorazon() {
    const alturaAleatoria = 250 + Math.random() * 200;
    corazones.push({ x: 1100, y: alturaAleatoria });
}

function rectIntersect(a, b) {
    // Colisión ajustada: el personaje tiene un margen para no chocar con el aire
    return a.x + 30 < b.x + b.w && a.x + a.w - 30 > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function perder() {
    juegoActivo = false;
    const modal = document.getElementById('modal-mensaje');
    const mTitulo = document.getElementById('modal-titulo');
    const mTexto = document.getElementById('modal-texto');
    const contenedorOpciones = document.getElementById('contenedor-opciones');
    const btnCerrar = document.getElementById('btn-cerrar-modal');

    mTitulo.innerHTML = "¡Sigue intentándolo!";
    mTexto.innerText = `Te has distraído del camino.\nRecogiste ${corazonesRecogidos} corazones de santidad.`;
    
    btnCerrar.classList.add('hidden');
    contenedorOpciones.innerHTML = "";

    const btnReintentar = document.createElement('button');
    btnReintentar.className = "btn-opcion";
    btnReintentar.innerText = "Reintentar Nivel 3";
    btnReintentar.onclick = () => {
        modal.classList.add('hidden');
        btnCerrar.classList.remove('hidden');
        iniciarZona3();
    };

    const btnMenu = document.createElement('button');
    btnMenu.className = "btn-opcion";
    btnMenu.style.backgroundColor = "#9e9e9e";
    btnMenu.innerText = "Reiniciar todo el juego";
    btnMenu.onclick = () => location.reload();

    contenedorOpciones.appendChild(btnReintentar);
    contenedorOpciones.appendChild(btnMenu);
    modal.classList.remove('hidden');
}