import { ShippingService } from '../../../src/orders/services/ShippingService';
import { Order } from '../../../src/orders/entities/Order';
import { OrderItem } from '../../../src/orders/components/OrderItem';
import { StandardProcessingStrategy } from '../../../src/orders/strategies/StandardProcessingStrategy';

describe('ShippingService', () => {
  let shippingService: ShippingService;
  let order: Order;

  beforeEach(() => {
    shippingService = new ShippingService();
    const components = [
      new OrderItem('PROD001', 'Laptop', 999.99, 1),
      new OrderItem('PROD002', 'Mouse', 29.99, 2)
    ];
    const strategy = new StandardProcessingStrategy();
    order = new Order('ORD-001', 'CUST-001', components, strategy);
  });

  describe('calculateShippingCost', () => {
    it('should calculate shipping cost using strategy', () => {
      const cost = shippingService.calculateShippingCost(order);
      
      // Total is over $100, so free shipping with standard strategy
      expect(cost).toBe(0);
    });

    it('should calculate correct cost for single low-value item', () => {
      const components = [new OrderItem('PROD001', 'Item', 50.00, 1)];
      const strategy = new StandardProcessingStrategy();
      const singleItemOrder = new Order('ORD-002', 'CUST-001', components, strategy);
      const cost = shippingService.calculateShippingCost(singleItemOrder);
      
      // Under $100, so standard $5.99 shipping
      expect(cost).toBe(5.99);
    });
  });

  describe('scheduleShipment', () => {
    it('should schedule shipment and return tracking number', () => {
      const trackingNumber = shippingService.scheduleShipment(order);
      
      expect(trackingNumber).toMatch(/^TRACK-\d{8}$/);
      expect(order.getTrackingNumber()).toBe(trackingNumber);
    });

    it('should generate unique tracking numbers', () => {
      const tracking1 = shippingService.scheduleShipment(order);
      
      const components2 = [new OrderItem('PROD003', 'Item', 100.00, 1)];
      const strategy2 = new StandardProcessingStrategy();
      const order2 = new Order('ORD-002', 'CUST-002', components2, strategy2);
      const tracking2 = shippingService.scheduleShipment(order2);
      
      expect(tracking1).not.toBe(tracking2);
    });
  });

  describe('getShipmentStatus', () => {
    it('should return status for tracking number', () => {
      const trackingNumber = 'TRACK-12345678';
      const status = shippingService.getShipmentStatus(trackingNumber);
      
      expect(status).toContain(trackingNumber);
      expect(status).toContain('in transit');
    });
  });

  describe('estimateDeliveryDate', () => {
    it('should estimate delivery date 3 days from now', () => {
      const estimatedDate = shippingService.estimateDeliveryDate();
      const today = new Date();
      const expectedDate = new Date();
      expectedDate.setDate(today.getDate() + 3);
      
      expect(estimatedDate.toDateString()).toBe(expectedDate.toDateString());
    });
  });
});

