import { Products } from "@/models";
import { CrudService } from "../crudService.pg";
import { ICrudOption } from "@/interfaces";

export class ProductService extends CrudService<typeof Products>{
    constructor() {
        super(Products)
    }

    async findOrCreate(params: any, option?: ICrudOption) {
        let product = await this.model.findOne({
            where: {
                categories_of_shop_id: params.categories_of_shop_id,
                name: params.name
            },
            transaction: option.transaction
        })
        if (!product) {
            product = await this.exec(this.model.create(params, this.applyCreateOptions(option)))
        }
        return product
    }
}