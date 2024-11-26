import { ColumnDef } from "@tanstack/react-table";
import { DropdownActions } from "./DropdownActions";
import { Automaker } from "@/app/stores/automakerStore";

export const columns: ColumnDef<Automaker>[] = [
  {
    accessorKey: "cnpj",
    header: "CNPJ",
  },
  {
    accessorKey: "corporateName",
    header: "Razão Social",
  },
  {
    accessorKey: "brand",
    header: "Marca",
  },
  {
    accessorKey: "email",
    header: "E-Mail",
  },
  {
    accessorKey: "businessPhone",
    header: "Telefone Corporativo",
  },
  {
    accessorKey: "cellPhone",
    header: "Celular",
  },
  {
    id: "actions",

    cell: ({ row }) => {
      const automaker = row.original;

      return <DropdownActions automaker={automaker} />;
    },
  },
];
