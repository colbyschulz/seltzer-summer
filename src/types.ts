export type DistanceOption = '5k' | '10k' | '1 mile';

export interface TableRecordFields {
  distance: string;
  name: string;
  time: number;
  raceName: string;
  date: string;
}
export interface TableRecord {
  createdTime?: string;
  fields: TableRecordFields;
  id?: string;
}
