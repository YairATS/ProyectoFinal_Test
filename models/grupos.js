import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('Grupos', {
        id_grupo:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_grupo: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        fecha_creacion: {
            type: DataTypes.DATE,
            allowNull: false
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },{
        tableName: 'grupos',
        timestamps: false
    });
};