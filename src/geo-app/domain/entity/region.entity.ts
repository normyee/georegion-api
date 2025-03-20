import { RegionNameError } from "../common/errors";

export class Region {
  private _id: string;
  private _name: string;
  private _userId: string;
  private _geometry: { type: string; coordinates: number[][][] };

  constructor(
    id: string,
    name: string,
    userId: string,
    geometry: { type: string; coordinates: number[][][] },
  ) {
    this._id = id;
    this._name = name;
    this._userId = userId;
    this._geometry = geometry;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    if (!value || value.trim().length === 0) {
      throw new RegionNameError();
    }
    this._name = value;
  }

  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
  }

  get geometry(): { type: string; coordinates: number[][][] } {
    return this._geometry;
  }

  set geometry(value: { type: string; coordinates: number[][][] }) {
    this._geometry = value;
  }
}
