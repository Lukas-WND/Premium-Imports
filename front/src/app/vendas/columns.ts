import { Model } from "../modelos/components/table/columns";

export type Vehicle = {
  vehicleId: string;
  chassisNumber: string;
  plate?: string;
  fabricatingYear: number;
  color: string;
  price: number;
  model: Model
};
