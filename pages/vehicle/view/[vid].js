import Auth from "../../../src/components/Templates/Auth/Auth";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";
import Car from "../../../src/components/Svg/Car";
import Truck from "../../../src/components/Svg/Truck";
import FuelHandle from "../../../src/components/Svg/FuelHandle";
import Bike from "../../../src/components/Svg/Bike";
import Graph from "../../../src/components/Svg/Graph";
import RefuelStrip from "../../../src/components/Refuel/RefuelStrip";

export default function add() {
  const [vehicle, setVehicle] = useState({});
  const [refuels, setRefuels] = useState({})
  const [isLoading, setIsLoading] = useState(false);
  const [isRefuelLoading, setIsRefuelLoading] = useState(true);
  const router = useRouter();
  const { vid } = router.query;
  useEffect(() => {
    if (vid === undefined) {
      return;
    }
    const fetchVehicle = async () => {
      const response = await fetch("/api/vehicle/view?vid=" + vid);
      const data = await response.json();
      setVehicle(data.vehicle);
      setIsLoading(false);
    };
    const fetchRefuels = async () => {
      const response = await fetch("/api/vehicle/refuel/all?vid=" + vid);
      const data = await response.json();
      setRefuels(data.refuels);
      setIsRefuelLoading(false);
    };
    fetchVehicle();
    fetchRefuels();
  }, [vid]);
  return (
    <Auth>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg m-3">
          <div class="p-6  bg-white border-b ">
            {vehicle.type == "Car" ? <Car className="h-10 fill-red-500" /> : ""}
            {vehicle.type == "Motor Cycle" ? (
              <Bike className="h-10 fill-red-500" />
            ) : (
              ""
            )}
            {!vehicle.type ? <Truck className="h-10 fill-red-500" /> : ""}
            <p>
              <span className="text-red-600 text-xl font-bold">
                {vehicle.brand}
              </span>{" "}
              <span className="font-bold text-xl">{vehicle.model}</span>
            </p>
            <br />
            <div>
              <Link
                href={"#"}
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
          { isRefuelLoading && <p>Loading...</p>}
          { !isRefuelLoading && <RefuelStrip refuels={refuels}/>}
        </div>
      )}
    </Auth>
  );
}
