// vark-data.js
const VARK_DATA = {
    titulo: "Cuestionario VARK",
    instrucciones: "Elija la respuesta que mejor explique su preferencia. Haga clic en más de una si una sola respuesta no coincide con su percepción.",
    preguntas: [
        {
            id: 1,
            texto: "Está a punto de dar instrucciones a una persona que está en una calle de una ciudad. Ella va a ir a la estación de ferrocarril, al correo y luego a la sala de música para un concierto. Usted:",
            opciones: [
                { valor: "V", texto: "Le dibuja un mapa en un papel" },
                { valor: "A", texto: "Le dice las direcciones verbalmente" },
                { valor: "R", texto: "Le escribe las direcciones (sin mapa)" },
                { valor: "K", texto: "Va con ella" }
            ]
        },
        {
            id: 2,
            texto: "No está seguro/a de si una palabra se escribe con 's' o con 'c'. Usted:",
            opciones: [
                { valor: "V", texto: "Escribe ambas palabras en un papel y elige una" },
                { valor: "A", texto: "Piensa cómo suena cada una" },
                { valor: "R", texto: "Busca la palabra en un diccionario" },
                { valor: "K", texto: "Escribe ambas palabras y elige una" }
            ]
        },
        {
            id: 3,
            texto: "Está planeando unas vacaciones para un grupo. Usted quiere alguna sugerencia de ellos sobre el plan. Usted:",
            opciones: [
                { valor: "V", texto: "Usa un mapa o páginas web para mostrarles los lugares" },
                { valor: "A", texto: "Les describe algunos de los puntos destacados" },
                { valor: "R", texto: "Les da una copia del itinerario impreso" },
                { valor: "K", texto: "Llama a algunos amigos para hablar del plan" }
            ]
        },
        {
            id: 4,
            texto: "Va a cocinar algo especial para su familia. Usted:",
            opciones: [
                { valor: "V", texto: "Busca en Internet o en un libro de cocina" },
                { valor: "A", texto: "Le pide sugerencias a amigos" },
                { valor: "R", texto: "Usa un libro de cocina donde sabe que hay una buena receta" },
                { valor: "K", texto: "Cocina algo que sabe sin necesidad de instrucciones" }
            ]
        },
        {
            id: 5,
            texto: "Un grupo de turistas quiere aprender sobre los parques o reservas naturales de su área. Usted:",
            opciones: [
                { valor: "V", texto: "Los lleva a un parque o reserva natural" },
                { valor: "A", texto: "Les da una charla sobre los parques o reservas naturales" },
                { valor: "R", texto: "Les da un libro o folleto sobre los parques o reservas naturales" },
                { valor: "K", texto: "Los lleva a un parque o reserva natural y camina con ellos" }
            ]
        },
        {
            id: 6,
            texto: "Va a elegir comida en un restaurante o una cafetería. Usted:",
            opciones: [
                { valor: "V", texto: "Mira lo que otros comen o mira los platos en el menú" },
                { valor: "A", texto: "Escucha al camarero o le pide recomendaciones" },
                { valor: "R", texto: "Elije en el menú" },
                { valor: "K", texto: "Elije algo que ya ha probado antes" }
            ]
        },
        {
            id: 7,
            texto: "Tiene que hacer un discurso para una conferencia u ocasión especial. Usted:",
            opciones: [
                { valor: "V", texto: "Hace diagramas o consigue imágenes para ayudar a explicar" },
                { valor: "A", texto: "Escribe algunas palabras clave y practica repitiendo" },
                { valor: "R", texto: "Escribe el discurso y lo aprende leyéndolo varias veces" },
                { valor: "K", texto: "Recoge muchos ejemplos e historias para hacerlo real" }
            ]
        },
        {
            id: 8,
            texto: "Un sitio web tiene un video que muestra cómo hacer algo. Hay una persona hablando, algunas listas y palabras y algunos diagramas. Usted aprende mejor:",
            opciones: [
                { valor: "V", texto: "Viendo los diagramas" },
                { valor: "A", texto: "Escuchando a la persona" },
                { valor: "R", texto: "Leyendo las palabras y listas" },
                { valor: "K", texto: "Viendo las acciones" }
            ]
        },
        {
            id: 9,
            texto: "Está usando un libro, un CD o un sitio web para aprender a tomar fotos con su nueva cámara. Le gustaría tener:",
            opciones: [
                { valor: "V", texto: "Muchos diagramas que muestren la cámara y alguien tomando fotos" },
                { valor: "A", texto: "Una oportunidad de hacer preguntas y hablar sobre las características" },
                { valor: "R", texto: "Instrucciones claras escritas con listas y puntos sobre qué hacer" },
                { valor: "K", texto: "Muchos ejemplos de fotos buenas y malas y cómo mejorarlas" }
            ]
        },
        {
            id: 10,
            texto: "Usted:",
            opciones: [
                { valor: "V", texto: "Puede entender cómo funciona algo si lo desarma y lo vuelve a armar" },
                { valor: "A", texto: "Puede entender cómo funciona algo si alguien se lo explica" },
                { valor: "R", texto: "Puede entender cómo funciona algo si lee cómo funciona" },
                { valor: "K", texto: "Puede entender cómo funciona algo si lo usa" }
            ]
        },
        {
            id: 11,
            texto: "Cuando ve las estadísticas en el diario o en Internet Usted:",
            opciones: [
                { valor: "V", texto: "Busca los gráficos o diagramas" },
                { valor: "A", texto: "Habla con alguien sobre lo que significan" },
                { valor: "R", texto: "Se concentra en las palabras" },
                { valor: "K", texto: "Relaciona las estadísticas con situaciones reales" }
            ]
        },
        {
            id: 12,
            texto: "Usted aprende algo práctico (no académico) mejor mediante:",
            opciones: [
                { valor: "V", texto: "Demostraciones visuales, diagramas, mapas" },
                { valor: "A", texto: "Consejos verbales, hablando a través de ello con alguien" },
                { valor: "R", texto: "Instrucciones escritas, libros o textos" },
                { valor: "K", texto: "Práctica, ensayo y error" }
            ]
        },
        {
            id: 13,
            texto: "Cuando está aprendiendo una habilidad física o un deporte, usted:",
            opciones: [
                { valor: "V", texto: "Observa a alguien que sabe hacerlo" },
                { valor: "A", texto: "Habla con un instructor que le explica" },
                { valor: "R", texto: "Sigue los diagramas o las instrucciones" },
                { valor: "K", texto: "Practica y se corrige a medida que avanza" }
            ]
        },
        {
            id: 14,
            texto: "Usted está aprendiendo a hacer algo nuevo en la computadora. Usted:",
            opciones: [
                { valor: "V", texto: "Sitúa el cursor y hace clic hasta que funciona" },
                { valor: "A", texto: "Habla con gente que sabe cómo hacerlo" },
                { valor: "R", texto: "Lee el manual" },
                { valor: "K", texto: "Sigue los diagramas que le muestran qué hacer" }
            ]
        },
        {
            id: 15,
            texto: "Usted prefiere un profesor o conferencista que use:",
            opciones: [
                { valor: "V", texto: "Demostraciones, modelos o sesiones prácticas" },
                { valor: "A", texto: "Preguntas y respuestas, charlas, oradores invitados" },
                { valor: "R", texto: "Apuntes, manuales y lecturas" },
                { valor: "K", texto: "Excursiones, laboratorios, sesiones prácticas" }
            ]
        },
        {
            id: 16,
            texto: "Usted está a punto de comprar una cámara digital o un teléfono o móvil. Además del precio, ¿qué más influye en su decisión?",
            opciones: [
                { valor: "V", texto: "Leer los detalles sobre sus características" },
                { valor: "A", texto: "El vendedor me informa acerca de sus características" },
                { valor: "R", texto: "Probarlo o usarlo" },
                { valor: "K", texto: "Es un diseño moderno y se ve bien" }
            ]
        }
    ]
};