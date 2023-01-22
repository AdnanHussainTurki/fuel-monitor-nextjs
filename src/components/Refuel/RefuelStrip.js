import { FaPencilAlt } from "react-icons/fa";
import { format } from "fecha";
import Link from "next/link";
export default function (props) {
  console.log("Props", props.refuels);
  return (
    <div class="p-4 w-auto bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg">
      <div class="flex justify-between items-center mb-4">
        <h5 class="text-xl font-bold leading-none text-white">{props.refuels.length == 0 ? "No Refuel History" : "Refuels"}</h5>
      </div>
      {props.refuels.length > 0 ? <hr/> : ""}
      <div class="flow-root">
        <ul role="list" class="">
          {props.refuels.map((refuel, key) => {
            let previousRefuel = props.refuels[key + 1];
            return (
              <div key={key}>
                <li class="py-3 sm:py-4">
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                      <div class="inline-flex overflow-hidden relative justify-center items-center w-10 h-10 bg-white-100 rounded-lg">
                        <span class="text-[13px] leading-[.8rem] text-center uppercase text-white  ">{format(new Date(refuel.refuel_on), "D MMM YYYY")} </span>
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm  font-mono font-medium text-gray-900 truncate dark:text-white">
                        {refuel.meter_reading} KM {previousRefuel?.meter_reading ? "- " + previousRefuel.meter_reading + " KM" : ""}
                      </p>
                      {previousRefuel?.meter_reading && <span class=" text-white  font-medium rounded-sm text-[12px] pr-2 py-1 text-center inline-flex items-center  mr-2 mb-2"> {"Run: " + (refuel.meter_reading - previousRefuel.meter_reading) + " KM"} </span>}
                      {refuel.rate_per_litre && <span class=" text-white  font-medium rounded-sm text-[12px] pr-2 py-1 text-center inline-flex items-center  mr-2 mb-2"> {"Fuel Rate: Rs. " + parseFloat(refuel.rate_per_litre).toFixed(2)} </span>}
                      {refuel.spending && <span class=" text-white  font-medium rounded-sm text-[12px] pr-2 py-1 text-center inline-flex items-center  mr-2 mb-2"> {"Litres: Rs. " + (parseFloat(refuel.spending) / parseFloat(refuel.rate_per_litre)).toFixed(2)} </span>}
                      <span class=" text-white bg-gradient-to-br from-pink-500 to-orange-400 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-sm text-[12px] px-2 py-1 text-center inline-flex items-center  mr-2 mb-2">
                        <Link
                                href={`/vehicle/refuel/edit/${props.vehicle._id}/${refuel._id}`}
                          >
                        <span className="cursor-pointer">Edit</span>
                        </Link>
                      </span>
                    </div>
                    <div class="inline-flex items-center text-base font-semibold font-mono text-gray-900 dark:text-white">{props.vehicle.currency} {parseFloat(refuel.spending).toFixed(2)}</div>
                  </div>
                </li>
                {previousRefuel?.meter_reading && refuel.continued && (
                  <li class="py-1">
                    <div class=" font-mono text-center text-xs text-white uppercase font-light bg-gradient-to-r from-gray-500 to-black-500">
                      <p>Mileage: {((refuel.meter_reading - previousRefuel.meter_reading)/(parseFloat(refuel.spending) / parseFloat(refuel.rate_per_litre))).toFixed(2)} KMs/Litre</p>
                    </div>
                  </li>
                )}
                {previousRefuel?.meter_reading && !refuel.continued && (
                  <li class="py-1">
                    <div class=" font-mono text-center text-xs text-white uppercase font-light bg-gray-800 hover:bg-gray-900">
                      <p>non-continuous refuels</p>
                    </div>
                  </li>
                )}
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
