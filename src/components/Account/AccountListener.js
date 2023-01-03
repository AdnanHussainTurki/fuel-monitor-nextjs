import React, { useState, useEffect } from 'react'
import { ethers, BigNumber } from 'ethers'
import { useCookies } from 'react-cookie'
import { useWeb3React } from '@web3-react/core'
import _ from 'lodash'

import AccountStore from '../../stores/AccountStore'
import ContractStore from '../../stores/ContractStore'
import { usePrevious } from '../../utils/hooks'
import { isCorrectNetwork } from '../../utils/web3'
import { useStoreState } from 'pullstate'
import { setupContracts } from '../../utils/contracts'
import { login } from '../../utils/account'
import useBalancesQuery from '../../queries/useBalancesQuery'
// import useAllowancesQuery from '../queries/useAllowancesQuery'

const AccountListener = (props) => {
  const web3react = useWeb3React()
  const { account, chainId, library, active } = web3react
  const prevAccount = usePrevious(account)
  const prevActive = usePrevious(active)
  const [contracts, setContracts] = useState(null)
  const [provider, setProvider] = useState(null)
  const [balanced, setBalanced] = useState(false)
  const [allowanced, setAllowanced] = useState(false)

  const [cookies, setCookie, removeCookie] = useCookies(['loggedIn'])
  const {
    readOnlyProvider,
  } = useStoreState(ContractStore, (s) => s);
  const {
    active: userActive,
    refetchUserData,
    refetchStakingData,
  } = useStoreState(AccountStore, (s) => s)
  const prevRefetchUserData = usePrevious(refetchUserData)

  const balancesQuery = useBalancesQuery(account, contracts, readOnlyProvider, {
    onSuccess: (balances) => {
      AccountStore.update((s) => {
        s.balances = balances
      })
    },
  })

  // const allowancesQuery = useAllowancesQuery(account, contracts, readOnlyProvider, {
  //   onSuccess: (allowances) => {
  //     AccountStore.update((s) => {
  //       s.allowances = allowances
  //     })
  //   },
  // })

  // const historyQuery = useTransactionHistoryQuery(account)

  useEffect(() => {
    if ((prevActive && !active) || prevAccount !== account) {
      AccountStore.update((s) => {
        s.allowances = {}
        s.balances = {}
      })
    }
  }, [active, prevActive, account, prevAccount])

  const loadData = async (contracts) => {
    if (!account) {
      return
    }

    if (!contracts) {
      console.warn('Contracts not yet loaded!')
      return
    }
    if (!isCorrectNetwork(chainId)) {
      return
    }

    balancesQuery.refetch()
  }
  useEffect(() => {
    if (account) {
      login(account, setCookie)
    }



    const setupContractsAndLoad = async () => {
      /* If we have a web3 provider present and is signed into the allowed network:
       * - NODE_ENV === production -> mainnet
       * - NODE_ENV === development -> localhost, forknet
       * then we use that chainId to setup contracts.
       *
       * In other case we still want to have read only capability of the contracts with a general provider
       * so we can fetch `getAPR` from Vault for example to use on marketing pages even when the user is not
       * logged in with a web3 provider.
       *
       */
      console.log("account listerner chain id", chainId)
      let usedChainId, usedLibrary
      if (chainId && isCorrectNetwork(chainId)) {
        usedChainId = chainId
        usedLibrary = library
      } else {
        usedChainId = parseInt(process.env.RPC_CHAIN_ID)
        usedLibrary = null
      }

      window.fetchId = window.fetchId ? window.fetchId : 0
      window.fetchId += 1

      const contracts = await setupContracts(
        account,
        usedLibrary,
        usedChainId,
        window.fetchId
      )
      setContracts(contracts)
    }

    setupContractsAndLoad()
  }, [account, chainId])

  useEffect(() => {
    loadData(contracts)
    AccountStore.update((s) => {
      s.refetchUserData = false
    })
  }, [userActive, contracts, refetchUserData, prevRefetchUserData])

  return ''
}

export default AccountListener
