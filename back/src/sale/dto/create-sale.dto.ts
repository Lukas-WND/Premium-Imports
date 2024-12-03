export class CreateSaleDto {
  entryValue: number;
  financedAmount?: number;
  totalAmount: number;
  client: string;
  seller: string;
  vehicle: string;
}
