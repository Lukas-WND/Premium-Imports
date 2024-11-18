import { Module } from '@nestjs/common';
import { AutomakerService } from './automaker.service';
import { AutomakerController } from './automaker.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Automaker } from './entities/automaker.entity';

@Module({
  controllers: [AutomakerController],
  imports: [TypeOrmModule.forFeature([Automaker])],
  providers: [AutomakerService],
})
export class AutomakerModule {}
