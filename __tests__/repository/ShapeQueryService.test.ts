import { ShapeQueryService } from '../../src/repository/ShapeQueryService';
import { ShapeRepository } from '../../src/repository/ShapeRepository';
import { Triangle } from '../../src/entities/Triangle';
import { Cube } from '../../src/entities/Cube';
import { Point } from '../../src/entities/Point';
import { TypeSpecification, IdSpecification } from '../../src/specifications/ShapeSpecifications';
import { ShapeComparators } from '../../src/comparators/ShapeComparators';

describe('ShapeQueryService', () => {
  let repository: ShapeRepository;
  let queryService: ShapeQueryService;
  let triangle1: Triangle;
  let triangle2: Triangle;
  let cube1: Cube;

  beforeEach(() => {
    repository = new ShapeRepository();
    queryService = new ShapeQueryService(repository);

    triangle1 = new Triangle(
      'b',
      'Triangle2',
      new Point(5, 5, 5),
      new Point(6, 6, 6),
      new Point(7, 7, 7),
    );
    triangle2 = new Triangle(
      'a',
      'Triangle1',
      new Point(0, 0, 0),
      new Point(1, 0, 0),
      new Point(0, 1, 0),
    );
    cube1 = new Cube('c', 'Cube1', new Point(10, 10, 10), 5);

    repository.addAll([triangle1, triangle2, cube1]);
  });

  describe('query', () => {
    it('should find shapes matching specification', () => {
      const spec = new TypeSpecification('Triangle');
      const results = queryService.query(spec);

      expect(results).toHaveLength(2);
      expect(results.every((s) => s.getType() === 'Triangle')).toBe(true);
    });

    it('should return empty array when no matches', () => {
      const spec = new IdSpecification('non-existent');
      const results = queryService.query(spec);

      expect(results).toHaveLength(0);
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('queryAndSort', () => {
    it('should find and sort shapes', () => {
      const spec = new TypeSpecification('Triangle');
      const comparator = ShapeComparators.byId();
      const results = queryService.queryAndSort(spec, comparator);

      expect(results).toHaveLength(2);
      expect(results[0].id).toBe('a');
      expect(results[1].id).toBe('b');
    });
  });

  describe('sort', () => {
    it('should sort all shapes', () => {
      const comparator = ShapeComparators.byName();
      const results = queryService.sort(comparator);

      expect(results).toHaveLength(3);
      expect(results[0].name).toBe('Cube1');
      expect(results[1].name).toBe('Triangle1');
      expect(results[2].name).toBe('Triangle2');
    });
  });

  describe('findFirst', () => {
    it('should find first matching shape', () => {
      const spec = new TypeSpecification('Triangle');
      const result = queryService.findFirst(spec);

      expect(result).toBeDefined();
      expect(result?.getType()).toBe('Triangle');
    });

    it('should return undefined when no match', () => {
      const spec = new IdSpecification('non-existent');
      const result = queryService.findFirst(spec);

      expect(result).toBeUndefined();
    });
  });

  describe('count', () => {
    it('should count matching shapes', () => {
      const spec = new TypeSpecification('Triangle');
      const count = queryService.count(spec);

      expect(count).toBe(2);
    });

    it('should return 0 when no matches', () => {
      const spec = new IdSpecification('non-existent');
      const count = queryService.count(spec);

      expect(count).toBe(0);
    });
  });
});

