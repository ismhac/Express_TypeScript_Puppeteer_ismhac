import { CrudController } from "@/controllers"
import { shopService } from "@/services";


export class ShopController extends CrudController<typeof shopService>{
    constructor() {
        super(shopService)
    }

    // get shops of a category
    async getResultAllShopByCategoryId(params: { category_id: Number }) {
        try {
            const result = await this.service.getResultAllShopByCategoryId(params)
            return result
        } catch (error) {
            console.log(">>> Error in ShopController -> getResultAllShopByCategoryId: ", error);
        }
    }
}