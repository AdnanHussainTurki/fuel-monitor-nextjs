import { ethers } from 'ethers'

import ContractStore from '../stores/ContractStore'
import AccountStore from '../stores/AccountStore'

/* fetchId - used to prevent race conditions.
 * Sometimes "setupContracts" is called twice with very little time in between and it can happen
 * that the call issued first (for example with not yet signed in account) finishes after the second
 * call. We must make sure that previous calls to setupContracts don't override later calls Stores
 */
export async function setupContracts(account, library, chainId, fetchId) {
  /* Using StaticJsonRpcProvider instead of JsonRpcProvider so it doesn't constantly query
   * the network for the current chainId. In case chainId changes, we rerun setupContracts
   * anyway. And StaticJsonRpcProvider also prevents "detected network changed" errors when
   * running node in forked mode.
   */
  const RPC_PROVIDER =  "http://localhost:8545";
  const PROD_RPC_CHAIN_ID = parseInt(process.env.PROD_RPC_CHAIN_ID)
  const RPC_CHAIN_ID = 1337;// parseInt(process.env.RPC_CHAIN_ID)
  console.log("RPC_CHAIN_ID: ", RPC_CHAIN_ID)
  console.log("PROD_RPC_CHAIN_ID: ", PROD_RPC_CHAIN_ID)
  console.log("chainId: ", chainId)
  console.log("RPC_PROVIDER: ", RPC_PROVIDER)

  const jsonRpcProvider = new ethers.providers.StaticJsonRpcProvider(
    RPC_PROVIDER,
    { chainId: RPC_CHAIN_ID }
  )
  let provider = jsonRpcProvider
  console.log("account", account);
  console.log("library", library);
  let walletConnected = account && !!library
  console.log("walletConnected", walletConnected);

  const getContract = (address, abi, overrideProvider) => {
    try {
      return new ethers.Contract(
        address,
        abi,
        overrideProvider ? overrideProvider : provider
      )
    } catch (e) {
      console.error(
        `Error creating contract in [getContract] with address:${address} abi:${JSON.stringify(
          abi
        )}`
      )
      throw e
    }
  }

  let network
  try {
    network = require(`../../${
      chainId === PROD_RPC_CHAIN_ID ? 'prod.' : ''
    }network.json`)
  } catch (e) {
    console.error('network.json file not present: ', e)
    return
  }

  const contracts = {}
  for (const key in network.contracts) {
    // Use Proxy address if one exists
    const address = network.contracts[`${key}Proxy`]
      ? network.contracts[`${key}Proxy`].address
      : network.contracts[key].address

    try {
      contracts[key] = new ethers.Contract(
        address,
        network.contracts[key].abi,
        null
      )
    } catch (e) {
      console.error(
        `Error creating contract in [setup] with address:${address} name:${key}`
      )
      throw e
    }
  }


  let iErc20Json, firefighterJson;
  try {
    iErc20Json = require('../../abis/IERC20.json')
    firefighterJson = require('../../abis/FireFighter.json')
  } catch (e) {
    console.error(`Can not find contract artifact file: `, e)
  }

  const fireFighter = contracts['FireFighterProxy']
  const fireFighterContract =  getContract(fireFighter.address, firefighterJson.abi)

  const fetchWater = async () => {
    try {
      if (!walletConnected) {
        return
      }
      const water =  await fireFighterContract.water(account);
      AccountStore.update((s) => {
        s.water = water.toString()
      });

    } catch (err) {
      console.error('Failed to fetch credits balance', err)
    }
  }


  const callWithDelay = () => {
    setTimeout(async () => {
      Promise.all([
        fetchWater(),
      ])
    }, 2)
  }

  callWithDelay()


  if (ContractStore.currentState.fetchId > fetchId) {
    console.log('Contracts already setup with newer fetchId. Exiting...')
    return
  }

  if (window.fetchInterval) {
    clearInterval(fetchInterval)
  }
  
  if (walletConnected) {
    // execute in parallel and repeat in an interval
    window.fetchInterval = setInterval(() => {
      callWithDelay()
    }, 20000)
  }


  ContractStore.update((s) => {
    s.contracts = contracts,
    s.coins = [
      {
        name: 'eth',
        symbol: 'eth',
        address: "0x0000000000000000000000000000000000000000",
        decimals: 18,
      },
    ]
    s.coinInfoList = [],
    s.walletConnected = walletConnected,
    s.chainId = chainId,
    s.readOnlyProvider = jsonRpcProvider,
    s.fetchId = fetchId
  });
  return contracts;
}
