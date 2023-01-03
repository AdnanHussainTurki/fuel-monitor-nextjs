import { Store, registerInDevtools } from 'pullstate'

const AccountStore = new Store({
  // makes Account Listener refetch user data
  refetchUserData: false,
  compromisedRefreshNeeded: true,
  compromised: [],
  allowances: {},
  balances: {},
  establishingConnection: true,
  walletSelectModalState: false,
  connectorName: null,
  creditsBalanceOf: 0,
  creditsWrapped: 0,
  water: 0,
  // is user active / engaged with the dapp
  active: 'active', // active / idle
  lifetimeYield: null,
})

registerInDevtools({
  AccountStore
});


export default AccountStore
