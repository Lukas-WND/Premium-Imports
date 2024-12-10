import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Purchase } from './entities/purchase.entity';
import { VehicleService } from '../vehicle/vehicle.service';
import { SellerService } from '../seller/seller.service';
import { ModelService } from '../model/model.service';
import { ClientService } from 'src/client/client.service';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    private readonly vehicleService: VehicleService,
    private readonly sellerService: SellerService,
    private readonly clientService: ClientService,
    private readonly modelService: ModelService,
  ) {}

  /**
   * Cria uma nova compra, criando também o veículo associado.
   * @param createPurchaseDto Dados da compra.
   * @returns A compra criada com sucesso.
   */
  async create(createPurchaseDto: CreatePurchaseDto) {
    const seller = await this.sellerService.findOne(createPurchaseDto.seller);
    const client = await this.clientService.findOne(createPurchaseDto.client);
    const code = `PRC-${Date.now()}`
    const model = createPurchaseDto.modelId ? await this.modelService.findOne(createPurchaseDto.modelId) : undefined;

    // Criando o veículo
    const vehicle = await this.vehicleService.create({
      modelId: createPurchaseDto.modelId,
      modelName: createPurchaseDto.modelName || model.modelName,
      modelYear: createPurchaseDto.modelYear || model.modelYear,
      price: createPurchaseDto.purchaseValue,
      chassisNumber: createPurchaseDto.chassisNumber,
      color: createPurchaseDto.color,
      plate: createPurchaseDto.plate,
      fabricatingYear: createPurchaseDto.modelYear || model.modelYear,
    });

    // Criando a compra
    const newPurchase = this.purchaseRepository.create({
      ...createPurchaseDto,
      vehicle,
      seller,
      client,
      purchaseCode: code,
      purchaseDate: new Date()
    });

    return this.purchaseRepository.save(newPurchase);
  }

  /**
   * Retorna todas as compras cadastradas.
   * @returns Lista de compras ou uma exceção se nenhuma for encontrada.
   */
  async findAll() {
    const purchases = await this.purchaseRepository.find({
      relations: ['vehicle', 'vehicle.modelId', 'seller', 'client'],
    });

    return purchases;
  }

  /**
   * Retorna uma compra específica pelo ID.
   * @param id ID da compra.
   * @returns A compra encontrada ou uma exceção.
   */
  async findOne(id: string) {
    const purchase = await this.purchaseRepository.findOne({
      where: { id },
      relations: ['vehicle', 'vehicle.modelId', 'seller', 'client'],
    });

    if (!purchase) {
      throw new NotFoundException(`Compra com o ID ${id} não encontrada.`);
    }

    return purchase;
  }

  /**
   * Atualiza os dados de uma compra.
   * @param id ID da compra.
   * @param updatePurchaseDto Dados para atualização.
   * @returns A compra atualizada.
   */
  async update(id: string, updatePurchaseDto: UpdatePurchaseDto) {
    const purchase = await this.findOne(id);

    if (updatePurchaseDto.seller) {
      purchase.seller = await this.sellerService.findOne(
        updatePurchaseDto.seller,
      );
    }

    Object.assign(purchase, updatePurchaseDto);

    return this.purchaseRepository.save(purchase);
  }

  /**
   * Remove uma compra da base de dados via exclusão lógica.
   * @param id ID da compra.
   * @returns Resultado da operação.
   */
  async remove(id: string) {
    await this.findOne(id); // Garante que a compra existe antes de tentar removê-la.
    return this.purchaseRepository.softDelete(id);
  }
}
