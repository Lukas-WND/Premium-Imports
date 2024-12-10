import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Purchase } from './entities/purchase.entity';
import { VehicleService } from '../vehicle/vehicle.service';
import { SellerService } from '../seller/seller.service';
import { ModelService } from '../model/model.service';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    private readonly vehicleService: VehicleService,
    private readonly sellerService: SellerService,
    private readonly modelService: ModelService,
  ) {}

  /**
   * Cria uma nova compra, criando também o veículo associado.
   * @param createPurchaseDto Dados da compra.
   * @returns A compra criada com sucesso.
   */
  async create(createPurchaseDto: CreatePurchaseDto) {
    const seller = await this.sellerService.findOne(createPurchaseDto.sellerId);

    // Criando ou encontrando o modelo do veículo
    const model = createPurchaseDto.vehicle.modelId
      ? await this.modelService.findOne(createPurchaseDto.vehicle.modelId)
      : await this.modelService.create({
          modelName: createPurchaseDto.vehicle.modelName,
          modelYear: createPurchaseDto.vehicle.modelYear,
        });

    // Criando o veículo
    const vehicle = await this.vehicleService.create({
      ...createPurchaseDto.vehicle,
      modelId: model.modelId,
    });

    // Criando a compra
    const newPurchase = this.purchaseRepository.create({
      ...createPurchaseDto,
      vehicle,
      seller,
    });

    return this.purchaseRepository.save(newPurchase);
  }

  /**
   * Retorna todas as compras cadastradas.
   * @returns Lista de compras ou uma exceção se nenhuma for encontrada.
   */
  async findAll() {
    const purchases = await this.purchaseRepository.find({
      relations: ['vehicle', 'vehicle.modelId', 'seller'],
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
      relations: ['vehicle', 'vehicle.model', 'seller'],
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

    if (updatePurchaseDto.sellerId) {
      purchase.seller = await this.sellerService.findOne(
        updatePurchaseDto.sellerId,
      );
    }

    if (updatePurchaseDto.vehicle) {
      const updatedVehicle = await this.vehicleService.update(
        purchase.vehicle.vehicleId,
        updatePurchaseDto.vehicle,
      );
      purchase.vehicle = updatedVehicle;
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
