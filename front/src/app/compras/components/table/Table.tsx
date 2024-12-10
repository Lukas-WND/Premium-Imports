"use client";

import { useEffect } from "react";
import { columns } from "./columns";
import { getPurchases } from "../../data/queries";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/utils/DataTable";
import TableSkeleton from "@/components/utils/TableSkeleton";
import { StartSale } from "./StartPurchase";
import { usePurchaseStore } from "@/app/stores/purchaseStore";

export function SaleTable() {
  const setPurchaseList = usePurchaseStore((state) => state.setPurchaseList);
  const purchaseList = usePurchaseStore((state) => state.purchaseList);

  const { data: purchases, isLoading } = useQuery({
    queryKey: ["purchases"],
    queryFn: getPurchases,
  });

  useEffect(() => {
    if (purchases) {
      setPurchaseList(purchases);
    }
  }, [purchases, purchaseList]);

  return (
    <div>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={purchaseList}
          actionComponent={StartSale}
          paginate={10}
        />
      )}
    </div>
  );
}
