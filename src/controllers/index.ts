import { CrudController } from './crudController';
import { CategoryController } from './crud/categoryController';
// import { TeamController } from './crud/teamController'
// import { DriverController } from './crud/driverController';
// import { RacesController } from './crud/racesController';
// import { DriversOfRaceController } from './crud/driversOfRaceController';



// SECTION

// Crud
// const teamController = new TeamController()
// const driverController = new DriverController()
// const racesController = new RacesController()
// const driversOfRaceController = new DriversOfRaceController()
const categoryController = new CategoryController()



// SECTION

export {
  CrudController,
  categoryController
  // teamController,
  // driverController,
  // racesController,
  // driversOfRaceController
};
