import { Shape } from '../entities/Shape.js';
import { Triangle } from '../entities/Triangle.js';
import { Cube } from '../entities/Cube.js';
import { Point } from '../entities/Point.js';

export type ShapeComparator = (a: Shape, b: Shape) => number;

export class ShapeComparators {
  public static byId(): ShapeComparator {
    return (a: Shape, b: Shape) => a.id.localeCompare(b.id);
  }

  public static byName(): ShapeComparator {
    return (a: Shape, b: Shape) => a.name.localeCompare(b.name);
  }

  public static byFirstPointX(): ShapeComparator {
    return (a: Shape, b: Shape) => {
      const pointA = ShapeComparators.getFirstPoint(a);
      const pointB = ShapeComparators.getFirstPoint(b);

      if (!pointA || !pointB) {
        return 0;
      }

      return pointA.x - pointB.x;
    };
  }

  public static byFirstPointY(): ShapeComparator {
    return (a: Shape, b: Shape) => {
      const pointA = ShapeComparators.getFirstPoint(a);
      const pointB = ShapeComparators.getFirstPoint(b);

      if (!pointA || !pointB) {
        return 0;
      }

      return pointA.y - pointB.y;
    };
  }

  public static byFirstPointZ(): ShapeComparator {
    return (a: Shape, b: Shape) => {
      const pointA = ShapeComparators.getFirstPoint(a);
      const pointB = ShapeComparators.getFirstPoint(b);

      if (!pointA || !pointB) {
        return 0;
      }

      return pointA.z - pointB.z;
    };
  }

  public static byDistanceFromOrigin(): ShapeComparator {
    return (a: Shape, b: Shape) => {
      const origin = new Point(0, 0, 0);
      const distanceA = ShapeComparators.getMinDistanceFromOrigin(a, origin);
      const distanceB = ShapeComparators.getMinDistanceFromOrigin(b, origin);

      return distanceA - distanceB;
    };
  }

  public static byType(): ShapeComparator {
    return (a: Shape, b: Shape) => a.getType().localeCompare(b.getType());
  }

  private static getFirstPoint(shape: Shape): Point | null {
    if (shape instanceof Triangle) {
      return shape.pointA;
    }
    if (shape instanceof Cube) {
      return shape.baseCenter;
    }
    return null;
  }

  private static getMinDistanceFromOrigin(shape: Shape, origin: Point): number {
    if (shape instanceof Triangle) {
      const distA = shape.pointA.distanceTo(origin);
      const distB = shape.pointB.distanceTo(origin);
      const distC = shape.pointC.distanceTo(origin);
      return Math.min(distA, distB, distC);
    }
    if (shape instanceof Cube) {
      return shape.baseCenter.distanceTo(origin);
    }
    return 0;
  }
}
