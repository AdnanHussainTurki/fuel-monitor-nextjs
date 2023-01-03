import Link from 'next/link'
import { useRouter } from 'next/router'
import { RiWaterFlashFill } from 'react-icons/ri'
import Auth from '../../src/components/Templates/Auth/Auth'
import { useRef, useState, useEffect } from 'react'
import { getSession } from 'next-auth/react'
import { fetchData } from 'next-auth/client/_utils'
import Loading from '../../src/components/Layout/Loading/Loading'
import { useWeb3React } from '@web3-react/core'
import withIsMobile from '../../src/components/Layout/NavBar/withIsMobile'
import withWalletSelectModal from '../../src/components/Layout/NavBar/withWalletSelectModal'
import { walletLogin } from '../../src/utils/account'
import ConnectWithMetamask from '../../src/components/Button/ConnectWithMetamask'
import { useStoreState } from 'pullstate'
import AccountStore from '../../src/stores/AccountStore'
import BalancerBar from '../../src/components/Layout/BalanceBar/BalanceBar'
import FillWaterInContract from '../../src/components/FillWater/FillWaterInContract'

const FillWater = ({ showLogin, connect }) => {
    const { active, account, activate } = useWeb3React()
    const balances = useStoreState(AccountStore, (s) => s.balances);
    const water = useStoreState(AccountStore, (s) => s.water);

    const [isLoading, setIsLoading] = useState(true)

    const router = useRouter()
    useEffect(() => {
        getSession().then((session) => {
            if (!session) {
                router.replace('/auth/signin')
                return
            }
        })
    }, [router])
    useEffect(() => {
        if (balances["eth"] != undefined && water) {
            setIsLoading(false)
        } 
    }, [water, balances])
               

    return (
        <Auth>
            <BalancerBar />
            <br />
            <FillWaterInContract />
           
        </Auth>
    )
}
export async function getServerSideProps(context) {
    const session = await getSession({ req: context.req })
    if (!session) {
        return {
            redirect: {
                destination: '/auth/signin',
                permanent: false,
            },
        }
    }
    return {
        props: { session },
    }
}

export default withIsMobile(withWalletSelectModal(FillWater))
