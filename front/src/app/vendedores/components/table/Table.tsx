"use client";

import { useEffect } from "react";
import { columns } from "./columns";
import { getSellers } from "../../data/queries";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/utils/DataTable";
import TableSkeleton from "@/components/utils/TableSkeleton";
import { CreateSeller } from "./CreateSeller";
import { useSellerStore } from "@/app/stores/sellerStore";

export function SellerTable() {
  const setSellerList = useSellerStore((state) => state.setSellerList);
  const sellersList = useSellerStore((state) => state.sellerList);

  const { data: sellers, isLoading } = useQuery({
    queryKey: ["sellers"],
    queryFn: getSellers,
  });

  useEffect(() => {
    if (sellers) {
      setSellerList(sellers);
    }
  }, [sellers, setSellerList]);

  return (
    <div>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={sellersList}
          actionComponent={CreateSeller}
          paginate={10}
        />
      )}
    </div>
  );
}
