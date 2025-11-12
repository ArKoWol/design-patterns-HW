import { CubeFactory } from '../../src/factories/CubeFactory';
import { Cube } from '../../src/entities/Cube';

describe('CubeFactory', () => {
  let factory: CubeFactory;

  beforeEach(() => {
    factory = new CubeFactory();
  });

  describe('createShape', () => {
    it('should create valid cube from correct parameters', () => {
      const params = [5, 5, 5, 10];
      
      const cube = factory.createShape('1', 'TestCube', params);
      
      expect(cube).toBeInstanceOf(Cube);
      expect(cube.id).toBe('1');
      expect(cube.name).toBe('TestCube');
      expect(cube.getType()).toBe('Cube');
      expect(cube.sideLength).toBe(10);
    });

    it('should throw error for incorrect number of parameters', () => {
      const params = [5, 5, 5];
      
      expect(() => factory.createShape('1', 'Test', params)).toThrow();
      expect(() => factory.createShape('1', 'Test', params)).toThrow('4 parameters');
    });

    it('should throw error for negative side length', () => {
      const params = [0, 0, 0, -1];
      
      expect(() => factory.createShape('1', 'Test', params)).toThrow();
      expect(() => factory.createShape('1', 'Test', params)).toThrow('positive');
    });

    it('should throw error for zero side length', () => {
      const params = [5, 5, 5, 0];
      
      expect(() => factory.createShape('1', 'Test', params)).toThrow();
    });

    it('should create cube with fractional values', () => {
      const params = [1.5, 2.5, 3.5, 4.0];
      
      const cube = factory.createShape('2', 'TestFractional', params);
      
      expect(cube).toBeInstanceOf(Cube);
      expect(cube.baseCenter.x).toBe(1.5);
      expect(cube.sideLength).toBe(4.0);
    });
  });

  describe('validateParams', () => {
    it('should return true for valid parameters', () => {
      const params = [5, 5, 5, 10];
      
      const result = factory.validateParams(params);
      
      expect(result).toBe(true);
      expect(typeof result).toBe('boolean');
    });

    it('should return false for wrong number of parameters', () => {
      const params = [5, 5, 5];
      
      const result = factory.validateParams(params);
      
      expect(result).toBe(false);
    });

    it('should return false for negative side length', () => {
      const params = [0, 0, 0, -1];
      
      const result = factory.validateParams(params);
      
      expect(result).toBe(false);
    });

    it('should return false for zero side length', () => {
      const params = [5, 5, 5, 0];
      
      const result = factory.validateParams(params);
      
      expect(result).toBe(false);
    });

    it('should return true for fractional valid parameters', () => {
      const params = [1.5, 2.5, 3.5, 4.0];
      
      const result = factory.validateParams(params);
      
      expect(result).toBe(true);
    });
  });
});

