import { ColumnDef } from "@tanstack/react-table";
import { DropdownActions } from "./DropdownActions";
import { Sale } from "@/app/stores/saleStore";

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: "saleCode",
    header: "Código",
  },
  {
    accessorKey: "vehicle",
    header: "Veículo",
    cell: ({ row }) => {
      const vehicle = row.original.vehicle;

      return (
        vehicle && (
          <span>
            {vehicle.modelId.modelName} {vehicle.modelId.modelYear} -{" "}
            {vehicle.chassisNumber}
          </span>
        )
      );
    },
  },
  {
    accessorKey: "client",
    header: "Cliente",
    cell: ({ row }) => {
      const client = row.original.client;

      return client && <span>{client.name}</span>;
    },
  },
  {
    accessorKey: "seller",
    header: "Vendedor",
    cell: ({ row }) => {
      const seller = row.original.seller;

      return seller && <span>{seller.name}</span>;
    },
  },
  {
    accessorKey: "entryValue",
    header: "Entrada (R$)",
  },
  {
    accessorKey: "financedAmount",
    header: "Valor Financiado (R$)",
  },
  {
    accessorKey: "totalAmount",
    header: "Valor Total (R$)",
  },
  {
    accessorKey: "saleDate",
    header: "Data da Venda",
  },
  {
    id: "actions",

    cell: ({ row }) => {
      const sale = row.original;

      // return <DropdownActions client={client} />;
    },
  },
];
