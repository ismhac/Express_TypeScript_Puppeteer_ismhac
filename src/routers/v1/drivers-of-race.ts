import { driversOfRaceController } from '@/controllers'
import * as _ from 'lodash'
// import { Request, Response } from '../base'
import { CrudRouter } from '../crud'

export default class DriversOfRaceRouter extends CrudRouter<typeof driversOfRaceController> {
	constructor() {
		super(driversOfRaceController)
	}
	customRouting() {

	}
}
