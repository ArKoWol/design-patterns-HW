import { Point } from '../entities/Point.js';
import { ValidationException } from '../exceptions/index.js';

const NUMBER_PATTERN = /^-?\d+\.?\d*$/;
const EPSILON = 1e-10;

export class CubeValidator {
  public validateInputString(input: string): boolean {
    const parts = input.trim().split(/\s+/);

    if (parts.length !== 4) {
      return false;
    }

    return parts.every((part) => NUMBER_PATTERN.test(part));
  }

  public validateCube(_baseCenter: Point, sideLength: number): void {
    if (sideLength <= 0) {
      throw new ValidationException('Cube side length must be positive');
    }

    if (sideLength < EPSILON) {
      throw new ValidationException('Cube side length is too small');
    }
  }

  public validateSurfaceArea(area: number): void {
    if (area <= 0) {
      throw new ValidationException('Cube surface area must be positive');
    }
  }

  public validateVolume(volume: number): void {
    if (volume <= 0) {
      throw new ValidationException('Cube volume must be positive');
    }
  }

  public validateSideLength(sideLength: number): void {
    if (sideLength <= 0) {
      throw new ValidationException('Side length must be positive');
    }
  }
}
