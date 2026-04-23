export const DATOS_AVENTURA = {
    // --- NIVEL 1: BÚSQUEDA ---
    zona1: {
        titulo: "Salón de Clases: El Tesoro de la Comunidad",
        pistas: [
            { id: "Jesús resucito", img: "iconos_L5_Jesus_resusitado.png", mensaje: "¡Jesús está vivo!", top: 697, left: 88 },
            { id: "custodia", img: "iconos_L5_Custodia.png", mensaje: "Siempre estoy contigo.", top: 364, left: 323 },
            { id: "mapa", img: "iconos_L5_Mapa.png", mensaje: "Descubre lugares importantes.", top: 360, left: 282 },
            { id: "biblia", img: "iconos_L5_Biblia.png", mensaje: "Jesús nos habla en su palabra.", top: 589, left: 610 },
            { id: "naturaleza", img: "iconos_L5_Naturaleza.png", mensaje: "Los regalos de Dios están en la creación.", top: 519, left: 842 },
            { 
                id: "familia", 
                img: "iconos_L5_Familia.png", 
                mensaje: "En familia aprendemos a amar.", 
                top: 333, 
                left: 970,
                dilema: {
                    pregunta: "Tu hermana pequeña rompe sin querer tu juguete favorito. ¿Qué harías?",
                    opciones: [
                        { texto: "Te enojas y le gritas.", puntos: -1 },
                        { texto: "La perdonas y le explicas cómo cuidarlo.", puntos: 3 },
                        { texto: "Lo escondes para que no lo vuelva a tocar.", puntos: 1 }
                    ]
                }
            },
            { 
                id: "Parroquia", 
                img: "iconos_L5_Iglesia.png", 
                mensaje: "Jesús nos reúne en comunidad.", 
                top: 243, 
                left: 962,
                dilema: {
                    pregunta: "Un adulto mayor necesita ayuda para cargar sus bolsas. ¿Qué harías?",
                    opciones: [
                        { texto: "Pasas rápido para no tardarte.", puntos: -1 },
                        { texto: "Le preguntas si necesita ayuda.", puntos: 3 },
                        { texto: "La miras pero no haces nada.", puntos: 1 }
                    ]
                }
            },
            { id: "el buen pastor", img: "iconos_L5_Jesus_y_corderos.png", mensaje: "El buen Pastor cuida de nosotros.", top: 578, left: 493 },
            { 
                id: "amigos", 
                img: "iconos_L5_Amigos.png", 
                mensaje: "Somos un equipo.", 
                top: 333, 
                left: 805,
                dilema: {
                    pregunta: "Estás jugando y tu amigo quiere cambiar las reglas para ganar. ¿Qué harías?",
                    opciones: [
                        { texto: "Te enojas y dejas de jugar.", puntos: -1 },
                        { texto: "Le explicas que deben jugar justo.", puntos: 3 },
                        { texto: "Aceptas aunque no te guste.", puntos: 2 }
                    ]
                }
            },
            { 
                id: "escuela", 
                img: "iconos_L5_Escuela.png", 
                mensaje: "Mi escuela también es comunidad.", 
                top: 274, 
                left: 591,
                dilema: {
                    pregunta: "Un compañero nuevo no tiene amigos y se sienta solo en el recreo. ¿Qué harías?",
                    opciones: [
                        { texto: "Lo ignoras y juegas con tus amigos.", puntos: -1 },
                        { texto: "Lo invitas a jugar contigo.", puntos: 3 },
                        { texto: "Le sonríes pero no hablas con él.", puntos: 1 }
                    ]
                }
            },
        ]
    },

    // --- NIVEL 2: MAPA DE DILEMAS ---
    zona2: {
        titulo: "Pistas para vivir en comunidad",
        pistas: [
            {
                id: 1, color: "🟡", titulo: "Reúnanse en mi nombre",
                dilema: "En el recreo, tus amigos quieren jugar a algo que excluye a otro niño. ¿Qué harías?",
                opciones: [
                    { texto: "Juegas con tus amigos y dejas al niño fuera.", correcta: false },
                    { texto: "Invitas al niño a jugar con todos.", correcta: true },
                    { texto: "Te vas a jugar solo para no meterte en problemas.", correcta: false }
                ],
                reto: "Reto: Invita a alguien que esté solo a jugar contigo y dile: 'Jesús también te quiere en nuestro grupo'."
            },
            {
                id: 2, color: "🔵", titulo: "Mantente en contacto con Jesús",
                dilema: "Estás muy cansado y se te olvida orar antes de dormir. ¿Qué harías?",
                opciones: [
                    { texto: "Dices que no importa, ya lo harás otro día.", correcta: false },
                    { texto: "Haces una oración cortita.", correcta: true },
                    { texto: "Le pides a tu mamá que ore por ti.", correcta: false }
                ],
                reto: "Reto: Haz una oración especial cada día para hablar con Jesús como un amigo."
            },
            {
                id: 3, color: "🟢", titulo: "¡Escucha con atención!",
                dilema: "Tu maestra está explicando algo importante, pero tus amigos te hablan para jugar. ¿Qué harías?",
                opciones: [
                    { texto: "Ignoras a la maestra y te distraes.", correcta: false },
                    { texto: "Les dices que esperen y prestas atención.", correcta: true },
                    { texto: "Te ríes y haces ruido para que se distraigan.", correcta: false }
                ],
                reto: "Reto: Escucha con el corazón a alguien que te cuente cómo se siente."
            },
            {
                id: 4, color: "🟣", titulo: "Comparte el mensaje",
                dilema: "Aprendiste algo bonito sobre Jesús, pero te da pena contarlo. ¿Qué harías?",
                opciones: [
                    { texto: "Lo guardas para ti.", correcta: false },
                    { texto: "Lo compartes con tu familia o amigos.", correcta: true },
                    { texto: "Lo escribes y lo escondes.", correcta: false }
                ],
                reto: "Reto: Dibuja o cuenta una historia de Jesús que te guste a alguien."
            },
            {
                id: 5, color: "🧡", titulo: "Comparte lo que tienes",
                dilema: "Tienes algunas galletas y tu amigo no tiene ninguna. ¿Qué harías?",
                opciones: [
                    { texto: "Te las comes rápido para no invitar.", correcta: false },
                    { texto: "Le invitas con alegría.", correcta: true },
                    { texto: "Le das un pedacito muy pequeño.", correcta: false }
                ],
                reto: "Reto: Dona algo que ya no uses a alguien que lo necesite."
            },
            {
                id: 6, color: "❤️", titulo: "Ayuda a los demás",
                dilema: "Ves que un adulto mayor necesita ayuda con las escaleras. ¿Qué harías?",
                opciones: [
                    { texto: "Sigues jugando y no haces caso.", correcta: false },
                    { texto: "Le ofreces tu mano y le acompañas.", correcta: true },
                    { texto: "Le dices que espere a que alguien más pase.", correcta: false }
                ],
                reto: "Reto: Haz una buena acción hoy sin que nadie te la pida."
            },
            {
                id: 7, color: "💙", titulo: "Sé amable y respetuoso",
                dilema: "Un niño te empuja sin querer y tú te enojas. ¿Qué harías?",
                opciones: [
                    { texto: "También lo empujas.", correcta: false },
                    { texto: "Le dices que no te gustó, pero lo perdonas.", correcta: true },
                    { texto: "Lo ignoras y no le hablas más.", correcta: false }
                ],
                reto: "Reto: Di tres palabras mágicas hoy: 'por favor', 'gracias' y 'perdón'."
            }
        ]
    },

    // --- NIVEL 3: RUNNER ---
    zona3: {
        titulo: "Corre por el Premio hacia la Santidad",
        fondo: "src/imgs/zona03/PISTA.JPG",
        config: {
            velocidadInicial: 8,
            gravedad: 0.9,
            fuerzaSalto: -18
        }
    }
};