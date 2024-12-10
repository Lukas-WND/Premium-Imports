import { ColumnDef } from "@tanstack/react-table";
import { DropdownActions } from "./DropdownActions";
import { Purchase } from "@/app/stores/purchaseStore";

export const columns: ColumnDef<Purchase>[] = [
  {
    accessorKey: "purchaseCode",
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
    accessorKey: "purchaseValue",
    header: "Valor da Compra",
  },
  {
    accessorKey: "purchaseDate",
    header: "Data da Venda",
    cell: ({ row }) => {
      const date = new Date(row.original.purchaseDate).toLocaleDateString(
        "pt-BR"
      );

      return date;
    },
  },
  {
    id: "actions",

    cell: ({ row }) => {
      const sale = row.original;

      return <DropdownActions purchase={sale} />;
    },
  },
];
