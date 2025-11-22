// ==================== AUTENTICACIÓN ====================
const token = localStorage.getItem('token');
const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

// Verificar autenticación
if (!token || !usuario.nombre) {
    window.location.href = '/admin/login';
}

// Mostrar info del usuario
document.getElementById('user-name').textContent = usuario.nombre;
document.getElementById('user-avatar').textContent = usuario.nombre.charAt(0).toUpperCase();

// Cargar grupos al inicio
cargarGrupos();

// ==================== FUNCIONES DE TABS ====================

function cambiarTab(tab) {
    // Cambiar clase active en tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    // Cambiar clase active en cards
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    document.getElementById(`card-${tab}`).classList.add('active');

    // Cargar datos según el tab
    if (tab === 'grupos') {
        cargarGrupos();
    } else if (tab === 'alumnos') {
        cargarAlumnos();
        cargarGruposParaSelect(); // Para el selector del modal
    }
}

// ==================== CRUD GRUPOS ====================

async function cargarGrupos() {
    try {
        const response = await fetch('/api/grupos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const grupos = await response.json();

        const tbody = document.getElementById('tabla-grupos');

        if (grupos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay grupos registrados</td></tr>';
            return;
        }

        tbody.innerHTML = grupos.map(g => `
            <tr>
                <td>${g.id_grupo}</td>
                <td>${g.nombre_grupo}</td>
                <td>${g.descripcion || '-'}</td>
                <td>${new Date(g.fecha_creacion).toLocaleDateString('es-MX')}</td>
                <td>
                    <span class="badge ${g.activo ? 'badge-active' : 'badge-inactive'}">
                        ${g.activo ? '✓ Activo' : '✗ Inactivo'}
                    </span>
                </td>
                <td>
                    <div class="actions">
                        <button class="btn-edit" onclick='editarGrupo(${JSON.stringify(g)})'>
                            ✏️ Editar
                        </button>
                        <button class="btn-delete" onclick="confirmarEliminarGrupo(${g.id_grupo}, '${g.nombre_grupo.replace(/'/g, "\\'")}')">
                            🗑️ Eliminar
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error al cargar grupos:', error);
        mostrarMensaje('grupos', 'Error al cargar los grupos', 'error');
    }
}

function abrirModalNuevoGrupo() {
    document.getElementById('modal-grupo-title').textContent = 'Nuevo Grupo';
    document.getElementById('grupo-id').value = '';
    document.getElementById('grupo-nombre').value = '';
    document.getElementById('grupo-descripcion').value = '';
    document.getElementById('grupo-activo').value = 'true';
    document.getElementById('modal-grupo').classList.add('show');
}

function editarGrupo(grupo) {
    document.getElementById('modal-grupo-title').textContent = 'Editar Grupo';
    document.getElementById('grupo-id').value = grupo.id_grupo;
    document.getElementById('grupo-nombre').value = grupo.nombre_grupo;
    document.getElementById('grupo-descripcion').value = grupo.descripcion || '';
    document.getElementById('grupo-activo').value = grupo.activo.toString();
    document.getElementById('modal-grupo').classList.add('show');
}

function cerrarModalGrupo() {
    document.getElementById('modal-grupo').classList.remove('show');
}

document.getElementById('form-grupo').addEventListener('submit', async (e) => {
    e.preventDefault();
    await guardarGrupo();
});

async function guardarGrupo() {
    const id = document.getElementById('grupo-id').value;
    const nombre = document.getElementById('grupo-nombre').value.trim();
    const descripcion = document.getElementById('grupo-descripcion').value.trim();
    const activo = document.getElementById('grupo-activo').value === 'true';

    if (!nombre) {
        alert('El nombre del grupo es requerido');
        return;
    }

    try {
        const url = id ? `/api/grupos/${id}` : '/api/grupos';
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre_grupo: nombre,
                descripcion: descripcion || null,
                activo: activo,
                fecha_creacion: new Date().toISOString()
            })
        });

        if (response.ok) {
            mostrarMensaje('grupos', id ? 'Grupo actualizado correctamente' : 'Grupo creado correctamente', 'success');
            cerrarModalGrupo();
            cargarGrupos();
        } else {
            const error = await response.json();
            mostrarMensaje('grupos', error.error || 'Error al guardar el grupo', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('grupos', 'Error de conexión', 'error');
    }
}

function confirmarEliminarGrupo(id, nombre) {
    if (confirm(`¿Está seguro de eliminar el grupo "${nombre}"?\n\nEsta acción no se puede deshacer.`)) {
        eliminarGrupo(id);
    }
}

async function eliminarGrupo(id) {
    try {
        const response = await fetch(`/api/grupos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            mostrarMensaje('grupos', 'Grupo eliminado correctamente', 'success');
            cargarGrupos();
        } else {
            const error = await response.json();
            mostrarMensaje('grupos', error.error || 'Error al eliminar el grupo', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('grupos', 'Error de conexión', 'error');
    }
}

// ==================== CRUD ALUMNOS ====================

async function cargarAlumnos() {
    try {
        const response = await fetch('/api/alumnos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const alumnos = await response.json();

        const tbody = document.getElementById('tabla-alumnos');

        if (alumnos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay alumnos registrados</td></tr>';
            return;
        }

        tbody.innerHTML = alumnos.map(a => {
            const nombreCompleto = `${a.nombre} ${a.apellido || ''}`.trim();
            return `
                <tr>
                    <td>${a.id_alumno}</td>
                    <td>${nombreCompleto}</td>
                    <td>${a.email}</td>
                    <td>${a.matricula || '-'}</td>
                    <td>${a.Grupo?.nombre_grupo || 'Sin grupo'}</td>
                    <td>
                        <span class="badge ${a.activo ? 'badge-active' : 'badge-inactive'}">
                            ${a.activo ? '✓ Activo' : '✗ Inactivo'}
                        </span>
                    </td>
                    <td>
                        <div class="actions">
                            <button class="btn-view" onclick="verDetalleAlumno(${a.id_alumno})">
                                👁️ Ver
                            </button>
                            <button class="btn-edit" onclick='editarAlumno(${JSON.stringify(a)})'>
                                ✏️ Editar
                            </button>
                            <button class="btn-delete" onclick="confirmarEliminarAlumno(${a.id_alumno}, '${nombreCompleto.replace(/'/g, "\\'")}')">
                                🗑️ Eliminar
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error al cargar alumnos:', error);
        mostrarMensaje('alumnos', 'Error al cargar los alumnos', 'error');
    }
}

async function cargarGruposParaSelect() {
    try {
        const response = await fetch('/api/grupos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const grupos = await response.json();

        const select = document.getElementById('alumno-grupo');
        select.innerHTML = '<option value="">Sin grupo</option>';
        
        grupos.filter(g => g.activo).forEach(grupo => {
            select.innerHTML += `<option value="${grupo.id_grupo}">${grupo.nombre_grupo}</option>`;
        });
    } catch (error) {
        console.error('Error al cargar grupos:', error);
    }
}

function abrirModalNuevoAlumno() {
    document.getElementById('modal-alumno-title').textContent = 'Nuevo Alumno';
    document.getElementById('alumno-id').value = '';
    document.getElementById('alumno-nombre').value = '';
    document.getElementById('alumno-apellido').value = '';
    document.getElementById('alumno-email').value = '';
    document.getElementById('alumno-matricula').value = '';
    document.getElementById('alumno-grupo').value = '';
    document.getElementById('alumno-activo').value = 'true';
    document.getElementById('modal-alumno').classList.add('show');
    cargarGruposParaSelect();
}

function editarAlumno(alumno) {
    document.getElementById('modal-alumno-title').textContent = 'Editar Alumno';
    document.getElementById('alumno-id').value = alumno.id_alumno;
    document.getElementById('alumno-nombre').value = alumno.nombre;
    document.getElementById('alumno-apellido').value = alumno.apellido || '';
    document.getElementById('alumno-email').value = alumno.email;
    document.getElementById('alumno-matricula').value = alumno.matricula || '';
    document.getElementById('alumno-grupo').value = alumno.id_grupo || '';
    document.getElementById('alumno-activo').value = alumno.activo.toString();
    document.getElementById('modal-alumno').classList.add('show');
    cargarGruposParaSelect();
}

function cerrarModalAlumno() {
    document.getElementById('modal-alumno').classList.remove('show');
}

async function verDetalleAlumno(id) {
    try {
        const response = await fetch(`/api/alumnos/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const alumno = await response.json();

        // Obtener tests del alumno
        const [varkResponse, personalidadResponse] = await Promise.all([
            fetch(`/api/tests/vark/alumno/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }),
            fetch(`/api/tests/personalidad/alumno/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
        ]);

        const testsVark = await varkResponse.json();
        const testsPersonalidad = await personalidadResponse.json();

        const nombreCompleto = `${alumno.nombre} ${alumno.apellido || ''}`.trim();
        
        alert(`
DETALLE DEL ALUMNO

Nombre: ${nombreCompleto}
Email: ${alumno.email}
Matrícula: ${alumno.matricula || 'Sin matrícula'}
Grupo: ${alumno.Grupo?.nombre_grupo || 'Sin grupo'}
Estado: ${alumno.activo ? 'Activo' : 'Inactivo'}

Tests realizados:
- VARK: ${testsVark.length}
- Personalidad: ${testsPersonalidad.length}

Último test VARK: ${testsVark[0] ? testsVark[0].estilo_predominante : 'Ninguno'}
Último test Personalidad: ${testsPersonalidad[0] ? testsPersonalidad[0].tipo_personalidad : 'Ninguno'}
        `);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al obtener detalles del alumno');
    }
}

document.getElementById('form-alumno').addEventListener('submit', async (e) => {
    e.preventDefault();
    await guardarAlumno();
});

async function guardarAlumno() {
    const id = document.getElementById('alumno-id').value;
    const nombre = document.getElementById('alumno-nombre').value.trim();
    const apellido = document.getElementById('alumno-apellido').value.trim();
    const email = document.getElementById('alumno-email').value.trim();
    const matricula = document.getElementById('alumno-matricula').value.trim();
    const id_grupo = document.getElementById('alumno-grupo').value;
    const activo = document.getElementById('alumno-activo').value === 'true';

    if (!nombre || !email) {
        alert('Nombre y email son requeridos');
        return;
    }

    try {
        const url = id ? `/api/alumnos/${id}` : '/api/alumnos';
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre,
                apellido: apellido || null,
                email,
                matricula: matricula || null,
                id_grupo: id_grupo || null,
                activo
            })
        });

        if (response.ok) {
            mostrarMensaje('alumnos', id ? 'Alumno actualizado correctamente' : 'Alumno creado correctamente', 'success');
            cerrarModalAlumno();
            cargarAlumnos();
        } else {
            const error = await response.json();
            mostrarMensaje('alumnos', error.error || 'Error al guardar el alumno', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('alumnos', 'Error de conexión', 'error');
    }
}

function confirmarEliminarAlumno(id, nombre) {
    if (confirm(`¿Está seguro de eliminar al alumno "${nombre}"?\n\nEsta acción eliminará también todos sus tests realizados.`)) {
        eliminarAlumno(id);
    }
}

async function eliminarAlumno(id) {
    try {
        const response = await fetch(`/api/alumnos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            mostrarMensaje('alumnos', 'Alumno eliminado correctamente', 'success');
            cargarAlumnos();
        } else {
            const error = await response.json();
            mostrarMensaje('alumnos', error.error || 'Error al eliminar el alumno', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('alumnos', 'Error de conexión', 'error');
    }
}

// ==================== FUNCIONES AUXILIARES ====================

function mostrarMensaje(catalogo, mensaje, tipo) {
    const messageDiv = document.getElementById(`message-${catalogo}`);
    messageDiv.textContent = mensaje;
    messageDiv.className = `message ${tipo} show`;

    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 5000);
}

async function cerrarSesion() {
    if (confirm('¿Está seguro de cerrar sesión?')) {
        try {
            await fetch('/api/auth/logout', { 
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }

        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = '/admin/login';
    }
}

// Cerrar modales al hacer clic fuera
document.getElementById('modal-grupo').addEventListener('click', (e) => {
    if (e.target.id === 'modal-grupo') {
        cerrarModalGrupo();
    }
});

document.getElementById('modal-alumno').addEventListener('click', (e) => {
    if (e.target.id === 'modal-alumno') {
        cerrarModalAlumno();
    }
});