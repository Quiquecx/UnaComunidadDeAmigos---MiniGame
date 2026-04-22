import { DATOS_AVENTURA } from './preguntas.js';

const zona1 = DATOS_AVENTURA.zona1;
const RUTA_IMGS = "src/imgs/zona01/"; 
let encontradas = 0;

// --- PRECARGA DE SONIDOS ---
const sndCorrecto = new Audio('src/sounds/correcto.mp3');
const sndError = new Audio('src/sounds/error.mp3');

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
        
        // --- AJUSTE DE RANGO DE SELECCIÓN ---
        // Si el objeto es 'mapa' o 'custodia', reducimos el área de clic
        if (pista.id === 'mapa' || pista.id === 'custodia') {
            div.style.width = '60px';  // Rango reducido a la mitad
            div.style.height = '60px';
            div.style.overflow = 'visible'; // La imagen puede sobresalir del área de clic
        }
        
        div.onclick = (e) => {
            e.stopPropagation();
            if (div.classList.contains('revelado')) return;
            
            div.classList.add('revelado'); 
            encontradas++;
            if (contador) contador.innerText = encontradas;
            
            marcarChecklist(pista.id);

            setTimeout(() => {
                if (pista.dilema) {
                    lanzarDilema(pista, onMarcarPuntos, () => {
                        verificarVictoria(onFinalizar);
                    });
                } else {
                    sndCorrecto.currentTime = 0;
                    sndCorrecto.play(); 
                    mostrarMensajeLocal("¡Tesoro Encontrado!", pista.mensaje, pista.img);
                    verificarVictoria(onFinalizar);
                }
            }, 300);
        };
        capaIconos.appendChild(div);
    });
}

// ... (Resto de las funciones verificarVictoria, crearChecklist, marcarChecklist y mostrarMensajeLocal se mantienen igual)

function verificarVictoria(onFinalizar) {
    if (encontradas === zona1.pistas.length) {
        const checkCont = document.getElementById('checklist-tesoros');
        if (checkCont) checkCont.style.display = 'none';

        setTimeout(() => {
            onFinalizar();
        }, 1500);
    }
}

function crearChecklist() {
    let checkCont = document.getElementById('checklist-tesoros');
    if (!checkCont) {
        checkCont = document.createElement('div');
        checkCont.id = 'checklist-tesoros';
        document.getElementById('escenario-juego').appendChild(checkCont);
    }
    checkCont.style.display = 'block'; 
    checkCont.innerHTML = `<h3>Lista de Tesoros</h3>` + 
        zona1.pistas.map(p => `<div id="check-${p.id}" class="item-check">⬜ ${p.id.toUpperCase()}</div>`).join('');
}

function marcarChecklist(id) {
    const item = document.getElementById(`check-${id}`);
    if (item) {
        item.innerHTML = `✅ ${id.toUpperCase()}`;
        item.classList.add('logrado');
    }
}

function mostrarMensajeLocal(titulo, texto, nombreImg) {
    const modal = document.getElementById('modal-mensaje');
    const mTitulo = document.getElementById('modal-titulo');
    const mTexto = document.getElementById('modal-texto');
    
    mTitulo.innerHTML = `<img src="${RUTA_IMGS}${nombreImg}" class="modal-img-pista"><br>${titulo}`;
    mTexto.innerText = texto;
    modal.classList.remove('hidden');
}

function lanzarDilema(pista, onMarcarPuntos, callback) {
    const modal = document.getElementById('modal-mensaje');
    const mTitulo = document.getElementById('modal-titulo');
    const mTexto = document.getElementById('modal-texto');
    const contenedor = document.getElementById('contenedor-opciones');
    const btnCerrar = document.getElementById('btn-cerrar-modal');

    mTitulo.innerHTML = `<img src="${RUTA_IMGS}${pista.img}" class="modal-img-pista"><br>¡Momento de Decidir!`;
    mTexto.innerText = `${pista.mensaje}\n\n${pista.dilema.pregunta}`;
    
    contenedor.innerHTML = "";
    btnCerrar.classList.add('hidden');

    pista.dilema.opciones.forEach(opcion => {
        const btn = document.createElement('button');
        btn.className = "btn-opcion";
        btn.innerText = opcion.texto;
        
        btn.onclick = () => {
            sndCorrecto.currentTime = 0;
            sndCorrecto.play();

            onMarcarPuntos(opcion.puntos);
            contenedor.innerHTML = `<p class="mensaje-exito">¡Acción de amor registrada! +${opcion.puntos} puntos</p>`;
            
            setTimeout(() => {
                modal.classList.add('hidden');
                btnCerrar.classList.remove('hidden');
                if (callback) callback(); 
            }, 1500);
        };
        contenedor.appendChild(btn);
    });
    modal.classList.remove('hidden');
}