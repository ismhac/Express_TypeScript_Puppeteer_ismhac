import { Shops } from "@/models";
import { CrudService } from "../crudService.pg";
import { ICrudOption } from "@/interfaces";

export class ShopService extends CrudService<typeof Shops>{
    constructor() {
        super(Shops)
    }

    async findOrCreate(params: any, option?: ICrudOption) {
        let shop = await this.model.findOne({
            where: {
                id: params.id
            },
            transaction: option.transaction
        })
        if (!shop) {
            shop = await this.exec(this.model.create(params, this.applyCreateOptions(option)))
        }
        return shop
    }
}