import { PartialType } from '@nestjs/swagger';
import { CreateMedidasDto } from './create-medidas.dto';

export class UpdateMedidasDto extends PartialType(CreateMedidasDto) {}
