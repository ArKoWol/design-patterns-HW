import { Shape } from './Shape.js';
import { Point } from './Point.js';

export class Triangle extends Shape {
  private internalPointA: Point;

  private internalPointB: Point;

  private internalPointC: Point;

  constructor(
    id: string,
    name: string,
    pointA: Point,
    pointB: Point,
    pointC: Point,
  ) {
    super(id, name);
    this.internalPointA = pointA;
    this.internalPointB = pointB;
    this.internalPointC = pointC;
  }

  public get pointA(): Point {
    return this.internalPointA;
  }

  public get pointB(): Point {
    return this.internalPointB;
  }

  public get pointC(): Point {
    return this.internalPointC;
  }

  public setPointA(point: Point): void {
    this.internalPointA = point;
    this.triggerUpdate();
  }

  public setPointB(point: Point): void {
    this.internalPointB = point;
    this.triggerUpdate();
  }

  public setPointC(point: Point): void {
    this.internalPointC = point;
    this.triggerUpdate();
  }

  public getType(): string {
    return 'Triangle';
  }
}
