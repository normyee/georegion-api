export class User {
  private _address?: string;
  private _coordinates?: [number, number];

  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    address?: string,
    coordinates?: [number, number],
    public regions: string[] = []
  ) {
    this._address = address;
    this._coordinates = coordinates;
    this.validate();
  }

  private validate() {
    if (!this.name) throw new Error("name is required");
    if (!this.email) throw new Error("email is required");
  }

  get address(): string | undefined {
    return this._address;
  }

  get coordinates(): [number, number] | undefined {
    return this._coordinates;
  }

  set address(value: string | undefined) {
    if (value && this._coordinates) {
      throw new Error("cannot set both address and coordinates");
    }
    this._address = value;
    this._coordinates = undefined;
  }

  set coordinates(value: [number, number] | undefined) {
    if (value && this._address) {
      throw new Error("cannot set both address and coordinates");
    }
    this._coordinates = value;
    this._address = undefined;
  }

  addRegion(regionId: string) {
    if (!this.regions.includes(regionId)) {
      this.regions.push(regionId);
    }
  }
}
