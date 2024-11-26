"use client";

import { useEffect } from "react";
import { columns } from "./columns";
import { getClients } from "../../data/queries";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/utils/DataTable";
import TableSkeleton from "@/components/utils/TableSkeleton";
import { CreateClient } from "./CreateClient";
import { useClientStore } from "@/app/stores/clientStore";

export function ClientTable() {
  const setClientList = useClientStore((state) => state.setClientList);
  const clientList = useClientStore((state) => state.clientList);

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  useEffect(() => {
    if (clients) {
      setClientList(clients);
    }
  }, [clients, setClientList]);

  return (
    <div>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DataTable columns={columns} data={clientList} actionComponent={CreateClient} paginate={10}/>
      )}
    </div>
  );
}
