import Auth from "../../../src/components/Templates/Auth/Auth";
import { useRouter } from "next/router";
import { BsCash, BsCalendar2DateFill } from "react-icons/bs";
import Link from "next/link";
import { useState, useEffect } from "react";
import Car from "../../../src/components/Svg/Car";
import Truck from "../../../src/components/Svg/Truck";
import FuelHandle from "../../../src/components/Svg/FuelHandle";
import Bike from "../../../src/components/Svg/Bike";
import Graph from "../../../src/components/Svg/Graph";

export default function Refuel() {
  const [vehicle, setVehicle] = useState({
    _id: "63619a52cba3979d4dd5ce4e",
    brand: "Royal Enfield",
    model: "Classic 350",
    user_email: "adnanhussainturki@gmail.com",
    createdAt: "2022-11-01T22:14:42.059Z",
    type: "Motor Cycle",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { vid } = router.query;
  console.log(vid);
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
            <FuelHandle className="h-10 mb-2 fill-red-500" />

            <p>
              <span className="text-red-600 text-xl font-bold">
                {vehicle.brand}
              </span>{" "}
              <span className="font-bold text-xl">{vehicle.model}</span>
            </p>
            <br />
            <div>
              <label
                className="block font-large font-semibold text-sm text-gray-700 text-right"
                htmlFor="model"
              >
                Spendings
              </label>
              <div class="relative mb-6">
                <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
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
                />
              </div>
            </div>
            <div>
              <label
                className="block font-large font-semibold text-sm text-gray-700 text-right"
                htmlFor="model"
              >
                Rate/Litre
              </label>
              <div class="relative mb-6">
                <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
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
                />
              </div>
            </div>
            <div>
              <label
                className="block font-large font-semibold text-sm text-gray-700 text-right"
                htmlFor="model"
              >
                Refueling on
              </label>
              <div class="relative mb-6">
    
                <input
                  dir="rtl"
                  id="model"
                  min={1}
                  className="rtl appearance-none text-xl font-bold caret-transparent text-red-600 caret-white rounded-md cursor-pointer shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block mt-1 p-2 w-full"
                  required="required"
                  autoComplete="off"
                  type="date"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Auth>
  );
}
