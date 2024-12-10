"use client";

import { useEffect } from "react";
import { columns } from "./columns";
import { getOrders } from "../../data/queries";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/utils/DataTable";
import TableSkeleton from "@/components/utils/TableSkeleton";
import { StartSale } from "./CreateOrder";
import { useOrderStore } from "@/app/stores/orderStore";

export function SaleTable() {
  const setOrderList = useOrderStore((state) => state.setOrderList);
  const orderList = useOrderStore((state) => state.orderList);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  useEffect(() => {
    if (orders) {
      setOrderList(orders);
    }
  }, [orders, setOrderList]);

  return (
    <div>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={orderList}
          actionComponent={StartSale}
          paginate={10} 
        />
      )}
    </div>
  );
}
