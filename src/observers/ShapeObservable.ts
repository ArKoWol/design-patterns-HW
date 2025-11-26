import { ShapeObserver } from './ShapeObserver.js';

export abstract class ShapeObservable {
  private observers: ShapeObserver[] = [];

  public addObserver(observer: ShapeObserver): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  public removeObserver(observer: ShapeObserver): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  protected notifyObservers(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.observers.forEach((observer) => observer.update(this as any));
  }
}
