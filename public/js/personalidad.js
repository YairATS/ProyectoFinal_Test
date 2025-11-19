// ============================================
// GENERACIÓN DEL TEST
// ============================================

function generarTestPersonalidad() {
    const container = document.getElementById('dimensiones-personalidad');
    
    DATOS_PERSONALIDAD.dimensiones.forEach((dimension, dimIndex) => {
        const divDimension = document.createElement('div');
        divDimension.className = 'dimension';
        divDimension.dataset.dimension = dimension.codigo;
        
        const titulo = document.createElement('h3');
        titulo.textContent = `${dimIndex + 1}. ${dimension.nombre}`;
        titulo.style.color = '#2c3e50';
        titulo.style.marginBottom = '1rem';
        titulo.style.borderBottom = '2px solid #4CAF50';
        titulo.style.paddingBottom = '0.5rem';
        divDimension.appendChild(titulo);
        
        dimension.pares.forEach(par => {
            const parDiv = document.createElement('div');
            parDiv.className = 'par-opciones';
            
            parDiv.innerHTML = `
                <div class="opcion opcion-izq" style="background: ${dimension.ladoA.color}; padding: 1rem; border-radius: 4px;">
                    <strong>${par.textoA}</strong>
                </div>
                
                <div class="distribucion">
                    <input type="number" class="puntos-input puntos-izq" min="0" max="10" value="0" 
                           data-dimension="${dimension.codigo}" data-par="${par.id}" data-lado="A">
                    <span style="margin: 0 0.5rem; font-weight: bold;">vs</span>
                    <input type="number" class="puntos-input puntos-der" min="0" max="10" value="0"
                           data-dimension="${dimension.codigo}" data-par="${par.id}" data-lado="B">
                    <span style="margin-left: 0.5rem;">/10</span>
                </div>
                
                <div class="opcion opcion-der" style="background: ${dimension.ladoB.color}; padding: 1rem; border-radius: 4px;">
                    <strong>${par.textoB}</strong>
                </div>
            `;
            
            divDimension.appendChild(parDiv);
            
            const validacionDiv = document.createElement('div');
            validacionDiv.className = 'validacion-par';
            validacionDiv.dataset.dimension = dimension.codigo;
            validacionDiv.dataset.par = par.id;
            validacionDiv.style.color = 'red';
            validacionDiv.style.fontSize = '0.875rem';
            validacionDiv.style.marginTop = '0.25rem';
            validacionDiv.style.display = 'none';
            validacionDiv.textContent = '¡Debe sumar 10 puntos! No use 5-5.';
            divDimension.appendChild(validacionDiv);
        });
        
        const totalDiv = document.createElement('div');
        totalDiv.className = 'total-dimension';
        totalDiv.style.background = '#ffeb3b';
        totalDiv.style.padding = '1rem';
        totalDiv.style.borderRadius = '4px';
        totalDiv.style.marginTop = '1rem';
        totalDiv.style.fontWeight = 'bold';
        totalDiv.style.textAlign = 'center';
        totalDiv.innerHTML = `
            Total ${dimension.ladoA.nombre}: <span id="total${dimension.codigo}_A">0</span> | 
            Total ${dimension.ladoB.nombre}: <span id="total${dimension.codigo}_B">0</span>
        `;
        divDimension.appendChild(totalDiv);
        
        container.appendChild(divDimension);
    });
    
    configurarEventos();
}

// ============================================
// CÁLCULOS Y VALIDACIONES
// ============================================

function calcularTotalesDimension(dimensionCodigo) {
    let totalA = 0;
    let totalB = 0;
    
    const inputsA = document.querySelectorAll(`input[data-dimension="${dimensionCodigo}"][data-lado="A"]`);
    const inputsB = document.querySelectorAll(`input[data-dimension="${dimensionCodigo}"][data-lado="B"]`);
    
    inputsA.forEach(input => {
        totalA += parseInt(input.value) || 0;
    });
    
    inputsB.forEach(input => {
        totalB += parseInt(input.value) || 0;
    });
    
    document.getElementById(`total${dimensionCodigo}_A`).textContent = totalA;
    document.getElementById(`total${dimensionCodigo}_B`).textContent = totalB;
    
    return { totalA, totalB };
}

function validarPar(dimensionCodigo, parId) {
    const inputA = document.querySelector(`input[data-dimension="${dimensionCodigo}"][data-par="${parId}"][data-lado="A"]`);
    const inputB = document.querySelector(`input[data-dimension="${dimensionCodigo}"][data-par="${parId}"][data-lado="B"]`);
    const validacionDiv = document.querySelector(`.validacion-par[data-dimension="${dimensionCodigo}"][data-par="${parId}"]`);
    
    const puntosA = parseInt(inputA.value) || 0;
    const puntosB = parseInt(inputB.value) || 0;
    const total = puntosA + puntosB;
    
    inputA.style.borderColor = '';
    inputB.style.borderColor = '';
    validacionDiv.style.display = 'none';
    
    let esValido = true;
    
    if (total !== 10) {
        inputA.style.borderColor = 'red';
        inputB.style.borderColor = 'red';
        validacionDiv.style.display = 'block';
        validacionDiv.textContent = `¡Debe sumar 10 puntos! Actual: ${total}`;
        esValido = false;
    } else if (puntosA === 5 && puntosB === 5) {
        inputA.style.borderColor = 'red';
        inputB.style.borderColor = 'red';
        validacionDiv.style.display = 'block';
        validacionDiv.textContent = '¡No puede usar 5-5! Distribuya de manera diferente.';
        esValido = false;
    } else if (puntosA < 0 || puntosA > 10 || puntosB < 0 || puntosB > 10) {
        inputA.style.borderColor = 'red';
        inputB.style.borderColor = 'red';
        validacionDiv.style.display = 'block';
        validacionDiv.textContent = '¡Los puntos deben estar entre 0 y 10!';
        esValido = false;
    }
    
    return esValido;
}

function validarTodoElFormulario() {
    let todoValido = true;
    
    DATOS_PERSONALIDAD.dimensiones.forEach(dimension => {
        dimension.pares.forEach(par => {
            const esValido = validarPar(dimension.codigo, par.id);
            if (!esValido) {
                todoValido = false;
            }
        });
    });
    
    return todoValido;
}

function actualizarEstadoBoton() {
    const boton = document.getElementById('btnCalcular');
    const todoValido = validarTodoElFormulario();
    
    boton.disabled = !todoValido;
    
    if (todoValido) {
        boton.style.background = '#4CAF50';
        boton.style.cursor = 'pointer';
        boton.title = 'Haga clic para calcular su tipo de personalidad';
    } else {
        boton.style.background = '#ccc';
        boton.style.cursor = 'not-allowed';
        boton.title = 'Complete correctamente todas las distribuciones de puntos';
    }
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
        'INFJ': 'Abogado - Idealista, organizado y determinado. Buscan sentido y tienen fuertes valores.',
        'INFP': 'Mediador - Poético, amable y altruista. Empáticos y guiados por sus principios.',
        'ENFJ': 'Protagonista - Líder carismático e inspirador. Persuasivos y motivadores naturales.',
        'ENFP': 'Activista - Entusiasta, creativo y sociable. Espíritus libres llenos de energía y optimismo.',
        'ISTJ': 'Logístico - Práctico y confiable. Responsables y metódicos.',
        'ISFJ': 'Defensor - Protector, dedicado y cálido. Comprometidos con ayudar a los demás.',
        'ESTJ': 'Ejecutivo - Administrador excelente, directo y organizado. Gestionan proyectos eficientemente.',
        'ESFJ': 'Cónsul - Cooperativo, práctico y sociable. Cuidan del bienestar de los demás.',
        'ISTP': 'Virtuoso - Experimentador audaz y práctico. Maestros en resolución de crisis.',
        'ISFP': 'Aventurero - Artista flexible y encantador. Disfrutan el momento presente.',
        'ESTP': 'Emprendedor - Energético, perceptivo y divertido. Excelentes en acción inmediata.',
        'ESFP': 'Animador - Espontáneo, entusiasta y sociable. Aman la vida y las experiencias nuevas.'
    };
    
    return descripciones[tipo] || `Tipo de personalidad ${tipo}`;
}

// ============================================
// ENVÍO AL BACKEND
// ============================================

async function enviarTestPersonalidad(resultado) {
    const datosAlumno = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        email: document.getElementById('email').value,
        matricula: document.getElementById('matricula').value || null,
        id_grupo: document.getElementById('id_grupo').value || null
    };

    const datosTest = {
        tipo_personalidad: resultado.tipo,
        puntaje_e: resultado.resultados.E_I.E,
        puntaje_i: resultado.resultados.E_I.I,
        puntaje_s: resultado.resultados.S_N.S,
        puntaje_n: resultado.resultados.S_N.N,
        puntaje_t: resultado.resultados.T_F.T,
        puntaje_f: resultado.resultados.T_F.F,
        puntaje_j: resultado.resultados.J_P.J,
        puntaje_p: resultado.resultados.J_P.P
    };

    try {
        document.getElementById('loading').style.display = 'block';
        
        const response = await fetch('/api/tests/personalidad', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ alumno: datosAlumno, test: datosTest })
        });

        const data = await response.json();
        
        document.getElementById('loading').style.display = 'none';

        if (response.ok) {
            mostrarResultado(resultado, data);
        } else {
            alert('Error: ' + (data.error || 'No se pudo guardar el test'));
            console.error('Error del servidor:', data);
        }
    } catch (error) {
        document.getElementById('loading').style.display = 'none';
        alert('Error al conectar con el servidor');
        console.error('Error de conexión:', error);
    }
}

// ============================================
// MOSTRAR RESULTADOS
// ============================================

async function mostrarResultado(resultado, dataServidor) {
    const resultadoDiv = document.getElementById('resultado');
    const contenidoDiv = document.getElementById('resultadoContenido');
    
    let html = `
        <div class="alert alert-success">
            <strong>✅ ${dataServidor.mensaje}</strong>
        </div>
        
        <h3 style="text-align: center; color: #2c3e50; margin-bottom: 1rem;">📊 Tu Resultado Individual</h3>
        
        <div style="text-align: center; margin-bottom: 20px;">
            <h3 style="font-size: 2em; color: #2c3e50; margin: 0;">${resultado.tipo}</h3>
            <p style="font-style: italic; color: #7f8c8d;">${resultado.descripcion}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px;">
    `;
    
    DATOS_PERSONALIDAD.dimensiones.forEach(dimension => {
        const dimResult = resultado.resultados[dimension.codigo];
        const letraA = dimension.ladoA.letra;
        const letraB = dimension.ladoB.letra;
        const totalA = dimResult[letraA];
        const totalB = dimResult[letraB];
        const ganador = totalA > totalB ? letraA : letraB;
        
        html += `
            <div style="border: 2px solid ${ganador === letraA ? dimension.ladoA.color : dimension.ladoB.color}; 
                       padding: 15px; border-radius: 8px; background: white;">
                <h4 style="margin-top: 0; color: #2c3e50;">${dimension.nombre.split(',')[0]}</h4>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="color: ${ganador === letraA ? '#27ae60' : '#7f8c8d'}">
                        ${dimension.ladoA.nombre}: <strong>${totalA}</strong>
                    </span>
                    <span style="color: ${ganador === letraB ? '#27ae60' : '#7f8c8d'}">
                        ${dimension.ladoB.nombre}: <strong>${totalB}</strong>
                    </span>
                </div>
                <div style="margin-top: 10px; font-weight: bold; color: #2c3e50; text-align: center; 
                           background: ${ganador === letraA ? dimension.ladoA.color : dimension.ladoB.color};
                           padding: 0.5rem; border-radius: 4px;">
                    Predominante: ${ganador}
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    
    // Si el alumno pertenece a un grupo, mostrar estadísticas grupales
    const idGrupo = document.getElementById('id_grupo').value;
    if (idGrupo) {
        html += '<div id="estadisticas-grupo"></div>';
    }
    
    html += `
        <div style="text-align: center; margin-top: 20px;">
            <button type="button" onclick="reiniciarTest()" class="btn" 
                    style="background: #e74c3c; color: white;">
                🔄 Hacer otro test
            </button>
        </div>
    `;
    
    contenidoDiv.innerHTML = html;
    resultadoDiv.style.display = 'block';
    
    // Cargar estadísticas del grupo si aplica
    if (idGrupo) {
        await cargarEstadisticasGrupoPersonalidad(idGrupo);
    }
    
    resultadoDiv.scrollIntoView({ behavior: 'smooth' });
}

async function cargarEstadisticasGrupoPersonalidad(idGrupo) {
    try {
        const response = await fetch(`/api/dashboard/personalidad/grupo/${idGrupo}`);
        const data = await response.json();
        
        if (!response.ok) {
            console.error('Error al cargar estadísticas:', data);
            return;
        }

        let html = `
            <div style="margin-top: 2rem; padding: 1.5rem; background: #f3e5f5; border-radius: 8px; border-left: 4px solid #9C27B0;">
                <h3 style="color: #7B1FA2; margin-top: 0;">
                    👥 Resultados de tu Grupo: ${data.grupo}
                </h3>
                
                <div style="background: white; padding: 1rem; border-radius: 4px; margin: 1rem 0;">
                    <p style="font-size: 1.1rem; margin: 0;">
                        <strong>Tipo predominante del grupo:</strong> 
                        <span style="color: #27ae60; font-size: 1.3rem;">${data.tipoPredominante}</span>
                    </p>
                    <p style="color: #666; margin: 0.5rem 0 0 0;">
                        <small>Basado en ${data.totalTests} test${data.totalTests !== 1 ? 's' : ''} realizado${data.totalTests !== 1 ? 's' : ''}</small>
                    </p>
                </div>

                <h4 style="color: #7B1FA2; margin-top: 1.5rem;">Distribución de tipos en el grupo:</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.75rem; margin-top: 1rem;">
        `;

        // Mostrar cada tipo con su cantidad
        data.distribucion.forEach(item => {
            const esPredominante = item.tipo_personalidad === data.tipoPredominante;
            
            html += `
                <div style="background: ${esPredominante ? '#e8f5e9' : 'white'}; 
                           padding: 0.75rem; 
                           border-radius: 4px; 
                           border: 2px solid ${esPredominante ? '#4CAF50' : '#ddd'};
                           text-align: center;">
                    <div style="font-weight: bold; font-size: 1.2rem; color: #2c3e50;">${item.tipo_personalidad}</div>
                    <div style="font-size: 1.5rem; font-weight: bold; color: #27ae60; margin: 0.25rem 0;">${item.cantidad}</div>
                    <div style="color: #666; font-size: 0.85rem;">${item.porcentaje}%</div>
                    ${esPredominante ? '<div style="color: #27ae60; margin-top: 0.25rem; font-size: 0.9rem;">★</div>' : ''}
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        document.getElementById('estadisticas-grupo').innerHTML = html;
        
    } catch (error) {
        console.error('Error al cargar estadísticas del grupo:', error);
    }
}

function reiniciarTest() {
    document.querySelectorAll('.puntos-input').forEach(input => {
        input.value = '0';
    });
    
    document.querySelectorAll('.validacion-par').forEach(div => {
        div.style.display = 'none';
    });
    
    DATOS_PERSONALIDAD.dimensiones.forEach(dimension => {
        calcularTotalesDimension(dimension.codigo);
    });
    
    document.getElementById('resultado').style.display = 'none';
    actualizarEstadoBoton();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// EVENT LISTENERS
// ============================================

function configurarEventos() {
    document.querySelectorAll('.puntos-input').forEach(input => {
        input.addEventListener('input', function() {
            const dimension = this.dataset.dimension;
            const par = this.dataset.par;
            
            validarPar(dimension, par);
            calcularTotalesDimension(dimension);
            actualizarEstadoBoton();
        });
    });
    
    document.getElementById('formPersonalidad').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!document.getElementById('nombre').value || !document.getElementById('email').value) {
            alert('Por favor completa nombre y email');
            return;
        }
        
        if (!validarTodoElFormulario()) {
            alert('Por favor completa todas las distribuciones correctamente');
            return;
        }
        
        const resultado = calcularTipoPersonalidad();
        await enviarTestPersonalidad(resultado);
    });
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    generarTestPersonalidad();
});