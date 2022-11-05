import Link from 'next/link'
import { useRouter } from 'next/router'
import { HiPlusCircle } from 'react-icons/hi2'
import Auth from '../src/components/Templates/Auth/Auth'
import SmallVehicle from '../src/components/Vehicle/SmallVehicle'
import { useRef, useState, useEffect } from 'react'
import { getSession } from 'next-auth/react'
import { fetchData } from 'next-auth/client/_utils'
export default function Home(props) {
  const [isLoading, setIsLoading] = useState(true)
  const [vehicles, setVehicles] = useState([])
  const router = useRouter()
  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        router.replace('/auth/signin')
      }
    })
  }, [router])
  useEffect( () => {
    const fetchVehicles = async () => {
      const response = await fetch('/api/vehicle/list')
      const data = await response.json()
      setVehicles(data.vehicles)
      setIsLoading(false)
    }
    fetchVehicles()
  }, [])
    
  return (
    <Auth>
      <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg ml-4 mr-4">
        <div class="p-6 bg-white border-b ">
          <div class="flex flex-row">
            <div class="basis-1/2">
              <span>Portfolio: </span>
              <span class="text-emerald-500 bg-emerald-500/5 text-sm px-3 py-2 inline-flex gap-2 items-center justify-center">
                <span class="font-mono">Rs. 61,334.00</span>
              </span>
            </div>
            <div class="basis-1/2 align-middle text-center ">
              <Link
                href={'/vehicle/add'}
                class="text-red-400 bg-white hover:bg-red-100 border border-red-200 focus:ring-4 focus:outline-none focus:ring-red-100 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center dark:focus:ring-red-600 dark:bg-red-600 dark:border-red-500 dark:text-white dark:hover:bg-red-500 mr-2 mb-2"
              >
                Add Vehicle
              </Link>
            </div>
          </div>
        </div>
      </div>
      <br />
      {isLoading && 'Loading...'}
      {!isLoading &&
        vehicles.map((vehicle) => {
          return (
            <div class="flex flex-wrap flex-gap-3 justify-center">
              <Link
                href="/"
                class="p-4 cursor-pointer hover:scale-105 transition duration-300 ease-in-out"
              >
                <SmallVehicle vehicle={vehicle} />
              </Link>
            </div>
          )
        })}
      {!isLoading &&
        vehicles.length == 0 && (
          <Link href={'/vehicle/add'} class="flex flex-wrap flex-gap-3 justify-center">
            <div class="p-4 cursor-pointer hover:scale-105 transition duration-300 ease-in-out">
              <div class="flex justify-center">
                <div class="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
                  <HiPlusCircle className="h-6 fill-red-500" />
                  <h5 class="text-gray-900 text-xl leading-tight font-medium mb-2">
                    <span class="text-red-600 text-xl font-bold">Add</span>{' '}
                    Vehicle
                  </h5>
                  <p class="text-gray-700 text-base">
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
