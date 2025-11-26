/* eslint-disable max-classes-per-file */
import { Shape } from '../entities/Shape.js';

export interface Specification {
  isSatisfiedBy(shape: Shape): boolean;
  and(other: Specification): Specification;
  or(other: Specification): Specification;
  not(): Specification;
}

export abstract class BaseSpecification implements Specification {
  public abstract isSatisfiedBy(shape: Shape): boolean;

  public and(other: Specification): Specification {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return new AndSpecification(this, other);
  }

  public or(other: Specification): Specification {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return new OrSpecification(this, other);
  }

  public not(): Specification {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return new NotSpecification(this);
  }
}

class AndSpecification extends BaseSpecification {
  constructor(
    private spec1: Specification,
    private spec2: Specification,
  ) {
    super();
  }

  public isSatisfiedBy(shape: Shape): boolean {
    return this.spec1.isSatisfiedBy(shape) && this.spec2.isSatisfiedBy(shape);
  }
}

class OrSpecification extends BaseSpecification {
  constructor(
    private spec1: Specification,
    private spec2: Specification,
  ) {
    super();
  }

  public isSatisfiedBy(shape: Shape): boolean {
    return this.spec1.isSatisfiedBy(shape) || this.spec2.isSatisfiedBy(shape);
  }
}

class NotSpecification extends BaseSpecification {
  constructor(private spec: Specification) {
    super();
  }

  public isSatisfiedBy(shape: Shape): boolean {
    return !this.spec.isSatisfiedBy(shape);
  }
}
