import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class UpdateParkingLotDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  totalSpots: number;

  @IsOptional()
  @Min(0)
  pricePerHour?: number;

  @IsOptional()
  @Min(0)
  freeHoursPerDay?: number;
}
