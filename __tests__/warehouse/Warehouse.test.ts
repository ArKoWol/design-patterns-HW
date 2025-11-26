import { Warehouse } from '../../src/warehouse/Warehouse';
import { Triangle } from '../../src/entities/Triangle';
import { Cube } from '../../src/entities/Cube';
import { Point } from '../../src/entities/Point';

describe('Warehouse', () => {
  let warehouse: Warehouse;

  beforeEach(() => {
    warehouse = Warehouse.getInstance();
    warehouse.clear();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = Warehouse.getInstance();
      const instance2 = Warehouse.getInstance();

      expect(instance1).toBe(instance2);
      expect(instance1).toBe(warehouse);
    });
  });

  describe('Observer pattern', () => {
    it('should calculate and store triangle metrics on update', () => {
      const triangle = new Triangle(
        '1',
        'Test',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0),
      );

      warehouse.update(triangle);

      const metrics = warehouse.getMetrics('1');
      expect(metrics).toBeDefined();
      expect(metrics?.area).toBeCloseTo(6, 5);
      expect(metrics?.perimeter).toBeCloseTo(12, 5);
    });

    it('should calculate and store cube metrics on update', () => {
      const cube = new Cube('2', 'Test', new Point(5, 5, 5), 10);

      warehouse.update(cube);

      const metrics = warehouse.getMetrics('2');
      expect(metrics).toBeDefined();
      expect(metrics?.volume).toBe(1000);
      expect(metrics?.surfaceArea).toBe(600);
    });

    it('should update metrics when shape changes', () => {
      const triangle = new Triangle(
        '1',
        'Test',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0),
      );

      triangle.addObserver(warehouse);
      warehouse.update(triangle);

      const initialMetrics = warehouse.getMetrics('1');
      expect(initialMetrics?.area).toBeCloseTo(6, 5);

      triangle.setPointC(new Point(0, 8, 0));

      const updatedMetrics = warehouse.getMetrics('1');
      expect(updatedMetrics?.area).toBeCloseTo(12, 5);
      expect(updatedMetrics?.perimeter).toBeGreaterThan(12);
    });
  });

  describe('getMetrics', () => {
    it('should return undefined for non-existent shape', () => {
      const metrics = warehouse.getMetrics('non-existent');

      expect(metrics).toBeUndefined();
    });
  });

  describe('hasMetrics', () => {
    it('should return true for existing metrics', () => {
      const triangle = new Triangle(
        '1',
        'Test',
        new Point(0, 0, 0),
        new Point(1, 0, 0),
        new Point(0, 1, 0),
      );
      warehouse.update(triangle);

      expect(warehouse.hasMetrics('1')).toBe(true);
    });

    it('should return false for non-existing metrics', () => {
      expect(warehouse.hasMetrics('non-existent')).toBe(false);
    });
  });

  describe('removeMetrics', () => {
    it('should remove metrics successfully', () => {
      const triangle = new Triangle(
        '1',
        'Test',
        new Point(0, 0, 0),
        new Point(1, 0, 0),
        new Point(0, 1, 0),
      );
      warehouse.update(triangle);

      expect(warehouse.hasMetrics('1')).toBe(true);
      const removed = warehouse.removeMetrics('1');

      expect(removed).toBe(true);
      expect(warehouse.hasMetrics('1')).toBe(false);
    });

    it('should return false when removing non-existent metrics', () => {
      const removed = warehouse.removeMetrics('non-existent');

      expect(removed).toBe(false);
    });
  });

  describe('getAllMetrics', () => {
    it('should return all stored metrics', () => {
      const triangle = new Triangle(
        '1',
        'Test',
        new Point(0, 0, 0),
        new Point(1, 0, 0),
        new Point(0, 1, 0),
      );
      const cube = new Cube('2', 'Test', new Point(0, 0, 0), 5);

      warehouse.update(triangle);
      warehouse.update(cube);

      const allMetrics = warehouse.getAllMetrics();

      expect(allMetrics.size).toBe(2);
      expect(allMetrics.has('1')).toBe(true);
      expect(allMetrics.has('2')).toBe(true);
    });
  });

  describe('getMetricsCount', () => {
    it('should return correct count', () => {
      expect(warehouse.getMetricsCount()).toBe(0);

      const triangle = new Triangle(
        '1',
        'Test',
        new Point(0, 0, 0),
        new Point(1, 0, 0),
        new Point(0, 1, 0),
      );
      warehouse.update(triangle);

      expect(warehouse.getMetricsCount()).toBe(1);
    });
  });
});

