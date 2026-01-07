import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ExitParkingLotDto {
  @ApiProperty({
    description: 'The plate number of the car exiting the parking lot.',
    example: 'ABC12345',
  })
  @IsString()
  @IsNotEmpty()
  plateNumber: string;
}
