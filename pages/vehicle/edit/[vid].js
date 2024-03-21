import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useRef, useState, useEffect, use } from 'react'
import Auth from '../../../src/components/Templates/Auth/Auth'
import getBrands from '../../../src/fetchs/getBrands'
import BrandsStore from '../../../src/stores/BrandsStore'
import CurrencyStore from '../../../src/stores/CurrencyStore'
import Creatable from 'react-select/creatable'
import Select from 'react-select'
import { ImPencil2, ImBin } from 'react-icons/im'
import Loading from '../../../src/components/Layout/Loading/Loading'
import VehicleStore from '../../../src/stores/VehicleStore'

async function fetchBrands() {
    const cars = BrandsStore.useState((s) => s.cars)
    const bikes = BrandsStore.useState((s) => s.bikes)

    if (cars.length === 0 || bikes.length === 0) {
        const brands = await getBrands()
        BrandsStore.update((s) => {
            s.cars = brands.filter((brand) => brand.type === 'car')
            s.bikes = brands.filter((brand) => brand.type === 'bike')
        })
    }
}
const predefinedFuelTypeOptions = [
    { value: 'petrol', label: 'Petrol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'cng', label: 'CNG' },
    { value: 'hydrogen', label: 'Hydrogen 😎' },
    { value: 'electric', label: 'Electric (Not yet supported 😕)' },
]
export default function edit() {
    const [isEditing, setIsAdding] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [vehicle, setVehicle] = useState(null)

    const [type, setType] = useState(null)
    const [brandJson, setBrandJson] = useState(null)
    const [model, setModel] = useState(null)
    const [currencyJson, setCurrencyJson] = useState(null)
    const [fuelTypeJson, setFuelTypeJson] = useState(null)
    const [fuelCapacity, setFuelCapacity] = useState(null)
    const [fuelReserve, setFuelReserve] = useState(null)

    const cars = BrandsStore.useState((s) => s.cars)
    const bikes = BrandsStore.useState((s) => s.bikes)
    const currencies = CurrencyStore.useState((s) => s.currencies)
    const vehicleStore = VehicleStore.useState((s) => s)

    const [brandOptions, setBrandOptions] = useState([])
    const [currencyOptions, setCurrencyOptions] = useState([])
    const [fuelTypeOptions, setFuelTypeOptions] = useState([])

    const modelInputRef = useRef()
    const typeInputRef = useRef()
    const currencyInputRef = useRef()
    const fuelTypeRef = useRef()
    const fuelCapacityRef = useRef()
    const fuelReserveRef = useRef()

    const router = useRouter()
    const { vid } = router.query
    fetchBrands()

    useEffect(() => {
        getSession().then((session) => {
            if (!session) {
                router.replace('/vehicle/add')
            }
        })
    }, [router])

    const _setBrandOptions = (type) => {
        if (type.toLowerCase() === 'car') {
            setBrandOptions(
                cars.map((car) => ({ value: car.name, label: car.name }))
            )
        } else if (type.toLowerCase() === 'bike') {
            setBrandOptions(
                bikes.map((bike) => ({ value: bike.name, label: bike.name }))
            )
        }
    }
    const changeBrands = (event) => {
        const type = typeInputRef?.current?.value

        _setBrandOptions(type)
        setBrandJson({})
    }
    useEffect(() => {
        if (!vehicle) {
            return
        }
        setType(vehicle.type)
        setBrandJson({ label: vehicle.brand, value: vehicle.brand })
        setModel(vehicle.model)
        console.log(
            '🚨🚨',
            currencies.find((option) => option.symbol === vehicle.currency)
        )
        setCurrencyJson({
            label: currencies.find(
                (option) => option.symbol === vehicle.currency
            ).name,
            value: currencies.find(
                (option) => option.symbol === vehicle.currency
            ).symbol,
        })
        setFuelTypeJson(
            predefinedFuelTypeOptions.find(
                (option) => option.value === vehicle.fuelType
            )
        )
        setFuelCapacity(vehicle.fuelCapacity)
        setFuelReserve(vehicle.fuelReserve)
        _setBrandOptions(vehicle.type)
    }, [vehicle])

    useEffect(() => {
        if (vid === undefined) {
            return
        }
        const fetchVehicle = async () => {
            setIsLoading(true)
            const response = await fetch('/api/vehicle/view?vid=' + vid)
            const data = await response.json()
            setVehicle(data.vehicle)
            setIsLoading(false)
        }
        fetchVehicle()
    }, [vid])
    useEffect(() => {
        setCurrencyOptions(
            currencies.map((currency) => ({
                value: currency.symbol,
                label: currency.name,
            }))
        )
        setFuelTypeOptions(predefinedFuelTypeOptions)
    }, [])
    const submitHandler = async (event) => {
        event.preventDefault()
        if (isEditing) {
            return
        }
        setIsAdding(true)
        const enteredBrand = brandJson.value
        const enteredModel = modelInputRef.current.value
        const enteredType = typeInputRef.current.value
        const enteredCurrency = currencyJson.value
        const enteredFuelType = fuelTypeJson.value
        const enteredFuelCapacity = fuelCapacityRef.current.value
        const enteredFuelReserve = fuelReserveRef.current.value

        // Add validation
        const result = await fetch('/api/vehicle/edit', {
            method: 'POST',
            body: JSON.stringify({
                vid: vid,
                brand: enteredBrand,
                model: enteredModel,
                type: enteredType,
                currency: enteredCurrency,
                fuelType: enteredFuelType,
                fuelCapacity: enteredFuelCapacity,
                fuelReserve: enteredFuelReserve,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!result.ok) {
            setIsAdding(false)
            return
        }
        VehicleStore.update((s) => {
            s.vehicles = s.vehicles.map((vehicle) => {
                if (vehicle._id === vid) {
                    vehicle.brand = enteredBrand
                    vehicle.model = enteredModel
                    vehicle.type = enteredType
                    vehicle.currency = enteredCurrency
                    vehicle.fuelType = enteredFuelType
                    vehicle.fuelCapacity = enteredFuelCapacity
                    vehicle.fuelReserve = enteredFuelReserve
                }
                return vehicle
            })
        })

        setIsAdding(false)
        router.replace('/vehicle/view/' + vid)
    }
    const deleteHandler = async (event) => {
        event.preventDefault()
        if (isDeleting) {
            return
        }
        setIsDeleting(true)
        const result = await fetch('/api/vehicle/delete', {
            method: 'POST',
            body: JSON.stringify({
                vid: vid,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (!result.ok) {
            setIsDeleting(false)
            return
        }
        VehicleStore.update((s) => {
            s.vehicles = s.vehicles.filter((vehicle) => vehicle._id !== vid)
        })
        if (vehicleStore.refuels[vid]) {
            RefuelStore.update((s) => {
                s.refuels = s.refuels.filter(
                    (refuel) => refuel.data.vid !== vid
                )
            })
        }

        setIsDeleting(false)
        router.replace('/')
    }
    useEffect(() => {
        if (isLoading == false && vehicle == null) {
            router.replace('/')
        }
    }, [isLoading, vehicle])

    return (
        <Auth>
            {isLoading ? (
                <Loading />
            ) : (
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg m-3">
                    <div className="p-6  bg-white border-b ">
                        <ImPencil2 className="h-30 mb-2 fill-red-500" />

                        <p>
                            <span className="text-red-600 text-xl font-bold">
                                {vehicle.brand}
                            </span>{' '}
                            <span className="font-bold text-xl">
                                {vehicle.model}
                            </span>
                        </p>
                        <br />
                        <form onSubmit={submitHandler} autoComplete="off">
                            <div>
                                <div>
                                    <label
                                        className="block font-large font-semibold text-sm text-gray-700 text-right"
                                        htmlFor="brand"
                                    >
                                        Type
                                    </label>
                                    <select
                                        onChange={changeBrands}
                                        ref={typeInputRef}
                                        dir="rtl"
                                        id="type"
                                        className="text-red-600 appearance-none rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
                                    >
                                        <option value="">Select</option>
                                        <option
                                            value="Car"
                                            selected={
                                                vehicle.type.toLowerCase() ==
                                                'car'
                                                    ? 'selected'
                                                    : ''
                                            }
                                        >
                                            Car
                                        </option>
                                        <option
                                            value="Bike"
                                            selected={
                                                vehicle.type.toLowerCase() ==
                                                'bike'
                                                    ? 'selected'
                                                    : ''
                                            }
                                        >
                                            Motor Cycle
                                        </option>
                                    </select>
                                </div>
                                <br />
                                <label
                                    className="block font-large font-semibold text-sm text-gray-700 text-right"
                                    htmlFor="brand"
                                >
                                    Brand
                                </label>
                                <Creatable
                                    options={brandOptions}
                                    onChange={(e) => {
                                        setBrandJson(e)
                                    }}
                                    value={brandJson}
                                    dir="rtl"
                                    id="brand"
                                    className="text-red-600 appearance-none rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
                                />
                            </div>
                            <br />
                            <div>
                                <label
                                    className="block font-large font-semibold text-sm text-gray-700 text-right"
                                    htmlFor="model"
                                >
                                    Model
                                </label>
                                <input
                                    id="model"
                                    value={model}
                                    onChange={(e) => {
                                        setModel(e.target.value)
                                    }}
                                    className="text-red-600 caret-white rounded-md cursor-pointer shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
                                    required="required"
                                    autoComplete="off"
                                    type="text"
                                    placeholder="Classic 350"
                                    ref={modelInputRef}
                                />
                            </div>
                            <br />
                            <div>
                                <label
                                    className="block font-large font-semibold text-sm text-gray-700 text-right"
                                    htmlFor="model"
                                >
                                    Currency
                                </label>
                                <Select
                                    options={currencyOptions}
                                    onChange={(opt) => setCurrencyJson(opt)}
                                    value={currencyJson}
                                    dir="ltf"
                                    id="type"
                                    className="text-red-600 appearance-none rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
                                ></Select>
                            </div>
                            <br />
                            <div>
                                <label
                                    className="block font-large font-semibold text-sm text-gray-700 text-right"
                                    htmlFor="model"
                                >
                                    Fuel Type
                                </label>
                                <Select
                                    options={fuelTypeOptions}
                                    onChange={(opt) => setFuelTypeJson(opt)}
                                    value={fuelTypeJson}
                                    dir="rtl"
                                    id="type"
                                    className="text-red-600 appearance-none rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
                                ></Select>
                            </div>
                            <br />
                            <div>
                                <label
                                    className="block font-large font-semibold text-sm text-gray-700 text-right"
                                    htmlFor="model"
                                >
                                    Fuel Tank Capacity (in Litres)
                                </label>
                                <input
                                    ref={fuelCapacityRef}
                                    onChange={(e) => {
                                        console.log(
                                            'fuelCapacity',
                                            e.target.value
                                        )
                                        setFuelCapacity(e.target.value)
                                    }}
                                    value={fuelCapacity}
                                    className="text-red-600 caret-white rounded-md cursor-pointer shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
                                    required="required"
                                    autoComplete="off"
                                    type="number"
                                    step={0.01}
                                    placeholder="13"
                                />
                            </div>
                            <br />
                            <div>
                                <label
                                    className="block font-large font-semibold text-sm text-gray-700 text-right"
                                    htmlFor="model"
                                >
                                    What's left in the tank when reserves hit
                                    (in Litres)
                                </label>
                                <input
                                    ref={fuelReserveRef}
                                    onChange={(e) => {
                                        console.log(
                                            'setFuelReserve',
                                            e.target.value
                                        )
                                        setFuelReserve(e.target.value)
                                    }}
                                    value={fuelReserve}
                                    className="text-red-600 caret-white rounded-md cursor-pointer shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
                                    required="required"
                                    autoComplete="off"
                                    type="number"
                                    placeholder="3.4"
                                    step={0.01}
                                />
                            </div>
                            <br />
                            <div className="flex justify-between ">
                                <button className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150 ">
                                    {isEditing && (
                                        <svg
                                            aria-hidden="true"
                                            className="mr-3 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
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
                                    {isEditing && 'Editing Vehicle...'}
                                    {!isEditing && 'Edit Vehicle'}
                                </button>

                                <button
                                    onClick={deleteHandler}
                                    className="inline-flex items-center px-4 py-2 bg-red-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 active:bg-red-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150 "
                                >
                                    {isDeleting && (
                                        <svg
                                            aria-hidden="true"
                                            className="w-3 h-3 text-white animate-spin text-white fill-red-600"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
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
                                    {!isDeleting && <ImBin />}
                                </button>
                            </div>
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
                destination: '/auth/forgot',
                permanent: false,
            },
        }
    }
    return {
        props: { session },
    }
}
