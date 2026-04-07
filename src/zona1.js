import { DATOS_AVENTURA } from './preguntas.js';

const zona1 = DATOS_AVENTURA.zona1;
const RUTA_IMGS = "src/imgs/zona01/"; 
let encontradas = 0;

export function iniciarZona1(onFinalizar, onMarcarPuntos) {
    const capaIconos = document.getElementById('capa-iconos');
    const contador = document.getElementById('contador');
    
    capaIconos.innerHTML = "";
    encontradas = 0;
    contador.innerText = encontradas;
    
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
            contador.innerText = encontradas;
            
            marcarChecklist(pista.id);

            setTimeout(() => {
                if (pista.dilema) {
                    lanzarDilema(pista, onMarcarPuntos);
                } else {
                    mostrarMensajeLocal("¡Tesoro Encontrado!", pista.mensaje, pista.img);
                }
            }, 300);

            if (encontradas === zona1.pistas.length) {
                setTimeout(onFinalizar, 2000);
            }
        };
        capaIconos.appendChild(div);
    });
}

function crearChecklist() {
    let checkCont = document.getElementById('checklist-tesoros');
    if (!checkCont) {
        checkCont = document.createElement('div');
        checkCont.id = 'checklist-tesoros';
        document.getElementById('escenario-juego').appendChild(checkCont);
    }
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

// Nota: Estas funciones de modal podrían ser globales en main.js si las usas en todo el juego
function mostrarMensajeLocal(titulo, texto, nombreImg) {
    document.getElementById('modal-titulo').innerHTML = `<img src="${RUTA_IMGS}${nombreImg}" id="modal-imagen"><br>${titulo}`;
    document.getElementById('modal-texto').innerText = texto;
    document.getElementById('modal-mensaje').classList.remove('hidden');
}

function lanzarDilema(pista, onMarcarPuntos) {
    const modal = document.getElementById('modal-mensaje');
    document.getElementById('modal-titulo').innerHTML = `<img src="${RUTA_IMGS}${pista.img}" id="modal-imagen"><br>¡Momento de Decidir!`;
    document.getElementById('modal-texto').innerText = `${pista.mensaje}\n\n${pista.dilema.pregunta}`;
    
    const contenedor = document.getElementById('contenedor-opciones');
    contenedor.innerHTML = "";
    document.getElementById('btn-cerrar-modal').classList.add('hidden');

    pista.dilema.opciones.forEach(opcion => {
        const btn = document.createElement('button');
        btn.className = "btn-opcion";
        btn.innerText = opcion.texto;
        btn.onclick = () => {
            onMarcarPuntos(opcion.puntos);
            contenedor.innerHTML = `<p>¡Acción de amor registrada!</p>`;
            setTimeout(() => {
                modal.classList.add('hidden');
                document.getElementById('btn-cerrar-modal').classList.remove('hidden');
            }, 1500);
        };
        contenedor.appendChild(btn);
    });
    modal.classList.remove('hidden');
}
