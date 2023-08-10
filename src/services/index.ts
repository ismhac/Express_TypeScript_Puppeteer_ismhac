import { ErrorService } from './errorService';
import { UtilService } from "@/services/utilService";
// Crud
import { ICrudExecOption, CrudService } from './crudService';
import { ScheduleService } from './scheduleService';
// import { TeamService } from './crud/teamService'
// import { DriverService } from './crud/driverService';
// import { DriversOfRaceService } from './crud/driversOfRaceService';
// import { RacesService } from './crud/racesService';

import { CategoryService } from './crud/categoryService';
import { ShopService } from './crud/shopService';
import { CategoryShopService } from './crud/categoryShopService';
import { CategoryOfShopService } from './crud/categoryOfShopService';
import { ProductService } from './crud/productService';

// SECTION

const errorService = new ErrorService();
const utilService = new UtilService();
const scheduleService = new ScheduleService();
// Crud
// const teamService = new TeamService()
// const driverService = new DriverService()
// const driversOfRaceService = new DriversOfRaceService()
// const racesService = new RacesService()

const categoryService = new CategoryService()
const shopService = new ShopService()
const categoryShopService = new CategoryShopService()
const categoryOfShopService = new CategoryOfShopService()
const productService = new ProductService()



// SECTION

export {
  CrudService,
  ICrudExecOption,
  utilService,
  errorService,
  scheduleService,

  categoryService,
  shopService,
  categoryShopService,
  categoryOfShopService,
  productService
};
