import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  readonly plateNumber: string;
}
