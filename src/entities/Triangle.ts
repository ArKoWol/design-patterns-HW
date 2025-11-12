import { Shape } from './Shape.js';
import { Point } from './Point.js';

export class Triangle extends Shape {
  constructor(
    id: string,
    name: string,
    public readonly pointA: Point,
    public readonly pointB: Point,
    public readonly pointC: Point,
  ) {
    super(id, name);
  }

  public getType(): string {
    return 'Triangle';
  }
}
