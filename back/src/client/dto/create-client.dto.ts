export class CreateClientDto {
  cpf: string;
  name: string;
  neighborhood: string;
  city: string;
  state: string;
  homePhone?: string;
  cellPhone: string;
  income: number;
}
