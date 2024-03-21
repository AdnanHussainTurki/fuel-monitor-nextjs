import Link from 'next/link'
import { useRouter } from 'next/router'
import { HiPlusCircle } from 'react-icons/hi2'
import Auth from '../src/components/Templates/Auth/Auth'
import SmallVehicle from '../src/components/Vehicle/SmallVehicle'
import { useRef, useState, useEffect } from 'react'
import { getSession, useSession } from 'next-auth/react'
import { fetchData } from 'next-auth/client/_utils'
import Loading from '../src/components/Layout/Loading/Loading'
import Greetings from '../src/components/Profile/Greetings'
import VehicleStore from '../src/stores/VehicleStore'
export default function Home(props) {
    const { data: session, status } = useSession()
    const [isLoading, setIsLoading] = useState(true)
    const [vehicles, setVehicles] = useState([])
    const vehicleStore = VehicleStore.useState((s) => s)

    const router = useRouter()
    useEffect(() => {
        getSession().then((session) => {
            if (!session) {
                router.replace('/auth/forgot')
                return
            }
        })
    }, [router])
    useEffect(() => {
        const fetchVehicles = async () => {
            const response = await fetch('/api/vehicle/list')
            const data = await response.json()
            VehicleStore.update((s) => {
                ;(s.vehicles = data.vehicles), (s.vehicleRefreshNeeded = false)
            })
            setVehicles(data.vehicles)
            setIsLoading(false)
        }
        if (vehicleStore.vehicleRefreshNeeded === true) {
            fetchVehicles()
        } else {
            setVehicles(vehicleStore.vehicles)
            setIsLoading(false)
        }
    }, [])

    return (
        <Auth>
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg ml-4 mr-4">
                <div className="p-6 bg-white border-b ">
                    <div className="flex flex-row">
                        <div className="basis-1/2">
                            <Greetings user={session.user} />
                        </div>
                        <div className="basis-1/2 align-middle text-center ">
                            <Link
                                href={'/vehicle/add'}
                                className="text-red-400 bg-white hover:bg-red-100 border border-red-200 focus:ring-4 focus:outline-none focus:ring-red-100 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center dark:focus:ring-red-600 dark:bg-red-600 dark:border-red-500 dark:text-white dark:hover:bg-red-500 mr-2 mb-2"
                            >
                                Add Vehicle
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            {isLoading && <Loading />}
            {!isLoading &&
                vehicles.map((vehicle) => {
                    return (
                        <div className="flex flex-wrap flex-gap-3 justify-center">
                            <Link
                                href="/"
                                className="p-4 cursor-pointer hover:scale-105 transition duration-300 ease-in-out"
                            >
                                <SmallVehicle vehicle={vehicle} />
                            </Link>
                        </div>
                    )
                })}
            {!isLoading && vehicles.length == 0 && (
                <Link
                    href={'/vehicle/add'}
                    className="flex flex-wrap flex-gap-3 justify-center"
                >
                    <div className="p-4 cursor-pointer hover:scale-105 transition duration-300 ease-in-out">
                        <div className="flex justify-center">
                            <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
                                <HiPlusCircle className="h-6 fill-red-500" />
                                <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">
                                    <span className="text-red-600 text-xl font-bold">
                                        Add
                                    </span>{' '}
                                    Vehicle
                                </h5>
                                <p className="text-gray-700 text-base">
                                    Add your first vehicle to get started.
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
            )}
        </Auth>
    )
}
export async function getServerSideProps(context) {
    const session = await getSession({ req: context.req })
    if (!session) {
        return {
            redirect: {
                destination: '/auth/forgot',
                permanent: false,
            },
        }
    }
    return {
        props: { session },
    }
}
