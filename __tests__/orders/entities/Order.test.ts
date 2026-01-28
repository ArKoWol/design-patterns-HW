import { Order } from '../../../src/orders/entities/Order';
import { OrderItem } from '../../../src/orders/components/OrderItem';
import { StandardProcessingStrategy } from '../../../src/orders/strategies/StandardProcessingStrategy';
import { NewOrderState } from '../../../src/orders/states/NewOrderState';
import { ProcessingOrderState } from '../../../src/orders/states/ProcessingOrderState';
import { ShippedOrderState } from '../../../src/orders/states/ShippedOrderState';
import { DeliveredOrderState } from '../../../src/orders/states/DeliveredOrderState';
import { CancelledOrderState } from '../../../src/orders/states/CancelledOrderState';

describe('Order Entity', () => {
  const createTestOrder = (id: string = 'ORD-001', customerId: string = 'CUST-001') => {
    const components = [
      new OrderItem('PROD001', 'Laptop', 999.99, 1),
      new OrderItem('PROD002', 'Mouse', 29.99, 2)
    ];
    const strategy = new StandardProcessingStrategy();
    return new Order(id, customerId, components, strategy);
  };

  describe('Constructor', () => {
    it('should create an order with correct properties', () => {
      const order = createTestOrder();

      expect(order.getId()).toBe('ORD-001');
      expect(order.getCustomerId()).toBe('CUST-001');
      expect(order.getComponents()).toHaveLength(2);
      expect(order.getItemsTotal()).toBeCloseTo(1059.97, 2);
      expect(order.getCreatedAt()).toBeInstanceOf(Date);
      expect(order.getStatus()).toBe('NEW');
    });

    it('should initialize with NewOrderState', () => {
      const order = createTestOrder();
      expect(order.getState()).toBeInstanceOf(NewOrderState);
    });
  });

  describe('State Management', () => {
    it('should allow state changes', () => {
      const order = createTestOrder();
      
      const newState = new ProcessingOrderState();
      order.setState(newState);
      
      expect(order.getState()).toBe(newState);
      expect(order.getStatus()).toBe('PROCESSING');
    });
  });

  describe('Tracking Number', () => {
    it('should set and get tracking number', () => {
      const order = createTestOrder();
      
      expect(order.getTrackingNumber()).toBeUndefined();
      
      order.setTrackingNumber('TRACK-12345678');
      expect(order.getTrackingNumber()).toBe('TRACK-12345678');
    });
  });

  describe('State Transitions', () => {
    it('should process a new order', () => {
      const order = createTestOrder();
      
      order.process();
      
      expect(order.getStatus()).toBe('PROCESSING');
      expect(order.getState()).toBeInstanceOf(ProcessingOrderState);
    });

    it('should ship a processing order', () => {
      const order = createTestOrder();
      
      order.process();
      order.ship();
      
      expect(order.getStatus()).toBe('SHIPPED');
      expect(order.getState()).toBeInstanceOf(ShippedOrderState);
    });

    it('should deliver a shipped order', () => {
      const order = createTestOrder();
      
      order.process();
      order.ship();
      order.deliver();
      
      expect(order.getStatus()).toBe('DELIVERED');
      expect(order.getState()).toBeInstanceOf(DeliveredOrderState);
    });

    it('should cancel a new order', () => {
      const order = createTestOrder();
      
      order.cancel();
      
      expect(order.getStatus()).toBe('CANCELLED');
      expect(order.getState()).toBeInstanceOf(CancelledOrderState);
    });

    it('should cancel a processing order', () => {
      const order = createTestOrder();
      
      order.process();
      order.cancel();
      
      expect(order.getStatus()).toBe('CANCELLED');
      expect(order.getState()).toBeInstanceOf(CancelledOrderState);
    });
  });

  describe('toString', () => {
    it('should return formatted order string', () => {
      const order = createTestOrder();
      
      const result = order.toString();
      
      expect(result).toContain('Order #ORD-001');
      expect(result).toContain('Status: NEW');
      expect(result).toContain('Customer: CUST-001');
      expect(result).toContain('Total:');
    });
  });
});

