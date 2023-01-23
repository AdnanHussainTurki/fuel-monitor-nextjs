import Link from 'next/link'
import Car from '../Svg/Car'
import Bike from '../Svg/Bike'
import Truck from '../Svg/Truck'

export default function (props) {
  return (
    <div className="flex justify-center">
      <div className="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
        { (props.vehicle.type == "Car") ? <Car className="h-6 fill-red-500" /> : "" }
        { (props.vehicle.type == "Bike" || props.vehicle.type == "Motor Cycle" ) ? <Bike className="h-6 fill-red-500" /> : "" }
        { (! props.vehicle.type ) ? <Truck className="h-6 fill-red-500" /> : "" }
        <h5 className="text-gray-900 text-xl leading-tight font-medium mb-2">
        <span className="text-red-600 text-xl font-bold">
        {props.vehicle.brand}
          </span>
          {' '}
              <span className="font-bold text-xl">{props.vehicle.model}</span>
           
        </h5>
        <p className="text-gray-700 text-sm mb-4">
          You have paid  <span className="text-blue-500 bg-blue-300/5 text-xs px-3 py-2 inline-flex gap-2 items-center justify-center">
                        <span className="font-mono"> {props.vehicle.currency} {parseFloat(props.vehicle.monthly_spending).toFixed(2).toLocaleString()}</span>
                    </span> for this vehicle refueling this month.
        </p>
        <Link
          href={`vehicle/view/${props.vehicle._id}`}
          className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          View
        </Link>
      </div>
    </div>
  )
}
