import TestVarkRepository from "../Repository/TestVarkRepository.js";
import AlumnoService from "../services/AlumnoService.js";

export const getAllTestsVark = async (req, res) => {
  try {
    const tests = await TestVarkRepository.findAll();
    res.json(tests);
  } catch (error) {
    console.error('Error en getAllTestsVark:', error);
    res.status(500).json({ error: 'Error al obtener los tests VARK' });
  }
};

export const getTestVark = async (req, res) => {
  try {
    const test = await TestVarkRepository.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ error: 'Test VARK no encontrado' });
    }
    res.json(test);
  } catch (error) {
    console.error('Error en getTestVark:', error);
    res.status(500).json({ error: 'Error al obtener el test VARK' });
  }
};

export const getTestsVarkByAlumno = async (req, res) => {
  try {
    const tests = await TestVarkRepository.findByAlumno(req.params.idAlumno);
    res.json(tests);
  } catch (error) {
    console.error('Error en getTestsVarkByAlumno:', error);
    res.status(500).json({ error: 'Error al obtener los tests del alumno' });
  }
};

/**
 * Crear test VARK con datos del alumno
 * Body: {
 *   alumno: { nombre, apellido, email, matricula, id_grupo },
 *   test: { puntaje_visual, puntaje_auditivo, puntaje_lectura_escritura, puntaje_kinestesico, estilo_predominante }
 * }
 */
export const createTestVark = async (req, res) => {
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
      puntaje_visual, 
      puntaje_auditivo, 
      puntaje_lectura_escritura, 
      puntaje_kinestesico, 
      estilo_predominante 
    } = datosTest;

    if (
      puntaje_visual === undefined || 
      puntaje_auditivo === undefined || 
      puntaje_lectura_escritura === undefined || 
      puntaje_kinestesico === undefined || 
      !estilo_predominante
    ) {
      return res.status(400).json({ 
        error: 'Faltan datos del test VARK' 
      });
    }

    // Validar estilo predominante
    if (!['V', 'A', 'R', 'K'].includes(estilo_predominante)) {
      return res.status(400).json({ 
        error: 'Estilo predominante inválido. Debe ser V, A, R o K' 
      });
    }

    // Buscar o crear alumno
    const { alumno, esNuevo } = await AlumnoService.buscarOCrearAlumno(datosAlumno);

    // Crear test VARK
    const nuevoTest = await TestVarkRepository.create({
      id_alumno: alumno.id_alumno,
      puntaje_visual,
      puntaje_auditivo,
      puntaje_lectura_escritura,
      puntaje_kinestesico,
      estilo_predominante
    });

    // Responder inmediatamente con los datos sin hacer query adicional
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
        id: nuevoTest.id_test_vark,
        puntaje_visual: nuevoTest.puntaje_visual,
        puntaje_auditivo: nuevoTest.puntaje_auditivo,
        puntaje_lectura_escritura: nuevoTest.puntaje_lectura_escritura,
        puntaje_kinestesico: nuevoTest.puntaje_kinestesico,
        estilo_predominante: nuevoTest.estilo_predominante,
        fecha_realizacion: nuevoTest.fecha_realizacion
      }
    });

  } catch (error) {
    console.error('Error en createTestVark:', error);
    res.status(500).json({ 
      error: 'Error al crear el test VARK',
      detalles: error.message 
    });
  }
};

export const updateTestVark = async (req, res) => {
  try {
    const test = await TestVarkRepository.update(req.params.id, req.body);
    if (!test) {
      return res.status(404).json({ error: 'Test VARK no encontrado' });
    }
    res.json(test);
  } catch (error) {
    console.error('Error en updateTestVark:', error);
    res.status(500).json({ error: 'Error al actualizar el test VARK' });
  }
};

export const deleteTestVark = async (req, res) => {
  try {
    const ok = await TestVarkRepository.delete(req.params.id);
    if (!ok) {
      return res.status(404).json({ error: 'Test VARK no encontrado' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Error en deleteTestVark:', error);
    res.status(500).json({ error: 'Error al eliminar el test VARK' });
  }
};