import { categoryOfShopService } from "@/services";
import { CrudController } from "../crudController";

export class CategoryOfShopController extends CrudController<typeof categoryOfShopService>{
    constructor() {
        super(categoryOfShopService)
    }

    // get all categories_of_shop by shop id
    async getResultAllCategoriesOfShopByShopId(params: { shop_id: Number }) {
        try {
            const result = await this.service.getResultAllCategoriesOfShopByShopId(params)
            return result
        } catch (error) {
            console.log(">>> Error in ProductController -> getResultAllCategoriesOfShopByShopId: ", error);
        }
    }
}