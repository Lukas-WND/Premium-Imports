import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Model } from 'src/model/entities/model.entity';
import { ModelService } from 'src/model/model.service';

@Module({
  controllers: [VehicleController],
  providers: [VehicleService, ModelService],
  imports: [TypeOrmModule.forFeature([Vehicle, Model])],
  exports: [VehicleService]
})
export class VehicleModule {}
