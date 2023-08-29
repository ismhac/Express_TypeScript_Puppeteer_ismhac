import { DataTypes } from 'sequelize'
import { sequelize, Sequelize } from '../base'

export const Shops = sequelize.define(
    'tbl_shops',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        shop_link: {
            type: DataTypes.TEXT,
        },
        logo: {
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
