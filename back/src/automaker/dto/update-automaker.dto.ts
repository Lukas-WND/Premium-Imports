import { PartialType } from '@nestjs/mapped-types';
import { CreateAutomakerDto } from './create-automaker.dto';

export class UpdateAutomakerDto extends PartialType(CreateAutomakerDto) {}
