// Generar preguntas (código de tu archivo original)
function generarTestVark() {
  const container = document.getElementById("preguntas-vark");

  VARK_DATA.preguntas.forEach((pregunta, index) => {
    const preguntaDiv = document.createElement("div");
    preguntaDiv.className = "pregunta-vark";

    let opcionesHTML = "";
    pregunta.opciones.forEach((opcion) => {
      opcionesHTML += `
                <label class="opcion-vark">
                    <input type="checkbox" name="pregunta_${pregunta.id}" 
                           value="${opcion.valor}">
                    ${opcion.texto}
                </label>
            `;
    });

    preguntaDiv.innerHTML = `
            <h4>${index + 1}. ${pregunta.texto}</h4>
            <div class="opciones-container">${opcionesHTML}</div>
        `;

    container.appendChild(preguntaDiv);
  });
}

// Calcular resultados
function calcularResultadoVark() {
  const respuestas = { V: 0, A: 0, R: 0, K: 0 };

  document
    .querySelectorAll('input[type="checkbox"]:checked')
    .forEach((checkbox) => {
      respuestas[checkbox.value]++;
    });

  const total = Object.values(respuestas).reduce((a, b) => a + b, 0);
  let estiloPredominante = Object.keys(respuestas).reduce((a, b) =>
    respuestas[a] > respuestas[b] ? a : b
  );

  return {
    puntajes: respuestas,
    estiloPredominante,
    total,
  };
}

// Enviar al backend
async function enviarTestVark(resultado) {
  const datosAlumno = {
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    email: document.getElementById("email").value,
    matricula: document.getElementById("matricula").value || null,
    id_grupo: document.getElementById("id_grupo").value || null,
  };

  const datosTest = {
    puntaje_visual: resultado.puntajes.V,
    puntaje_auditivo: resultado.puntajes.A,
    puntaje_lectura_escritura: resultado.puntajes.R,
    puntaje_kinestesico: resultado.puntajes.K,
    estilo_predominante: resultado.estiloPredominante,
  };

  try {
    document.getElementById("loading").style.display = "block";

    const response = await fetch("/api/tests/vark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alumno: datosAlumno, test: datosTest }),
    });

    const data = await response.json();

    document.getElementById("loading").style.display = "none";

    if (response.ok) {
      mostrarResultadoVark(resultado, data);
    } else {
      alert("Error: " + (data.error || "No se pudo guardar el test"));
    }
  } catch (error) {
    document.getElementById("loading").style.display = "none";
    alert("Error al conectar con el servidor");
    console.error(error);
  }
}

async function mostrarResultadoVark(resultado, dataServidor) {
  const descripciones = {
    V: "👁️ VISUAL - Aprendes mejor mediante imágenes, diagramas, videos",
    A: "👂 AUDITIVO - Prefieres escuchar explicaciones y discusiones",
    R: "📝 LECTURA/ESCRITURA - Aprendes mejor leyendo y escribiendo",
    K: "✋ KINESTÉSICO - Aprendes haciendo, mediante experiencia práctica",
  };

  let html = `
        <div class="alert alert-success">
            <strong>✅ ${dataServidor.mensaje}</strong>
        </div>
        
        <h3 style="text-align: center; color: #2c3e50; margin-bottom: 1rem;">📊 Tu Resultado Individual</h3>
        
        <div class="result-header">
            <h3>Estilo ${resultado.estiloPredominante}</h3>
            <p>${descripciones[resultado.estiloPredominante]}</p>
        </div>
        <div class="puntajes">
            <h4>📊 Tus Puntajes:</h4>
    `;

  Object.entries(resultado.puntajes).forEach(([estilo, puntaje]) => {
    const porcentaje = Math.round((puntaje / resultado.total) * 100);
    const clase = estilo === resultado.estiloPredominante ? "predominante" : "";

    html += `
            <div class="puntaje-item ${clase}">
                <strong>${estilo}: ${puntaje} puntos (${porcentaje}%)</strong><br>
                <small>${descripciones[estilo]}</small>
            </div>
        `;
  });

  html += `</div>`;

  // Si el alumno pertenece a un grupo, mostrar estadísticas grupales
  const idGrupo = document.getElementById("id_grupo").value;
  if (idGrupo) {
    html += '<div id="estadisticas-grupo"></div>';
  }

  document.getElementById("resultadoContenidoVark").innerHTML = html;
  document.getElementById("resultadoVark").style.display = "block";

  // Cargar estadísticas del grupo si aplica
  if (idGrupo) {
    await cargarEstadisticasGrupoVark(idGrupo);
  }

  document
    .getElementById("resultadoVark")
    .scrollIntoView({ behavior: "smooth" });
}

async function cargarEstadisticasGrupoVark(idGrupo) {
    try {
        const response = await fetch(`/api/dashboard/vark/grupo/${idGrupo}`);
        const data = await response.json();
        
        if (!response.ok) {
            console.error('Error al cargar estadísticas:', data);
            return;
        }

        const descripciones = {
            'V': '👁️ Visual',
            'A': '👂 Auditivo',
            'R': '📝 Lectura/Escritura',
            'K': '✋ Kinestésico'
        };

        let html = `
            <div style="margin-top: 2rem; padding: 1.5rem; background: #f0f7ff; border-radius: 8px; border-left: 4px solid #2196F3;">
                <h3 style="color: #1976D2; margin-top: 0;">
                    👥 Resultados de tu Grupo: ${data.grupo}
                </h3>
                
                <div style="background: white; padding: 1rem; border-radius: 4px; margin: 1rem 0;">
                    <p style="font-size: 1.1rem; margin: 0;">
                        <strong>Estilo predominante del grupo:</strong> 
                        <span style="color: #27ae60; font-size: 1.3rem;">${descripciones[data.estiloPredominante]}</span>
                    </p>
                    <p style="color: #666; margin: 0.5rem 0 0 0;">
                        <small>Basado en ${data.totalTests} test${data.totalTests !== 1 ? 's' : ''} realizado${data.totalTests !== 1 ? 's' : ''}</small>
                    </p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1.5rem; align-items: center;">
                    <!-- Gráfica -->
                    <div style="background: white; padding: 1.5rem; border-radius: 8px;">
                        <canvas id="chartVarkGrupo" style="max-height: 300px;"></canvas>
                    </div>
                    
                    <!-- Detalles -->
                    <div>
                        <h4 style="color: #1976D2; margin-bottom: 1rem;">Distribución del grupo:</h4>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        `;

        // Mostrar cada estilo con su cantidad
        ['V', 'A', 'R', 'K'].forEach(estilo => {
            const cantidad = data.detalle[estilo];
            const porcentaje = data.totalTests > 0 ? Math.round((cantidad / data.totalTests) * 100) : 0;
            const esPredominante = estilo === data.estiloPredominante;
            
            html += `
                <div style="background: ${esPredominante ? '#e8f5e9' : 'white'}; 
                           padding: 1rem; 
                           border-radius: 4px; 
                           border: 2px solid ${esPredominante ? '#4CAF50' : '#ddd'};
                           display: flex;
                           justify-content: space-between;
                           align-items: center;">
                    <div>
                        <div style="font-weight: bold;">${descripciones[estilo]}</div>
                        ${esPredominante ? '<small style="color: #27ae60;">★ Predominante</small>' : ''}
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: #2c3e50;">${cantidad}</div>
                        <small style="color: #666;">${porcentaje}%</small>
                    </div>
                </div>
            `;
        });

        html += `
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('estadisticas-grupo').innerHTML = html;
        
        // Crear la gráfica de pie
        crearGraficaVark(data);
        
    } catch (error) {
        console.error('Error al cargar estadísticas del grupo:', error);
    }
}

function crearGraficaVark(data) {
    const ctx = document.getElementById('chartVarkGrupo');
    
    if (!ctx) {
        console.error('Canvas no encontrado');
        return;
    }

    const colores = {
        'V': '#2196F3',  // Azul para Visual
        'A': '#4CAF50',  // Verde para Auditivo
        'R': '#FF9800',  // Naranja para Lectura/Escritura
        'K': '#9C27B0'   // Morado para Kinestésico
    };

    const labels = {
        'V': '👁️ Visual',
        'A': '👂 Auditivo',
        'R': '📝 Lectura/Escritura',
        'K': '✋ Kinestésico'
    };

    const dataValues = [];
    const backgroundColors = [];
    const labelsArray = [];

    ['V', 'A', 'R', 'K'].forEach(estilo => {
        const cantidad = data.detalle[estilo];
        if (cantidad > 0) {
            dataValues.push(cantidad);
            backgroundColors.push(colores[estilo]);
            labelsArray.push(labels[estilo]);
        }
    });

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labelsArray,
            datasets: [{
                data: dataValues,
                backgroundColor: backgroundColors,
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Event listeners
document.getElementById("formVark").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validar datos del alumno
  if (
    !document.getElementById("nombre").value ||
    !document.getElementById("email").value
  ) {
    alert("Por favor completa nombre y email");
    return;
  }

  const resultado = calcularResultadoVark();

  if (resultado.total === 0) {
    alert("Por favor responde al menos una pregunta");
    return;
  }

  await enviarTestVark(resultado);
});

// Inicializar
document.addEventListener("DOMContentLoaded", generarTestVark);
