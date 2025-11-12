import { TriangleFactory } from '../../src/factories/TriangleFactory';
import { Triangle } from '../../src/entities/Triangle';

describe('TriangleFactory', () => {
  let factory: TriangleFactory;

  beforeEach(() => {
    factory = new TriangleFactory();
  });

  describe('createShape', () => {
    it('should create valid triangle from correct parameters', () => {
      const params = [0, 0, 0, 1, 0, 0, 0, 1, 0];
      
      const triangle = factory.createShape('1', 'TestTriangle', params);
      
      expect(triangle).toBeInstanceOf(Triangle);
      expect(triangle.id).toBe('1');
      expect(triangle.name).toBe('TestTriangle');
      expect(triangle.getType()).toBe('Triangle');
    });

    it('should throw error for incorrect number of parameters', () => {
      const params = [0, 0, 0, 1, 0, 0];
      
      expect(() => factory.createShape('1', 'Test', params)).toThrow();
      expect(() => factory.createShape('1', 'Test', params)).toThrow('9 parameters');
    });

    it('should throw error for collinear points', () => {
      const params = [0, 0, 0, 1, 0, 0, 2, 0, 0];
      
      expect(() => factory.createShape('1', 'Test', params)).toThrow();
      expect(() => factory.createShape('1', 'Test', params)).toThrow('collinear');
    });

    it('should create triangle with 3D coordinates', () => {
      const params = [1, 1, 1, 2, 2, 2, 3, 3, 4];
      
      const triangle = factory.createShape('2', 'Test3D', params);
      
      expect(triangle).toBeInstanceOf(Triangle);
      expect(triangle.pointA.z).toBe(1);
      expect(triangle.pointB.z).toBe(2);
    });
  });

  describe('validateParams', () => {
    it('should return true for valid parameters', () => {
      const params = [0, 0, 0, 1, 0, 0, 0, 1, 0];
      
      const result = factory.validateParams(params);
      
      expect(result).toBe(true);
      expect(typeof result).toBe('boolean');
    });

    it('should return false for wrong number of parameters', () => {
      const params = [0, 0, 0, 1, 0, 0];
      
      const result = factory.validateParams(params);
      
      expect(result).toBe(false);
    });

    it('should return false for collinear points', () => {
      const params = [0, 0, 0, 1, 0, 0, 2, 0, 0];
      
      const result = factory.validateParams(params);
      
      expect(result).toBe(false);
    });

    it('should return false for duplicate points', () => {
      const params = [0, 0, 0, 0, 0, 0, 1, 1, 1];
      
      const result = factory.validateParams(params);
      
      expect(result).toBe(false);
    });
  });
});

