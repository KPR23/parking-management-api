export type EntryAction =
  | 'ENTRY_ALLOWED'
  | 'ENTRY_BLOCKED'
  | 'EXIT_ALLOWED'
  | 'EXIT_BLOCKED';

export class CameraEntryResponseDto {
  action: EntryAction;
  ticketId?: number;
  parkingLotId?: number;
  reason?: string;
  totalAmount?: number;
}
