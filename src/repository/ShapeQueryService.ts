import { Shape } from '../entities/Shape.js';
import { ShapeRepository } from './ShapeRepository.js';
import { Specification } from '../specifications/Specification.js';
import { ShapeComparator } from '../comparators/ShapeComparators.js';

export class ShapeQueryService {
  constructor(private repository: ShapeRepository) {}

  public query(specification: Specification): Shape[] {
    return this.repository.findAll().filter((shape) => specification.isSatisfiedBy(shape));
  }

  public queryAndSort(specification: Specification, comparator: ShapeComparator): Shape[] {
    return this.query(specification).sort(comparator);
  }

  public sort(comparator: ShapeComparator): Shape[] {
    return this.repository.findAll().sort(comparator);
  }

  public findFirst(specification: Specification): Shape | undefined {
    return this.repository.findAll().find((shape) => specification.isSatisfiedBy(shape));
  }

  public count(specification: Specification): number {
    return this.query(specification).length;
  }
}
