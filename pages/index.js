import Link from 'next/link'
import { useRouter } from 'next/router'
import { RiWaterFlashFill } from 'react-icons/ri'
import Auth from '../src/components/Templates/Auth/Auth'
import SmallVehicle from '../src/components/Vehicle/SmallVehicle'
import { useRef, useState, useEffect } from 'react'
import { getSession } from 'next-auth/react'
import { fetchData } from 'next-auth/client/_utils'
import Loading from '../src/components/Layout/Loading/Loading'
import VehicleStore from '../src/stores/VehicleStore'
import { useWeb3React } from '@web3-react/core'
import withIsMobile from '../src/components/Layout/NavBar/withIsMobile'
import withWalletSelectModal from '../src/components/Layout/NavBar/withWalletSelectModal'
import { walletLogin } from '../src/utils/account'
import ConnectWithMetamask from '../src/components/Button/ConnectWithMetamask'
import { useStoreState } from 'pullstate'
import AccountStore from '../src/stores/AccountStore'
import { displayCurrencyWithDecimalsNonWaiting } from '../src/utils/math'

const Home = ({ showLogin, connect }) => {
    const { active, account, activate } = useWeb3React()
    const balances = useStoreState(AccountStore, (s) => s.balances);
    const water = useStoreState(AccountStore, (s) => s.water);
    const compromiseds = useStoreState(AccountStore, (s) => s.compromised);
    const [compromised, setCompromised] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const accountStore = AccountStore.useState((s) => s)

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

    useEffect(() => {
        const fetchCompromised = async () => {
            const response = await fetch('/api/compromised/list')
            const data = await response.json()
            AccountStore.update((s) => {
                (s.compromised = data.compromiseds), (s.compromisedRefreshNeeded = false)
            })
            setCompromised(data.compromiseds)
            // setIsLoading(false)
        }
        if (accountStore.compromisedRefreshNeeded === true) {
          fetchCompromised()
        } else {
            if (accountStore.compromised) {
                return;
            }
            setCompromised(accountStore.compromised)
            // setIsLoading(false)
        }
    }, [])


    return (
        <Auth>
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg ml-4 mr-4">
                <div class="p-6 bg-white border-b ">
                    <div class="flex flex-row">
                        <div class="basis-1/2">
                            {active && !isLoading && (
                                <span>
                                    <span className="font-bold">Account:</span>
                                    <br />{' '}
                                    <span className="text-red-600">
                                        {account}
                                    </span>
                                </span>
                            )}
                        </div>
                        <div class="basis-1/2 align-middle text-center ">
                            {!active && (
                                <ConnectWithMetamask walletLogin={walletLogin} showLogin={showLogin} activate={activate} />
                            )}
                            {active && !isLoading && (
                                <span>
                                    <span className="font-bold">
                                        ETH Balance:
                                    </span>
                                    <br />{' '}
                                    <span className="text-red-600">
                                        {balances["eth"].display} {balances["eth"].name}
                                    </span>
                                </span>
                            )}
                            <br />
                            {active && !isLoading && (
                                <span>
                                    <span className="font-bold">
                                        Water in FireTruck:
                                    </span>
                                    <br />{' '}
                                    <span className="text-red-600">
                                        { displayCurrencyWithDecimalsNonWaiting(water, 18)} {balances["eth"].name}
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <br />
            {active && isLoading && <Loading />}

            {active && !isLoading && water == 0 && (
                <Link
                    href={'/mission-control/fill-water'}
                    class="flex flex-wrap flex-gap-3 justify-center"
                >
                    <div class="p-4 cursor-pointer hover:scale-105 transition duration-300 ease-in-out">
                        <div class="flex justify-center">
                            <div class="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
                                <RiWaterFlashFill className="w-30 font-large fill-red-500" />
                                <h5 class="text-gray-900 text-xl leading-tight font-medium mb-2">
                                    <span class="text-red-600 text-xl font-bold">
                                        Add
                                    </span>{' '}
                                    Water in FireTruck
                                </h5>
                                <p class="text-gray-700 text-base">
                                    Add your first vehicle to get started.
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
            )}
            {active && !isLoading && water > 0 && (
                <div>
                    <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg ml-4 mr-4">
                        <div class="p-6 bg-white border-b ">
                            <div class="flex flex-row place-content-end">
                                <Link
                                    href={'/mission-control/fill-water'}
                                    className="self-end text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                                >
                                    Fill Water
                                </Link>
                                <Link
                                    href={'/compromised/add'}
                                    className="self-end text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                                >
                                    Add Compromised Account
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div class="my-7 bg-white overflow-hidden shadow-sm sm:rounded-lg ml-4 mr-4">
                        <div class="p-6 bg-white border-b ">
                            <div class="flex flex-row">


                                <div class="overflow-x-auto relative shadow-md sm:rounded-lg w-full">
                                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" class="py-3 px-6">
                                                    Name
                                                </th>
                                                <th scope="col" class="py-3 px-6">
                                                    Tokens
                                                </th>

                                                <th scope="col" class="py-3 px-6">
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {compromiseds.map((compromised, index) => (
                                                (
                                                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                        <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                            {compromised.name}
                                                        </th>
                                                        <td class="py-4 px-6">
                                                            Sliver
                                                        </td>
                                                        <td class="py-4 px-6">
                                                            <div class="flex flex-row place-content-end">
                                                                <Link
                                                                    href={`compromised/view/${compromised._id}`}
                                                                    className="self-end text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-3 py-1.5 text-center mr-2 mb-2"
                                                                >
                                                                    View
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            ))}


                                        </tbody>
                                    </table>
                                </div>



                            </div>
                        </div>
                    </div>
                </div>

            )}
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

export default withIsMobile(withWalletSelectModal(Home))
