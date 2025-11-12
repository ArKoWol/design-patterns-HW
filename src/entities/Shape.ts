export abstract class Shape {
  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {}

  public abstract getType(): string;
}
