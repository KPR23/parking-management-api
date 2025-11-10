import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateEntryDto {
  @IsInt()
  @IsNotEmpty()
  parkingLotId: number;

  @IsString()
  @IsNotEmpty()
  plateNumber: string;
}
