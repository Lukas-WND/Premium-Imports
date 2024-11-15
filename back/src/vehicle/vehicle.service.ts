import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private VehicleRepository: Repository<Vehicle>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    return 'This action adds a new vehicle';
  }

  async findAll() {
    const findAllResult = await this.VehicleRepository.find();

    return findAllResult.length > 0
      ? findAllResult
      : 'Não foram encontrados registros de veículos';
  }

  async findOne(id: number) {
    return `This action returns a #${id} vehicle`;
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto) {
    return `This action updates a #${id} vehicle`;
  }

  async remove(id: number) {
    return `This action removes a #${id} vehicle`;
  }
}
