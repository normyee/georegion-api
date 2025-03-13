export interface RegionDTO {
  id?: string;
  name: string;
  userId: string;
  geometry: { type: string; coordinates: number[][][] };
}
