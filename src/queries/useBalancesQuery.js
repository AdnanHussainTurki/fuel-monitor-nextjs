import { QueryClient, QueryClientProvider, useQuery } from 'react-query'


const QUERY_KEYS = {
    Balances: (account) => ['balances', { account }],
}
  

import { balancesService } from '../services/balances.service'

const useBalancesQuery = (account, contracts, provider, options) => {
  return useQuery(
    QUERY_KEYS.Balances(account),
    () => balancesService.fetchBalances(account, contracts, provider),
    {
      enabled: account != null && contracts != null,
      refetchOnWindowFocus: false,
      ...options,
    }
  )
}

export default useBalancesQuery
