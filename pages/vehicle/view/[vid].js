import Auth from '../../../src/components/Templates/Auth/Auth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Car from '../../../src/components/Svg/Car'
import Truck from '../../../src/components/Svg/Truck'
import FuelHandle from '../../../src/components/Svg/FuelHandle'
import Bike from '../../../src/components/Svg/Bike'
import Graph from '../../../src/components/Svg/Graph'

export default function add() {
  const [vehicle, setVehicle] = useState({
    "_id": "63619a52cba3979d4dd5ce4e",
    "brand": "Royal Enfield",
    "model": "Classic 350",
    "user_email": "adnanhussainturki@gmail.com",
    "createdAt": "2022-11-01T22:14:42.059Z",
    "type": "Motor Cycle"
})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { vid } = router.query
  console.log(vid)
  // useEffect(() => {
  //   if (vid === undefined) {
  //     return
  //   }
  //   const fetchVehicle = async () => {
  //     const response = await fetch('/api/vehicle/view?vid=' + vid)
  //     const data = await response.json()
  //     setVehicle(data.vehicle)
  //     setIsLoading(false)
  //   }
  //   fetchVehicle()
  // }, [vid])
  return (
    <Auth>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg m-3">
          <div class="p-6  bg-white border-b ">
            {vehicle.type == 'Car' ? <Car className="h-10 fill-red-500" /> : ''}
            {vehicle.type == 'Motor Cycle' ? (
              <Bike className="h-10 fill-red-500" />
            ) : (
              ''
            )}
            {!vehicle.type ? <Truck className="h-10 fill-red-500" /> : ''}
            <p>
              <span className="text-red-600 text-xl font-bold">
                {vehicle.brand}
              </span>{' '}
              <span className="font-bold text-xl">{vehicle.model}</span>
            </p>
            <br />
            <Link
            href={'#'}
            class="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  mr-2 mb-2"
            >
              <Graph className="h-5 pr-2 fill-red-500 block" />
              Charts
            </Link>
            <Link
            href={`/vehicle/refuel/${vehicle._id}`}
            class="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  mr-2 mb-2"
            >
              <FuelHandle className="h-5 pr-2 fill-red-500 block" />
              Refuel
            </Link>

          </div>
        </div>
      )}
    </Auth>
  )
}
