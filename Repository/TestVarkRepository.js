import { TestVark, Alumno, sequelize } from "../models/database.js";

class TestVarkRepository {

  async create(data) {
    return await TestVark.create(data);
  }

  async findAll() {
    return await TestVark.findAll({
      include: [{
        model: Alumno,
        as: 'alumno'
      }]
    });
  }

  async findById(id) {
    return await TestVark.findByPk(id, {
      include: [{
        model: Alumno,
        as: 'alumno'
      }]
    });
  }

  async findByAlumno(id_alumno) {
    return await TestVark.findAll({
      where: { id_alumno },
      order: [['fecha_realizacion', 'DESC']]
    });
  }

  async findLastByAlumno(id_alumno) {
    return await TestVark.findOne({
      where: { id_alumno },
      order: [['fecha_realizacion', 'DESC']]
    });
  }

  async update(id, data) {
    const t = await sequelize.transaction();
    try {
      const test = await TestVark.findByPk(id);
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
      const test = await TestVark.findByPk(id);
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

export default new TestVarkRepository();