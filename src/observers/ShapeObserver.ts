import { Shape } from '../entities/Shape.js';

export interface ShapeObserver {
  update(shape: Shape): void;
}
