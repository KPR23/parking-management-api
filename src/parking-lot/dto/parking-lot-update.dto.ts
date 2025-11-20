import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateParkingLotDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  location?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  totalSpots?: number;

  @Min(0)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  pricePerHour?: number;

  @Min(0)
  @Max(24)
  @IsOptional()
  freeHoursPerDay?: number;
}
