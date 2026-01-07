import { PartialType } from '@nestjs/swagger';
import { CreateParkingLotDto } from './parking-lot-create.dto';

export class UpdateParkingLotDto extends PartialType(CreateParkingLotDto) {}
