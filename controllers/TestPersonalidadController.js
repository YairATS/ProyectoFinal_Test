import TestPersonalidadRepository from "../Repository/TestPersonalidadRepository.js";
import AlumnoService from "../services/AlumnoService.js";

export const getAllTestsPersonalidad = async (req, res) => {
  try {
    const tests = await TestPersonalidadRepository.findAll();
    res.json(tests);
  } catch (error) {
    console.error('Error en getAllTestsPersonalidad:', error);
    res.status(500).json({ error: 'Error al obtener los tests de personalidad' });
  }
};

export const getTestPersonalidad = async (req, res) => {
  try {
    const test = await TestPersonalidadRepository.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ error: 'Test de personalidad no encontrado' });
    }
    res.json(test);
  } catch (error) {
    console.error('Error en getTestPersonalidad:', error);
    res.status(500).json({ error: 'Error al obtener el test de personalidad' });
  }
};

export const getTestsPersonalidadByAlumno = async (req, res) => {
  try {
    const tests = await TestPersonalidadRepository.findByAlumno(req.params.idAlumno);
    res.json(tests);
  } catch (error) {
    console.error('Error en getTestsPersonalidadByAlumno:', error);
    res.status(500).json({ error: 'Error al obtener los tests del alumno' });
  }
};

/**
 * Crear test de Personalidad con datos del alumno
 * Body: {
 *   alumno: { nombre, apellido, email, matricula, id_grupo },
 *   test: { tipo_personalidad, puntaje_e, puntaje_i, puntaje_s, puntaje_n, puntaje_t, puntaje_f, puntaje_j, puntaje_p }
 * }
 */
export const createTestPersonalidad = async (req, res) => {
  try {
    const { alumno: datosAlumno, test: datosTest } = req.body;

    // Validar estructura del body
    if (!datosAlumno || !datosTest) {
      return res.status(400).json({ 
        error: 'Se requieren datos del alumno y del test' 
      });
    }

    // Validar datos del alumno
    const { esValido, errores } = AlumnoService.validarDatosAlumno(datosAlumno);
    if (!esValido) {
      return res.status(400).json({ 
        error: 'Datos del alumno inválidos', 
        detalles: errores 
      });
    }

    // Validar datos del test
    const { 
      tipo_personalidad,
      puntaje_e, puntaje_i,
      puntaje_s, puntaje_n,
      puntaje_t, puntaje_f,
      puntaje_j, puntaje_p
    } = datosTest;

    if (
      !tipo_personalidad ||
      puntaje_e === undefined || puntaje_i === undefined ||
      puntaje_s === undefined || puntaje_n === undefined ||
      puntaje_t === undefined || puntaje_f === undefined ||
      puntaje_j === undefined || puntaje_p === undefined
    ) {
      return res.status(400).json({ 
        error: 'Faltan datos del test de personalidad' 
      });
    }

    // Validar tipo de personalidad (4 letras)
    if (tipo_personalidad.length !== 4 || !/^[EISNTFJP]{4}$/i.test(tipo_personalidad)) {
      return res.status(400).json({ 
        error: 'Tipo de personalidad inválido. Debe ser 4 letras (E/I, S/N, T/F, J/P)' 
      });
    }

    // Buscar o crear alumno
    const { alumno, esNuevo } = await AlumnoService.buscarOCrearAlumno(datosAlumno);

    // Crear test de personalidad
    const nuevoTest = await TestPersonalidadRepository.create({
      id_alumno: alumno.id_alumno,
      tipo_personalidad: tipo_personalidad.toUpperCase(),
      puntaje_e, puntaje_i,
      puntaje_s, puntaje_n,
      puntaje_t, puntaje_f,
      puntaje_j, puntaje_p
    });

    // Responder inmediatamente con los datos
    res.status(201).json({
      mensaje: esNuevo ? 'Alumno registrado y test creado exitosamente' : 'Test creado exitosamente',
      alumno: {
        id: alumno.id_alumno,
        nombre: alumno.nombre,
        apellido: alumno.apellido,
        email: alumno.email,
        esNuevo
      },
      test: {
        id: nuevoTest.id_test_personalidad,
        tipo_personalidad: nuevoTest.tipo_personalidad,
        puntaje_e: nuevoTest.puntaje_e,
        puntaje_i: nuevoTest.puntaje_i,
        puntaje_s: nuevoTest.puntaje_s,
        puntaje_n: nuevoTest.puntaje_n,
        puntaje_t: nuevoTest.puntaje_t,
        puntaje_f: nuevoTest.puntaje_f,
        puntaje_j: nuevoTest.puntaje_j,
        puntaje_p: nuevoTest.puntaje_p,
        fecha_realizacion: nuevoTest.fecha_realizacion
      }
    });

  } catch (error) {
    console.error('Error en createTestPersonalidad:', error);
    res.status(500).json({ 
      error: 'Error al crear el test de personalidad',
      detalles: error.message 
    });
  }
};

export const updateTestPersonalidad = async (req, res) => {
  try {
    const test = await TestPersonalidadRepository.update(req.params.id, req.body);
    if (!test) {
      return res.status(404).json({ error: 'Test de personalidad no encontrado' });
    }
    res.json(test);
  } catch (error) {
    console.error('Error en updateTestPersonalidad:', error);
    res.status(500).json({ error: 'Error al actualizar el test de personalidad' });
  }
};

export const deleteTestPersonalidad = async (req, res) => {
  try {
    const ok = await TestPersonalidadRepository.delete(req.params.id);
    if (!ok) {
      return res.status(404).json({ error: 'Test de personalidad no encontrado' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Error en deleteTestPersonalidad:', error);
    res.status(500).json({ error: 'Error al eliminar el test de personalidad' });
  }
};