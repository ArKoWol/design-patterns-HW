import { ShapeFactory } from './ShapeFactory.js';
import { Cube } from '../entities/Cube.js';
import { Point } from '../entities/Point.js';
import { CubeValidator } from '../validators/CubeValidator.js';

export class CubeFactory extends ShapeFactory {
  private validator: CubeValidator;

  constructor() {
    super();
    this.validator = new CubeValidator();
  }

  public createShape(id: string, name: string, params: number[]): Cube {
    if (params.length !== 4) {
      throw new Error('Cube requires 4 parameters (base center x, y, z and side length)');
    }

    const baseCenter = new Point(params[0], params[1], params[2]);
    const sideLength = params[3];

    this.validator.validateCube(baseCenter, sideLength);

    return new Cube(id, name, baseCenter, sideLength);
  }

  public validateParams(params: number[]): boolean {
    if (params.length !== 4) {
      return false;
    }

    const baseCenter = new Point(params[0], params[1], params[2]);
    const sideLength = params[3];

    try {
      this.validator.validateCube(baseCenter, sideLength);
      return true;
    } catch {
      return false;
    }
  }
}
