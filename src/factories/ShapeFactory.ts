import { Shape } from '../entities/Shape.js';

export abstract class ShapeFactory {
  public abstract createShape(id: string, name: string, params: number[]): Shape;

  public abstract validateParams(params: number[]): boolean;
}
