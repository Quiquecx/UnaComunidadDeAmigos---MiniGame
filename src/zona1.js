import { DATOS_AVENTURA } from './preguntas.js';

const zona1 = DATOS_AVENTURA.zona1;
const RUTA_IMGS = "src/imgs/zona01/"; 
let encontradas = 0;

const sndCorrecto = new Audio('src/sounds/correcto.mp3');

export function iniciarZona1(onFinalizar, onMarcarPuntos) {
    const capaIconos = document.getElementById('capa-iconos');
    const contador = document.getElementById('contador');
    
    capaIconos.innerHTML = "";
    encontradas = 0;
    if (contador) contador.innerText = encontradas;
    
    crearChecklist();

    zona1.pistas.forEach(pista => {
        const div = document.createElement('div');
        div.className = 'pista-icono';
        div.style.top = `${pista.top}px`;
        div.style.left = `${pista.left}px`;
        
        div.onclick = (e) => {
            e.stopPropagation();
            if (div.classList.contains('revelado')) return;
            
            div.classList.add('revelado'); 
            encontradas++;
            if (contador) contador.innerText = encontradas;
            
            marcarChecklist(pista.id);

            // Siempre suma 1 punto por encontrar el objeto
            onMarcarPuntos(1);
            sndCorrecto.currentTime = 0;
            sndCorrecto.play(); 

            setTimeout(() => {
                if (pista.dilema) {
                    lanzarDilema(pista, onMarcarPuntos, () => {
                        verificarVictoria(onFinalizar);
                    });
                } else {
                    // Ahora usa fraseImg para mostrar la imagen del 1 al 10
                    mostrarMensajeLocal("¡Tesoro Encontrado!", pista.fraseImg, pista.img);
                    verificarVictoria(onFinalizar);
                }
            }, 300);
        };
        capaIconos.appendChild(div);
    });
}

function verificarVictoria(onFinalizar) {
    if (encontradas === zona1.pistas.length) {
        const checkCont = document.getElementById('checklist-tesoros');
        if (checkCont) checkCont.style.display = 'none';
        setTimeout(() => { onFinalizar(); }, 1500);
    }
}

function crearChecklist() {
    const escenario = document.getElementById('escenario-juego');
    let checkCont = document.getElementById('checklist-tesoros');
    
    if (!checkCont) {
        checkCont = document.createElement('div');
        checkCont.id = 'checklist-tesoros';
        escenario.appendChild(checkCont);
    }
    
    checkCont.style.display = 'flex'; 
    checkCont.innerHTML = `<h3>Tesoros</h3>` + 
        zona1.pistas.map(p => `
            <div id="check-${p.id}" class="item-check">
                <span>⬜</span> <span>${p.id.toUpperCase()}</span>
            </div>
        `).join('');
}

function marcarChecklist(id) {
    const item = document.getElementById(`check-${id}`);
    if (item) {
        item.innerHTML = `<span>✅</span> <span>${id.toUpperCase()}</span>`;
        item.classList.add('logrado');
    }
}

// --- DENTRO DE ZONA1.JS ---

function mostrarMensajeLocal(titulo, nombreImgFrase, iconoPista) {
    const modal = document.getElementById('modal-mensaje');
    const mTitulo = document.getElementById('modal-titulo');
    const mTexto = document.getElementById('modal-texto');
    const contenedorOpciones = document.getElementById('contenedor-opciones');
    const btnCerrar = document.getElementById('btn-cerrar-modal'); // Referencia al botón
    
    contenedorOpciones.innerHTML = ""; 
    
    // Cambiamos el texto del botón para que no diga "EMPEZAR"
    if (btnCerrar) {
        btnCerrar.innerText = "CONTINUAR";
    }

    mTitulo.innerHTML = `<img src="${RUTA_IMGS}${iconoPista}" class="modal-img-pista"><br>${titulo}`;
    
    mTexto.innerHTML = `
        <div style="text-align:center;">
            <img src="${RUTA_IMGS}${nombreImgFrase}" style="max-width:100%; height:auto; margin-top:10px; border-radius:8px;">
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// Función actualizada para Dilemas: muestra imagen + pregunta
function lanzarDilema(pista, onMarcarPuntos, callback) {
    const modal = document.getElementById('modal-mensaje');
    const mTitulo = document.getElementById('modal-titulo');
    const mTexto = document.getElementById('modal-texto');
    const contenedor = document.getElementById('contenedor-opciones');
    const btnCerrar = document.getElementById('btn-cerrar-modal');

    mTitulo.innerHTML = `<img src="${RUTA_IMGS}${pista.img}" class="modal-img-pista"><br>¡Decisión!`;
    
    // Mostramos la imagen de la frase arriba y la pregunta abajo
    mTexto.innerHTML = `
        <div style="text-align:center; margin-bottom:15px;">
            <img src="${RUTA_IMGS}${pista.fraseImg}" style="max-width:90%; height:auto; border-radius:8px;">
        </div>
        <p style="font-weight:bold; font-size:1.1rem;">${pista.dilema.pregunta}</p>
    `;
    
    contenedor.innerHTML = "";
    btnCerrar.classList.add('hidden');

    pista.dilema.opciones.forEach(opcion => {
        const btn = document.createElement('button');
        btn.className = "btn-opcion";
        btn.innerText = opcion.texto;
        btn.onclick = () => {
            onMarcarPuntos(opcion.puntos);
            contenedor.innerHTML = `<p class="mensaje-exito">¡Hecho! (${opcion.puntos >= 0 ? '+' : ''}${opcion.puntos} pts)</p>`;
            setTimeout(() => {
                modal.classList.add('hidden');
                btnCerrar.classList.remove('hidden');
                if (callback) callback(); 
            }, 1200);
        };
        contenedor.appendChild(btn);
    });
    modal.classList.remove('hidden');
}