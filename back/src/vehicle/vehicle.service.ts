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
    let model: Model;

    console.log(createVehicleDto);

    // Verifica se um `modelId` foi fornecido e tenta buscar o modelo.
    if (createVehicleDto.modelId) {
      model = await this.modelService.findOne(createVehicleDto.modelId);

      if (!model) {
        throw new NotFoundException(
          `Modelo com o ID ${createVehicleDto.modelId} não encontrado.`,
        );
      }
    } else {
      // Se o `modelId` não foi fornecido, cria um novo modelo.
      model = await this.modelService.create({
        name: createVehicleDto.modelName,
        year: createVehicleDto.modelYear,
      });
    }

    // Cria o veículo associado ao modelo.
    const newVehicle = this.vehicleRepository.create({
      ...createVehicleDto,
      modelId: model,
    });

    // Salva o novo veículo no banco de dados.
    return this.vehicleRepository.save(newVehicle);
  }

  /**
   * Retorna todos os veículos cadastrados.
   * @returns Lista de veículos ou uma exceção caso não existam registros.
   */
  async findAll() {
    const vehicles = await this.vehicleRepository.find({relations: ['modelId']});

    if (!vehicles.length) {
      throw new NotFoundException(
        'Não foram encontrados registros de veículos.',
      );
    }

    return vehicles;
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

    // Atualiza somente os campos fornecidos
    // this.vehicleRepository.merge(vehicle, updateVehicleDto);

    return this.vehicleRepository.save(vehicle);
  }

  /**
   * Remove um veículo da base de dados via exclusão lógica.
   * @param id ID do veículo a ser removido.
   * @returns Resultado da operação.
   */
  async remove(id: string) {
    await this.findVehicleByIdOrFail(id); // Garante que o veículo existe antes de tentar removê-lo.
    return this.vehicleRepository.softDelete(id);
  }

  /**
   * Helper: Busca um veículo pelo ID e lança exceção caso não exista.
   * @param id ID do veículo.
   * @returns O veículo encontrado.
   */
  private async findVehicleByIdOrFail(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });

    if (!vehicle) {
      throw new NotFoundException(
        'Nenhum veículo encontrado com o ID informado.',
      );
    }

    return vehicle;
  }
}
