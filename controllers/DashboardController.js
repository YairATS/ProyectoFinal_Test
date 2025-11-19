import { sequelize } from "../models/database.js";

export const getEstadisticasVarkGrupo = async (req, res) => {
  try {
    const { idGrupo } = req.params;

    // Query para obtener estadísticas del grupo
    const resultados = await sequelize.query(`
      SELECT 
        tv.estilo_predominante,
        COUNT(*) as cantidad,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as porcentaje
      FROM tests_vark tv
      JOIN alumnos a ON tv.id_alumno = a.id_alumno
      WHERE a.id_grupo = :idGrupo AND a.activo = TRUE
      GROUP BY tv.estilo_predominante
      ORDER BY cantidad DESC
    `, {
      replacements: { idGrupo },
      type: sequelize.QueryTypes.SELECT
    });

    // Obtener total de tests del grupo
    const totalResult = await sequelize.query(`
      SELECT COUNT(*) as total
      FROM tests_vark tv
      JOIN alumnos a ON tv.id_alumno = a.id_alumno
      WHERE a.id_grupo = :idGrupo AND a.activo = TRUE
    `, {
      replacements: { idGrupo },
      type: sequelize.QueryTypes.SELECT
    });

    const total = totalResult[0]?.total || 0;

    // Obtener nombre del grupo
    const grupoResult = await sequelize.query(`
      SELECT nombre_grupo FROM grupos WHERE id_grupo = :idGrupo
    `, {
      replacements: { idGrupo },
      type: sequelize.QueryTypes.SELECT
    });

    const nombreGrupo = grupoResult[0]?.nombre_grupo || 'Grupo';

    // Determinar estilo predominante del grupo (moda)
    const estiloPredominante = resultados.length > 0 ? resultados[0].estilo_predominante : null;

    // Si no hay tests en el grupo, devolver estructura vacía
    if (total === 0) {
      return res.json({
        grupo: nombreGrupo,
        totalTests: 0,
        estiloPredominante: null,
        distribucion: [],
        detalle: {
          V: 0,
          A: 0,
          R: 0,
          K: 0
        }
      });
    }

    res.json({
      grupo: nombreGrupo,
      totalTests: parseInt(total),
      estiloPredominante,
      distribucion: resultados,
      detalle: {
        V: parseInt(resultados.find(r => r.estilo_predominante === 'V')?.cantidad || 0),
        A: parseInt(resultados.find(r => r.estilo_predominante === 'A')?.cantidad || 0),
        R: parseInt(resultados.find(r => r.estilo_predominante === 'R')?.cantidad || 0),
        K: parseInt(resultados.find(r => r.estilo_predominante === 'K')?.cantidad || 0)
      }
    });

  } catch (error) {
    console.error('Error en getEstadisticasVarkGrupo:', error);
    res.status(500).json({ 
      error: 'Error al obtener estadísticas del grupo',
      detalles: error.message 
    });
  }
};

export const getEstadisticasPersonalidadGrupo = async (req, res) => {
  try {
    const { idGrupo } = req.params;

    // Query para obtener estadísticas del grupo
    const resultados = await sequelize.query(`
      SELECT 
        tp.tipo_personalidad,
        COUNT(*) as cantidad,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as porcentaje
      FROM tests_personalidad tp
      JOIN alumnos a ON tp.id_alumno = a.id_alumno
      WHERE a.id_grupo = :idGrupo AND a.activo = TRUE
      GROUP BY tp.tipo_personalidad
      ORDER BY cantidad DESC
    `, {
      replacements: { idGrupo },
      type: sequelize.QueryTypes.SELECT
    });

    // Total de tests
    const totalResult = await sequelize.query(`
      SELECT COUNT(*) as total
      FROM tests_personalidad tp
      JOIN alumnos a ON tp.id_alumno = a.id_alumno
      WHERE a.id_grupo = :idGrupo AND a.activo = TRUE
    `, {
      replacements: { idGrupo },
      type: sequelize.QueryTypes.SELECT
    });

    const total = totalResult[0]?.total || 0;

    // Nombre del grupo
    const grupoResult = await sequelize.query(`
      SELECT nombre_grupo FROM grupos WHERE id_grupo = :idGrupo
    `, {
      replacements: { idGrupo },
      type: sequelize.QueryTypes.SELECT
    });

    const nombreGrupo = grupoResult[0]?.nombre_grupo || 'Grupo';

    // Tipo predominante (moda)
    const tipoPredominante = resultados.length > 0 ? resultados[0].tipo_personalidad : null;

    // Si no hay tests en el grupo, devolver estructura vacía
    if (total === 0) {
      return res.json({
        grupo: nombreGrupo,
        totalTests: 0,
        tipoPredominante: null,
        distribucion: []
      });
    }

    res.json({
      grupo: nombreGrupo,
      totalTests: parseInt(total),
      tipoPredominante,
      distribucion: resultados.map(r => ({
        tipo_personalidad: r.tipo_personalidad,
        cantidad: parseInt(r.cantidad),
        porcentaje: parseFloat(r.porcentaje)
      }))
    });

  } catch (error) {
    console.error('Error en getEstadisticasPersonalidadGrupo:', error);
    res.status(500).json({ 
      error: 'Error al obtener estadísticas del grupo',
      detalles: error.message 
    });
  }
};