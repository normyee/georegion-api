export class Region {
  private _id: string;
  private _name: string;
  private _userId: string;
  private _coordinates: { type: string; coordinates: number[][][] };

  constructor(
    id: string,
    name: string,
    userId: string,
    coordinates: number[][][]
  ) {
    this._id = id;
    this._name = name;
    this._userId = userId;
    this._coordinates = {
      type: "Polygon",
      coordinates: coordinates,
    };
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("region name cannot be empty");
    }
    this._name = value;
  }

  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
  }

  get coordinates(): { type: string; coordinates: number[][][] } {
    return this._coordinates;
  }

  set coordinates(value: number[][][]) {
    this._coordinates = {
      type: "Polygon",
      coordinates: value,
    };
  }
}
