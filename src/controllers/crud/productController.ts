import { categoryOfShopService, productService } from "@/services";
import { CrudController } from "../crudController";

export class ProductController extends CrudController<typeof productService>{
    constructor() {
        super(productService)
    }

    // get products of a category_of_shop
    async getResultAllProductByCategoryOfShopId(params: { category_of_shop_id: Number }) {
        try {
            const result = await this.service.getResultAllProductByCategoryOfShopId(params)
            return result
        } catch (error) {
            console.log(">>> Error in ProductController -> getResultAllProductByCategoryOfShopId: ", error);
        }
    }

    // get products of a shop
    async getResultAllProductByShopId(params: { shop_id: Number }) {
        try {
            const result = await this.service.getResultAllProductByShopId(params)
            return result
        } catch (error) {
            console.log(">>> Error in ProductController -> getResultAllProductByShopId: ", error);
        }
    }

    // get products of a main category
    async getResultAllProductByCategoryId(params: { category_id: Number }) {
        try {
            const result = await this.service.getResultAllProductByCategoryId(params)
            return result
        } catch (error) {
            console.log(">>> Error in ProductController -> getResultAllProductByCategoryId: ", error);
        }
    }


}