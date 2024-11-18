import { CreateVehicleDto } from "src/vehicle/dto/create-vehicle.dto";

export class CreatePurchaseDto {
  purchaseValue: number;
  clientId: string;
  sellerId: string;
  vehicle: CreateVehicleDto;
}
