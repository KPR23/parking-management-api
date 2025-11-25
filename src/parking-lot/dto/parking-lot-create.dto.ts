import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'The name of the parking lot',
    example: 'Central Parking',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly name: string;

  @ApiProperty({
    description: 'The location of the parking lot',
    example: '123 Main St, New York, NY',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  readonly location?: string;

  @ApiProperty({
    description: 'Total number of parking spots',
    example: 100,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  readonly totalSpots: number;

  @ApiProperty({
    description: 'Price per hour in PLN',
    example: 5.0,
    required: false,
    default: 5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  readonly pricePerHour?: number;

  @ApiProperty({
    description: 'Number of free hours per day',
    example: 2,
    required: false,
    default: 2,
  })
  @Min(0)
  @Max(24)
  readonly freeHoursPerDay?: number;
}
