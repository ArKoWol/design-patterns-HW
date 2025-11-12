import { Point } from '../../src/entities/Point';

describe('Point', () => {
  describe('constructor', () => {
    it('should create a 2D point with z=0 by default', () => {
      const point = new Point(1, 2);
      
      expect(point.x).toBe(1);
      expect(point.y).toBe(2);
      expect(point.z).toBe(0);
    });

    it('should create a 3D point with explicit z coordinate', () => {
      const point = new Point(1, 2, 3);
      
      expect(point.x).toBe(1);
      expect(point.y).toBe(2);
      expect(point.z).toBe(3);
    });

    it('should handle negative coordinates', () => {
      const point = new Point(-1, -2, -3);
      
      expect(point.x).toBe(-1);
      expect(point.y).toBe(-2);
      expect(point.z).toBe(-3);
    });
  });

  describe('distanceTo', () => {
    it('should calculate distance between two 2D points', () => {
      const pointA = new Point(0, 0);
      const pointB = new Point(3, 4);
      
      const distance = pointA.distanceTo(pointB);
      
      expect(distance).toBeCloseTo(5, 10);
      expect(distance).toBeGreaterThan(4.99);
      expect(distance).toBeLessThan(5.01);
    });

    it('should calculate distance between two 3D points', () => {
      const pointA = new Point(0, 0, 0);
      const pointB = new Point(1, 1, 1);
      
      const distance = pointA.distanceTo(pointB);
      
      expect(distance).toBeCloseTo(Math.sqrt(3), 10);
      expect(distance).toBeGreaterThan(1.73);
    });

    it('should return zero for identical points', () => {
      const pointA = new Point(5, 5, 5);
      const pointB = new Point(5, 5, 5);
      
      const distance = pointA.distanceTo(pointB);
      
      expect(distance).toBeCloseTo(0, 10);
      expect(distance).toBeLessThan(1e-10);
    });
  });

  describe('equals', () => {
    it('should return true for identical points', () => {
      const pointA = new Point(1, 2, 3);
      const pointB = new Point(1, 2, 3);
      
      expect(pointA.equals(pointB)).toBe(true);
      expect(pointB.equals(pointA)).toBe(true);
    });

    it('should return false for different points', () => {
      const pointA = new Point(1, 2, 3);
      const pointB = new Point(4, 5, 6);
      
      expect(pointA.equals(pointB)).toBe(false);
      expect(pointB.equals(pointA)).toBe(false);
    });

    it('should handle floating point precision', () => {
      const pointA = new Point(1.00000000001, 2.00000000001, 3.00000000001);
      const pointB = new Point(1, 2, 3);
      
      expect(pointA.equals(pointB)).toBe(true);
    });
  });
});

