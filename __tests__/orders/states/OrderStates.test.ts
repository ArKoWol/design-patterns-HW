import { Order } from '../../../src/orders/entities/Order';
import { OrderItem } from '../../../src/orders/components/OrderItem';
import { StandardProcessingStrategy } from '../../../src/orders/strategies/StandardProcessingStrategy';
import { NewOrderState } from '../../../src/orders/states/NewOrderState';
import { ProcessingOrderState } from '../../../src/orders/states/ProcessingOrderState';
import { ShippedOrderState } from '../../../src/orders/states/ShippedOrderState';
import { DeliveredOrderState } from '../../../src/orders/states/DeliveredOrderState';
import { CancelledOrderState } from '../../../src/orders/states/CancelledOrderState';

describe('Order States', () => {
  let order: Order;

  beforeEach(() => {
    const components = [
      new OrderItem('PROD001', 'Laptop', 999.99, 1)
    ];
    const strategy = new StandardProcessingStrategy();
    order = new Order('ORD-001', 'CUST-001', components, strategy);
  });

  describe('NewOrderState', () => {
    it('should have status "NEW"', () => {
      const state = new NewOrderState();
      expect(state.getStatus()).toBe('NEW');
    });

    it('should transition to PROCESSING when processed', () => {
      const state = new NewOrderState();
      state.process(order);
      expect(order.getStatus()).toBe('PROCESSING');
    });

    it('should transition to CANCELLED when cancelled', () => {
      const state = new NewOrderState();
      state.cancel(order);
      expect(order.getStatus()).toBe('CANCELLED');
    });

    it('should throw error when trying to ship', () => {
      const state = new NewOrderState();
      expect(() => state.ship(order)).toThrow('Cannot ship an order that has not been processed yet');
    });

    it('should throw error when trying to deliver', () => {
      const state = new NewOrderState();
      expect(() => state.deliver(order)).toThrow('Cannot deliver an order that has not been processed yet');
    });
  });

  describe('ProcessingOrderState', () => {
    beforeEach(() => {
      order.setState(new ProcessingOrderState());
    });

    it('should have status "PROCESSING"', () => {
      const state = new ProcessingOrderState();
      expect(state.getStatus()).toBe('PROCESSING');
    });

    it('should transition to SHIPPED when shipped', () => {
      const state = new ProcessingOrderState();
      state.ship(order);
      expect(order.getStatus()).toBe('SHIPPED');
    });

    it('should transition to CANCELLED when cancelled', () => {
      const state = new ProcessingOrderState();
      state.cancel(order);
      expect(order.getStatus()).toBe('CANCELLED');
    });

    it('should not change state when processed again', () => {
      const state = new ProcessingOrderState();
      state.process(order);
      expect(order.getStatus()).toBe('PROCESSING');
    });

    it('should throw error when trying to deliver', () => {
      const state = new ProcessingOrderState();
      expect(() => state.deliver(order)).toThrow('Cannot deliver an order that has not been shipped yet');
    });
  });

  describe('ShippedOrderState', () => {
    beforeEach(() => {
      order.setState(new ShippedOrderState());
    });

    it('should have status "SHIPPED"', () => {
      const state = new ShippedOrderState();
      expect(state.getStatus()).toBe('SHIPPED');
    });

    it('should transition to DELIVERED when delivered', () => {
      const state = new ShippedOrderState();
      state.deliver(order);
      expect(order.getStatus()).toBe('DELIVERED');
    });

    it('should throw error when trying to cancel', () => {
      const state = new ShippedOrderState();
      expect(() => state.cancel(order)).toThrow('Cannot cancel an order that has already been shipped');
    });

    it('should not change state when shipped again', () => {
      const state = new ShippedOrderState();
      state.ship(order);
      expect(order.getStatus()).toBe('SHIPPED');
    });

    it('should not change state when processed again', () => {
      const state = new ShippedOrderState();
      state.process(order);
      expect(order.getStatus()).toBe('SHIPPED');
    });
  });

  describe('DeliveredOrderState', () => {
    beforeEach(() => {
      order.setState(new DeliveredOrderState());
    });

    it('should have status "DELIVERED"', () => {
      const state = new DeliveredOrderState();
      expect(state.getStatus()).toBe('DELIVERED');
    });

    it('should throw error when trying to cancel', () => {
      const state = new DeliveredOrderState();
      expect(() => state.cancel(order)).toThrow('Cannot cancel an order that has been delivered');
    });

    it('should not change state when delivered again', () => {
      const state = new DeliveredOrderState();
      state.deliver(order);
      expect(order.getStatus()).toBe('DELIVERED');
    });

    it('should not change state when processed', () => {
      const state = new DeliveredOrderState();
      state.process(order);
      expect(order.getStatus()).toBe('DELIVERED');
    });

    it('should not change state when shipped', () => {
      const state = new DeliveredOrderState();
      state.ship(order);
      expect(order.getStatus()).toBe('DELIVERED');
    });
  });

  describe('CancelledOrderState', () => {
    beforeEach(() => {
      order.setState(new CancelledOrderState());
    });

    it('should have status "CANCELLED"', () => {
      const state = new CancelledOrderState();
      expect(state.getStatus()).toBe('CANCELLED');
    });

    it('should throw error when trying to process', () => {
      const state = new CancelledOrderState();
      expect(() => state.process(order)).toThrow('Cannot process a cancelled order');
    });

    it('should throw error when trying to ship', () => {
      const state = new CancelledOrderState();
      expect(() => state.ship(order)).toThrow('Cannot ship a cancelled order');
    });

    it('should throw error when trying to deliver', () => {
      const state = new CancelledOrderState();
      expect(() => state.deliver(order)).toThrow('Cannot deliver a cancelled order');
    });

    it('should not change state when cancelled again', () => {
      const state = new CancelledOrderState();
      state.cancel(order);
      expect(order.getStatus()).toBe('CANCELLED');
    });
  });
});

