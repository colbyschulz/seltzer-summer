export type DistanceOption = '5k' | '10k' | '1 mile';
export interface Race {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  raceDate: string;
  timeInSeconds: number;
  distanceInMeters: number;
  raceName: string;
  user?: User;
  userId?: number;
}

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  userFullName: string;
  races?: Race[];
}
