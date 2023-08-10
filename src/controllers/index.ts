import { CrudController } from './crudController';
import { TeamController } from './crud/teamController'
import { DriverController } from './crud/driverController';
import { RacesController } from './crud/racesController';
import { DriversOfRaceController } from './crud/driversOfRaceController';



// SECTION

// Crud
const teamController = new TeamController()
const driverController = new DriverController()
const racesController = new RacesController()
const driversOfRaceController = new DriversOfRaceController()



// SECTION

export {
  CrudController,
  teamController,
  driverController,
  racesController,
  driversOfRaceController
};
