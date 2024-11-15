import { Model } from 'src/model/entities/model.entity';

export class CreateVehicleDto {
  chassisNumer: string;
  plate: string;
  fabricatingYear: number;
  color: string;
  price: number;
  model: Model;
}
