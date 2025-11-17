import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('TestPersonalidad', {
        id_test_personalidad: {
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
        tipo_personalidad: {
            type: DataTypes.STRING(4),
            allowNull: false,
            validate: {
                len: [4, 4],
                is: /^[EISNTFJP]{4}$/i
            }
        },
        puntaje_e: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        puntaje_i: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        puntaje_s: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        puntaje_n: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        puntaje_t: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        puntaje_f: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        puntaje_j: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        puntaje_p: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        }
    }, {
        tableName: 'tests_personalidad',
        timestamps: false
    });
};