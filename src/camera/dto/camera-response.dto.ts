export type EntryAction = 'ENTRY_ALLOWED' | 'ENTRY_BLOCKED';

export class CameraEntryResponseDto {
  action: EntryAction;
  ticketId?: number;
  parkingLotId?: number;
  reason?: string;
}
