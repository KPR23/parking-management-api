import { IsNotEmpty, IsString } from 'class-validator';

export class CreateExitDto {
  @IsString()
  @IsNotEmpty()
  plateNumber: string;
}
