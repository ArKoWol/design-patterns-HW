import { CubeValidator } from '../../src/validators/CubeValidator';
import { Point } from '../../src/entities/Point';
import { ValidationException } from '../../src/exceptions';

describe('CubeValidator', () => {
  let validator: CubeValidator;

  beforeEach(() => {
    validator = new CubeValidator();
  });

  describe('validateInputString', () => {
    it('should accept valid 4-number input', () => {
      const input = '5 5 5 10';
      
      const result = validator.validateInputString(input);
      
      expect(result).toBe(true);
      expect(typeof result).toBe('boolean');
    });

    it('should accept negative coordinates with positive side length', () => {
      const input = '-5 -5 -5 3';
      
      const result = validator.validateInputString(input);
      
      expect(result).toBe(true);
    });

    it('should accept floating point numbers', () => {
      const input = '1.5 2.5 3.5 4.0';
      
      const result = validator.validateInputString(input);
      
      expect(result).toBe(true);
    });

    it('should reject input with non-numeric characters', () => {
      const input = '2a.0 3.0 4.0 5.0';
      
      const result = validator.validateInputString(input);
      
      expect(result).toBe(false);
    });

    it('should reject input with insufficient numbers', () => {
      const input = '1.0 2.0';
      
      const result = validator.validateInputString(input);
      
      expect(result).toBe(false);
    });

    it('should reject input with too many numbers', () => {
      const input = '1 2 3 4 5';
      
      const result = validator.validateInputString(input);
      
      expect(result).toBe(false);
    });
  });

  describe('validateCube', () => {
    it('should accept valid cube parameters', () => {
      const baseCenter = new Point(5, 5, 5);
      const sideLength = 10;
      
      expect(() => validator.validateCube(baseCenter, sideLength)).not.toThrow();
    });

    it('should reject zero side length', () => {
      const baseCenter = new Point(5, 5, 5);
      const sideLength = 0;
      
      expect(() => validator.validateCube(baseCenter, sideLength)).toThrow(ValidationException);
      expect(() => validator.validateCube(baseCenter, sideLength)).toThrow('positive');
    });

    it('should reject negative side length', () => {
      const baseCenter = new Point(0, 0, 0);
      const sideLength = -1;
      
      expect(() => validator.validateCube(baseCenter, sideLength)).toThrow(ValidationException);
      expect(() => validator.validateCube(baseCenter, sideLength)).toThrow('positive');
    });

    it('should reject very small side length', () => {
      const baseCenter = new Point(0, 0, 0);
      const sideLength = 1e-15;
      
      expect(() => validator.validateCube(baseCenter, sideLength)).toThrow(ValidationException);
    });
  });

  describe('validateSurfaceArea', () => {
    it('should accept positive surface area', () => {
      expect(() => validator.validateSurfaceArea(100)).not.toThrow();
      expect(() => validator.validateSurfaceArea(0.001)).not.toThrow();
    });

    it('should reject zero surface area', () => {
      expect(() => validator.validateSurfaceArea(0)).toThrow(ValidationException);
      expect(() => validator.validateSurfaceArea(0)).toThrow('positive');
    });

    it('should reject negative surface area', () => {
      expect(() => validator.validateSurfaceArea(-100)).toThrow(ValidationException);
    });
  });

  describe('validateVolume', () => {
    it('should accept positive volume', () => {
      expect(() => validator.validateVolume(1000)).not.toThrow();
      expect(() => validator.validateVolume(0.001)).not.toThrow();
    });

    it('should reject zero volume', () => {
      expect(() => validator.validateVolume(0)).toThrow(ValidationException);
      expect(() => validator.validateVolume(0)).toThrow('positive');
    });

    it('should reject negative volume', () => {
      expect(() => validator.validateVolume(-1000)).toThrow(ValidationException);
    });
  });

  describe('validateSideLength', () => {
    it('should accept positive side length', () => {
      expect(() => validator.validateSideLength(10)).not.toThrow();
      expect(() => validator.validateSideLength(0.1)).not.toThrow();
    });

    it('should reject zero side length', () => {
      expect(() => validator.validateSideLength(0)).toThrow(ValidationException);
      expect(() => validator.validateSideLength(0)).toThrow('positive');
    });

    it('should reject negative side length', () => {
      expect(() => validator.validateSideLength(-10)).toThrow(ValidationException);
    });
  });
});

