import { DataTypes } from 'sequelize'
import { sequelize, Sequelize } from '../base'

export const Shops = sequelize.define(
    'tbl_shops',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        shop_link: {
            type: DataTypes.STRING,
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
