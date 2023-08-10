import { Categories } from './categorires';
import { DataTypes } from 'sequelize'
import { sequelize, Sequelize } from '../base'

export const CategoriesShops = sequelize.define(
    'tbl_categories_shops',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
        },
        shop_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'tbl_shops',
                key: 'id',
            },
        },
        category_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'tbl_categories',
                key: 'id',
            },
        },

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
