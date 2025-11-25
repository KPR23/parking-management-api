import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class ExitParkingDto {
  @ApiProperty({
    description: 'The license plate number of the vehicle',
    example: 'WB12345',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9]+$/, {
    message: 'Plate number must contain only uppercase letters and numbers',
  })
  @MaxLength(20)
  readonly plateNumber: string;
}
