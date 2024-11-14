import { Injectable } from '@nestjs/common';
import { CreateAutomakerDto } from './dto/create-automaker.dto';
import { UpdateAutomakerDto } from './dto/update-automaker.dto';

@Injectable()
export class AutomakerService {
  create(createAutomakerDto: CreateAutomakerDto) {
    return 'This action adds a new automaker';
  }

  findAll() {
    return `This action returns all automaker`;
  }

  findOne(id: number) {
    return `This action returns a #${id} automaker`;
  }

  update(id: number, updateAutomakerDto: UpdateAutomakerDto) {
    return `This action updates a #${id} automaker`;
  }

  remove(id: number) {
    return `This action removes a #${id} automaker`;
  }
}
