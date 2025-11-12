export class Point {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly z: number = 0,
  ) {}

  public distanceTo(other: Point): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const dz = this.z - other.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  public equals(other: Point): boolean {
    const EPSILON = 1e-10;
    return Math.abs(this.x - other.x) < EPSILON
      && Math.abs(this.y - other.y) < EPSILON
      && Math.abs(this.z - other.z) < EPSILON;
  }
}
