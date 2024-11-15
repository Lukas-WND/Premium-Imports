export class CreateSaleDto {
  entryValue: number;
  financedAmount?: number;
  totalAmount: number;
  clientId: string;
  sellerId: string;
  vehicleId: string;
}
