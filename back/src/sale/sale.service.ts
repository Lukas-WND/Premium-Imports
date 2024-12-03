import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale } from './entities/sale.entity';
import { ClientService } from '../client/client.service';
import { SellerService } from '../seller/seller.service';
import { VehicleService } from '../vehicle/vehicle.service';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    private readonly clientService: ClientService,
    private readonly sellerService: SellerService,
    private readonly vehicleService: VehicleService,
  ) {}

  /**
   * Valida o financiamento para um cliente.
   * @param amount Valor financiado.
   * @param clientId ID do cliente.
   * @returns `true` se aprovado, caso contrário lança uma exceção.
   */
  private async validateFinancing(
    amount: number,
    clientId: string,
  ): Promise<boolean> {
    const client = await this.clientService.findOne(clientId);

    if (!client) {
      throw new NotFoundException('Cliente não encontrado!');
    }

    if (amount <= 0) {
      throw new BadRequestException(
        'Valor do financiamento deve ser positivo.',
      );
    }

    return true;
  }

  /**
   * Cria uma nova venda, associando cliente, vendedor e veículo.
   * @param createSaleDto Dados da venda.
   * @returns A venda criada.
   */
  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    const { client, seller, vehicle, financedAmount } = createSaleDto;

    const clientId = await this.clientService.findOne(client);
    const sellerId = await this.sellerService.findOne(seller);
    const vehicleId = await this.vehicleService.findOne(vehicle);

    if (!client || !seller || !vehicle) {
      throw new BadRequestException(
        'Cliente, vendedor ou veículo não encontrados.',
      );
    }

    if (financedAmount) {
      await this.validateFinancing(financedAmount, client);
    }

    const newSale = this.saleRepository.create({
      ...createSaleDto,
      saleCode: `SLE-${Date.now()}`,
      saleDate: new Date(),
      client: clientId,
      seller: sellerId,
      vehicle: vehicleId,
    });

    return this.saleRepository.save(newSale);
  }

  /**
   * Retorna todas as vendas cadastradas, incluindo seus relacionamentos.
   * @returns Lista de vendas.
   */
  async findAll(): Promise<Readonly<Sale[]>> {
    const sales = await this.saleRepository.find({
      relations: ['client', 'seller', 'vehicle', 'vehicle.modelId'],
    });

    return sales;
  }

  /**
   * Retorna uma venda específica pelo ID, com seus relacionamentos.
   * @param id ID da venda.
   * @returns A venda encontrada.
   */
  async findOne(id: string): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['client', 'seller', 'vehicle', 'vehicle.modelId'],
    });

    if (!sale) {
      throw new NotFoundException(`Venda com ID "${id}" não encontrada.`);
    }

    return sale;
  }

  /**
   * Atualiza os dados de uma venda.
   * @param id ID da venda.
   * @param updateSaleDto Dados para atualização.
   * @returns A venda atualizada.
   */
  async update(id: string, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const sale = await this.findOne(id);

    if (updateSaleDto.client) {
      sale.client = await this.clientService.findOne(updateSaleDto.client);
    }

    if (updateSaleDto.seller) {
      sale.seller = await this.sellerService.findOne(updateSaleDto.seller);
    }

    if (updateSaleDto.vehicle) {
      sale.vehicle = await this.vehicleService.findOne(updateSaleDto.vehicle);
    }

    Object.assign(sale, updateSaleDto);

    return this.saleRepository.save(sale);
  }

  /**
   * Remove uma venda utilizando exclusão lógica.
   * @param id ID da venda.
   * @returns Resultado da operação.
   */
  async remove(id: string): Promise<void> {
    const sale = await this.findOne(id);
    if (!sale) {
      throw new NotFoundException(`Venda com ID "${id}" não encontrada.`);
    }

    await this.saleRepository.softDelete(id);
  }
}
