import { PartialType } from '@nestjs/mapped-types';
import { CreateParkingLotDto } from './parking-lot-create.dto.js';

export class UpdateParkingLotDto extends PartialType(CreateParkingLotDto) {}
