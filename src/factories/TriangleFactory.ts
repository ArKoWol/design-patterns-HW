import { ShapeFactory } from './ShapeFactory.js';
import { Triangle } from '../entities/Triangle.js';
import { Point } from '../entities/Point.js';
import { TriangleValidator } from '../validators/TriangleValidator.js';

export class TriangleFactory extends ShapeFactory {
  private validator: TriangleValidator;

  constructor() {
    super();
    this.validator = new TriangleValidator();
  }

  public createShape(id: string, name: string, params: number[]): Triangle {
    if (params.length !== 9) {
      throw new Error('Triangle requires 9 parameters (3 points with x, y, z coordinates)');
    }

    const pointA = new Point(params[0], params[1], params[2]);
    const pointB = new Point(params[3], params[4], params[5]);
    const pointC = new Point(params[6], params[7], params[8]);

    this.validator.validateTriangle(pointA, pointB, pointC);

    return new Triangle(id, name, pointA, pointB, pointC);
  }

  public validateParams(params: number[]): boolean {
    if (params.length !== 9) {
      return false;
    }

    const pointA = new Point(params[0], params[1], params[2]);
    const pointB = new Point(params[3], params[4], params[5]);
    const pointC = new Point(params[6], params[7], params[8]);

    try {
      this.validator.validateTriangle(pointA, pointB, pointC);
      return true;
    } catch {
      return false;
    }
  }
}
