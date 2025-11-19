// javascript
import { Sequelize } from 'sequelize';
import 'dotenv/config';

class Database {
  constructor() {
    if (!Database.instance) {
      this.sequelize = new Sequelize('ProyecotFinal_Test', 'postgres', 'your_password', {
        host: 'localhost',
        dialect: 'postgres',
        logging: false,
      });

      // placeholders until init()
      this.Alumno = null;
      this.Contacto = null;
      this.Grupos = null;
      this.TestPersonalidad = null;
      this.TestVark = null;
      this.Administrador = null;

      Database.instance = this;
    }

    return Database.instance;
  }

  async init() {
    // Use dynamic import() in ESM
    const { default: GrupoModel } = await import('./grupos.js');
    const { default: ContactoModel } = await import('./Contacto.js');
    const { default: AlumnoModel } = await import('./Alumno.js');
    const { default: AdministradorModel } = await import('./Administrador.js');
    const { default: TestVarkModel } = await import('./TestVark.js');
    const { default: TestPersonalidadkModel } = await import('./TestPersonalidad.js');

    

    // If your model factories expect (sequelize, DataTypes), pass DataTypes:
    const DataTypes = Sequelize.DataTypes;

    this.Grupo = GrupoModel(this.sequelize, DataTypes);
    this.Alumno = AlumnoModel(this.sequelize, DataTypes);
    this.Contacto = ContactoModel(this.sequelize, DataTypes);
    this.TestVark = TestVarkModel(this.sequelize, DataTypes);
    this.TestPersonalidad = TestPersonalidadkModel(this.sequelize, DataTypes);
    this.Administrador = AdministradorModel(this.sequelize, DataTypes);

    this.initializeRelationships();
  }

  // Relaciones entre los modelos
  initializeRelationships() {
    // Relaciones Alumno
    this.Alumno.belongsTo(this.Grupo, { foreignKey: 'id_grupo', as: 'grupo' });
    this.Alumno.hasMany(this.TestVark, { foreignKey: 'id_alumno', as: 'testsVark' });
    this.Alumno.hasMany(this.TestPersonalidad, { foreignKey: 'id_alumno', as: 'testsPersonalidad' });

    // Relaciones Grupo
    this.Grupo.hasMany(this.Alumno, { foreignKey: 'id_grupo', as: 'alumnos' });

    // Relaciones Tests
    this.TestVark.belongsTo(this.Alumno, { foreignKey: 'id_alumno', as: 'alumno' });
    this.TestPersonalidad.belongsTo(this.Alumno, { foreignKey: 'id_alumno', as: 'alumno' });
  }

  async testConnection() {
    try {
      await this.sequelize.authenticate();
      console.log('✅ Conexión a la base de datos establecida correctamente');
      return true;
    } catch (error) {
      console.error('❌ No se pudo conectar a la base de datos:', error);
      return false;
    }
  }
}

const instance = new Database();
await instance.init(); // top-level await is valid in ESM

export const sequelize = instance.sequelize;
export const TestVark = instance.TestVark;
export const TestPersonalidad = instance.TestPersonalidad;
export const Grupos = instance.Grupo;
export const Alumno = instance.Alumno;
export const Contacto = instance.Contacto;
export const Administrador = instance.Administrador;
export const testConnection = instance.testConnection.bind(instance);
