import { Shape } from './Shape.js';
import { Point } from './Point.js';

export class Cube extends Shape {
  constructor(
    id: string,
    name: string,
    public readonly baseCenter: Point,
    public readonly sideLength: number,
  ) {
    super(id, name);
  }

  public getType(): string {
    return 'Cube';
  }
}
