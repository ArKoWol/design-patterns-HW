import { Order, OrderItem } from '../../../src/orders/entities/Order';
import { NewOrderState } from '../../../src/orders/states/NewOrderState';
import { ProcessingOrderState } from '../../../src/orders/states/ProcessingOrderState';
import { ShippedOrderState } from '../../../src/orders/states/ShippedOrderState';
import { DeliveredOrderState } from '../../../src/orders/states/DeliveredOrderState';
import { CancelledOrderState } from '../../../src/orders/states/CancelledOrderState';

describe('Order Entity', () => {
  const sampleItems: OrderItem[] = [
    { productId: 'PROD001', productName: 'Laptop', quantity: 1, price: 999.99 },
    { productId: 'PROD002', productName: 'Mouse', quantity: 2, price: 29.99 }
  ];

  describe('Constructor', () => {
    it('should create an order with correct properties', () => {
      const order = new Order('ORD-001', 'CUST-001', sampleItems, 1059.97);

      expect(order.getId()).toBe('ORD-001');
      expect(order.getCustomerId()).toBe('CUST-001');
      expect(order.getItems()).toEqual(sampleItems);
      expect(order.getTotalAmount()).toBe(1059.97);
      expect(order.getCreatedAt()).toBeInstanceOf(Date);
      expect(order.getStatus()).toBe('NEW');
    });

    it('should initialize with NewOrderState', () => {
      const order = new Order('ORD-001', 'CUST-001', sampleItems, 1059.97);
      expect(order.getState()).toBeInstanceOf(NewOrderState);
    });
  });

  describe('State Management', () => {
    it('should allow state changes', () => {
      const order = new Order('ORD-001', 'CUST-001', sampleItems, 1059.97);
      
      const newState = new ProcessingOrderState();
      order.setState(newState);
      
      expect(order.getState()).toBe(newState);
      expect(order.getStatus()).toBe('PROCESSING');
    });
  });

  describe('Tracking Number', () => {
    it('should set and get tracking number', () => {
      const order = new Order('ORD-001', 'CUST-001', sampleItems, 1059.97);
      
      expect(order.getTrackingNumber()).toBeUndefined();
      
      order.setTrackingNumber('TRACK-12345678');
      expect(order.getTrackingNumber()).toBe('TRACK-12345678');
    });
  });

  describe('State Transitions', () => {
    it('should process a new order', () => {
      const order = new Order('ORD-001', 'CUST-001', sampleItems, 1059.97);
      
      order.process();
      
      expect(order.getStatus()).toBe('PROCESSING');
      expect(order.getState()).toBeInstanceOf(ProcessingOrderState);
    });

    it('should ship a processing order', () => {
      const order = new Order('ORD-001', 'CUST-001', sampleItems, 1059.97);
      
      order.process();
      order.ship();
      
      expect(order.getStatus()).toBe('SHIPPED');
      expect(order.getState()).toBeInstanceOf(ShippedOrderState);
    });

    it('should deliver a shipped order', () => {
      const order = new Order('ORD-001', 'CUST-001', sampleItems, 1059.97);
      
      order.process();
      order.ship();
      order.deliver();
      
      expect(order.getStatus()).toBe('DELIVERED');
      expect(order.getState()).toBeInstanceOf(DeliveredOrderState);
    });

    it('should cancel a new order', () => {
      const order = new Order('ORD-001', 'CUST-001', sampleItems, 1059.97);
      
      order.cancel();
      
      expect(order.getStatus()).toBe('CANCELLED');
      expect(order.getState()).toBeInstanceOf(CancelledOrderState);
    });

    it('should cancel a processing order', () => {
      const order = new Order('ORD-001', 'CUST-001', sampleItems, 1059.97);
      
      order.process();
      order.cancel();
      
      expect(order.getStatus()).toBe('CANCELLED');
      expect(order.getState()).toBeInstanceOf(CancelledOrderState);
    });
  });

  describe('toString', () => {
    it('should return formatted order string', () => {
      const order = new Order('ORD-001', 'CUST-001', sampleItems, 1059.97);
      
      const result = order.toString();
      
      expect(result).toContain('Order #ORD-001');
      expect(result).toContain('Status: NEW');
      expect(result).toContain('Customer: CUST-001');
      expect(result).toContain('Total: $1059.97');
    });
  });
});

