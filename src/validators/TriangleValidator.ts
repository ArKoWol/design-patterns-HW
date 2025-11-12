import { Point } from '../entities/Point.js';
import { ValidationException } from '../exceptions/index.js';

const NUMBER_PATTERN = /^-?\d+\.?\d*$/;
const EPSILON = 1e-10;

export class TriangleValidator {
  public validateInputString(input: string): boolean {
    const parts = input.trim().split(/\s+/);

    if (parts.length !== 9) {
      return false;
    }

    return parts.every((part) => NUMBER_PATTERN.test(part));
  }

  public validateTriangle(pointA: Point, pointB: Point, pointC: Point): void {
    if (!this.arePointsDistinct(pointA, pointB, pointC)) {
      throw new ValidationException('Triangle points must be distinct');
    }

    if (this.arePointsCollinear(pointA, pointB, pointC)) {
      throw new ValidationException('Triangle points cannot be collinear');
    }
  }

  public validateArea(area: number): void {
    if (area < 0) {
      throw new ValidationException('Triangle area cannot be negative');
    }
    if (Math.abs(area) < EPSILON) {
      throw new ValidationException('Triangle area cannot be zero');
    }
  }

  public validatePerimeter(perimeter: number): void {
    if (perimeter <= 0) {
      throw new ValidationException('Triangle perimeter must be positive');
    }
  }

  private arePointsDistinct(pointA: Point, pointB: Point, pointC: Point): boolean {
    return !pointA.equals(pointB) && !pointB.equals(pointC) && !pointA.equals(pointC);
  }

  private arePointsCollinear(pointA: Point, pointB: Point, pointC: Point): boolean {
    const vectorAB = {
      x: pointB.x - pointA.x,
      y: pointB.y - pointA.y,
      z: pointB.z - pointA.z,
    };

    const vectorAC = {
      x: pointC.x - pointA.x,
      y: pointC.y - pointA.y,
      z: pointC.z - pointA.z,
    };

    const crossProduct = {
      x: vectorAB.y * vectorAC.z - vectorAB.z * vectorAC.y,
      y: vectorAB.z * vectorAC.x - vectorAB.x * vectorAC.z,
      z: vectorAB.x * vectorAC.y - vectorAB.y * vectorAC.x,
    };

    const magnitude = Math.sqrt(
      crossProduct.x * crossProduct.x
      + crossProduct.y * crossProduct.y
      + crossProduct.z * crossProduct.z,
    );

    return magnitude < EPSILON;
  }
}
