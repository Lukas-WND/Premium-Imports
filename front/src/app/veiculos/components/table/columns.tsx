import { ColumnDef } from "@tanstack/react-table";
import { DropdownActions } from "./DropdownActions";
import { Model } from "../../../stores/modelStore";
import { Vehicle } from "@/app/stores/vehicleStore";

export const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "model",
    header: "Modelo",
    cell: ({row}) => {
      const vehicle = row.original;
      console.log(vehicle)

      return `${vehicle.modelId?.modelName} ${vehicle.modelId?.modelYear}`
    }
  },
  {
    accessorKey: "chassisNumber",
    header: "Num. Chassi",
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "fabricatingYear",
    header: "Ano de Fabricação",
  },
  {
    accessorKey: "plate",
    header: "Placa",
  },
  {
    accessorKey: "price",
    header: "Preço",
  },
  {
    id: "actions",

    cell: ({ row }) => {
      const vehicle = row.original;

      return <DropdownActions vehicle={vehicle} />;
    },
  },
];
