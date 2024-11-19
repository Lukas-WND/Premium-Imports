export class CreateOrderDto {
  orderValue: number;
  clientId: string;
  sellerId: string;
  automakerId: string;
  modelId?: string;
  modelName?: string;
  modelYear?: number;
}
