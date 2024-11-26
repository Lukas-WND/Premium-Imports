"use client";

import { useEffect } from "react";
import { columns } from "./columns";
import { getVehicles } from "../../data/queries";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/utils/DataTable";
import { useVehicleStore } from "@/app/stores/vehicleStore";
import TableSkeleton from "@/components/utils/TableSkeleton";
import { CreateVehicle } from "./CreateVehicle";

export function ModelTable() {
  const setVehicleList = useVehicleStore((state) => state.setVehicleList);
  const vehicleList = useVehicleStore((state) => state.vehicleList);

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  useEffect(() => {
    if (vehicles) {
      setVehicleList(vehicles);
    }
  }, [vehicles, setVehicleList]);

  return (
    <div>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DataTable columns={columns} data={vehicleList} actionComponent={CreateVehicle} paginate={15}/>
      )}
    </div>
  );
}
