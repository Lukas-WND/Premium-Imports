import { ColumnDef } from "@tanstack/react-table";
import { DropdownActions } from "./DropdownActions";
import { Order } from "@/app/stores/orderStore";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderCode",
    header: "Código do Pedido",
  },
  {
    accessorKey: "modelName",
    header: "Modelo",
    cell: ({ row }) => {
      const { modelName, modelYear } = row.original;

      return (
        <span>
          {modelName} {modelYear}
        </span>
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
    accessorKey: "orderValue",
    header: "Valor do Pedido (R$)",
  },
  {
    accessorKey: "orderDate",
    header: "Data do Pedido",
    cell: ({ row }) => {
      const date = new Date(row.original.orderDate).toLocaleDateString("pt-BR");

      return date;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusMap: Record<number, string> = {
        0: "Em Processamento",
        1: "Confirmado",
        2: "Enviado",
        3: "Concluído",
      };

      const status: number = row.original.status;

      return <span>{statusMap[status]}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;

      return <DropdownActions order={order} />;
    },
  },
];
