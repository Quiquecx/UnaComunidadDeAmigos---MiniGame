export const DATOS_AVENTURA = {
    zona1: {
        titulo: "Salón de Clases: El Tesoro de la Comunidad",
        pistas: [
            { id: "jesus", img: "iconos_L5_Jesus_resusitado.png", mensaje: "¡Jesús está vivo!", top: 697, left: 88 },
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
                        { texto: "Te enojas y le gritas.", puntos: 1 },
                        { texto: "La perdonas y le explicas cómo cuidarlo.", puntos: 3 },
                        { texto: "Lo escondes para que no lo vuelva a tocar.", puntos: 2 }
                    ]
                }
            },
            { 
                id: "iglesia", 
                img: "iconos_L5_Iglesia.png", 
                mensaje: "Jesús nos reúne en comunidad.", 
                top: 243, 
                left: 962,
                dilema: {
                    pregunta: "Un adulto mayor necesita ayuda para cargar sus bolsas. ¿Qué harías?",
                    opciones: [
                        { texto: "Pasas rápido para no tardarte.", puntos: 1 },
                        { texto: "Le preguntas si necesita ayuda.", puntos: 3 },
                        { texto: "La miras pero no haces nada.", puntos: 2 }
                    ]
                }
            },
            { id: "pan-vino", img: "iconos_L5_Jesus_y_corderos.png", mensaje: "El buen Pastor cuida de nosotros.", top: 578, left: 493 },
            { 
                id: "amigos", 
                img: "iconos_L5_Amigos.png", 
                mensaje: "Somos un equipo.", 
                top: 333, 
                left: 805,
                dilema: {
                    pregunta: "Estás jugando y tu amigo quiere cambiar las reglas para ganar. ¿Qué harías?",
                    opciones: [
                        { texto: "Te enojas y dejas de jugar.", puntos: 1 },
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
                        { texto: "Lo ignoras y juegas con tus amigos.", puntos: 1 },
                        { texto: "Lo invitas a jugar contigo.", puntos: 3 },
                        { texto: "Le sonríes pero no hablas con él.", puntos: 2 }
                    ]
                }
            },
        ]
    },
    zona2: {
        // Aquí irán los dilemas de "Pistas para vivir en comunidad"
        titulo: "Pistas para vivir en comunidad",
        dilemas: [] 
    },
    zona3: {
        // Aquí irán las reglas de "Corre por el Premio"
        titulo: "Las reglas del juego",
        retos: []
    }
};