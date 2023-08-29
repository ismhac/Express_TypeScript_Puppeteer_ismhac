import { CategoriesOfShop } from "@/models";
import { CrudService } from "../crudService.pg";
import { ICrudOption } from "@/interfaces";
import sequelize from "sequelize";

export class CategoryOfShopService extends CrudService<typeof CategoriesOfShop>{
    constructor() {
        super(CategoriesOfShop)
    }

    async findOrCreate(params: any, option?: ICrudOption) {
        let categoryOfShop = await this.model.findOne({
            where: {
                id: params.id,
            },
            transaction: option.transaction
        })
        if (!categoryOfShop) {
            categoryOfShop = await this.exec(this.model.create(params, this.applyCreateOptions(option)))
        }
        return categoryOfShop
    }

    // get all categories_of_shop by shop id
    async getResultAllCategoriesOfShopByShopId(params: { shop_id: Number }) {
        try {
            let categoriesOfShop: any = await this.model.findAll({
                where: {
                    "$shop.id$": params.shop_id
                },
                include: [
                    {
                        association: "shop",
                        attributes: [],
                    }
                ],
                attributes: [
                    [sequelize.col("shop.name"), "shop_name"],
                    ["id", "category_of_shop_id"],
                    ["title", "category_of_shop_title"]
                ],
                order: [["category_of_shop_title", "ASC"]],
                raw: true
            })
            for (let index = 0; index < categoriesOfShop.length; index++) {
                const item = categoriesOfShop[index]
                const fieldsValue = '["$all"]'
                const apiGetResultACategoryOfShopById: string = `/api/v1/categories_of_shops/${item["category_of_shop_id"]}?fields=${encodeURIComponent(fieldsValue)}`
                item.category_of_shop_details = apiGetResultACategoryOfShopById
            }
            return categoriesOfShop
        } catch (error) {
            console.log(`>>> Error in CategoryOfShopService -> getResultAllCategoriesOfShopByShopId: ${error}`);
        }
    }

}