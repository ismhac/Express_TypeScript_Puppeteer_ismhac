import { CategoriesShops, Shops } from "@/models";
import { CrudService } from "../crudService.pg";
import { ICrudOption } from "@/interfaces";
import sequelize from "sequelize";

export class ShopService extends CrudService<typeof Shops>{
    constructor() {
        super(Shops)
    }

    async findOrCreate(params: any, option?: ICrudOption) {
        let shop = await this.model.findOne({
            where: {
                id: params.id
            },
            transaction: option.transaction
        })
        if (!shop) {
            shop = await this.exec(this.model.create(params, this.applyCreateOptions(option)))
        }
        return shop
    }

    // get shops of a category
    async getResultAllShopByCategoryId(params: { category_id: Number }) {
        try {
            let shopsOfCategory: any = await CategoriesShops.findAll({
                where: {
                    "category_id": params.category_id
                },
                include: [
                    {
                        association: "shop",
                        attributes: [],
                    },
                    {
                        association: "category",
                        attributes: [],
                    }
                ],
                attributes: [
                    [sequelize.literal("category.title"), "category_title"],
                    [sequelize.literal("shop.id"), "shop_id"],
                    [sequelize.literal("shop.name"), "shop_name"],
                ],
                order: [["shop_name", "ASC"]],
                raw: true
            })
            for (let index = 0; index < shopsOfCategory.length; index++) {
                const item = shopsOfCategory[index]
                const fieldsValue = '["$all"]';
                const apiGetResultAShopByShopId: string = `/api/v1/shops/${item["shop_id"]}?fields=${encodeURIComponent(fieldsValue)}`
                item.shop_detail = apiGetResultAShopByShopId
            }
            return shopsOfCategory
        } catch (error) {
            console.log(`>>> Error in ShopService -> getResultAllShopByCategoryId: ${error}`);
        }
    }
}