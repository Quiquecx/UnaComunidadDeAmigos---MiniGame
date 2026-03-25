import { DATOS_AVENTURA } from './preguntas.js';

const zona1 = DATOS_AVENTURA.zona1;
const RUTA_IMGS = "src/imgs/zona01/"; 

let encontradas = 0;
let puntajeTotal = 0;

document.addEventListener('DOMContentLoaded', () => {
    // --- REFERENCIAS ---
    const btnJugar = document.getElementById('btn-jugar');
    const pantallaInicio = document.getElementById('pantalla-inicio');
    const escenarioJuego = document.getElementById('escenario-juego');
    const capaIconos = document.getElementById('capa-iconos');
    const contenedorMision = document.getElementById('contenedor-mision');

    // Se ha eliminado el detector de coordenadas para el juego final

    if (btnJugar) {
        btnJugar.onclick = () => {
            pantallaInicio.classList.add('hidden');
            escenarioJuego.classList.remove('hidden');
            crearMarcadorPuntos();
            crearChecklist(); 
            iniciarZona1();
        };
    }

    // --- LÓGICA DEL CHECKLIST ---
    function crearChecklist() {
        let checkCont = document.getElementById('checklist-tesoros');
        if (!checkCont) {
            checkCont = document.createElement('div');
            checkCont.id = 'checklist-tesoros';
            escenarioJuego.appendChild(checkCont);
        }
        
        let html = `<h3>Lista de Tesoros</h3>`;
        zona1.pistas.forEach(p => {
            html += `<div id="check-${p.id}" class="item-check">⬜ ${p.id.toUpperCase()}</div>`;
        });
        checkCont.innerHTML = html;
    }

    function marcarChecklist(id) {
        const item = document.getElementById(`check-${id}`);
        if (item) {
            item.innerHTML = `✅ ${id.toUpperCase()}`;
            item.classList.add('logrado');
        }
    }

    // --- INICIO DE ZONA 1 ---
    function iniciarZona1() {
        capaIconos.innerHTML = "";
        encontradas = 0;
        document.getElementById('contador').innerText = encontradas;
        
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
                document.getElementById('contador').innerText = encontradas;
                
                marcarChecklist(pista.id);

                setTimeout(() => {
                    if (pista.dilema) {
                        lanzarDilema(pista, pista.dilema);
                    } else {
                        mostrarMensaje("¡Tesoro Encontrado!", pista.mensaje, pista.img);
                    }
                }, 300);

                if (encontradas === zona1.pistas.length) {
                    setTimeout(finalizarNivel, 2000);
                }
            };
            capaIconos.appendChild(div);
        });
    }

    // --- MODALES Y DILEMAS ---
    function lanzarDilema(pista, datosDilema) {
        const modal = document.getElementById('modal-mensaje');
        const mTitulo = document.getElementById('modal-titulo');
        const mTexto = document.getElementById('modal-texto');
        const btnCerrar = document.getElementById('btn-cerrar-modal');

        mTitulo.innerHTML = `
            <img src="${RUTA_IMGS}${pista.img}" id="modal-imagen">
            <br>¡Momento de Decidir!
        `;
        
        mTexto.innerText = `${pista.mensaje}\n\n${datosDilema.pregunta}`;
        btnCerrar.classList.add('hidden');

        let contenedorOpciones = document.getElementById('contenedor-opciones');
        if (!contenedorOpciones) {
            contenedorOpciones = document.createElement('div');
            contenedorOpciones.id = 'contenedor-opciones';
            mTexto.after(contenedorOpciones);
        }
        contenedorOpciones.innerHTML = "";

        datosDilema.opciones.forEach(opcion => {
            const btn = document.createElement('button');
            btn.className = "btn-opcion";
            btn.innerText = opcion.texto;
            btn.onclick = () => {
                puntajeTotal += opcion.puntos;
                actualizarInterfazPuntos();
                contenedorOpciones.innerHTML = `<p style="color:#0277bd; font-weight:bold;">¡Gracias por tu acción de amor!</p>`;
                setTimeout(() => {
                    modal.classList.add('hidden');
                    btnCerrar.classList.remove('hidden');
                    contenedorOpciones.innerHTML = "";
                }, 1500);
            };
            contenedorOpciones.appendChild(btn);
        });
        modal.classList.remove('hidden');
    }

    function mostrarMensaje(titulo, texto, nombreImg) {
        const mTitulo = document.getElementById('modal-titulo');
        mTitulo.innerHTML = `
            <img src="${RUTA_IMGS}${nombreImg}" id="modal-imagen">
            <br>${titulo}
        `;
        
        document.getElementById('modal-texto').innerText = texto;
        const extra = document.getElementById('contenedor-opciones');
        if (extra) extra.innerHTML = "";
        
        document.getElementById('btn-cerrar-modal').classList.remove('hidden');
        document.getElementById('modal-mensaje').classList.remove('hidden');
    }

    // --- MARCADORES ---
    function crearMarcadorPuntos() {
        if (!document.getElementById('marcador-puntos')) {
            const marcador = document.createElement('div');
            marcador.id = 'marcador-puntos';
            marcador.innerHTML = `Puntos de Bondad: <span id="puntos-val">0</span>`;
            document.getElementById('marcador').after(marcador);
        }
    }

    function actualizarInterfazPuntos() {
        const pVal = document.getElementById('puntos-val');
        if (pVal) pVal.innerText = puntajeTotal;
    }

    function finalizarNivel() {
        mostrarMensaje(
            "¡Nivel Completado!", 
            `¡Felicidades! Has descubierto todos los tesoros de nuestra comunidad.\n\nPuntaje de Bondad: ${puntajeTotal}`, 
            "iconos_L5_Jesus_resusitado.png"
        );
    }

    document.getElementById('btn-cerrar-modal').onclick = () => {
        document.getElementById('modal-mensaje').classList.add('hidden');
    };
});