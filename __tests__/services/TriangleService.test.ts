import { TriangleService, TriangleType } from '../../src/services/TriangleService';
import { Triangle } from '../../src/entities/Triangle';
import { Point } from '../../src/entities/Point';

describe('TriangleService', () => {
  let service: TriangleService;

  beforeEach(() => {
    service = new TriangleService();
  });

  describe('calculateArea', () => {
    it('should calculate area of right triangle', () => {
      const triangle = new Triangle(
        '1',
        'Test',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0),
      );
      
      const area = service.calculateArea(triangle);
      
      expect(area).toBeCloseTo(6, 10);
      expect(area).toBeGreaterThan(5.99);
      expect(area).toBeLessThan(6.01);
    });

    it('should calculate area of equilateral triangle', () => {
      const triangle = new Triangle(
        '2',
        'Test',
        new Point(0, 0, 0),
        new Point(1, 0, 0),
        new Point(0.5, Math.sqrt(3) / 2, 0),
      );
      
      const area = service.calculateArea(triangle);
      
      expect(area).toBeCloseTo(Math.sqrt(3) / 4, 5);
      expect(area).toBeGreaterThan(0.43);
    });

    it('should handle 3D triangles', () => {
      const triangle = new Triangle(
        '3',
        'Test',
        new Point(1, 1, 1),
        new Point(2, 2, 2),
        new Point(3, 3, 4),
      );
      
      const area = service.calculateArea(triangle);
      
      expect(area).toBeGreaterThan(0);
      expect(typeof area).toBe('number');
      expect(isNaN(area)).toBe(false);
    });
  });

  describe('calculatePerimeter', () => {
    it('should calculate perimeter correctly', () => {
      const triangle = new Triangle(
        '1',
        'Test',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0),
      );
      
      const perimeter = service.calculatePerimeter(triangle);
      
      expect(perimeter).toBeCloseTo(12, 10);
      expect(perimeter).toBeGreaterThan(11.99);
      expect(perimeter).toBeLessThan(12.01);
    });

    it('should calculate perimeter of equilateral triangle', () => {
      const triangle = new Triangle(
        '2',
        'Test',
        new Point(0, 0, 0),
        new Point(1, 0, 0),
        new Point(0, 1, 0),
      );
      
      const perimeter = service.calculatePerimeter(triangle);
      
      expect(perimeter).toBeCloseTo(2 + Math.sqrt(2), 10);
      expect(perimeter).toBeGreaterThan(3.4);
    });
  });

  describe('isValidTriangle', () => {
    it('should return true for valid triangle', () => {
      const result = service.isValidTriangle(
        new Point(0, 0, 0),
        new Point(1, 0, 0),
        new Point(0, 1, 0),
      );
      
      expect(result).toBe(true);
      expect(typeof result).toBe('boolean');
    });

    it('should return false for collinear points', () => {
      const result = service.isValidTriangle(
        new Point(0, 0, 0),
        new Point(1, 0, 0),
        new Point(2, 0, 0),
      );
      
      expect(result).toBe(false);
    });

    it('should return false for duplicate points', () => {
      const result = service.isValidTriangle(
        new Point(0, 0, 0),
        new Point(0, 0, 0),
        new Point(1, 1, 1),
      );
      
      expect(result).toBe(false);
    });
  });

  describe('isRightTriangle', () => {
    it('should return true for right triangle', () => {
      const triangle = new Triangle(
        '1',
        'Test',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0),
      );
      
      const result = service.isRightTriangle(triangle);
      
      expect(result).toBe(true);
    });

    it('should return false for non-right triangle', () => {
      const triangle = new Triangle(
        '2',
        'Test',
        new Point(0, 0, 0),
        new Point(2, 0, 0),
        new Point(1, 2, 0),
      );
      
      const result = service.isRightTriangle(triangle);
      
      expect(result).toBe(false);
    });
  });

  describe('isIsoscelesTriangle', () => {
    it('should return true for isosceles triangle', () => {
      const triangle = new Triangle(
        '1',
        'Test',
        new Point(0, 0, 0),
        new Point(2, 0, 0),
        new Point(1, 1, 0),
      );
      
      const result = service.isIsoscelesTriangle(triangle);
      
      expect(result).toBe(true);
    });

    it('should return false for scalene triangle', () => {
      const triangle = new Triangle(
        '2',
        'Test',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0),
      );
      
      const result = service.isIsoscelesTriangle(triangle);
      
      expect(result).toBe(false);
    });
  });

  describe('isEquilateralTriangle', () => {
    it('should return true for equilateral triangle', () => {
      const triangle = new Triangle(
        '1',
        'Test',
        new Point(0, 0, 0),
        new Point(1, 0, 0),
        new Point(0.5, Math.sqrt(3) / 2, 0),
      );
      
      const result = service.isEquilateralTriangle(triangle);
      
      expect(result).toBe(true);
    });

    it('should return false for non-equilateral triangle', () => {
      const triangle = new Triangle(
        '2',
        'Test',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0),
      );
      
      const result = service.isEquilateralTriangle(triangle);
      
      expect(result).toBe(false);
    });
  });

  describe('isAcuteTriangle', () => {
    it('should return true for acute triangle', () => {
      const triangle = new Triangle(
        '1',
        'Test',
        new Point(0, 0, 0),
        new Point(2, 0, 0),
        new Point(1, 1.5, 0),
      );
      
      const result = service.isAcuteTriangle(triangle);
      
      expect(result).toBe(true);
    });

    it('should return false for right triangle', () => {
      const triangle = new Triangle(
        '2',
        'Test',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0),
      );
      
      const result = service.isAcuteTriangle(triangle);
      
      expect(result).toBe(false);
    });
  });

  describe('isObtuseTriangle', () => {
    it('should return true for obtuse triangle', () => {
      const triangle = new Triangle(
        '1',
        'Test',
        new Point(0, 0, 0),
        new Point(5, 0, 0),
        new Point(1, 1, 0),
      );
      
      const result = service.isObtuseTriangle(triangle);
      
      expect(result).toBe(true);
    });

    it('should return false for acute triangle', () => {
      const triangle = new Triangle(
        '2',
        'Test',
        new Point(0, 0, 0),
        new Point(2, 0, 0),
        new Point(1, 1.5, 0),
      );
      
      const result = service.isObtuseTriangle(triangle);
      
      expect(result).toBe(false);
    });
  });

  describe('getTriangleTypes', () => {
    it('should identify right isosceles triangle', () => {
      const triangle = new Triangle(
        '1',
        'Test',
        new Point(0, 0, 0),
        new Point(1, 0, 0),
        new Point(0, 1, 0),
      );
      
      const types = service.getTriangleTypes(triangle);
      
      expect(types).toContain(TriangleType.ISOSCELES);
      expect(types).toContain(TriangleType.RIGHT);
      expect(types.length).toBeGreaterThan(1);
    });

    it('should identify equilateral acute triangle', () => {
      const triangle = new Triangle(
        '2',
        'Test',
        new Point(0, 0, 0),
        new Point(1, 0, 0),
        new Point(0.5, Math.sqrt(3) / 2, 0),
      );
      
      const types = service.getTriangleTypes(triangle);
      
      expect(types).toContain(TriangleType.EQUILATERAL);
      expect(types).toContain(TriangleType.ACUTE);
      expect(types.length).toBe(2);
    });
  });
});

