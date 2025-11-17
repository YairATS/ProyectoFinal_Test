import { Grupo, sequelize } from "../models/database.js";


class GrupoRepository {

  async create(data){
    return await Grupo.create(data);
  }

  async findAll(){
    return await Grupo.findAll();
  }

  async findById(id){
    return await Grupo.findByPk(id);
  }

  async update (id, data){
    const t = await sequelize.transaction();
    try {
        const grupo = await Grupo.findByPk(id);
        await grupo.update(data, {transaction: t});
        await t.commit();
        return grupo;
    } catch (error) {
        await t.rollback();
        throw error;
    }
  }

  async delete (id){
    const t = await sequelize.transaction();
    try {
        const grupo = await Grupo.findByPk(id);
        if (!grupo) { await t.rollback(); return false; }
        await grupo.destroy({transaction: t});
        await t.commit();
        return true;
    } catch (error) {
        await t.rollback();
        throw error;
    }
  }

}

export default new GrupoRepository();