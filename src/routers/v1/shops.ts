import { shopController } from "@/controllers";
import { CrudRouter } from "../crud.pg";
import { Request, Response } from "../base";


export default class ShopRouter extends CrudRouter<typeof shopController>{
    constructor() {
        super(shopController)
    }

    customRouting() {
        this.router.get("/get-result-by-category-id/:category_id", this.route(this.getResultAllShopByCategoryId))
    }

    // get shops of a category
    async getResultAllShopByCategoryId(req: Request, res: Response) {
        try {
            const category_id = parseInt(req.params.category_id)
            const result = await this.controller.getResultAllShopByCategoryId({ category_id })
            this.onSuccess(res, result)
        } catch (error) {
            console.log(">>> Error in ShopRouter -> getResultAllShopByCategoryId: ", error);
        }
    }
}