export type DistanceOption = '5k' | '10k' | '1 mile';

export interface TableRecord {
  createdTime?: string;
  fields: {
    distance: string;
    name: string;
    time: string;
    raceName: string;
    date: string;
  };
  id?: string;
}
