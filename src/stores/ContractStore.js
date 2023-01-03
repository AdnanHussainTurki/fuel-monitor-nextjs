import { Store, registerInDevtools } from 'pullstate'

const ContractStore = new Store({
  contracts: {},
  coinInfoList: {},
  chainId: parseInt(process.env.PROD_RPC_CHAIN_ID),
  walletConnected: false,
  fetchId: -1,
})

registerInDevtools({
  ContractStore
});

export default ContractStore
