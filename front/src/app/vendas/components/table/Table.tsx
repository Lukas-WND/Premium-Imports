"use client";

import { useEffect } from "react";
import { columns } from "./columns";
import { getSales } from "../../data/queries";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/utils/DataTable";
import TableSkeleton from "@/components/utils/TableSkeleton";
import { StartSale } from "./StartSale";
import { useSaleStore } from "@/app/stores/saleStore";

export function SaleTable() {
  const setSaleList = useSaleStore((state) => state.setSaleList);
  const saleList = useSaleStore((state) => state.saleList);

  const { data: sales, isLoading } = useQuery({
    queryKey: ["sales"],
    queryFn: getSales,
  });

  useEffect(() => {
    if (sales) {
      setSaleList(sales);
    }
  }, [sales, setSaleList]);

  return (
    <div>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={saleList}
          actionComponent={StartSale}
          paginate={10}
        />
      )}
    </div>
  );
}
