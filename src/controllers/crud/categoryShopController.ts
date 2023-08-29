import { categoryShopService } from "@/services";
import { CrudController } from "../crudController";

export class CategoryShopController extends CrudController<typeof categoryShopService>{
    constructor() {
        super(categoryShopService)
    }
}