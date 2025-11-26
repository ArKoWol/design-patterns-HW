import { ShapeRepository } from '../../src/repository/ShapeRepository';
import { Triangle } from '../../src/entities/Triangle';
import { Cube } from '../../src/entities/Cube';
import { Point } from '../../src/entities/Point';

describe('ShapeRepository', () => {
  let repository: ShapeRepository;
  let triangle: Triangle;
  let cube: Cube;

  beforeEach(() => {
    repository = new ShapeRepository();
    triangle = new Triangle(
      '1',
      'Triangle1',
      new Point(0, 0, 0),
      new Point(1, 0, 0),
      new Point(0, 1, 0),
    );
    cube = new Cube('2', 'Cube1', new Point(5, 5, 5), 10);
  });

  describe('add', () => {
    it('should add shape to repository', () => {
      repository.add(triangle);

      expect(repository.count()).toBe(1);
      expect(repository.exists('1')).toBe(true);
    });

    it('should replace shape with same id', () => {
      repository.add(triangle);
      const newTriangle = new Triangle(
        '1',
        'NewTriangle',
        new Point(0, 0, 0),
        new Point(2, 0, 0),
        new Point(0, 2, 0),
      );
      repository.add(newTriangle);

      expect(repository.count()).toBe(1);
      const found = repository.findById('1');
      expect(found?.name).toBe('NewTriangle');
    });
  });

  describe('addAll', () => {
    it('should add multiple shapes', () => {
      repository.addAll([triangle, cube]);

      expect(repository.count()).toBe(2);
      expect(repository.exists('1')).toBe(true);
      expect(repository.exists('2')).toBe(true);
    });
  });

  describe('remove', () => {
    it('should remove existing shape', () => {
      repository.add(triangle);
      const removed = repository.remove('1');

      expect(removed).toBe(true);
      expect(repository.count()).toBe(0);
      expect(repository.exists('1')).toBe(false);
    });

    it('should return false for non-existing shape', () => {
      const removed = repository.remove('non-existent');

      expect(removed).toBe(false);
    });
  });

  describe('findById', () => {
    it('should find existing shape', () => {
      repository.add(triangle);
      const found = repository.findById('1');

      expect(found).toBeDefined();
      expect(found?.id).toBe('1');
      expect(found?.name).toBe('Triangle1');
    });

    it('should return undefined for non-existing shape', () => {
      const found = repository.findById('non-existent');

      expect(found).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return all shapes', () => {
      repository.addAll([triangle, cube]);
      const all = repository.findAll();

      expect(all).toHaveLength(2);
      expect(all.some((s) => s.id === '1')).toBe(true);
      expect(all.some((s) => s.id === '2')).toBe(true);
    });

    it('should return empty array when empty', () => {
      const all = repository.findAll();

      expect(all).toHaveLength(0);
      expect(Array.isArray(all)).toBe(true);
    });
  });

  describe('exists', () => {
    it('should return true for existing shape', () => {
      repository.add(triangle);

      expect(repository.exists('1')).toBe(true);
    });

    it('should return false for non-existing shape', () => {
      expect(repository.exists('non-existent')).toBe(false);
    });
  });

  describe('count', () => {
    it('should return correct count', () => {
      expect(repository.count()).toBe(0);

      repository.add(triangle);
      expect(repository.count()).toBe(1);

      repository.add(cube);
      expect(repository.count()).toBe(2);

      repository.remove('1');
      expect(repository.count()).toBe(1);
    });
  });

  describe('clear', () => {
    it('should remove all shapes', () => {
      repository.addAll([triangle, cube]);
      expect(repository.count()).toBe(2);

      repository.clear();

      expect(repository.count()).toBe(0);
      expect(repository.findAll()).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update existing shape', () => {
      repository.add(triangle);
      const updatedTriangle = new Triangle(
        '1',
        'UpdatedTriangle',
        new Point(0, 0, 0),
        new Point(2, 0, 0),
        new Point(0, 2, 0),
      );

      const updated = repository.update(updatedTriangle);

      expect(updated).toBe(true);
      const found = repository.findById('1');
      expect(found?.name).toBe('UpdatedTriangle');
    });

    it('should return false for non-existing shape', () => {
      const updated = repository.update(triangle);

      expect(updated).toBe(false);
    });
  });
});

