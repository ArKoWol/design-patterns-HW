import { Shape } from '../entities/Shape.js';
import { logger } from '../utils/logger.js';

export class ShapeRepository {
  private shapes: Map<string, Shape> = new Map();

  public add(shape: Shape): void {
    this.shapes.set(shape.id, shape);
    logger.debug(`Added shape ${shape.id} to repository`);
  }

  public addAll(shapesArray: Shape[]): void {
    shapesArray.forEach((shape) => this.add(shape));
  }

  public remove(id: string): boolean {
    const result = this.shapes.delete(id);
    if (result) {
      logger.debug(`Removed shape ${id} from repository`);
    }
    return result;
  }

  public findById(id: string): Shape | undefined {
    return this.shapes.get(id);
  }

  public findAll(): Shape[] {
    return Array.from(this.shapes.values());
  }

  public exists(id: string): boolean {
    return this.shapes.has(id);
  }

  public count(): number {
    return this.shapes.size;
  }

  public clear(): void {
    this.shapes.clear();
    logger.debug('Repository cleared');
  }

  public update(shape: Shape): boolean {
    if (this.shapes.has(shape.id)) {
      this.shapes.set(shape.id, shape);
      logger.debug(`Updated shape ${shape.id} in repository`);
      return true;
    }
    return false;
  }
}
