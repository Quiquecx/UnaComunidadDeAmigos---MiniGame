import { DATOS_AVENTURA } from './preguntas.js';

const zona1 = DATOS_AVENTURA.zona1;
const RUTA_IMGS = "src/imgs/zona01/"; 
let encontradas = 0;

export function iniciarZona1(onFinalizar, onMarcarPuntos) {
    const capaIconos = document.getElementById('capa-iconos');
    const contador = document.getElementById('contador');
    
    // Limpiamos todo antes de empezar
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

            // Pequeña pausa para que se vea la animación de revelado antes del modal
            setTimeout(() => {
                if (pista.dilema) {
                    lanzarDilema(pista, onMarcarPuntos, () => {
                        verificarVictoria(onFinalizar);
                    });
                } else {
                    mostrarMensajeLocal("¡Tesoro Encontrado!", pista.mensaje, pista.img);
                    verificarVictoria(onFinalizar);
                }
            }, 300);
        };
        capaIconos.appendChild(div);
    });
}

function verificarVictoria(onFinalizar) {
    if (encontradas === zona1.pistas.length) {
        // Quitamos el checklist antes de irnos para que no estorbe en la Zona 2
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
    checkCont.style.display = 'block'; // Aseguramos que sea visible
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
            onMarcarPuntos(opcion.puntos);
            contenedor.innerHTML = `<p class="mensaje-exito">¡Acción de amor registrada! +${opcion.puntos} puntos</p>`;
            
            setTimeout(() => {
                modal.classList.add('hidden');
                btnCerrar.classList.remove('hidden');
                if (callback) callback(); // Revisa si ya ganamos
            }, 1500);
        };
        contenedor.appendChild(btn);
    });
    modal.classList.remove('hidden');
}