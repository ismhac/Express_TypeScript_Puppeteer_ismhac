import { Categories, CategoriesShops } from "@/models";
import { CrudService } from "../crudService.pg";
import { ICrudOption } from "@/interfaces";
import sequelize from "sequelize";

export class CategoryService extends CrudService<typeof Categories>{
    constructor() {
        super(Categories)
    }

    async findOrCreate(params: any, option?: ICrudOption) {
        let category = await this.model.findOne({
            where: {
                id: params.id
            },
            transaction: option.transaction
        })
        if (!category) {
            category = await this.exec(this.model.create(params, this.applyCreateOptions(option)))
        }
        return category
    }

    // get categories of a shop
    async getResultAllCategoryByShopId(params: { shop_id: Number }) {
        try {
            let categoriesOfShop: any = await CategoriesShops.findAll({
                where: {
                    "shop_id": params.shop_id
                },
                include: [
                    {
                        association: "category",
                        attributes: [],
                    },
                    {
                        association: "shop",
                        attributes: [],
                    }
                ],
                attributes: [
                    [sequelize.literal("shop.name"), "shop_name"],
                    [sequelize.literal("category.id"), "category_id"],
                    [sequelize.literal("category.title"), "category_title"],
                ],
                order: [["category_title", "ASC"]],
                raw: true
            })
            for (let index = 0; index < categoriesOfShop.length; index++) {
                const item = categoriesOfShop[index]
                const fieldsValue = '["$all"]';
                const apiGetResultACategoryByCategoryId: string = `/api/v1/categories/${item["category_id"]}?fields=${encodeURIComponent(fieldsValue)}`
                item.category_detail = apiGetResultACategoryByCategoryId
            }
            return categoriesOfShop
        } catch (error) {
            console.log(`>>> Error in CategoryService -> getResultAllCategoryByShopId: ${error}`);
        }
    }
}