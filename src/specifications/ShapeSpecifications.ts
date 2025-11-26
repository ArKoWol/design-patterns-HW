/* eslint-disable max-classes-per-file */
import { Shape } from '../entities/Shape.js';
import { Triangle } from '../entities/Triangle.js';
import { Cube } from '../entities/Cube.js';
import { BaseSpecification } from './Specification.js';
import { Point } from '../entities/Point.js';
import { TriangleService } from '../services/TriangleService.js';
import { CubeService } from '../services/CubeService.js';

export class IdSpecification extends BaseSpecification {
  constructor(private id: string) {
    super();
  }

  public isSatisfiedBy(shape: Shape): boolean {
    return shape.id === this.id;
  }
}

export class NameSpecification extends BaseSpecification {
  constructor(private name: string) {
    super();
  }

  public isSatisfiedBy(shape: Shape): boolean {
    return shape.name === this.name;
  }
}

export class FirstQuadrantSpecification extends BaseSpecification {
  public isSatisfiedBy(shape: Shape): boolean {
    if (shape instanceof Triangle) {
      return this.isPointInFirstQuadrant(shape.pointA)
        && this.isPointInFirstQuadrant(shape.pointB)
        && this.isPointInFirstQuadrant(shape.pointC);
    }
    if (shape instanceof Cube) {
      return this.isPointInFirstQuadrant(shape.baseCenter);
    }
    return false;
  }

  private isPointInFirstQuadrant(point: Point): boolean {
    return point.x >= 0 && point.y >= 0 && point.z >= 0;
  }
}

export class AreaRangeSpecification extends BaseSpecification {
  private triangleService: TriangleService = new TriangleService();

  constructor(
    private minArea: number,
    private maxArea: number,
  ) {
    super();
  }

  public isSatisfiedBy(shape: Shape): boolean {
    if (shape instanceof Triangle) {
      const area = this.triangleService.calculateArea(shape);
      return area >= this.minArea && area <= this.maxArea;
    }
    return false;
  }
}

export class PerimeterRangeSpecification extends BaseSpecification {
  private triangleService: TriangleService = new TriangleService();

  constructor(
    private minPerimeter: number,
    private maxPerimeter: number,
  ) {
    super();
  }

  public isSatisfiedBy(shape: Shape): boolean {
    if (shape instanceof Triangle) {
      const perimeter = this.triangleService.calculatePerimeter(shape);
      return perimeter >= this.minPerimeter && perimeter <= this.maxPerimeter;
    }
    return false;
  }
}

export class VolumeRangeSpecification extends BaseSpecification {
  private cubeService: CubeService = new CubeService();

  constructor(
    private minVolume: number,
    private maxVolume: number,
  ) {
    super();
  }

  public isSatisfiedBy(shape: Shape): boolean {
    if (shape instanceof Cube) {
      const volume = this.cubeService.calculateVolume(shape);
      return volume >= this.minVolume && volume <= this.maxVolume;
    }
    return false;
  }
}

export class SurfaceAreaRangeSpecification extends BaseSpecification {
  private cubeService: CubeService = new CubeService();

  constructor(
    private minArea: number,
    private maxArea: number,
  ) {
    super();
  }

  public isSatisfiedBy(shape: Shape): boolean {
    if (shape instanceof Cube) {
      const surfaceArea = this.cubeService.calculateSurfaceArea(shape);
      return surfaceArea >= this.minArea && surfaceArea <= this.maxArea;
    }
    return false;
  }
}

export class DistanceFromOriginRangeSpecification extends BaseSpecification {
  constructor(
    private minDistance: number,
    private maxDistance: number,
  ) {
    super();
  }

  public isSatisfiedBy(shape: Shape): boolean {
    const origin = new Point(0, 0, 0);
    let distance: number;

    if (shape instanceof Triangle) {
      const distA = shape.pointA.distanceTo(origin);
      const distB = shape.pointB.distanceTo(origin);
      const distC = shape.pointC.distanceTo(origin);
      distance = Math.min(distA, distB, distC);
    } else if (shape instanceof Cube) {
      distance = shape.baseCenter.distanceTo(origin);
    } else {
      return false;
    }

    return distance >= this.minDistance && distance <= this.maxDistance;
  }
}

export class TypeSpecification extends BaseSpecification {
  constructor(private shapeType: string) {
    super();
  }

  public isSatisfiedBy(shape: Shape): boolean {
    return shape.getType() === this.shapeType;
  }
}
