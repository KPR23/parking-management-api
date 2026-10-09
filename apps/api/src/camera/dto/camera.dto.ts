import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CameraDto {
  @IsInt()
  @IsNotEmpty()
  gateId: number;

  @IsString()
  @IsNotEmpty()
  plateNumber: string;
}
