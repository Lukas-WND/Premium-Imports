export class CreateOrderDto {
  orderValue: number;
  client: string;
  seller: string;
  automaker: string;
  color: string;
  modelId?: string;
  modelName?: string;
  modelYear?: number;
}
