import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { ModelService } from 'src/model/model.service';
import { Model } from 'src/model/entities/model.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private modelService: ModelService,
  ) {}

  /**
   * Cria um novo veículo na base de dados.
   * @param createVehicleDto Dados para criar o veículo.
   * @returns O veículo criado.
   */
  async create(createVehicleDto: CreateVehicleDto) {
    console.log('Dados recebidos para criação do veículo:', createVehicleDto);

    let model = await this.findOrCreateModel(createVehicleDto.modelId, createVehicleDto.modelName, createVehicleDto.modelYear);

    const newVehicle = this.vehicleRepository.create({
      ...createVehicleDto,
      modelId: model,
    });

    return this.vehicleRepository.save(newVehicle);
  }

  /**
   * Retorna todos os veículos cadastrados.
   * @returns Lista de veículos.
   */
  async findAll() {
    return this.vehicleRepository.find({
      relations: ['modelId'],
    });
  }

  /**
   * Busca um veículo específico pelo ID.
   * @param id ID do veículo.
   * @returns O veículo encontrado ou uma exceção.
   */
  async findOne(id: string) {
    return this.findVehicleByIdOrFail(id);
  }

  /**
   * Atualiza os dados de um veículo específico.
   * @param id ID do veículo a ser atualizado.
   * @param updateVehicleDto Dados para atualização.
   * @returns O veículo atualizado.
   */
  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    const vehicle = await this.findVehicleByIdOrFail(id);

    let model: Model | undefined;

    if (updateVehicleDto.modelId || (updateVehicleDto.modelName && updateVehicleDto.modelYear)) {
      model = await this.findOrCreateModel(updateVehicleDto.modelId, updateVehicleDto.modelName, updateVehicleDto.modelYear);
    }

    this.vehicleRepository.merge(vehicle, {
      ...updateVehicleDto,
      modelId: model ?? vehicle.modelId,
    });

    return this.vehicleRepository.save(vehicle);
  }

  /**
   * Remove um veículo da base de dados via exclusão lógica.
   * @param id ID do veículo a ser removido.
   * @returns Resultado da operação.
   */
  async remove(id: string) {
    await this.findVehicleByIdOrFail(id);
    return this.vehicleRepository.softDelete(id);
  }

  /**
   * Helper: Busca um veículo pelo ID e lança exceção caso não exista.
   * @param id ID do veículo.
   * @returns O veículo encontrado.
   */
  private async findVehicleByIdOrFail(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { vehicleId: id },
      relations: ['modelId'],
    });

    if (!vehicle) {
      throw new NotFoundException('Nenhum veículo encontrado com o ID informado.');
    }

    return vehicle;
  }

  /**
   * Helper: Busca ou cria um modelo com base no ID, nome e ano fornecidos.
   * @param modelId ID do modelo (opcional).
   * @param modelName Nome do modelo (opcional).
   * @param modelYear Ano do modelo (opcional).
   * @returns O modelo encontrado ou criado.
   */
  private async findOrCreateModel(modelId?: string, modelName?: string, modelYear?: number): Promise<Model> {
    let model: Model | undefined;

    if (modelId) {
      model = await this.modelService.findOne(modelId);
    }

    if (!model && modelName && modelYear) {
      model = await this.modelService.findByNameAndYear(modelName, modelYear);
    }

    if (!model && modelName && modelYear) {
      model = await this.modelService.create({ modelName, modelYear });
    }

    if (!model) {
      throw new NotFoundException('Não foi possível localizar ou criar o modelo para o veículo.');
    }

    return model;
  }
}
