import { TriangleValidator } from '../../src/validators/TriangleValidator';
import { Point } from '../../src/entities/Point';
import { ValidationException } from '../../src/exceptions';

describe('TriangleValidator', () => {
  let validator: TriangleValidator;

  beforeEach(() => {
    validator = new TriangleValidator();
  });

  describe('validateInputString', () => {
    it('should accept valid 9-number input', () => {
      const input = '0 0 0 1 0 0 0 1 0';
      
      const result = validator.validateInputString(input);
      
      expect(result).toBe(true);
      expect(typeof result).toBe('boolean');
    });

    it('should accept negative numbers', () => {
      const input = '-1 -2 -3 4 5 6 7 8 9';
      
      const result = validator.validateInputString(input);
      
      expect(result).toBe(true);
    });

    it('should accept floating point numbers', () => {
      const input = '1.5 2.5 3.5 4.5 5.5 6.5 7.5 8.5 9.5';
      
      const result = validator.validateInputString(input);
      
      expect(result).toBe(true);
    });

    it('should reject input with non-numeric characters', () => {
      const input = '2a.0 3.0 4.0 5.0 6.0 7.0 8.0 9.0 10.0';
      
      const result = validator.validateInputString(input);
      
      expect(result).toBe(false);
    });

    it('should reject input with insufficient numbers', () => {
      const input = '1.0 2.0';
      
      const result = validator.validateInputString(input);
      
      expect(result).toBe(false);
    });

    it('should reject input with too many numbers', () => {
      const input = '1 2 3 4 5 6 7 8 9 10';
      
      const result = validator.validateInputString(input);
      
      expect(result).toBe(false);
    });
  });

  describe('validateTriangle', () => {
    it('should accept valid triangle points', () => {
      const pointA = new Point(0, 0, 0);
      const pointB = new Point(1, 0, 0);
      const pointC = new Point(0, 1, 0);
      
      expect(() => validator.validateTriangle(pointA, pointB, pointC)).not.toThrow();
    });

    it('should reject collinear points', () => {
      const pointA = new Point(0, 0, 0);
      const pointB = new Point(1, 0, 0);
      const pointC = new Point(2, 0, 0);
      
      expect(() => validator.validateTriangle(pointA, pointB, pointC)).toThrow(ValidationException);
      expect(() => validator.validateTriangle(pointA, pointB, pointC)).toThrow('collinear');
    });

    it('should reject duplicate points', () => {
      const pointA = new Point(0, 0, 0);
      const pointB = new Point(0, 0, 0);
      const pointC = new Point(1, 1, 1);
      
      expect(() => validator.validateTriangle(pointA, pointB, pointC)).toThrow(ValidationException);
      expect(() => validator.validateTriangle(pointA, pointB, pointC)).toThrow('distinct');
    });
  });

  describe('validateArea', () => {
    it('should accept positive area', () => {
      expect(() => validator.validateArea(10)).not.toThrow();
      expect(() => validator.validateArea(0.001)).not.toThrow();
    });

    it('should reject negative area', () => {
      expect(() => validator.validateArea(-10)).toThrow(ValidationException);
      expect(() => validator.validateArea(-10)).toThrow('negative');
    });

    it('should reject zero area', () => {
      expect(() => validator.validateArea(0)).toThrow(ValidationException);
      expect(() => validator.validateArea(0)).toThrow('zero');
    });
  });

  describe('validatePerimeter', () => {
    it('should accept positive perimeter', () => {
      expect(() => validator.validatePerimeter(10)).not.toThrow();
      expect(() => validator.validatePerimeter(0.001)).not.toThrow();
    });

    it('should reject zero perimeter', () => {
      expect(() => validator.validatePerimeter(0)).toThrow(ValidationException);
      expect(() => validator.validatePerimeter(0)).toThrow('positive');
    });

    it('should reject negative perimeter', () => {
      expect(() => validator.validatePerimeter(-10)).toThrow(ValidationException);
    });
  });
});

