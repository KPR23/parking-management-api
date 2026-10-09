import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateParkingLotDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly name: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  readonly location?: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly totalSpots: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  readonly pricePerHour?: number;

  @Min(0)
  @Max(24)
  readonly freeHoursPerDay?: number;
}
