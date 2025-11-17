function configurarEventos() {
    // Configurar eventos para todos los inputs de puntos
    document.querySelectorAll('.puntos-input').forEach(input => {
        input.addEventListener('input', function() {
            const dimension = this.dataset.dimension;
            const par = this.dataset.par;
            
            validarPar(dimension, par);
            calcularTotalesDimension(dimension);
            actualizarEstadoBoton();
        });
    });
    
    // Configurar evento del formulario
    document.getElementById('formPersonalidad').addEventListener('submit', function(e) {
        e.preventDefault();
        mostrarResultado();
    });
}

function validarPar(dimensionCodigo, parId) {
    const inputA = document.querySelector(`input[data-dimension="${dimensionCodigo}"][data-par="${parId}"][data-lado="A"]`);
    const inputB = document.querySelector(`input[data-dimension="${dimensionCodigo}"][data-par="${parId}"][data-lado="B"]`);
    const validacionDiv = document.querySelector(`.validacion-par[data-dimension="${dimensionCodigo}"][data-par="${parId}"]`);
    
    const puntosA = parseInt(inputA.value) || 0;
    const puntosB = parseInt(inputB.value) || 0;
    const total = puntosA + puntosB;
    
    // Reset estilos
    inputA.style.borderColor = '';
    inputB.style.borderColor = '';
    validacionDiv.style.display = 'none';
    
    let esValido = true;
    
    // Validar suma = 10
    if (total !== 10) {
        inputA.style.borderColor = 'red';
        inputB.style.borderColor = 'red';
        validacionDiv.style.display = 'block';
        validacionDiv.textContent = `¡Debe sumar 10 puntos! Actual: ${total}`;
        esValido = false;
    }
    // Validar no sea 5-5
    else if (puntosA === 5 && puntosB === 5) {
        inputA.style.borderColor = 'red';
        inputB.style.borderColor = 'red';
        validacionDiv.style.display = 'block';
        validacionDiv.textContent = '¡No puede usar 5-5! Distribuya de manera diferente.';
        esValido = false;
    }
    // Validar rangos individuales
    else if (puntosA < 0 || puntosA > 10 || puntosB < 0 || puntosB > 10) {
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
        boton.title = 'Haga clic para calcular su tipo de personalidad';
    } else {
        boton.style.background = '#ccc';
        boton.title = 'Complete correctamente todas las distribuciones de puntos';
    }
}

function mostrarResultado() {
    const resultado = calcularTipoPersonalidad();
    const resultadoDiv = document.getElementById('resultado');
    const contenidoDiv = document.getElementById('resultadoContenido');
    
    let html = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h3 style="font-size: 2em; color: #2c3e50; margin: 0;">${resultado.tipo}</h3>
            <p style="font-style: italic; color: #7f8c8d;">${resultado.descripcion}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
    `;
    
    // Mostrar resultados por dimensión
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
                <h4 style="margin-top: 0;">${dimension.nombre.split(' - ')[0]}</h4>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: ${ganador === letraA ? '#27ae60' : '#7f8c8d'}">
                        ${dimension.ladoA.nombre}: <strong>${totalA}</strong>
                    </span>
                    <span style="color: ${ganador === letraB ? '#27ae60' : '#7f8c8d'}">
                        ${dimension.ladoB.nombre}: <strong>${totalB}</strong>
                    </span>
                </div>
                <div style="margin-top: 10px; font-weight: bold; color: #2c3e50;">
                    Predominante: ${ganador}
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    
    // Botón para reiniciar
    html += `
        <div style="text-align: center;">
            <button type="button" onclick="reiniciarTest()" 
                    style="background: #e74c3c; color: white; padding: 10px 20px; 
                           border: none; border-radius: 5px; cursor: pointer;">
                Hacer otro test
            </button>
        </div>
    `;
    
    contenidoDiv.innerHTML = html;
    resultadoDiv.style.display = 'block';
    
    // Scroll al resultado
    resultadoDiv.scrollIntoView({ behavior: 'smooth' });
}

function reiniciarTest() {
    // Limpiar todos los inputs
    document.querySelectorAll('.puntos-input').forEach(input => {
        input.value = '0';
    });
    
    // Resetear validaciones
    document.querySelectorAll('.validacion-par').forEach(div => {
        div.style.display = 'none';
    });
    
    // Resetear totales
    DATOS_PERSONALIDAD.dimensiones.forEach(dimension => {
        calcularTotalesDimension(dimension.codigo);
    });
    
    // Ocultar resultado
    document.getElementById('resultado').style.display = 'none';
    
    // Resetear botón
    actualizarEstadoBoton();
    
    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
}