import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CameraDto {
  @ApiProperty({
    description: 'The ID of the gate',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  gateId: number;

  @ApiProperty({
    description: 'The license plate number of the vehicle',
    example: 'WB12345',
  })
  @IsString()
  @IsNotEmpty()
  plateNumber: string;
}
