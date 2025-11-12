import { Triangle } from '../entities/Triangle.js';
import { Point } from '../entities/Point.js';

const EPSILON = 1e-10;

export enum TriangleType {
  EQUILATERAL = 'equilateral',
  ISOSCELES = 'isosceles',
  SCALENE = 'scalene',
  RIGHT = 'right',
  ACUTE = 'acute',
  OBTUSE = 'obtuse',
}

export class TriangleService {
  public calculateArea(triangle: Triangle): number {
    const { pointA, pointB, pointC } = triangle;

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

    return magnitude / 2;
  }

  public calculatePerimeter(triangle: Triangle): number {
    const { pointA, pointB, pointC } = triangle;
    const sideAB = pointA.distanceTo(pointB);
    const sideBC = pointB.distanceTo(pointC);
    const sideCA = pointC.distanceTo(pointA);

    return sideAB + sideBC + sideCA;
  }

  public isValidTriangle(pointA: Point, pointB: Point, pointC: Point): boolean {
    if (pointA.equals(pointB) || pointB.equals(pointC) || pointA.equals(pointC)) {
      return false;
    }

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

    return magnitude >= EPSILON;
  }

  public isRightTriangle(triangle: Triangle): boolean {
    const { pointA, pointB, pointC } = triangle;
    const sides = [
      pointA.distanceTo(pointB),
      pointB.distanceTo(pointC),
      pointC.distanceTo(pointA),
    ].sort((a, b) => a - b);

    const [a, b, c] = sides;
    return Math.abs(a * a + b * b - c * c) < EPSILON;
  }

  public isIsoscelesTriangle(triangle: Triangle): boolean {
    const { pointA, pointB, pointC } = triangle;
    const sideAB = pointA.distanceTo(pointB);
    const sideBC = pointB.distanceTo(pointC);
    const sideCA = pointC.distanceTo(pointA);

    return Math.abs(sideAB - sideBC) < EPSILON
      || Math.abs(sideBC - sideCA) < EPSILON
      || Math.abs(sideCA - sideAB) < EPSILON;
  }

  public isEquilateralTriangle(triangle: Triangle): boolean {
    const { pointA, pointB, pointC } = triangle;
    const sideAB = pointA.distanceTo(pointB);
    const sideBC = pointB.distanceTo(pointC);
    const sideCA = pointC.distanceTo(pointA);

    return Math.abs(sideAB - sideBC) < EPSILON && Math.abs(sideBC - sideCA) < EPSILON;
  }

  public isAcuteTriangle(triangle: Triangle): boolean {
    const { pointA, pointB, pointC } = triangle;
    const sides = [
      pointA.distanceTo(pointB),
      pointB.distanceTo(pointC),
      pointC.distanceTo(pointA),
    ].sort((a, b) => a - b);

    const [a, b, c] = sides;
    return a * a + b * b > c * c + EPSILON;
  }

  public isObtuseTriangle(triangle: Triangle): boolean {
    const { pointA, pointB, pointC } = triangle;
    const sides = [
      pointA.distanceTo(pointB),
      pointB.distanceTo(pointC),
      pointC.distanceTo(pointA),
    ].sort((a, b) => a - b);

    const [a, b, c] = sides;
    return a * a + b * b < c * c - EPSILON;
  }

  public getTriangleTypes(triangle: Triangle): TriangleType[] {
    const types: TriangleType[] = [];

    if (this.isEquilateralTriangle(triangle)) {
      types.push(TriangleType.EQUILATERAL);
    } else if (this.isIsoscelesTriangle(triangle)) {
      types.push(TriangleType.ISOSCELES);
    } else {
      types.push(TriangleType.SCALENE);
    }

    if (this.isRightTriangle(triangle)) {
      types.push(TriangleType.RIGHT);
    } else if (this.isAcuteTriangle(triangle)) {
      types.push(TriangleType.ACUTE);
    } else if (this.isObtuseTriangle(triangle)) {
      types.push(TriangleType.OBTUSE);
    }

    return types;
  }
}
