import { categoryController, categoryShopController } from "@/controllers";
import { CrudRouter } from "../crud.pg";
import { Request, Response } from "../base";


export default class CategoryShopRouter extends CrudRouter<typeof categoryShopController>{

    constructor() {
        super(categoryShopController)
    }
    customRouting() {

    }
}