import AlumnoRepository from "../Repository/AlumnoRepository.js";

class AlumnoService {

  /**
   * Busca o crea un alumno basado en email o matrícula
   * @param {Object} datos - { nombre, apellido, email, matricula, id_grupo }
   * @returns {Object} - { alumno, esNuevo }
   */
  async buscarOCrearAlumno(datos) {
    const { nombre, apellido, email, matricula, id_grupo } = datos;

    // Validar datos requeridos
    if (!nombre || !email) {
      throw new Error('Nombre y email son obligatorios');
    }

    try {
      // Primero buscar por email
      let alumno = await AlumnoRepository.findAll();
      alumno = alumno.find(a => a.email === email);

      // Si no existe por email y hay matrícula, buscar por matrícula
      if (!alumno && matricula) {
        alumno = await AlumnoRepository.findByMatricula(matricula);
      }

      // Si existe el alumno, actualizarlo
      if (alumno) {
        const datosActualizados = {};
        
        if (nombre && nombre !== alumno.nombre) datosActualizados.nombre = nombre;
        if (apellido && apellido !== alumno.apellido) datosActualizados.apellido = apellido;
        if (matricula && matricula !== alumno.matricula) datosActualizados.matricula = matricula;
        if (id_grupo && id_grupo !== alumno.id_grupo) datosActualizados.id_grupo = id_grupo;

        // Solo actualizar si hay cambios
        if (Object.keys(datosActualizados).length > 0) {
          alumno = await AlumnoRepository.update(alumno.id_alumno, datosActualizados);
        }

        return { alumno, esNuevo: false };
      }

      // Si no existe, crear nuevo alumno
      const nuevoAlumno = await AlumnoRepository.create({
        nombre,
        apellido: apellido || null,
        email,
        matricula: matricula || null,
        id_grupo: id_grupo || null
      });

      return { alumno: nuevoAlumno, esNuevo: true };

    } catch (error) {
      console.error('Error en buscarOCrearAlumno:', error);
      throw new Error('Error al procesar información del alumno');
    }
  }

  /**
   * Valida datos del alumno
   */
  validarDatosAlumno(datos) {
    const errores = [];

    if (!datos.nombre || datos.nombre.trim().length === 0) {
      errores.push('El nombre es obligatorio');
    }

    if (!datos.email || datos.email.trim().length === 0) {
      errores.push('El email es obligatorio');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (datos.email && !emailRegex.test(datos.email)) {
      errores.push('El formato del email no es válido');
    }

    return {
      esValido: errores.length === 0,
      errores
    };
  }
}

export default new AlumnoService();