import { ShapeObservable } from '../observers/ShapeObservable.js';

export abstract class Shape extends ShapeObservable {
  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {
    super();
  }

  public abstract getType(): string;

  protected triggerUpdate(): void {
    this.notifyObservers();
  }
}
