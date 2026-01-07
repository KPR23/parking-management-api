import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCarDto {
  @ApiProperty({
    description: 'The license plate number of the vehicle',
    example: 'WB12345',
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  readonly plateNumber: string;
}
