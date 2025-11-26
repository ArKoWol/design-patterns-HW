import { ShapeComparators } from '../../src/comparators/ShapeComparators';
import { Triangle } from '../../src/entities/Triangle';
import { Cube } from '../../src/entities/Cube';
import { Point } from '../../src/entities/Point';

describe('ShapeComparators', () => {
  let triangle1: Triangle;
  let triangle2: Triangle;
  let cube1: Cube;
  let cube2: Cube;

  beforeEach(() => {
    triangle1 = new Triangle(
      'a',
      'ZTriangle',
      new Point(1, 2, 3),
      new Point(4, 5, 6),
      new Point(7, 8, 9),
    );
    triangle2 = new Triangle(
      'b',
      'ATriangle',
      new Point(10, 11, 12),
      new Point(13, 14, 15),
      new Point(16, 17, 18),
    );
    cube1 = new Cube('c', 'YCube', new Point(5, 10, 15), 10);
    cube2 = new Cube('d', 'BCube', new Point(20, 25, 30), 5);
  });

  describe('byId', () => {
    it('should sort shapes by id', () => {
      const shapes = [triangle2, cube1, triangle1, cube2];
      const sorted = shapes.sort(ShapeComparators.byId());

      expect(sorted[0].id).toBe('a');
      expect(sorted[1].id).toBe('b');
      expect(sorted[2].id).toBe('c');
      expect(sorted[3].id).toBe('d');
    });
  });

  describe('byName', () => {
    it('should sort shapes by name', () => {
      const shapes = [triangle1, cube1, triangle2, cube2];
      const sorted = shapes.sort(ShapeComparators.byName());

      expect(sorted[0].name).toBe('ATriangle');
      expect(sorted[1].name).toBe('BCube');
      expect(sorted[2].name).toBe('YCube');
      expect(sorted[3].name).toBe('ZTriangle');
    });
  });

  describe('byFirstPointX', () => {
    it('should sort shapes by first point X coordinate', () => {
      const shapes = [triangle2, cube2, triangle1, cube1];
      const sorted = shapes.sort(ShapeComparators.byFirstPointX());

      expect(sorted[0]).toBe(triangle1);
      expect(sorted[1]).toBe(cube1);
      expect(sorted[2]).toBe(triangle2);
      expect(sorted[3]).toBe(cube2);
    });
  });

  describe('byFirstPointY', () => {
    it('should sort shapes by first point Y coordinate', () => {
      const shapes = [triangle2, cube2, triangle1, cube1];
      const sorted = shapes.sort(ShapeComparators.byFirstPointY());

      expect(sorted[0]).toBe(triangle1);
      expect(sorted[1]).toBe(cube1);
      expect(sorted[2]).toBe(triangle2);
      expect(sorted[3]).toBe(cube2);
    });
  });

  describe('byFirstPointZ', () => {
    it('should sort shapes by first point Z coordinate', () => {
      const shapes = [triangle2, cube2, triangle1, cube1];
      const sorted = shapes.sort(ShapeComparators.byFirstPointZ());

      expect(sorted[0]).toBe(triangle1);
      expect(sorted[1]).toBe(triangle2);
      expect(sorted[2]).toBe(cube1);
      expect(sorted[3]).toBe(cube2);
    });
  });

  describe('byDistanceFromOrigin', () => {
    it('should sort shapes by distance from origin', () => {
      const nearTriangle = new Triangle(
        'near',
        'Near',
        new Point(1, 1, 1),
        new Point(2, 2, 2),
        new Point(3, 3, 3),
      );
      const farTriangle = new Triangle(
        'far',
        'Far',
        new Point(10, 10, 10),
        new Point(11, 11, 11),
        new Point(12, 12, 12),
      );
      const shapes = [farTriangle, nearTriangle];
      const sorted = shapes.sort(ShapeComparators.byDistanceFromOrigin());

      expect(sorted[0]).toBe(nearTriangle);
      expect(sorted[1]).toBe(farTriangle);
    });
  });

  describe('byType', () => {
    it('should sort shapes by type', () => {
      const shapes = [triangle1, cube1, triangle2, cube2];
      const sorted = shapes.sort(ShapeComparators.byType());

      expect(sorted[0].getType()).toBe('Cube');
      expect(sorted[1].getType()).toBe('Cube');
      expect(sorted[2].getType()).toBe('Triangle');
      expect(sorted[3].getType()).toBe('Triangle');
    });
  });
});

