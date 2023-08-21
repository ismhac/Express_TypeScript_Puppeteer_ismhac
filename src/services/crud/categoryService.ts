import { Categories } from "@/models";
import { CrudService } from "../crudService.pg";
import { ICrudOption } from "@/interfaces";

export class CategoryService extends CrudService<typeof Categories>{
    constructor() {
        super(Categories)
    }

    async findOrCreate(params: any, option?: ICrudOption) {
        let category = await this.model.findOne({
            where: {
                id: params.id
            },
            transaction: option.transaction
        })
        if (!category) {
            category = await this.exec(this.model.create(params, this.applyCreateOptions(option)))
        }
        return category
    }
}