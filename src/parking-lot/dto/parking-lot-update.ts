import { IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class UpdateParkingLotDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  totalSpots?: number;

  @Min(0)
  @IsOptional()
  pricePerHour?: number;

  @Min(0)
  @IsOptional()
  freeHoursPerDay?: number;
}
