import { Store, registerInDevtools  } from "pullstate";

const BrandsStore = new Store({
    cars: [],
    bikes: []
});
registerInDevtools({
    BrandsStore
});

export default BrandsStore;