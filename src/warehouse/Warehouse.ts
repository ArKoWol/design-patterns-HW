import { Shape } from '../entities/Shape.js';
import { Triangle } from '../entities/Triangle.js';
import { Cube } from '../entities/Cube.js';
import { ShapeObserver } from '../observers/ShapeObserver.js';
import { ShapeMetrics } from './ShapeMetrics.js';
import { TriangleService } from '../services/TriangleService.js';
import { CubeService } from '../services/CubeService.js';
import { logger } from '../utils/logger.js';

export class Warehouse implements ShapeObserver {
  private static instance: Warehouse;

  private metrics: Map<string, ShapeMetrics> = new Map();

  private triangleService: TriangleService = new TriangleService();

  private cubeService: CubeService = new CubeService();

  private constructor() {
    logger.info('Warehouse instance created');
  }

  public static getInstance(): Warehouse {
    if (!Warehouse.instance) {
      Warehouse.instance = new Warehouse();
    }
    return Warehouse.instance;
  }

  public update(shape: Shape): void {
    this.calculateAndStore(shape);
    logger.debug(`Warehouse updated metrics for shape ${shape.id}`);
  }

  private calculateAndStore(shape: Shape): void {
    const shapeMetrics: ShapeMetrics = {};

    if (shape instanceof Triangle) {
      shapeMetrics.area = this.triangleService.calculateArea(shape);
      shapeMetrics.perimeter = this.triangleService.calculatePerimeter(shape);
    } else if (shape instanceof Cube) {
      shapeMetrics.volume = this.cubeService.calculateVolume(shape);
      shapeMetrics.surfaceArea = this.cubeService.calculateSurfaceArea(shape);
    }

    this.metrics.set(shape.id, shapeMetrics);
  }

  public getMetrics(shapeId: string): ShapeMetrics | undefined {
    return this.metrics.get(shapeId);
  }

  public getAllMetrics(): Map<string, ShapeMetrics> {
    return new Map(this.metrics);
  }

  public hasMetrics(shapeId: string): boolean {
    return this.metrics.has(shapeId);
  }

  public removeMetrics(shapeId: string): boolean {
    return this.metrics.delete(shapeId);
  }

  public clear(): void {
    this.metrics.clear();
  }

  public getMetricsCount(): number {
    return this.metrics.size;
  }
}
