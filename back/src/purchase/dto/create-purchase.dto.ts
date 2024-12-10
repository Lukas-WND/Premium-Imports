export class CreatePurchaseDto {
  purchaseValue: number;
  client: string;
  seller: string;
  modelId?: string;
  modelName?: string;
  modelYear?: number;
  plate: string;
  color: string;
  chassisNumber: string;
}
