import { Injectable } from '@nestjs/common';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from './entities/model.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private modelRepository: Repository<Model>,
  ) {}

  async create(createModelDto: CreateModelDto) {
    const createModelResult = this.modelRepository.create({
      modelName: createModelDto.name,
      modelYear: createModelDto.year,
    });

    return this.modelRepository.save(createModelResult);
  }

  async findAll() {
    const findAllModelsResult = await this.modelRepository.find();

    return findAllModelsResult.length > 0
      ? findAllModelsResult
      : 'Não foram encontrados registros de modelos.';
  }

  async findOne(id: string) {
    const resultFindOneModel = await this.modelRepository.findOne({
      where: { id: id },
    });

    return resultFindOneModel;
  }

  update(id: number, updateModelDto: UpdateModelDto) {
    return `This action updates a #${id} model`;
  }

  remove(id: number) {
    return `This action removes a #${id} model`;
  }
}
