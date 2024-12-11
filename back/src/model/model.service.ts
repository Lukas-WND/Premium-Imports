import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from './entities/model.entity';
import { And, Repository } from 'typeorm';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
  ) {}

  /**
   * Cria um novo modelo na base de dados.
   * @param createModelDto Dados para criar o modelo.
   * @returns O modelo criado.
   */
  async create(createModelDto: CreateModelDto) {
    console.log('model: ', createModelDto);
    const newModel = this.modelRepository.create({
      modelName: createModelDto.modelName,
      modelYear: createModelDto.modelYear,
    });

    return this.modelRepository.save(newModel);
  }

  /**
   * Retorna todos os modelos cadastrados.
   * @returns Lista de modelos ou uma exceção caso não existam registros.
   */
  async findAll() {
    const models = await this.modelRepository.find();

    return models;
  }

  /**
   * Busca um modelo específico pelo ID.
   * @param id ID do modelo.
   * @returns O modelo encontrado ou uma exceção.
   */
  async findOne(id: string) {
    const model = await this.modelRepository.findOne({
      where: { modelId: id },
    });
    return model;
  }

  async findByNameAndYear(name: string, year: number) {
    const model = await this.modelRepository.findOne({
      where: { modelName: name, modelYear: year },
    });

    return model;
  }

  /**
   * Atualiza os dados de um modelo específico.
   * @param id ID do modelo a ser atualizado.
   * @param updateModelDto Dados para atualização.
   * @returns O modelo atualizado.
   */
  async update(id: string, updateModelDto: UpdateModelDto) {
    const model = await this.findModelByIdOrFail(id);

    // Atualiza somente os campos fornecidos
    this.modelRepository.merge(model, {
      modelName: updateModelDto.modelName ?? model.modelName,
      modelYear: updateModelDto.modelYear ?? model.modelYear,
    });

    return this.modelRepository.save(model);
  }

  /**
   * Remove um modelo da base de dados via exclusão lógica.
   * @param id ID do modelo a ser removido.
   * @returns Resultado da operação.
   */
  async remove(id: string) {
    await this.findModelByIdOrFail(id); // Garante que o modelo existe antes de tentar removê-lo.
    return this.modelRepository.softDelete(id);
  }

  /**
   * Helper: Busca um modelo pelo ID e lança exceção caso não exista.
   * @param id ID do modelo.
   * @returns O modelo encontrado.
   */
  private async findModelByIdOrFail(id: string): Promise<Model> {
    const model = await this.modelRepository.findOne({
      where: { modelId: id },
    });

    if (!model) {
      throw new NotFoundException(
        'Nenhum modelo encontrado com o ID informado.',
      );
    }

    return model;
  }
}
