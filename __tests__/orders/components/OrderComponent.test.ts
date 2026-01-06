import { OrderItem } from '../../../src/orders/components/OrderItem';
import { OrderBundle } from '../../../src/orders/components/OrderBundle';

describe('Composite Pattern - Order Components', () => {
  describe('OrderItem (Leaf)', () => {
    it('should create a simple order item', () => {
      const item = new OrderItem('PROD001', 'Laptop', 999.99, 2);

      expect(item.getProductId()).toBe('PROD001');
      expect(item.getName()).toBe('Laptop');
      expect(item.getPrice()).toBe(999.99);
      expect(item.getQuantity()).toBe(2);
    });

    it('should calculate total price correctly', () => {
      const item = new OrderItem('PROD001', 'Mouse', 25.50, 3);

      expect(item.getTotalPrice()).toBe(76.50);
    });

    it('should generate correct description', () => {
      const item = new OrderItem('PROD001', 'Keyboard', 89.99, 1);
      const description = item.getDescription();

      expect(description).toContain('Keyboard');
      expect(description).toContain('x1');
      expect(description).toContain('89.99');
    });

    it('should not be a composite', () => {
      const item = new OrderItem('PROD001', 'Monitor', 299.99, 1);

      expect(item.isComposite()).toBe(false);
    });
  });

  describe('OrderBundle (Composite)', () => {
    it('should create an empty bundle', () => {
      const bundle = new OrderBundle('Starter Pack', 0.10);

      expect(bundle.getName()).toBe('Starter Pack');
      expect(bundle.getDiscount()).toBe(0.10);
      expect(bundle.getChildren()).toHaveLength(0);
      expect(bundle.getTotalPrice()).toBe(0);
    });

    it('should add and remove items from bundle', () => {
      const bundle = new OrderBundle('Gaming Bundle');
      const item1 = new OrderItem('PROD001', 'Mouse', 29.99, 1);
      const item2 = new OrderItem('PROD002', 'Keyboard', 79.99, 1);

      bundle.add(item1);
      bundle.add(item2);

      expect(bundle.getChildren()).toHaveLength(2);

      bundle.remove(item1);

      expect(bundle.getChildren()).toHaveLength(1);
    });

    it('should calculate total price without discount', () => {
      const bundle = new OrderBundle('Basic Bundle', 0);
      const item1 = new OrderItem('PROD001', 'Mouse', 30.00, 1);
      const item2 = new OrderItem('PROD002', 'Keyboard', 70.00, 1);

      bundle.add(item1);
      bundle.add(item2);

      expect(bundle.getTotalPrice()).toBe(100.00);
    });

    it('should apply discount correctly', () => {
      const bundle = new OrderBundle('Discounted Bundle', 0.20); // 20% discount
      const item1 = new OrderItem('PROD001', 'Item1', 50.00, 1);
      const item2 = new OrderItem('PROD002', 'Item2', 50.00, 1);

      bundle.add(item1);
      bundle.add(item2);

      // Total: 100, Discount: 20, Final: 80
      expect(bundle.getTotalPrice()).toBe(80.00);
    });

    it('should be identified as composite', () => {
      const bundle = new OrderBundle('Test Bundle');

      expect(bundle.isComposite()).toBe(true);
    });

    it('should generate description with all items', () => {
      const bundle = new OrderBundle('Test Bundle', 0.10);
      const item1 = new OrderItem('PROD001', 'Item1', 10.00, 1);
      const item2 = new OrderItem('PROD002', 'Item2', 20.00, 1);

      bundle.add(item1);
      bundle.add(item2);

      const description = bundle.getDescription();

      expect(description).toContain('Test Bundle');
      expect(description).toContain('10% discount');
      expect(description).toContain('Item1');
      expect(description).toContain('Item2');
    });

    it('should support nested bundles', () => {
      const innerBundle = new OrderBundle('Inner Bundle', 0.05);
      const item1 = new OrderItem('PROD001', 'Item1', 100.00, 1);
      innerBundle.add(item1);

      const outerBundle = new OrderBundle('Outer Bundle', 0.10);
      const item2 = new OrderItem('PROD002', 'Item2', 50.00, 1);
      
      outerBundle.add(innerBundle);
      outerBundle.add(item2);

      // Inner bundle: 100 - 5% = 95
      // Outer bundle: (95 + 50) - 10% = 145 - 14.5 = 130.5
      expect(outerBundle.getTotalPrice()).toBeCloseTo(130.5, 2);
    });

    it('should handle multiple quantities in bundle', () => {
      const bundle = new OrderBundle('Multi-Item Bundle', 0);
      const item1 = new OrderItem('PROD001', 'Pen', 2.00, 5);
      const item2 = new OrderItem('PROD002', 'Notebook', 5.00, 3);

      bundle.add(item1);
      bundle.add(item2);

      // (2*5) + (5*3) = 10 + 15 = 25
      expect(bundle.getTotalPrice()).toBe(25.00);
    });
  });

  describe('Composite Pattern Integration', () => {
    it('should treat items and bundles uniformly', () => {
      const item = new OrderItem('PROD001', 'Simple Item', 10.00, 1);
      const bundle = new OrderBundle('Bundle', 0);
      bundle.add(new OrderItem('PROD002', 'Bundled Item', 10.00, 1));

      // Both implement same interface
      expect(item.getTotalPrice()).toBe(10.00);
      expect(bundle.getTotalPrice()).toBe(10.00);
      expect(item.getName()).toBeDefined();
      expect(bundle.getName()).toBeDefined();
    });

    it('should calculate complex nested structure correctly', () => {
      // Create a complex order structure
      const laptop = new OrderItem('PROD001', 'Laptop', 1000.00, 1);
      const mouse = new OrderItem('PROD002', 'Mouse', 50.00, 1);
      const keyboard = new OrderItem('PROD003', 'Keyboard', 100.00, 1);

      const accessoryBundle = new OrderBundle('Accessories', 0.15);
      accessoryBundle.add(mouse);
      accessoryBundle.add(keyboard);

      const gamingBundle = new OrderBundle('Gaming Setup', 0.10);
      gamingBundle.add(laptop);
      gamingBundle.add(accessoryBundle);

      // Accessories: (50 + 100) * 0.85 = 127.5
      // Gaming: (1000 + 127.5) * 0.90 = 1014.75
      expect(gamingBundle.getTotalPrice()).toBeCloseTo(1014.75, 2);
    });
  });
});

