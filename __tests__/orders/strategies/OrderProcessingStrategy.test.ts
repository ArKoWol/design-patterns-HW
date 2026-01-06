import { StandardProcessingStrategy } from '../../../src/orders/strategies/StandardProcessingStrategy';
import { ExpressProcessingStrategy } from '../../../src/orders/strategies/ExpressProcessingStrategy';
import { InternationalProcessingStrategy } from '../../../src/orders/strategies/InternationalProcessingStrategy';
import { OrderItem } from '../../../src/orders/components/OrderItem';
import { OrderBundle } from '../../../src/orders/components/OrderBundle';

describe('Strategy Pattern - Order Processing Strategies', () => {
  describe('StandardProcessingStrategy', () => {
    let strategy: StandardProcessingStrategy;

    beforeEach(() => {
      strategy = new StandardProcessingStrategy();
    });

    it('should have correct strategy name', () => {
      expect(strategy.getStrategyName()).toBe('Standard Processing');
    });

    it('should return 5 days delivery time', () => {
      expect(strategy.getEstimatedDeliveryDays()).toBe(5);
    });

    it('should have no processing fee', () => {
      expect(strategy.getProcessingFee()).toBe(0);
    });

    it('should charge $5.99 shipping for orders under $100', () => {
      const items = [new OrderItem('PROD001', 'Item', 50.00, 1)];
      
      expect(strategy.calculateShippingCost(items)).toBe(5.99);
    });

    it('should provide free shipping for orders over $100', () => {
      const items = [new OrderItem('PROD001', 'Item', 150.00, 1)];
      
      expect(strategy.calculateShippingCost(items)).toBe(0);
    });

    it('should provide free shipping for orders exactly $100', () => {
      const items = [
        new OrderItem('PROD001', 'Item1', 50.00, 1),
        new OrderItem('PROD002', 'Item2', 50.00, 1),
      ];
      
      expect(strategy.calculateShippingCost(items)).toBe(5.99);
    });

    it('should be able to process any order with items', () => {
      const items = [new OrderItem('PROD001', 'Item', 10.00, 1)];
      
      expect(strategy.canProcess(items)).toBe(true);
    });

    it('should not process empty orders', () => {
      expect(strategy.canProcess([])).toBe(false);
    });

    it('should have descriptive description', () => {
      const description = strategy.getDescription();
      
      expect(description).toContain('Standard');
      expect(description).toContain('5-7 business days');
    });
  });

  describe('ExpressProcessingStrategy', () => {
    let strategy: ExpressProcessingStrategy;

    beforeEach(() => {
      strategy = new ExpressProcessingStrategy();
    });

    it('should have correct strategy name', () => {
      expect(strategy.getStrategyName()).toBe('Express Processing');
    });

    it('should return 2 days delivery time', () => {
      expect(strategy.getEstimatedDeliveryDays()).toBe(2);
    });

    it('should have $9.99 processing fee', () => {
      expect(strategy.getProcessingFee()).toBe(9.99);
    });

    it('should calculate shipping as 15% of order value', () => {
      const items = [new OrderItem('PROD001', 'Item', 100.00, 1)];
      const shippingCost = strategy.calculateShippingCost(items);
      
      expect(shippingCost).toBe(15.00);
    });

    it('should have minimum shipping cost of $15', () => {
      const items = [new OrderItem('PROD001', 'Item', 50.00, 1)];
      const shippingCost = strategy.calculateShippingCost(items);
      
      expect(shippingCost).toBe(15.00);
    });

    it('should handle high-value orders', () => {
      const items = [new OrderItem('PROD001', 'Item', 1000.00, 1)];
      const shippingCost = strategy.calculateShippingCost(items);
      
      expect(shippingCost).toBe(150.00);
    });

    it('should not process orders over $5000', () => {
      const items = [new OrderItem('PROD001', 'Item', 6000.00, 1)];
      
      expect(strategy.canProcess(items)).toBe(false);
    });

    it('should process orders under $5000', () => {
      const items = [new OrderItem('PROD001', 'Item', 4999.99, 1)];
      
      expect(strategy.canProcess(items)).toBe(true);
    });

    it('should not process empty orders', () => {
      expect(strategy.canProcess([])).toBe(false);
    });

    it('should have descriptive description', () => {
      const description = strategy.getDescription();
      
      expect(description).toContain('Express');
      expect(description).toContain('1-2 business days');
    });
  });

  describe('InternationalProcessingStrategy', () => {
    it('should store destination country', () => {
      const strategy = new InternationalProcessingStrategy('Canada');
      
      expect(strategy.getDestinationCountry()).toBe('Canada');
    });

    it('should have correct strategy name with country', () => {
      const strategy = new InternationalProcessingStrategy('Japan');
      
      expect(strategy.getStrategyName()).toBe('International Processing (Japan)');
    });

    it('should return 14 days delivery time', () => {
      const strategy = new InternationalProcessingStrategy('UK');
      
      expect(strategy.getEstimatedDeliveryDays()).toBe(14);
    });

    it('should have $19.99 processing fee for customs', () => {
      const strategy = new InternationalProcessingStrategy('Germany');
      
      expect(strategy.getProcessingFee()).toBe(19.99);
    });

    it('should calculate shipping as 25% of order value', () => {
      const strategy = new InternationalProcessingStrategy('Australia');
      const items = [new OrderItem('PROD001', 'Item', 200.00, 1)];
      
      expect(strategy.calculateShippingCost(items)).toBe(50.00);
    });

    it('should have minimum shipping cost of $30', () => {
      const strategy = new InternationalProcessingStrategy('Mexico');
      const items = [new OrderItem('PROD001', 'Item', 60.00, 1)];
      
      expect(strategy.calculateShippingCost(items)).toBe(30.00);
    });

    it('should not process orders under $50', () => {
      const strategy = new InternationalProcessingStrategy('France');
      const items = [new OrderItem('PROD001', 'Item', 40.00, 1)];
      
      expect(strategy.canProcess(items)).toBe(false);
    });

    it('should not process orders over $10000', () => {
      const strategy = new InternationalProcessingStrategy('Brazil');
      const items = [new OrderItem('PROD001', 'Item', 15000.00, 1)];
      
      expect(strategy.canProcess(items)).toBe(false);
    });

    it('should process orders between $50 and $10000', () => {
      const strategy = new InternationalProcessingStrategy('Spain');
      const items = [new OrderItem('PROD001', 'Item', 500.00, 1)];
      
      expect(strategy.canProcess(items)).toBe(true);
    });

    it('should have descriptive description with country', () => {
      const strategy = new InternationalProcessingStrategy('Italy');
      const description = strategy.getDescription();
      
      expect(description).toContain('International');
      expect(description).toContain('Italy');
      expect(description).toContain('10-14 business days');
    });
  });

  describe('Strategy Pattern - Polymorphism', () => {
    it('should allow interchangeable strategies', () => {
      const items = [new OrderItem('PROD001', 'Item', 200.00, 1)];
      
      const strategies = [
        new StandardProcessingStrategy(),
        new ExpressProcessingStrategy(),
        new InternationalProcessingStrategy('Canada'),
      ];

      strategies.forEach((strategy) => {
        expect(strategy.getStrategyName()).toBeDefined();
        expect(strategy.calculateShippingCost(items)).toBeGreaterThanOrEqual(0);
        expect(strategy.getEstimatedDeliveryDays()).toBeGreaterThan(0);
        expect(strategy.getProcessingFee()).toBeGreaterThanOrEqual(0);
        expect(strategy.canProcess(items)).toBeDefined();
      });
    });

    it('should demonstrate different costs for same order', () => {
      const items = [new OrderItem('PROD001', 'Laptop', 1000.00, 1)];

      const standardStrategy = new StandardProcessingStrategy();
      const expressStrategy = new ExpressProcessingStrategy();
      const intlStrategy = new InternationalProcessingStrategy('UK');

      const standardCost = standardStrategy.calculateShippingCost(items) 
        + standardStrategy.getProcessingFee();
      const expressCost = expressStrategy.calculateShippingCost(items) 
        + expressStrategy.getProcessingFee();
      const intlCost = intlStrategy.calculateShippingCost(items) 
        + intlStrategy.getProcessingFee();

      // Express should cost more than standard
      expect(expressCost).toBeGreaterThan(standardCost);
      // International should cost most
      expect(intlCost).toBeGreaterThan(expressCost);
    });
  });

  describe('Strategy with Composite Components', () => {
    it('should calculate shipping for bundle orders', () => {
      const bundle = new OrderBundle('Test Bundle', 0.10);
      bundle.add(new OrderItem('PROD001', 'Item1', 60.00, 1));
      bundle.add(new OrderItem('PROD002', 'Item2', 40.00, 1));

      const strategy = new StandardProcessingStrategy();
      const shipping = strategy.calculateShippingCost([bundle]);

      // Bundle total: 90 (after 10% discount)
      expect(shipping).toBe(5.99); // Under $100
    });

    it('should handle complex nested structures', () => {
      const innerBundle = new OrderBundle('Inner', 0);
      innerBundle.add(new OrderItem('PROD001', 'Item1', 50.00, 1));
      innerBundle.add(new OrderItem('PROD002', 'Item2', 60.00, 1));

      const outerBundle = new OrderBundle('Outer', 0);
      outerBundle.add(innerBundle);

      const strategy = new ExpressProcessingStrategy();
      const shipping = strategy.calculateShippingCost([outerBundle]);

      // Total: 110, Express: 15% = 16.5
      expect(shipping).toBeCloseTo(16.5, 2);
    });
  });
});

