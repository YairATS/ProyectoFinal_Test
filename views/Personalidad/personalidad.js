function generarTestPersonalidad() {
    const form = document.getElementById('formPersonalidad');
    
    DATOS_PERSONALIDAD.dimensiones.forEach((dimension, dimIndex) => {
        // Crear contenedor de dimensión
        const divDimension = document.createElement('div');
        divDimension.className = 'dimension';
        divDimension.dataset.dimension = dimension.codigo;
        
        // Título de la dimensión
        const titulo = document.createElement('h4');
        titulo.textContent = `${dimIndex + 1}. ${dimension.nombre}`;
        divDimension.appendChild(titulo);
        
        // Generar cada par de opciones
        dimension.pares.forEach(par => {
            const parDiv = document.createElement('div');
            parDiv.className = 'par-opciones';
            
            parDiv.innerHTML = `
                <div class="opcion opcion-izq" style="background: ${dimension.ladoA.color}">
                    <strong>${par.textoA}</strong>
                </div>
                
                <div class="distribucion">
                    <input type="number" class="puntos-izq puntos-input" min="0" max="10" value="0" 
                           data-dimension="${dimension.codigo}" data-par="${par.id}" data-lado="A">
                    <span>vs</span>
                    <input type="number" class="puntos-der puntos-input" min="0" max="10" value="0"
                           data-dimension="${dimension.codigo}" data-par="${par.id}" data-lado="B">
                    <span>/10</span>
                </div>
                
                <div class="opcion opcion-der" style="background: ${dimension.ladoB.color}">
                    <strong>${par.textoB}</strong>
                </div>
            `;
            
            divDimension.appendChild(parDiv);
            
            // Agregar validación
            const validacionDiv = document.createElement('div');
            validacionDiv.className = 'validacion-par';
            validacionDiv.dataset.dimension = dimension.codigo;
            validacionDiv.dataset.par = par.id;
            validacionDiv.textContent = '¡Debe sumar 10 puntos! No use 5-5.';
            divDimension.appendChild(validacionDiv);
        });
        
        // Total de la dimensión
        const totalDiv = document.createElement('div');
        totalDiv.className = 'total-dimension';
        totalDiv.innerHTML = `
            Total ${dimension.ladoA.nombre}: <span id="total${dimension.codigo}_A">0</span> | 
            Total ${dimension.ladoB.nombre}: <span id="total${dimension.codigo}_B">0</span>
        `;
        divDimension.appendChild(totalDiv);
        
        form.insertBefore(divDimension, document.getElementById('btnCalcular'));
    });
    
    // Configurar eventos después de generar todo
    configurarEventos();
}

function calcularTotalesDimension(dimensionCodigo) {
    let totalA = 0;
    let totalB = 0;
    
    // Seleccionar todos los inputs de esta dimensión
    const inputsA = document.querySelectorAll(`input[data-dimension="${dimensionCodigo}"][data-lado="A"]`);
    const inputsB = document.querySelectorAll(`input[data-dimension="${dimensionCodigo}"][data-lado="B"]`);
    
    inputsA.forEach(input => {
        totalA += parseInt(input.value) || 0;
    });
    
    inputsB.forEach(input => {
        totalB += parseInt(input.value) || 0;
    });
    
    // Actualizar display
    document.getElementById(`total${dimensionCodigo}_A`).textContent = totalA;
    document.getElementById(`total${dimensionCodigo}_B`).textContent = totalB;
    
    return { totalA, totalB };
}

function calcularTipoPersonalidad() {
    const resultados = {};
    let tipo = '';
    
    DATOS_PERSONALIDAD.dimensiones.forEach(dimension => {
        const { totalA, totalB } = calcularTotalesDimension(dimension.codigo);
        
        resultados[dimension.codigo] = {
            [dimension.ladoA.letra]: totalA,
            [dimension.ladoB.letra]: totalB
        };
        
        // Determinar letra ganadora para esta dimensión
        tipo += totalA > totalB ? dimension.ladoA.letra : dimension.ladoB.letra;
    });
    
    return {
        tipo,
        resultados,
        descripcion: obtenerDescripcionTipo(tipo)
    };
}

function obtenerDescripcionTipo(tipo) {
    const descripciones = {
        'INTJ': 'Arquitecto - Estratégico, innovador y determinado. Planificadores visionarios con gran capacidad para implementar ideas.',
        'INTP': 'Lógico - Inventivo, curioso y analítico. Amantes del conocimiento y la resolución de problemas complejos.',
        'ENTJ': 'Comandante - Líder audaz, imaginativo y de fuerte voluntad. Excelentes organizadores y estrategas.',
        'ENTP': 'Innovador - Inventor inteligente y emprendedor. Creativos que disfrutan debatir y explorar posibilidades.',
        'INFJ': 'Abogado - Idealista, organizado y determinado. Buscan meaning y tienen fuertes valores.',
        'INFP': 'Mediador - Poético, amable y altruista. Empatícos y guiados por sus principios.',
        'ENFJ': 'Protagonista - Líder carismático e inspirador. Persuasive y motivadores naturales.',
        'ENFP': 'Activista - Entusiasta, creativo y sociable. Espíritus libres llenos de energía y optimismo.',
        'ISTJ': 'Logístico - Práctico, fact-based y confiable. Responsables y metódicos.',
        'ISFJ': 'Defensor - Protector, dedicado y cálido. Comprometidos con ayudar a los demás.',
        'ESTJ': 'Ejecutivo - Administrador excelente, directo y organizado. Gestionan proyectos y personas eficientemente.',
        'ESFJ': 'Cónsul - Cooperativo, práctico y sociable. Cuidan del bienestar de los demás.',
        'ISTP': 'Virtuoso - Experimentador audaz y práctico. Maestros en el uso de herramientas y resolución de crisis.',
        'ISFP': 'Aventurero - Artista flexible y encantador. Disfrutan el momento presente y experiencias nuevas.',
        'ESTP': 'Emprendedor - Energético, perceptivo y divertido. Excelentes en negociación y acción inmediata.',
        'ESFP': 'Animador - Espontáneo, entusiasta y sociable. Aman la vida, las personas y las experiencias nuevas.'
    };
    
    return descripciones[tipo] || `Tipo de personalidad ${tipo}`;
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    generarTestPersonalidad();
});