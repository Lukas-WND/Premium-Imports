import { Injectable, NotFoundException } from '@nestjs/common';
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
   * Cria uma nova venda, relacionando cliente, vendedor e veículo.
   * @param createSaleDto Dados da venda.
   * @returns A venda criada.
   */
  async create(createSaleDto: CreateSaleDto) {
    const client = await this.clientService.findOne(createSaleDto.clientId);
    const seller = await this.sellerService.findOne(createSaleDto.sellerId);
    const vehicle = await this.vehicleService.findOne(createSaleDto.vehicleId);

    const newSale = this.saleRepository.create({
      ...createSaleDto,
      client,
      seller,
      vehicle,
    });

    return this.saleRepository.save(newSale);
  }

  /**
   * Retorna todas as vendas cadastradas, com seus relacionamentos.
   * @returns Lista de vendas ou uma exceção se nenhuma venda for encontrada.
   */
  async findAll() {
    const sales = await this.saleRepository.find({
      relations: ['client', 'seller', 'vehicle', 'vehicle.model'],
    });

    if (!sales.length) {
      throw new NotFoundException('Não foram encontrados registros de vendas.');
    }

    return sales;
  }

  /**
   * Retorna uma venda específica pelo ID, com seus relacionamentos.
   * @param id ID da venda.
   * @returns A venda encontrada ou uma exceção.
   */
  async findOne(id: string) {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['client', 'seller', 'vehicle', 'vehicle.model'],
    });

    if (!sale) {
      throw new NotFoundException(`Venda com o ID ${id} não encontrada.`);
    }

    return sale;
  }

  /**
   * Atualiza os dados de uma venda, permitindo alterações em cliente, vendedor e veículo.
   * @param id ID da venda.
   * @param updateSaleDto Dados para atualização.
   * @returns A venda atualizada.
   */
  async update(id: string, updateSaleDto: UpdateSaleDto) {
    const sale = await this.findOne(id);

    if (updateSaleDto.clientId) {
      sale.client = await this.clientService.findOne(updateSaleDto.clientId);
    }

    if (updateSaleDto.sellerId) {
      sale.seller = await this.sellerService.findOne(updateSaleDto.sellerId);
    }

    if (updateSaleDto.vehicleId) {
      sale.vehicle = await this.vehicleService.findOne(updateSaleDto.vehicleId);
    }

    Object.assign(sale, updateSaleDto);

    return this.saleRepository.save(sale);
  }

  /**
   * Remove uma venda da base de dados via exclusão lógica.
   * @param id ID da venda.
   * @returns Resultado da operação.
   */
  async remove(id: string) {
    await this.findOne(id); // Garante que a venda existe antes de tentar removê-la.
    return this.saleRepository.softDelete(id);
  }
}
