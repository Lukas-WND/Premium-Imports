export class CreateVehicleDto {
  chassisNumer: string;
  plate: string;
  fabricatingYear: number;
  color: string;
  price: number;
  modelId?: string;
  modelName?: string;
  modelYear?: number;
}
