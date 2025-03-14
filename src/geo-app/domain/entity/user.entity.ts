import { GeoCoordinates } from "../../../shared/types";

export class User {
  private _address?: string;
  private _coordinates?: GeoCoordinates;

  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    address?: string,
    coordinates?: GeoCoordinates,
    public regions: string[] = [],
  ) {
    this._address = address;
    this._coordinates = coordinates;
  }

  get address(): string | undefined {
    return this._address;
  }

  get coordinates(): GeoCoordinates | undefined {
    return this._coordinates;
  }

  set address(value: string | undefined) {
    this._address = value;
  }

  set coordinates(value: [number, number] | undefined) {
    this._coordinates = value;
  }

  addRegion(regionId: string) {
    if (!this.regions.includes(regionId)) {
      this.regions.push(regionId);
    }
  }
}
