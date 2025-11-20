import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class EntryParkingDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9]+$/, {
    message: 'Plate number must contain only uppercase letters and numbers',
  })
  @MaxLength(20)
  readonly plateNumber: string;

  @IsNotEmpty()
  readonly parkingLotId: number;
}
