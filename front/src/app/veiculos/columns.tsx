"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type Veiculo = {
  id: string;
  chassiNumber: string;
  plate: string;
  fabricatingYear: string;
  color: string;
  price: number;
  model: {
    name: string;
    year: number;
  };
};

export const columns: ColumnDef<Veiculo>[] = [
  {
    accessorKey: "chassiNumber",
    sortingFn: "alphanumeric",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Num. Chassi
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "plate",
    header: "Placa",
  },
  {
    accessorKey: "fabricatingYear",
    header: "Ano Fabricação",
  },
  {
    accessorKey: "color",
    header: "Cor",
  },
  {
    accessorKey: "price",
    header: "Preço",
  },
  {
    accessorKey: "model",
    header: "Modelo",
    cell: ({ row }) => {
      <span>
        {row.original.model.name}{' '}{row.original.model.year}
      </span>;
    },
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const service = row.original;

  //     return <DropdownActions service={service} />;
  //   },
  // },
];
