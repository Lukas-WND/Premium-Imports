"use client";

import { useQuery } from "@tanstack/react-query";
import { getModels } from "../../data/queries";
import TableSkeleton from "@/components/utils/TableSkeleton";
import DataTable from "@/components/utils/DataTable";
import { columns } from "./columns";

export function ModelTable() {
  const { data: models, isLoading } = useQuery({
    queryKey: ["models"],
    queryFn: getModels,
  });

  return (
    <div>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DataTable columns={columns} data={models || []} />
      )}
    </div>
  );
}
