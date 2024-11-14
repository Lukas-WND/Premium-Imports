import { Module } from '@nestjs/common';
import { AutomakerService } from './automaker.service';
import { AutomakerController } from './automaker.controller';

@Module({
  controllers: [AutomakerController],
  providers: [AutomakerService],
})
export class AutomakerModule {}
