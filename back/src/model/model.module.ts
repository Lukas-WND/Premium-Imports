import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model } from './entities/model.entity';

@Module({
  controllers: [ModelController],
  providers: [ModelService],
  imports: [TypeOrmModule.forFeature([Model])],
  exports: [ModelService]
})
export class ModelModule {}
