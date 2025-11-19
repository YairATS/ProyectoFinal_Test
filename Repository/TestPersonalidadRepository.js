import { TestPersonalidad, Alumno, sequelize } from "../models/database.js";

class TestPersonalidadRepository {

  async create(data) {
    return await TestPersonalidad.create(data);
  }

  async findAll() {
    return await TestPersonalidad.findAll({
      include: [{
        model: Alumno,
        as: 'alumno'
      }]
    });
  }

  async findById(id) {
    return await TestPersonalidad.findByPk(id, {
      include: [{
        model: Alumno,
        as: 'alumno'
      }]
    });
  }

  async findByAlumno(id_alumno) {
    return await TestPersonalidad.findAll({
      where: { id_alumno },
      order: [['fecha_realizacion', 'DESC']]
    });
  }

  async findLastByAlumno(id_alumno) {
    return await TestPersonalidad.findOne({
      where: { id_alumno },
      order: [['fecha_realizacion', 'DESC']]
    });
  }

  async update(id, data) {
    const t = await sequelize.transaction();
    try {
      const test = await TestPersonalidad.findByPk(id);
      if (!test) {
        await t.rollback();
        return null;
      }
      await test.update(data, { transaction: t });
      await t.commit();
      return test;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async delete(id) {
    const t = await sequelize.transaction();
    try {
      const test = await TestPersonalidad.findByPk(id);
      if (!test) {
        await t.rollback();
        return false;
      }
      await test.destroy({ transaction: t });
      await t.commit();
      return true;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

export default new TestPersonalidadRepository();