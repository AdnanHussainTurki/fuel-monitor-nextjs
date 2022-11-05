import { Store, registerInDevtools  } from "pullstate";

const CurrencyStore = new Store({
    currencies: []
});

CurrencyStore.update((s) => {
    s.currencies = require('../constants/currencies.json')
});

registerInDevtools({
    CurrencyStore
});

export default CurrencyStore;