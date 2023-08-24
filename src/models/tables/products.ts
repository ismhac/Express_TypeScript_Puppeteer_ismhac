import { DataTypes } from 'sequelize'
import { sequelize, Sequelize } from '../base'

export const Products = sequelize.define(
    'tbl_products',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
        },
        categories_of_shop_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'tbl_categories_of_shop',
                key: 'id',
            },
        },
        name: {
            type: DataTypes.STRING
        },
        price: {
            type: DataTypes.INTEGER
        },
        product_link: {
            type: DataTypes.TEXT
        },
        images: {
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
