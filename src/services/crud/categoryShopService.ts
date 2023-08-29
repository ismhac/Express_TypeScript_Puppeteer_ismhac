import { CategoriesShops } from "@/models";
import { CrudService } from "../crudService.pg";
import { ICrudOption } from "@/interfaces";
export class CategoryShopService extends CrudService<typeof CategoriesShops>{
    constructor() {
        super(CategoriesShops)
    }

    async findOrCreate(params: any, option?: ICrudOption) {
        let categoryShop = await this.model.findOne({
            where: {
                shop_id: params.shop_id,
                category_id: params.category_id
            },
            transaction: option.transaction
        })
        if (!categoryShop) {
            categoryShop = await this.exec(this.model.create(params, this.applyCreateOptions(option)))
        }
        return categoryShop
    }

}