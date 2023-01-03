import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react'
import { LedgerConnector } from './LedgerConnector'
import { get } from 'lodash'

import { providerName } from './web3'

const isProduction = true;
const POLLING_INTERVAL = 12000
const RPC_PROVIDER = process.env.ETHEREUM_RPC_PROVIDER
const WS_PROVIDER = process.env.ETHEREUM_WEBSOCKET_PROVIDER

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [1, 1337, 137],
})

export const gnosisConnector = () => {
  let gnosisConnectorCache
  if (!process.browser) return
  if (!gnosisConnectorCache) gnosisConnectorCache = new SafeAppConnector()
  return gnosisConnectorCache
}


export const walletConnectConnector = new WalletConnectConnector({
  rpc: {
    1: RPC_PROVIDER,
  },
  pollingInterval: POLLING_INTERVAL,
})

//coinbase
export const walletlink = new WalletLinkConnector({
  url: RPC_PROVIDER,
  supportedChainIds: [1, 1337],
})

export function resetWalletConnector(connector) {
  if (connector && connector instanceof WalletConnectConnector) {
    connector.walletConnectProvider = undefined
  }
}

// Clear WalletConnect's state on disconnect
walletConnectConnector.on('disconnect', () => {
  console.log('Cleaning up...')
  delete localStorage.walletconnect
})

export const ledgerConnector = new LedgerConnector({
  chainId: isProduction ? 1 : 1337,
  url: RPC_PROVIDER,
})

export const connectorNameIconMap = {
  MetaMask: 'metamask-icon.svg',
  Ledger: 'ledger-icon.svg',
  MyEtherWallet: 'myetherwallet-icon.svg',
  WalletConnect: 'walletconnect-icon.svg',
}

export const getConnectorIcon = (name) =>
  get(connectorNameIconMap, name, 'default-wallet-icon.svg')
