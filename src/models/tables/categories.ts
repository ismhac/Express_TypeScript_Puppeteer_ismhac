import { DataTypes } from 'sequelize'
import { sequelize, Sequelize } from '../base'

export const Categories = sequelize.define(
    'tbl_categories',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
        },
        category_link: {
            type: DataTypes.TEXT,
        },
        image: {
            type: DataTypes.JSON
        }
    },
    {
        hooks: {

        },
        timestamps: true,
        underscored: true,
        freezeTableName: true,
        paranoid: true,
        defaultScope: {
            attributes: { exclude: ['deletedAt'] },
        },
        scopes: {
            deleted: {
                where: { deletedAt: { $ne: null } },
                paranoid: false,
            },
        },
    },
)
