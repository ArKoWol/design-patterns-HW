import { ShippingService } from '../../../src/orders/services/ShippingService';
import { Order, OrderItem } from '../../../src/orders/entities/Order';

describe('ShippingService', () => {
  let shippingService: ShippingService;
  let order: Order;

  const sampleItems: OrderItem[] = [
    { productId: 'PROD001', productName: 'Laptop', quantity: 1, price: 999.99 },
    { productId: 'PROD002', productName: 'Mouse', quantity: 2, price: 29.99 }
  ];

  beforeEach(() => {
    shippingService = new ShippingService();
    order = new Order('ORD-001', 'CUST-001', sampleItems, 1059.97);
  });

  describe('calculateShippingCost', () => {
    it('should calculate shipping cost based on item count', () => {
      const cost = shippingService.calculateShippingCost(order);
      
      // Base cost $5.99 + (3 items * $1.50) = $10.49
      expect(cost).toBe(10.49);
    });

    it('should calculate correct cost for single item', () => {
      const singleItemOrder = new Order('ORD-002', 'CUST-001', [sampleItems[0]], 999.99);
      const cost = shippingService.calculateShippingCost(singleItemOrder);
      
      // Base cost $5.99 + (1 item * $1.50) = $7.49
      expect(cost).toBe(7.49);
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
      
      const order2 = new Order('ORD-002', 'CUST-002', sampleItems, 1059.97);
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
      const estimatedDate = shippingService.estimateDeliveryDate(order);
      const today = new Date();
      const expectedDate = new Date();
      expectedDate.setDate(today.getDate() + 3);
      
      expect(estimatedDate.toDateString()).toBe(expectedDate.toDateString());
    });
  });
});

