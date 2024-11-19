export class CreateOrderDto {
  orderValue: number;
  clientId: string;
  sellerId: string;
  automakerId: string;
  color: string;
  modelId?: string;
  modelName?: string;
  modelYear?: number;
}
