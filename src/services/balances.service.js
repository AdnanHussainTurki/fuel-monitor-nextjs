import { ethers } from 'ethers'
import { displayCurrencyWithDecimals } from '../utils/math'
const isProduction = false;

let jsonCallId = 1

export default class BalancesService {
  async fetchBalances(account, contracts, provider) {
    if (isProduction) {
      console.log("Fetch balances as production");
      return this.fetchBalancesForProduction(account, contracts, provider)
    }
    console.log("Fetch balances as development");

    return this.fetchBalancesForDevelopment(account, contracts, provider)
  }

  async fetchBalancesForProduction(account, contracts, provider) {
   
    return 
  }

  async fetchBalancesForDevelopment(account, contracts, provider) {
    var ethBalance = await provider.getBalance(account)
    console.log("ethBalance", ethBalance)
    return {
      eth: { raw: ethBalance.toString(), decimals: 18, display: await displayCurrencyWithDecimals(ethBalance, 18), balance: await displayCurrencyWithDecimals(ethBalance, 18), symbol: "eth", name: "MATIC" },
    }
  }
}

export const balancesService = new BalancesService()
