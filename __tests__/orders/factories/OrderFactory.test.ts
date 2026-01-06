import { StandardOrderFactory } from '../../../src/orders/factories/StandardOrderFactory';
import { ExpressOrderFactory } from '../../../src/orders/factories/ExpressOrderFactory';
import { InternationalOrderFactory } from '../../../src/orders/factories/InternationalOrderFactory';
import { OrderItem } from '../../../src/orders/components/OrderItem';
import { OrderBundle } from '../../../src/orders/components/OrderBundle';
import { StandardProcessingStrategy } from '../../../src/orders/strategies/StandardProcessingStrategy';
import { ExpressProcessingStrategy } from '../../../src/orders/strategies/ExpressProcessingStrategy';
import { InternationalProcessingStrategy } from '../../../src/orders/strategies/InternationalProcessingStrategy';

describe('Factory Method Pattern - Order Factories', () => {
  const createTestComponents = () => [
    new OrderItem('PROD001', 'Test Item', 100.00, 1),
  ];

  describe('StandardOrderFactory', () => {
    let factory: StandardOrderFactory;

    beforeEach(() => {
      factory = new StandardOrderFactory();
    });

    it('should create a standard order', () => {
      const components = createTestComponents();
      const strategy = new StandardProcessingStrategy();

      const order = factory.createOrder('ORD-001', 'CUST-001', components, strategy);

      expect(order).toBeDefined();
      expect(order.getId()).toBe('ORD-001');
      expect(order.getCustomerId()).toBe('CUST-001');
      expect(order.getComponents()).toHaveLength(1);
    });

    it('should have correct factory name', () => {
      expect(factory.getFactoryName()).toBe('Standard Order Factory');
    });

    it('should set order to non-priority', () => {
      const components = createTestComponents();
      const strategy = new StandardProcessingStrategy();

      const order = factory.createOrder('ORD-001', 'CUST-001', components, strategy);

      expect(order.isPriority()).toBe(false);
    });

    it('should set order to non-international', () => {
      const components = createTestComponents();
      const strategy = new StandardProcessingStrategy();

      const order = factory.createOrder('ORD-001', 'CUST-001', components, strategy);

      expect(order.isInternational()).toBe(false);
    });

    it('should throw error for invalid parameters', () => {
      const strategy = new StandardProcessingStrategy();

      expect(() => {
        factory.createOrder('', 'CUST-001', [], strategy);
      }).toThrow('Invalid order parameters');
    });

    it('should throw error when strategy cannot process', () => {
      const components = [new OrderItem('PROD001', 'Item', 10000.00, 1)];
      const strategy = new ExpressProcessingStrategy(); // Cannot process orders over $5000

      expect(() => {
        factory.createOrder('ORD-001', 'CUST-001', components, strategy);
      }).toThrow('Strategy');
    });

    it('should create order with bundles', () => {
      const bundle = new OrderBundle('Test Bundle', 0.10);
      bundle.add(new OrderItem('PROD001', 'Item', 50.00, 1));

      const strategy = new StandardProcessingStrategy();
      const order = factory.createOrder('ORD-001', 'CUST-001', [bundle], strategy);

      expect(order.getComponents()).toHaveLength(1);
      expect(order.getComponents()[0].isComposite()).toBe(true);
    });
  });

  describe('ExpressOrderFactory', () => {
    let factory: ExpressOrderFactory;

    beforeEach(() => {
      factory = new ExpressOrderFactory();
    });

    it('should create an express order', () => {
      const components = createTestComponents();
      const strategy = new ExpressProcessingStrategy();

      const order = factory.createOrder('ORD-002', 'CUST-002', components, strategy);

      expect(order).toBeDefined();
      expect(order.getId()).toBe('ORD-002');
      expect(order.getCustomerId()).toBe('CUST-002');
    });

    it('should have correct factory name', () => {
      expect(factory.getFactoryName()).toBe('Express Order Factory');
    });

    it('should set order to priority', () => {
      const components = createTestComponents();
      const strategy = new ExpressProcessingStrategy();

      const order = factory.createOrder('ORD-002', 'CUST-002', components, strategy);

      expect(order.isPriority()).toBe(true);
    });

    it('should use express strategy', () => {
      const components = createTestComponents();
      const strategy = new ExpressProcessingStrategy();

      const order = factory.createOrder('ORD-002', 'CUST-002', components, strategy);

      expect(order.getProcessingStrategy().getStrategyName()).toContain('Express');
    });

    it('should handle standard strategy and convert to express', () => {
      const components = createTestComponents();
      const strategy = new StandardProcessingStrategy();

      const order = factory.createOrder('ORD-002', 'CUST-002', components, strategy);

      // Factory should use express strategy
      expect(order.getProcessingStrategy().getStrategyName()).toContain('Express');
    });

    it('should calculate correct total with express fees', () => {
      const components = [new OrderItem('PROD001', 'Item', 100.00, 1)];
      const strategy = new ExpressProcessingStrategy();

      const order = factory.createOrder('ORD-002', 'CUST-002', components, strategy);

      const total = order.getTotalAmount();
      // 100 + shipping (15% = 15) + processing fee (9.99) = 124.99
      expect(total).toBeCloseTo(124.99, 2);
    });
  });

  describe('InternationalOrderFactory', () => {
    it('should create international order with default country', () => {
      const factory = new InternationalOrderFactory('Canada');
      const components = [new OrderItem('PROD001', 'Item', 200.00, 1)];
      const strategy = new InternationalProcessingStrategy('Canada');

      const order = factory.createOrder('ORD-003', 'CUST-003', components, strategy);

      expect(order).toBeDefined();
      expect(order.isInternational()).toBe(true);
    });

    it('should have correct factory name', () => {
      const factory = new InternationalOrderFactory();
      
      expect(factory.getFactoryName()).toBe('International Order Factory');
    });

    it('should store default country', () => {
      const factory = new InternationalOrderFactory('Japan');
      
      expect(factory.getDefaultCountry()).toBe('Japan');
    });

    it('should set order to international', () => {
      const factory = new InternationalOrderFactory('Germany');
      const components = [new OrderItem('PROD001', 'Item', 200.00, 1)];
      const strategy = new InternationalProcessingStrategy('Germany');

      const order = factory.createOrder('ORD-003', 'CUST-003', components, strategy);

      expect(order.isInternational()).toBe(true);
    });

    it('should use international strategy', () => {
      const factory = new InternationalOrderFactory('UK');
      const components = [new OrderItem('PROD001', 'Item', 200.00, 1)];
      const strategy = new InternationalProcessingStrategy('UK');

      const order = factory.createOrder('ORD-003', 'CUST-003', components, strategy);

      expect(order.getProcessingStrategy().getStrategyName()).toContain('International');
    });

    it('should handle standard strategy and convert to international', () => {
      const factory = new InternationalOrderFactory('France');
      const components = [new OrderItem('PROD001', 'Item', 200.00, 1)];
      const strategy = new StandardProcessingStrategy();

      const order = factory.createOrder('ORD-003', 'CUST-003', components, strategy);

      // Factory should use international strategy with default country
      expect(order.getProcessingStrategy().getStrategyName()).toContain('International');
      expect(order.getProcessingStrategy().getStrategyName()).toContain('France');
    });

    it('should calculate correct total with international fees', () => {
      const factory = new InternationalOrderFactory('Australia');
      const components = [new OrderItem('PROD001', 'Item', 200.00, 1)];
      const strategy = new InternationalProcessingStrategy('Australia');

      const order = factory.createOrder('ORD-003', 'CUST-003', components, strategy);

      const total = order.getTotalAmount();
      // 200 + shipping (25% = 50) + processing fee (19.99) = 269.99
      expect(total).toBeCloseTo(269.99, 2);
    });

    it('should not process orders under $50', () => {
      const factory = new InternationalOrderFactory('Mexico');
      const components = [new OrderItem('PROD001', 'Item', 30.00, 1)];
      const strategy = new InternationalProcessingStrategy('Mexico');

      expect(() => {
        factory.createOrder('ORD-003', 'CUST-003', components, strategy);
      }).toThrow();
    });
  });

  describe('Factory Method Pattern - Polymorphism', () => {
    it('should allow using factories polymorphically', () => {
      const factories = [
        new StandardOrderFactory(),
        new ExpressOrderFactory(),
      ];

      factories.forEach((factory) => {
        const components = [new OrderItem('PROD001', 'Item', 100.00, 1)];
        const strategy = new StandardProcessingStrategy();

        const order = factory.createOrder(`ORD-${Math.random()}`, 'CUST-001', components, strategy);

        expect(order).toBeDefined();
        expect(order.getId()).toBeDefined();
        expect(factory.getFactoryName()).toBeDefined();
      });
    });

    it('should create different order types with different characteristics', () => {
      const components = [new OrderItem('PROD001', 'Item', 100.00, 1)];

      const standardFactory = new StandardOrderFactory();
      const standardStrategy = new StandardProcessingStrategy();
      const standardOrder = standardFactory.createOrder('ORD-S', 'CUST-001', components, standardStrategy);

      const expressFactory = new ExpressOrderFactory();
      const expressStrategy = new ExpressProcessingStrategy();
      const expressOrder = expressFactory.createOrder('ORD-E', 'CUST-001', components, expressStrategy);

      // Standard order should not be priority
      expect(standardOrder.isPriority()).toBe(false);
      // Express order should be priority
      expect(expressOrder.isPriority()).toBe(true);

      // Express should cost more
      expect(expressOrder.getTotalAmount()).toBeGreaterThan(standardOrder.getTotalAmount());

      // Express should be faster
      expect(expressOrder.getEstimatedDeliveryDays()).toBeLessThan(standardOrder.getEstimatedDeliveryDays());
    });

    it('should create orders with complex component structures', () => {
      const laptop = new OrderItem('PROD001', 'Laptop', 999.99, 1);
      const mouse = new OrderItem('PROD002', 'Mouse', 29.99, 1);

      const bundle = new OrderBundle('Starter Pack', 0.10);
      bundle.add(laptop);
      bundle.add(mouse);

      const factory = new StandardOrderFactory();
      const strategy = new StandardProcessingStrategy();

      const order = factory.createOrder('ORD-BUNDLE', 'CUST-001', [bundle], strategy);

      expect(order.getComponents()).toHaveLength(1);
      expect(order.getComponents()[0].isComposite()).toBe(true);
      
      // Bundle price: (999.99 + 29.99) * 0.9 = 926.98
      expect(order.getItemsTotal()).toBeCloseTo(926.98, 2);
    });
  });

  describe('Integration of Factory with Strategy and Composite', () => {
    it('should create order with all three patterns working together', () => {
      // COMPOSITE: Create complex order structure
      const item1 = new OrderItem('PROD001', 'Smartphone', 699.99, 1);
      const item2 = new OrderItem('PROD002', 'Case', 19.99, 1);
      
      const bundle = new OrderBundle('Phone Bundle', 0.05);
      bundle.add(item1);
      bundle.add(item2);

      // STRATEGY: Choose processing strategy
      const strategy = new ExpressProcessingStrategy();

      // FACTORY METHOD: Create order
      const factory = new ExpressOrderFactory();
      const order = factory.createOrder('ORD-ALL', 'CUST-ALL', [bundle], strategy);

      // Verify all patterns are working
      expect(order.getComponents()[0].isComposite()).toBe(true); // Composite
      expect(order.getProcessingStrategy().getStrategyName()).toContain('Express'); // Strategy
      expect(order.isPriority()).toBe(true); // Factory Method
    });

    it('should handle international order with bundles', () => {
      const monitor = new OrderItem('PROD001', 'Monitor', 299.99, 2);
      const cable = new OrderItem('PROD002', 'Cable', 9.99, 2);

      const bundle = new OrderBundle('Display Bundle', 0.08);
      bundle.add(monitor);
      bundle.add(cable);

      const factory = new InternationalOrderFactory('Japan');
      const strategy = new InternationalProcessingStrategy('Japan');

      const order = factory.createOrder('ORD-INTL', 'CUST-JP', [bundle], strategy);

      expect(order.isInternational()).toBe(true);
      expect(order.getComponents()[0].isComposite()).toBe(true);
      expect(order.getProcessingStrategy().getStrategyName()).toContain('Japan');
    });
  });
});

