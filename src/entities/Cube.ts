import { Shape } from './Shape.js';
import { Point } from './Point.js';

export class Cube extends Shape {
  private internalBaseCenter: Point;

  private internalSideLength: number;

  constructor(
    id: string,
    name: string,
    baseCenter: Point,
    sideLength: number,
  ) {
    super(id, name);
    this.internalBaseCenter = baseCenter;
    this.internalSideLength = sideLength;
  }

  public get baseCenter(): Point {
    return this.internalBaseCenter;
  }

  public get sideLength(): number {
    return this.internalSideLength;
  }

  public setBaseCenter(point: Point): void {
    this.internalBaseCenter = point;
    this.triggerUpdate();
  }

  public setSideLength(length: number): void {
    this.internalSideLength = length;
    this.triggerUpdate();
  }

  public getType(): string {
    return 'Cube';
  }
}
