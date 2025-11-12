import { CubeService, CoordinatePlane } from '../../src/services/CubeService';
import { Cube } from '../../src/entities/Cube';
import { Point } from '../../src/entities/Point';

describe('CubeService', () => {
  let service: CubeService;

  beforeEach(() => {
    service = new CubeService();
  });

  describe('calculateSurfaceArea', () => {
    it('should calculate surface area correctly', () => {
      const cube = new Cube('1', 'Test', new Point(5, 5, 5), 10);
      
      const area = service.calculateSurfaceArea(cube);
      
      expect(area).toBe(600);
      expect(area).toBeGreaterThan(0);
      expect(typeof area).toBe('number');
    });

    it('should handle small cubes', () => {
      const cube = new Cube('2', 'Test', new Point(0, 0, 0), 1);
      
      const area = service.calculateSurfaceArea(cube);
      
      expect(area).toBe(6);
      expect(area).toBeGreaterThan(0);
    });

    it('should handle fractional side lengths', () => {
      const cube = new Cube('3', 'Test', new Point(1.5, 2.5, 3.5), 4.0);
      
      const area = service.calculateSurfaceArea(cube);
      
      expect(area).toBeCloseTo(96, 10);
      expect(area).toBeGreaterThan(95);
    });
  });

  describe('calculateVolume', () => {
    it('should calculate volume correctly', () => {
      const cube = new Cube('1', 'Test', new Point(5, 5, 5), 10);
      
      const volume = service.calculateVolume(cube);
      
      expect(volume).toBe(1000);
      expect(volume).toBeGreaterThan(0);
      expect(typeof volume).toBe('number');
    });

    it('should handle small cubes', () => {
      const cube = new Cube('2', 'Test', new Point(0, 0, 0), 1);
      
      const volume = service.calculateVolume(cube);
      
      expect(volume).toBe(1);
      expect(volume).toBeGreaterThan(0);
    });

    it('should handle fractional side lengths', () => {
      const cube = new Cube('3', 'Test', new Point(10, 10, 10), 5.5);
      
      const volume = service.calculateVolume(cube);
      
      expect(volume).toBeCloseTo(166.375, 5);
      expect(volume).toBeGreaterThan(166);
    });
  });

  describe('isValidCube', () => {
    it('should return true for valid cube parameters', () => {
      const result = service.isValidCube(new Point(5, 5, 5), 10);
      
      expect(result).toBe(true);
      expect(typeof result).toBe('boolean');
    });

    it('should return false for zero side length', () => {
      const result = service.isValidCube(new Point(0, 0, 0), 0);
      
      expect(result).toBe(false);
    });

    it('should return false for very small side length', () => {
      const result = service.isValidCube(new Point(0, 0, 0), 1e-15);
      
      expect(result).toBe(false);
    });
  });

  describe('isBaseOnCoordinatePlane', () => {
    it('should detect base on XY plane', () => {
      const cube = new Cube('1', 'Test', new Point(5, 5, 5), 10);
      
      const result = service.isBaseOnCoordinatePlane(cube);
      
      expect(result.isOnPlane).toBe(true);
      expect(result.plane).toBe(CoordinatePlane.XY);
    });

    it('should detect base on XZ plane', () => {
      const cube = new Cube('2', 'Test', new Point(5, 2.5, 5), 5);
      
      const result = service.isBaseOnCoordinatePlane(cube);
      
      expect(result.isOnPlane).toBe(true);
      expect(result.plane).toBe(CoordinatePlane.XZ);
    });

    it('should detect base on YZ plane', () => {
      const cube = new Cube('3', 'Test', new Point(1, 5, 5), 2);
      
      const result = service.isBaseOnCoordinatePlane(cube);
      
      expect(result.isOnPlane).toBe(true);
      expect(result.plane).toBe(CoordinatePlane.YZ);
    });

    it('should return false when base is not on coordinate plane', () => {
      const cube = new Cube('4', 'Test', new Point(10, 10, 10), 5);
      
      const result = service.isBaseOnCoordinatePlane(cube);
      
      expect(result.isOnPlane).toBe(false);
      expect(result.plane).toBe(null);
    });
  });

  describe('calculateVolumeRatioByPlane', () => {
    it('should calculate volume ratio for XY plane', () => {
      const cube = new Cube('1', 'Test', new Point(0, 0, 0), 10);
      
      const ratio = service.calculateVolumeRatioByPlane(cube, CoordinatePlane.XY);
      
      expect(ratio).not.toBe(null);
      expect(ratio?.plane).toBe(CoordinatePlane.XY);
      expect(ratio?.lowerVolume).toBeCloseTo(ratio!.upperVolume, 1);
    });

    it('should return null when plane does not intersect', () => {
      const cube = new Cube('2', 'Test', new Point(10, 10, 10), 2);
      
      const ratio = service.calculateVolumeRatioByPlane(cube, CoordinatePlane.XY);
      
      expect(ratio).toBe(null);
    });

    it('should calculate correct ratios for asymmetric intersection', () => {
      const cube = new Cube('3', 'Test', new Point(0, 0, 2), 10);
      
      const ratio = service.calculateVolumeRatioByPlane(cube, CoordinatePlane.XY);
      
      expect(ratio).not.toBe(null);
      expect(ratio?.lowerVolume).toBeGreaterThan(0);
      expect(ratio?.upperVolume).toBeGreaterThan(0);
    });
  });

  describe('getAllVolumeRatios', () => {
    it('should calculate ratios for all intersecting planes', () => {
      const cube = new Cube('1', 'Test', new Point(0, 0, 0), 10);
      
      const ratios = service.getAllVolumeRatios(cube);
      
      expect(Array.isArray(ratios)).toBe(true);
      expect(ratios.length).toBeGreaterThan(0);
      expect(ratios.length).toBeLessThanOrEqual(3);
    });

    it('should return empty array for cube not intersecting origin planes', () => {
      const cube = new Cube('2', 'Test', new Point(20, 20, 20), 2);
      
      const ratios = service.getAllVolumeRatios(cube);
      
      expect(Array.isArray(ratios)).toBe(true);
      expect(ratios.length).toBe(0);
    });
  });

  describe('doesPlaneIntersectCube', () => {
    it('should detect XY plane intersection', () => {
      const cube = new Cube('1', 'Test', new Point(5, 5, 5), 10);
      
      const result = service.doesPlaneIntersectCube(cube, CoordinatePlane.XY);
      
      expect(result).toBe(true);
      expect(typeof result).toBe('boolean');
    });

    it('should detect no intersection', () => {
      const cube = new Cube('2', 'Test', new Point(20, 20, 20), 2);
      
      const result = service.doesPlaneIntersectCube(cube, CoordinatePlane.XY);
      
      expect(result).toBe(false);
    });

    it('should detect YZ plane intersection', () => {
      const cube = new Cube('3', 'Test', new Point(5, 10, 10), 10);
      
      const result = service.doesPlaneIntersectCube(cube, CoordinatePlane.YZ);
      
      expect(result).toBe(true);
    });
  });
});

