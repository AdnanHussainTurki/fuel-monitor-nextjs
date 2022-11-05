import { FaPencilAlt } from "react-icons/fa";
import { format } from 'fecha';
export default function (props) {
  console.log(props.refuels)
  return (
    <div class="p-4 w-auto bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg">
      <div class="flex justify-between items-center mb-4">
        <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
          Refuels
        </h5>
      </div>
      <hr />
      <div class="flow-root">
        <ul role="list" class="">
          {props.refuels.map((refuel) => {
                  return ( 
            <div>
              <li class="py-3 sm:py-4">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <div class="inline-flex overflow-hidden relative justify-center items-center w-10 h-10 bg-white-100 rounded-lg dark:bg-white">
                    <span class="text-[13px] text-center ">{format(new Date(refuel.refuel_on), 'D MMM YYYY')} </span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm  font-mono font-medium text-gray-900 truncate dark:text-white">
                    Till {refuel.meter_reading} KM
                  </p>
                    <span class=" text-white  font-medium rounded-sm text-[12px] pr-2 py-1 text-center inline-flex items-center  mr-2 mb-2">
                    <span >Run: 212 KMs</span>
                    </span>
                    <span class=" text-white bg-gradient-to-br from-pink-500 to-orange-400 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-sm text-[12px] px-2 py-1 text-center inline-flex items-center  mr-2 mb-2">
                    <span className="cursor-pointer">Edit</span>
                    </span>
                    
                </div>
                <div class="inline-flex items-center text-base font-semibold font-mono text-gray-900 dark:text-white">
                  $ {refuel.spending}
                </div>
              </div>
            </li>
            <li class="py-1">
              <div class=" font-mono text-center text-xs text-white uppercase font-light bg-gradient-to-r from-gray-500 to-black-500">
                <p>Mileage: 14 KMs/Litre</p>
              </div>

            </li></div>)
                
          })}
         
        </ul>
      </div>
    </div>
  );
}
