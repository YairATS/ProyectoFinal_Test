import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('TestVark', {
        id_test_vark: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_alumno: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'alumnos',
                key: 'id_alumno'
            }
        },
        fecha_realizacion: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        puntaje_visual: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        puntaje_auditivo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        puntaje_lectura_escritura: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        puntaje_kinestesico: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        estilo_predominante: {
            type: DataTypes.STRING(1),
            allowNull: false,
            validate: {
                isIn: [['V', 'A', 'R', 'K']]
            }
        }
    }, {
        tableName: 'tests_vark',
        timestamps: false
    });
};