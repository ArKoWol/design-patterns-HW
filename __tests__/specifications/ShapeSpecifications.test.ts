import {
  IdSpecification,
  NameSpecification,
  FirstQuadrantSpecification,
  AreaRangeSpecification,
  PerimeterRangeSpecification,
  VolumeRangeSpecification,
  SurfaceAreaRangeSpecification,
  DistanceFromOriginRangeSpecification,
  TypeSpecification,
} from '../../src/specifications/ShapeSpecifications';
import { Triangle } from '../../src/entities/Triangle';
import { Cube } from '../../src/entities/Cube';
import { Point } from '../../src/entities/Point';

describe('ShapeSpecifications', () => {
  let triangle: Triangle;
  let cube: Cube;

  beforeEach(() => {
    triangle = new Triangle(
      '1',
      'Triangle1',
      new Point(0, 0, 0),
      new Point(3, 0, 0),
      new Point(0, 4, 0),
    );
    cube = new Cube('2', 'Cube1', new Point(5, 5, 5), 10);
  });

  describe('IdSpecification', () => {
    it('should match shape by id', () => {
      const spec = new IdSpecification('1');

      expect(spec.isSatisfiedBy(triangle)).toBe(true);
      expect(spec.isSatisfiedBy(cube)).toBe(false);
    });
  });

  describe('NameSpecification', () => {
    it('should match shape by name', () => {
      const spec = new NameSpecification('Triangle1');

      expect(spec.isSatisfiedBy(triangle)).toBe(true);
      expect(spec.isSatisfiedBy(cube)).toBe(false);
    });
  });

  describe('FirstQuadrantSpecification', () => {
    it('should match shapes in first quadrant', () => {
      const spec = new FirstQuadrantSpecification();

      expect(spec.isSatisfiedBy(triangle)).toBe(true);
      expect(spec.isSatisfiedBy(cube)).toBe(true);
    });

    it('should not match shapes outside first quadrant', () => {
      const negativeTriangle = new Triangle(
        '3',
        'Test',
        new Point(-1, 0, 0),
        new Point(1, 0, 0),
        new Point(0, 1, 0),
      );
      const spec = new FirstQuadrantSpecification();

      expect(spec.isSatisfiedBy(negativeTriangle)).toBe(false);
    });
  });

  describe('AreaRangeSpecification', () => {
    it('should match triangle with area in range', () => {
      const spec = new AreaRangeSpecification(5, 7);

      expect(spec.isSatisfiedBy(triangle)).toBe(true);
    });

    it('should not match triangle with area outside range', () => {
      const spec = new AreaRangeSpecification(10, 20);

      expect(spec.isSatisfiedBy(triangle)).toBe(false);
    });

    it('should not match non-triangle shapes', () => {
      const spec = new AreaRangeSpecification(0, 100);

      expect(spec.isSatisfiedBy(cube)).toBe(false);
    });
  });

  describe('PerimeterRangeSpecification', () => {
    it('should match triangle with perimeter in range', () => {
      const spec = new PerimeterRangeSpecification(11, 13);

      expect(spec.isSatisfiedBy(triangle)).toBe(true);
    });

    it('should not match triangle with perimeter outside range', () => {
      const spec = new PerimeterRangeSpecification(1, 5);

      expect(spec.isSatisfiedBy(triangle)).toBe(false);
    });
  });

  describe('VolumeRangeSpecification', () => {
    it('should match cube with volume in range', () => {
      const spec = new VolumeRangeSpecification(500, 1500);

      expect(spec.isSatisfiedBy(cube)).toBe(true);
    });

    it('should not match cube with volume outside range', () => {
      const spec = new VolumeRangeSpecification(1, 100);

      expect(spec.isSatisfiedBy(cube)).toBe(false);
    });

    it('should not match non-cube shapes', () => {
      const spec = new VolumeRangeSpecification(0, 2000);

      expect(spec.isSatisfiedBy(triangle)).toBe(false);
    });
  });

  describe('SurfaceAreaRangeSpecification', () => {
    it('should match cube with surface area in range', () => {
      const spec = new SurfaceAreaRangeSpecification(500, 700);

      expect(spec.isSatisfiedBy(cube)).toBe(true);
    });

    it('should not match cube with surface area outside range', () => {
      const spec = new SurfaceAreaRangeSpecification(1, 100);

      expect(spec.isSatisfiedBy(cube)).toBe(false);
    });
  });

  describe('DistanceFromOriginRangeSpecification', () => {
    it('should match shapes within distance range', () => {
      const spec = new DistanceFromOriginRangeSpecification(0, 1);

      expect(spec.isSatisfiedBy(triangle)).toBe(true);
    });

    it('should not match shapes outside distance range', () => {
      const spec = new DistanceFromOriginRangeSpecification(10, 20);

      expect(spec.isSatisfiedBy(triangle)).toBe(false);
    });
  });

  describe('TypeSpecification', () => {
    it('should match shapes by type', () => {
      const triangleSpec = new TypeSpecification('Triangle');
      const cubeSpec = new TypeSpecification('Cube');

      expect(triangleSpec.isSatisfiedBy(triangle)).toBe(true);
      expect(triangleSpec.isSatisfiedBy(cube)).toBe(false);
      expect(cubeSpec.isSatisfiedBy(cube)).toBe(true);
      expect(cubeSpec.isSatisfiedBy(triangle)).toBe(false);
    });
  });

  describe('Composite specifications', () => {
    it('should support AND operation', () => {
      const spec1 = new TypeSpecification('Triangle');
      const spec2 = new FirstQuadrantSpecification();
      const composite = spec1.and(spec2);

      expect(composite.isSatisfiedBy(triangle)).toBe(true);
      expect(composite.isSatisfiedBy(cube)).toBe(false);
    });

    it('should support OR operation', () => {
      const spec1 = new IdSpecification('1');
      const spec2 = new IdSpecification('2');
      const composite = spec1.or(spec2);

      expect(composite.isSatisfiedBy(triangle)).toBe(true);
      expect(composite.isSatisfiedBy(cube)).toBe(true);
    });

    it('should support NOT operation', () => {
      const spec = new TypeSpecification('Triangle');
      const notSpec = spec.not();

      expect(notSpec.isSatisfiedBy(triangle)).toBe(false);
      expect(notSpec.isSatisfiedBy(cube)).toBe(true);
    });
  });
});

