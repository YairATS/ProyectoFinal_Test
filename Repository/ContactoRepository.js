import { Contacto, sequelize } from "../models/database.js";


class ContactosRepository {

  async create(data){
    return await Contacto.create(data);
  }

  async findAll(){
    return await Contacto.findAll();
  }

  async findById(id){
    return await Contacto.findByPk(id);
  }

  async update (id, data){
    const t = await sequelize.transaction();
    try {
        const contacto = await Contacto.findByPk(id);
        await contacto.update(data, {transaction: t});
        await t.commit();
        return contacto;
    } catch (error) {
        await t.rollback();
        throw error;
    }
  }

  async delete (id){
    const t = await sequelize.transaction();
    try {
        const contacto = await Contacto.findByPk(id);
        if (!contacto) { await t.rollback(); return false; }
        await contacto.destroy({transaction: t});
        await t.commit();
        return true;
    } catch (error) {
        await t.rollback();
        throw error;
    }
  }

}

export default new ContactosRepository();