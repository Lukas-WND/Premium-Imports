export class CreateVehicleDto {
  chassisNumber: string;
  plate?: string;
  fabricatingYear: number;
  color: string;
  price: number;
  modelId?: string;
  modelName?: string;
  modelYear?: number;
}
