// vark-logica.js
function generarTestVark() {
    const container = document.getElementById('preguntas-vark');
    
    VARK_DATA.preguntas.forEach((pregunta, index) => {
        const preguntaDiv = document.createElement('div');
        preguntaDiv.className = 'pregunta-vark';
        preguntaDiv.dataset.id = pregunta.id;
        
        let opcionesHTML = '';
        pregunta.opciones.forEach((opcion) => {
            opcionesHTML += `
                <label class="opcion-vark">
                    <input type="checkbox" name="pregunta_${pregunta.id}" 
                           value="${opcion.valor}" data-pregunta="${pregunta.id}">
                    ${opcion.texto}
                </label>
            `;
        });
        
        preguntaDiv.innerHTML = `
            <div class="pregunta-texto">
                <h4>${index + 1}. ${pregunta.texto}</h4>
            </div>
            <div class="opciones-container">
                ${opcionesHTML}
            </div>
        `;
        
        container.appendChild(preguntaDiv);
    });
    
    configurarEventosVark();
}

function configurarEventosVark() {
    document.getElementById('formVark').addEventListener('submit', function(e) {
        e.preventDefault();
        calcularResultadoVark();
    });
}

function calcularResultadoVark() {
    const respuestas = recolectarRespuestasVark();
    const resultado = procesarResultadoVark(respuestas);
    mostrarResultadoVark(resultado);


}

function recolectarRespuestasVark() {
    const respuestas = { V: 0, A: 0, R: 0, K: 0 };
    
    // Contar selecciones por estilo
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
        const estilo = checkbox.value;
        respuestas[estilo]++;
    });
    
    return respuestas;
}

function procesarResultadoVark(respuestas) {
    const { V, A, R, K } = respuestas;
    const total = V + A + R + K;
    
    // Encontrar estilo predominante
    let estiloPredominante = 'V';
    let maxPuntaje = V;
    
    if (A > maxPuntaje) { estiloPredominante = 'A'; maxPuntaje = A; }
    if (R > maxPuntaje) { estiloPredominante = 'R'; maxPuntaje = R; }
    if (K > maxPuntaje) { estiloPredominante = 'K'; maxPuntaje = K; }
    
    return {
        puntajes: { V, A, R, K },
        estiloPredominante,
        totalRespuestas: total,
        porcentajes: {
            V: total > 0 ? Math.round((V / total) * 100) : 0,
            A: total > 0 ? Math.round((A / total) * 100) : 0,
            R: total > 0 ? Math.round((R / total) * 100) : 0,
            K: total > 0 ? Math.round((K / total) * 100) : 0
        }
    };
}

function mostrarResultadoVark(resultado) {
    const resultadoDiv = document.getElementById('resultadoVark');
    const contenidoDiv = document.getElementById('resultadoContenidoVark');
    
    const descripciones = {
        'V': '👁️ VISUAL - Aprendes mejor mediante imágenes, diagramas, videos, gráficos y representaciones visuales',
        'A': '👂 AUDITIVO - Prefieres escuchar explicaciones, discusiones, conferencias y material auditivo',
        'R': '📝 LECTURA/ESCRITURA - Aprendes mejor leyendo textos, tomando notas, escribiendo y organizando información',
        'K': '✋ KINESTÉSICO - Aprendes haciendo, mediante experiencia práctica, movimiento y actividades táctiles'
    };
    
    let html = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h3 style="font-size: 2em; color: #2c3e50; margin: 0;">
                Estilo ${resultado.estiloPredominante} - ${descripciones[resultado.estiloPredominante].split(' - ')[1]}
            </h3>
            <p style="font-style: italic; color: #7f8c8d;">
                ${descripciones[resultado.estiloPredominante]}
            </p>
        </div>
        
        <h4>📊 Tus Puntajes:</h4>
    `;
    
    // Mostrar puntajes individuales
    Object.entries(resultado.puntajes).forEach(([estilo, puntaje]) => {
        const esPredominante = estilo === resultado.estiloPredominante;
        const clase = esPredominante ? 'puntaje-estilo estilo-predominante' : 'puntaje-estilo';
        const porcentaje = resultado.porcentajes[estilo];
        
        html += `
            <div class="${clase}">
                <strong>${estilo}: ${puntaje} puntos (${porcentaje}%)</strong><br>
                <small>${descripciones[estilo]}</small>
                ${esPredominante ? '<div style="color: #27ae60; margin-top: 5px;">🎯 ESTILO PREDOMINANTE</div>' : ''}
            </div>
        `;
    });
    
    html += `
        <div style="margin-top: 20px; padding: 15px; background: #d6eaf8; border-radius: 5px;">
            <strong>Total de respuestas seleccionadas:</strong> ${resultado.totalRespuestas}
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <button onclick="reiniciarTestVark()" style="background: #e74c3c;">
                🔄 Hacer otro test
            </button>
        </div>
    `;
    
    contenidoDiv.innerHTML = html;
    resultadoDiv.style.display = 'block';
    resultadoDiv.scrollIntoView({ behavior: 'smooth' });
}

function reiniciarTestVark() {
    // Limpiar todos los checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Ocultar resultado
    document.getElementById('resultadoVark').style.display = 'none';
    
    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    generarTestVark();
});