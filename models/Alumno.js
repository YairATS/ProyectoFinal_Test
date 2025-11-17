import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('Alumno', {
        id_alumno: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        apellido: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        matricula: {
            type: DataTypes.STRING(50),
            allowNull: true,
            unique: true
        },
        id_grupo: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'grupos',
                key: 'id_grupo'
            }
        },
        fecha_registro: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        activo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'alumnos',
        timestamps: false
    });
};