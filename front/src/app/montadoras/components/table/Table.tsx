"use client";

import { useEffect } from "react";
import { columns } from "./columns";
import { getAutomakers } from "../../data/queries";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/utils/DataTable";
import TableSkeleton from "@/components/utils/TableSkeleton";
import { CreateClient } from "./CreateAutomaker";
import { useAutomakerStore } from "@/app/stores/automakerStore";

export function AutomakerTable() {
  const setAutomakerList = useAutomakerStore((state) => state.setAutomakerList);
  const automakerList = useAutomakerStore((state) => state.automakerList);

  const { data: automakers, isLoading } = useQuery({
    queryKey: ["automakers"],
    queryFn: getAutomakers,
  });

  useEffect(() => {
    if (automakers) {
      setAutomakerList(automakers);
    }
  }, [automakers, setAutomakerList]);

  return (
    <div>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={automakerList}
          actionComponent={CreateClient}
          paginate={10}
        />
      )}
    </div>
  );
}
