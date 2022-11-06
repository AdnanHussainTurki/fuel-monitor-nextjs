import { Store, registerInDevtools  } from "pullstate";

const VehicleStore = new Store({
    vehicles: [],
    refuels: {},
    vehicleRefreshNeeded: true,
    refuelRefreshNeeded: true,
    vehicleFullRefreshNeeded: false,
    refuelFullRefreshNeeded: false,

});

registerInDevtools({
    VehicleStore
});

export default VehicleStore;