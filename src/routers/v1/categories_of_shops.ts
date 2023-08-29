import { categoryOfShopController } from "@/controllers";
import { CrudRouter } from "../crud.pg";
import { Request, Response } from "../base";


export default class CategoryOfShopRouter extends CrudRouter<typeof categoryOfShopController>{
    constructor() {
        super(categoryOfShopController)
    }

    customRouting() {
        this.router.get("/get-result-by-shop-id/:shop_id", this.route(this.getResultAllCategoriesOfShopByShopId))
    }

    async getResultAllCategoriesOfShopByShopId(req: Request, res: Response) {
        try {
            const shop_id = parseInt(req.params.shop_id)
            const result = await this.controller.getResultAllCategoriesOfShopByShopId({ shop_id })
            this.onSuccess(res, result)
        } catch (error) {
            console.log(">>> Error in ProductRouter -> getResultAllCategoriesOfShopByShopId: ", error);
        }
    }
}