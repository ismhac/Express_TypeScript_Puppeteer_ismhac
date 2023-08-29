import { productController } from "@/controllers";
import { CrudRouter } from "../crud";
import { Request, Response } from "../base";
import * as _ from 'lodash'

export default class ProductRouter extends CrudRouter<typeof productController>{
    constructor() {
        super(productController)
    }

    customRouting() {
        this.router.get("/get-result-by-category-of-shop-id/:category_of_shop_id", this.route(this.getResultAllProductByCategoryOfShopId))
        this.router.get("/get-result-by-shop-id/:shop_id", this.route(this.getResultAllProductByShopId))
        this.router.get("/get-result-by-category-id/:category_id", this.route(this.getResultAllProductByCategoryId))
    }

    async getResultAllProductByCategoryOfShopId(req: Request, res: Response) {
        try {
            const category_of_shop_id = parseInt(req.params.category_of_shop_id)
            const result = await this.controller.getResultAllProductByCategoryOfShopId({ category_of_shop_id })
            this.onSuccess(res, result)
        } catch (error) {
            console.log(">>> Error in ProductRouter -> getResultAllProductByCategoryOfShopId: ", error);
        }
    }

    async getResultAllProductByShopId(req: Request, res: Response) {
        try {
            const shop_id = parseInt(req.params.shop_id)
            const result = await this.controller.getResultAllProductByShopId({ shop_id })
            this.onSuccess(res, result)
        } catch (error) {
            console.log(">>> Error in ProductRouter -> getResultAllProductByShopId: ", error);
        }
    }

    async getResultAllProductByCategoryId(req: Request, res: Response) {
        try {
            const category_id = parseInt(req.params.category_id)
            const result = await this.controller.getResultAllProductByCategoryId({ category_id })
            this.onSuccess(res, result)
        } catch (error) {
            console.log(">>> Error in ProductRouter -> getResultAllProductByCategoryId: ", error);
        }
    }
}