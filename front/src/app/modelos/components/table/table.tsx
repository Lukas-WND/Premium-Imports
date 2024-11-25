"use client";

import { useEffect } from "react";
import { columns } from "./columns";
import { getModels } from "../../data/queries";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/utils/DataTable";
import { useModelStore } from "@/app/stores/modelStore";
import TableSkeleton from "@/components/utils/TableSkeleton";
import { CreateModel } from "./CreateModel";

export function ModelTable() {
  const setModelList = useModelStore((state) => state.setModelList);
  const modelList = useModelStore((state) => state.modelList);

  const { data: models, isLoading } = useQuery({
    queryKey: ["models"],
    queryFn: getModels,
  });

  useEffect(() => {
    if (models) {
      setModelList(models);
    }
  }, [models, setModelList]);

  return (
    <div>
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <DataTable columns={columns} data={modelList} actionComponent={CreateModel} paginate={15}/>
      )}
    </div>
  );
}
