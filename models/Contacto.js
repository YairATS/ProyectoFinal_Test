import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('Contacto', {
        id_contacto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        mensaje: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        fecha_envio: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        leido: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: 'contactos',
        timestamps: false
    });
};