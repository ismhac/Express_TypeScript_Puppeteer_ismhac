import { categoryController } from '@/controllers'
import * as _ from 'lodash'
import { Request, Response } from '../base'
import { CrudRouter } from '../crud'
// import { blockMiddleware } from '@/middlewares'

export default class RacesRouter extends CrudRouter<typeof categoryController> {
    constructor() {
        super(categoryController)
    }
    customRouting() {
        // this.router.get('/craw/:year', this.crawdataMiddleware(), this.route(this.crawdata))//for test
        this.router.get('/sync-data', this.crawdataMiddleware(), this.route(this.syncData))

    }
    async syncData(req: Request, res: Response) {
        this.controller.syncData()
        this.onSuccess(res, { message: "in sync" })
    }
    // async crawdata(req: Request, res: Response) {
    //     const year: Number = parseInt(req.params.year)
    //     const result = await this.controller.crawdata(year)//test with latest year
    //     this.onSuccess(res, result)
    // }
    crawdataMiddleware(): any[] {
        // return [blockMiddleware.run()]
        return []
    }
}
