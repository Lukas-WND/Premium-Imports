import { ColumnDef } from "@tanstack/react-table";
import DropdownActions from "./DropdownActions";

export type Model = {
  modelId: string;
  modelName: string;
  modelYear: string;
};

export const columns: ColumnDef<Model>[] = [
  {
    accessorKey: "modelName",
    header: "Modelo",
  },
  {
    accessorKey: "modelYear",
    header: "Ano",
  },
  {
    id: "actions",
    
    cell: ({ row }) => {
      const model = row.original;

      return <DropdownActions model={model} />;
    },
  },
];
