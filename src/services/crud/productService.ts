import { CategoriesOfShop, CategoriesShops, Products, Shops } from "@/models";
import { CrudService } from "../crudService.pg";
import { ICrudOption } from "@/interfaces";
import sequelize from 'sequelize';
import { Op } from 'sequelize';

export class ProductService extends CrudService<typeof Products>{
    constructor() {
        super(Products)
    }

    async findOrCreate(params: any, option?: ICrudOption) {
        let product = await this.model.findOne({
            where: {
                categories_of_shop_id: params.categories_of_shop_id,
                name: params.name
            },
            transaction: option.transaction
        })
        if (!product) {
            product = await this.exec(this.model.create(params, this.applyCreateOptions(option)))
        }
        return product
    }

    // get products of a category_of_shop
    async getResultAllProductByCategoryOfShopId(params: { category_of_shop_id: Number }) {
        try {
            let productsOfCategoryOfShop: any = await CategoriesOfShop.findAll({
                where: {
                    "id": params.category_of_shop_id
                },
                include: [
                    {
                        association: "products",
                        attributes: [],
                    }
                ],
                attributes: [
                    ["title", "category_of_shop_title"],
                    [sequelize.literal("products.id"), "product_id"],
                    [sequelize.literal("products.name"), "product_name"],
                ],
                order: [
                    ["product_name", "ASC"]
                ],
                raw: true
            })
            for (let index = 0; index < productsOfCategoryOfShop.length; index++) {
                const item = productsOfCategoryOfShop[index]
                const fieldsValue = '["$all"]'
                const apiGetResultAProductByProductId: string = `/api/v1/products/${item["product_id"]}?fields=${encodeURIComponent(fieldsValue)}`
                item.product_details = apiGetResultAProductByProductId
            }
            return productsOfCategoryOfShop
        } catch (error) {
            console.log(`>>> Error in ProductService -> getResultAllProductByCategoryOfShopId: ${error}`);
        }
    }

    async getResultAllProductByShopId(params: { shop_id: Number }) {
        try {
            let productsOfShop: any = await CategoriesOfShop.findAll({
                where: {
                    "shop_id": params.shop_id
                },
                include: [
                    {
                        association: "shop",
                        attributes: [],
                    },
                    {
                        association: "products",
                        attributes: [],
                    }
                ],
                attributes: [
                    [sequelize.literal("shop.name"), "shop_name"],
                    [sequelize.literal("products.id"), "product_id"],
                    [sequelize.literal("products.name"), "product_name"],
                ],
                order: [["product_name", "ASC"]],
                raw: true
            })
            for (let index = 0; index < productsOfShop.length; index++) {
                const item = productsOfShop[index]
                const fieldsValue = '["$all"]'
                const apiGetResultAProductByProductId: string = `/api/v1/products/${item["product_id"]}?fields=${encodeURIComponent(fieldsValue)}`
                item.product_details = apiGetResultAProductByProductId
            }
            return productsOfShop
        } catch (error) {
            console.log(`>>> Error in ProductService -> getResultAllProductByShopId: ${error}`);
        }
    }

    // get products of a main category
    async getResultAllProductByCategoryId(params: { category_id: Number }) {
        try {
            let productsOfCategory: any = await CategoriesShops.findAll({
                where: {
                    "category_id": params.category_id,
                    "$shop.categories_of_shops.products.id$": { [Op.not]: null }
                },
                include: [
                    {
                        association: "category",
                        attributes: []
                    },
                    {
                        association: "shop",
                        attributes: [],
                        include: [
                            {
                                association: "categories_of_shops",
                                attributes: [],
                                include: [
                                    {
                                        association: "products",
                                        attributes: [],
                                    }
                                ]
                            }
                        ]

                    }
                ],
                attributes: [
                    [sequelize.col("category.title"), "category_title"],
                    [sequelize.col("shop.categories_of_shops.products.id"), "product_id"],
                    [sequelize.col("shop.categories_of_shops.products.name"), "product_name"],
                ],
                order: [["product_name", "ASC"]],
                raw: true
            })
            for (let index = 0; index < productsOfCategory.length; index++) {
                const item = productsOfCategory[index]
                const fieldsValue = '["$all"]'
                const apiGetResultAProductByProductId: string = `/api/v1/products/${item["product_id"]}?fields=${encodeURIComponent(fieldsValue)}`
                item.product_details = apiGetResultAProductByProductId
            }
            return productsOfCategory
        } catch (error) {
            console.log(`>>> Error in ProductService -> getResultAllProductByCategoryId: ${error}`);
        }
    }
}