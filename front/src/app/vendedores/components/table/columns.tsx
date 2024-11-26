import { ColumnDef } from "@tanstack/react-table";
import { DropdownActions } from "./DropdownActions";
import { Seller } from "@/app/stores/sellerStore";

export const columns: ColumnDef<Seller>[] = [
  {
    accessorKey: "registration",
    header: "Matrícula",
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    id: "actions",

    cell: ({ row }) => {
      const seller = row.original;

      // return <DropdownActions client={client} />;
    },
  },
];
