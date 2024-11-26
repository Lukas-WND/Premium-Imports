import { ColumnDef } from "@tanstack/react-table";
import { DropdownActions } from "./DropdownActions";
import { Client } from "@/app/stores/clientStore";

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "cpf",
    header: "CPF",
  },
  {
    accessorKey: "income",
    header: "Renda",
  },
  {
    accessorKey: "state",
    header: "Estado",
  },
  {
    accessorKey: "city",
    header: "Cidade",
  },
  {
    accessorKey: "neighborhood",
    header: "Bairro",
  },
  {
    accessorKey: "cellPhone",
    header: "Celular",
  },
  {
    accessorKey: "homePhone",
    header: "Telefone Residencial",
  },
  {
    id: "actions",

    cell: ({ row }) => {
      const client = row.original;

      return <DropdownActions client={client} />;
    },
  },
];
