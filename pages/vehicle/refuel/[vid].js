import Auth from '../../../src/components/Templates/Auth/Auth'
import { useRouter } from 'next/router'
import { BsCash, BsCalendar2DateFill, BsSpeedometer } from 'react-icons/bs'
import { GiThermometerScale } from 'react-icons/gi'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import Car from '../../../src/components/Svg/Car'
import Truck from '../../../src/components/Svg/Truck'
import FuelHandle from '../../../src/components/Svg/FuelHandle'
import Bike from '../../../src/components/Svg/Bike'
import Graph from '../../../src/components/Svg/Graph'
import Loading from '../../../src/components/Layout/Loading/Loading'
import VehicleStore from '../../../src/stores/VehicleStore'
import { getSession } from 'next-auth/react'

async function doRefuel(
    vid,
    spending,
    meter_reading,
    rate_per_litre,
    refuel_on,
    percent_before_refuel
) {
    const response = await fetch('/api/vehicle/refuel/add', {
        method: 'POST',
        body: JSON.stringify({
            vid: vid,
            spending: spending,
            meter_reading: meter_reading,
            rate_per_litre: rate_per_litre,
            refuel_on: refuel_on,
            percent_before_refuel: percent_before_refuel,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!')
    }
    const data = await response.json()
    VehicleStore.update((s) => {
        if (s.refuels[vid] === undefined) {
            s.refuels[vid] = { data: [], refreshNeeded: false }
        }
        s.refuels[vid].data = [
            {
                _id: data.refuel.insertedId,
                vid: vid,
                spending: spending,
                meter_reading: meter_reading,
                rate_per_litre: rate_per_litre,
                refuel_on: refuel_on,
                percent_before_refuel: percent_before_refuel,
                created_at: new Date().toISOString(),
            },
            ...s.refuels[vid].data,
        ]
    })
    return data
}

export default function Refuel() {
    const [vehicle, setVehicle] = useState({})
    const [lastRefuel, setLastRefuel] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const spendingInputRef = useRef()
    const meterReadingInputRef = useRef()
    const ratePerLitreInputRef = useRef()
    const refuelingOnInputRef = useRef()
    const fuelPercentBeforeRefuelInputRef = useRef()
    const router = useRouter()
    const { vid } = router.query
    useEffect(() => {
        if (vid === undefined) {
            return
        }
        const fetchVehicle = async () => {
            const response = await fetch('/api/vehicle/view?vid=' + vid)
            const data = await response.json()
            setVehicle(data.vehicle)
        }
        const fetchLastRefuel = async () => {
            const response = await fetch('/api/vehicle/refuel/last?vid=' + vid)
            const data = await response.json()
            console.log('lastRefuel', data)
            if (data.refuel.length) {
                const refuel = data.refuel[0]
                meterReadingInputRef.current.value = refuel.meter_reading
                ratePerLitreInputRef.current.value = refuel.rate_per_litre
                setLastRefuel(refuel)
            }
        }
        fetchVehicle()
        fetchLastRefuel()
        setIsLoading(false)
    }, [vid])
    const submitHandler = async (event) => {
        event.preventDefault()
        if (isAdding) {
            return
        }
        setIsAdding(true)

        // Add validation
        const data = await doRefuel(
            vid,
            spendingInputRef.current.value,
            meterReadingInputRef.current.value,
            ratePerLitreInputRef.current.value,
            refuelingOnInputRef.current.value,
            fuelPercentBeforeRefuelInputRef.current.value
        )
        setIsAdding(false)
        router.replace('/vehicle/view/' + vid)
    }
    return (
        <Auth>
            {isLoading ? (
                <Loading />
            ) : (
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg m-3">
                    <div className="p-6  bg-white border-b ">
                        <FuelHandle className="h-10 mb-2 fill-red-500" />

                        <p>
                            <span className="text-red-600 text-xl font-bold">
                                {vehicle.brand}
                            </span>{' '}
                            <span className="font-bold text-xl">
                                {vehicle.model}
                            </span>
                        </p>
                        <br />
                        <form onSubmit={submitHandler}>
                            <div>
                                <label
                                    className="block text-xs font-normal uppercase  text-red-600 text-right"
                                    htmlFor="model"
                                >
                                    Spendings
                                </label>
                                <div className="relative mb-6">
                                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                        <BsCash />
                                    </div>
                                    <input
                                        dir="rtl"
                                        id="model"
                                        min={1}
                                        className=" appearance-none text-xl font-bold caret-transparent text-red-600 caret-white rounded-md cursor-pointer shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
                                        required="required"
                                        autoComplete="off"
                                        type="number"
                                        placeholder="961"
                                        ref={spendingInputRef}
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    className="block text-xs font-normal uppercase  text-red-600 text-right"
                                    htmlFor="model"
                                >
                                    Meter reading
                                </label>
                                <div className="relative mb-1">
                                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                        <BsSpeedometer />
                                    </div>
                                    <input
                                        dir="rtl"
                                        id="model"
                                        min={
                                            lastRefuel.meter_reading
                                                ? lastRefuel.meter_reading
                                                : 1
                                        }
                                        className=" appearance-none text-xl font-bold caret-transparent text-red-600 caret-white rounded-md cursor-pointer shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
                                        required="required"
                                        autoComplete="off"
                                        type="number"
                                        placeholder="000000"
                                        ref={meterReadingInputRef}
                                    />
                                </div>
                            </div>
                            <div className="text-[9px] text-gray-500 font-italic text-right">
                                <span className="text-grey-600 uppercase">
                                    Last Meter Reading:
                                </span>{' '}
                                <span className="text-red-600">
                                    {lastRefuel.meter_reading}
                                </span>
                            </div>
                            <div className="mt-3">
                                <label
                                    className="block text-xs font-normal uppercase  text-red-600 text-right"
                                    htmlFor="model"
                                >
                                    Rate/Litre
                                </label>
                                <div className="relative mb-1">
                                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                        <BsCash />
                                    </div>
                                    <input
                                        dir="rtl"
                                        id="model"
                                        min={1}
                                        className=" appearance-none text-xl font-bold caret-transparent text-red-600 caret-white rounded-md cursor-pointer shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
                                        required="required"
                                        autoComplete="off"
                                        type="number"
                                        placeholder="96"
                                        ref={ratePerLitreInputRef}
                                    />
                                </div>
                            </div>

                            <div className="text-[9px] text-gray-500 font-italic text-right">
                                <span className="text-grey-600 uppercase">
                                    Last FUEL RATE:
                                </span>{' '}
                                <span className="text-red-600">
                                    {lastRefuel.rate_per_litre}
                                </span>
                            </div>
                            <div className="mt-3">
                                <label
                                    className="block text-xs font-normal uppercase  text-red-600 text-right"
                                    htmlFor="model"
                                >
                                    Refueling on
                                </label>
                                <div className="relative mb-1">
                                    <input
                                        dir="rtl"
                                        id="model"
                                        min={lastRefuel.refuel_on}
                                        className="rtl appearance-none text-xl font-bold caret-transparent text-red-600 caret-white rounded-md cursor-pointer shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
                                        required="required"
                                        autoComplete="off"
                                        type="date"
                                        ref={refuelingOnInputRef}
                                    />
                                </div>
                            </div>
                            <div className="text-[9px] text-gray-500 font-italic text-right">
                                <span className="text-grey-600 uppercase">
                                    Last REFUEL Date:
                                </span>{' '}
                                <span className="text-red-600">
                                    {lastRefuel.refuel_on}
                                </span>
                            </div>
                            <div className="mt-3">
                                <label
                                    className="block text-xs font-normal uppercase  text-red-600 text-right"
                                    htmlFor="model"
                                >
                                    Fuel % Present Before Refueling
                                </label>
                                <div className="relative mb-6">
                                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                        <GiThermometerScale />
                                    </div>
                                    <input
                                        dir="rtl"
                                        step={1}
                                        id="model"
                                        min={0}
                                        max={100}
                                        className=" appearance-none text-xl font-bold caret-transparent text-red-600 caret-white rounded-md cursor-pointer shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
                                        required="required"
                                        autoComplete="off"
                                        type="number"
                                        placeholder="45%"
                                        ref={fuelPercentBeforeRefuelInputRef}
                                    />
                                </div>
                            </div>
                            <button className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150 ">
                                {isAdding && (
                                    <svg
                                        aria-hidden="true"
                                        class="mr-3 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                    >
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"
                                        />
                                    </svg>
                                )}
                                {isAdding && 'Refueling...'}
                                {!isAdding && 'Refuel'}
                            </button>
                        </form>
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
