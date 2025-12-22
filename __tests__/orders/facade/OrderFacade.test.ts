import { OrderFacade } from '../../../src/orders/facade/OrderFacade';
import { OrderItem } from '../../../src/orders/entities/Order';
import { PaymentService } from '../../../src/orders/services/PaymentService';
import { InventoryService } from '../../../src/orders/services/InventoryService';
import { ShippingService } from '../../../src/orders/services/ShippingService';
import { NotificationService } from '../../../src/orders/services/NotificationService';

describe('OrderFacade', () => {
  let orderFacade: OrderFacade;
  let paymentService: PaymentService;
  let inventoryService: InventoryService;
  let shippingService: ShippingService;
  let notificationService: NotificationService;

  const sampleItems: OrderItem[] = [
    { productId: 'PROD001', productName: 'Laptop', quantity: 1, price: 999.99 },
    { productId: 'PROD002', productName: 'Mouse', quantity: 2, price: 29.99 }
  ];

  beforeEach(() => {
    paymentService = new PaymentService();
    inventoryService = new InventoryService();
    shippingService = new ShippingService();
    notificationService = new NotificationService();
    
    orderFacade = new OrderFacade(
      paymentService,
      inventoryService,
      shippingService,
      notificationService
    );
  });

  describe('placeOrder', () => {
    it('should place order successfully with valid data', () => {
      const order = orderFacade.placeOrder('CUST-001', sampleItems);
      
      expect(order).not.toBeNull();
      expect(order?.getCustomerId()).toBe('CUST-001');
      expect(order?.getStatus()).toBe('NEW');
      expect(order?.getTotalAmount()).toBe(1059.97);
    });

    it('should fail with empty items', () => {
      const order = orderFacade.placeOrder('CUST-001', []);
      expect(order).toBeNull();
    });

    it('should fail with unavailable items', () => {
      const unavailableItems: OrderItem[] = [
        { productId: 'PROD001', productName: 'Laptop', quantity: 1000, price: 999.99 }
      ];
      
      const order = orderFacade.placeOrder('CUST-001', unavailableItems);
      expect(order).toBeNull();
    });

    it('should generate unique order IDs', () => {
      const order1 = orderFacade.placeOrder('CUST-001', sampleItems);
      const order2 = orderFacade.placeOrder('CUST-002', sampleItems);
      
      expect(order1?.getId()).not.toBe(order2?.getId());
    });
  });

  describe('processOrder', () => {
    it('should process a new order successfully', () => {
      const order = orderFacade.placeOrder('CUST-001', sampleItems);
      expect(order).not.toBeNull();
      
      const result = orderFacade.processOrder(order!.getId());
      
      expect(result).toBe(true);
      expect(order?.getStatus()).toBe('PROCESSING');
    });

    it('should fail with non-existent order ID', () => {
      const result = orderFacade.processOrder('INVALID-ID');
      expect(result).toBe(false);
    });

    it('should handle already processed order', () => {
      const order = orderFacade.placeOrder('CUST-001', sampleItems);
      expect(order).not.toBeNull();
      
      orderFacade.processOrder(order!.getId());
      const result = orderFacade.processOrder(order!.getId());
      
      expect(result).toBe(true);
      expect(order?.getStatus()).toBe('PROCESSING');
    });
  });

  describe('shipOrder', () => {
    it('should ship a processing order successfully', () => {
      const order = orderFacade.placeOrder('CUST-001', sampleItems);
      expect(order).not.toBeNull();
      
      orderFacade.processOrder(order!.getId());
      const result = orderFacade.shipOrder(order!.getId());
      
      expect(result).toBe(true);
      expect(order?.getStatus()).toBe('SHIPPED');
      expect(order?.getTrackingNumber()).toBeDefined();
    });

    it('should fail with non-existent order ID', () => {
      const result = orderFacade.shipOrder('INVALID-ID');
      expect(result).toBe(false);
    });

    it('should fail when trying to ship a new order', () => {
      const order = orderFacade.placeOrder('CUST-001', sampleItems);
      expect(order).not.toBeNull();
      
      const result = orderFacade.shipOrder(order!.getId());
      expect(result).toBe(false);
    });
  });

  describe('deliverOrder', () => {
    it('should deliver a shipped order successfully', () => {
      const order = orderFacade.placeOrder('CUST-001', sampleItems);
      expect(order).not.toBeNull();
      
      orderFacade.processOrder(order!.getId());
      orderFacade.shipOrder(order!.getId());
      const result = orderFacade.deliverOrder(order!.getId());
      
      expect(result).toBe(true);
      expect(order?.getStatus()).toBe('DELIVERED');
    });

    it('should fail with non-existent order ID', () => {
      const result = orderFacade.deliverOrder('INVALID-ID');
      expect(result).toBe(false);
    });

    it('should fail when trying to deliver a new order', () => {
      const order = orderFacade.placeOrder('CUST-001', sampleItems);
      expect(order).not.toBeNull();
      
      const result = orderFacade.deliverOrder(order!.getId());
      expect(result).toBe(false);
    });
  });

  describe('cancelOrder', () => {
    it('should cancel a new order successfully', () => {
      const order = orderFacade.placeOrder('CUST-001', sampleItems);
      expect(order).not.toBeNull();
      
      const result = orderFacade.cancelOrder(order!.getId());
      
      expect(result).toBe(true);
      expect(order?.getStatus()).toBe('CANCELLED');
    });

    it('should cancel a processing order successfully', () => {
      const order = orderFacade.placeOrder('CUST-001', sampleItems);
      expect(order).not.toBeNull();
      
      orderFacade.processOrder(order!.getId());
      const result = orderFacade.cancelOrder(order!.getId());
      
      expect(result).toBe(true);
      expect(order?.getStatus()).toBe('CANCELLED');
    });

    it('should fail when trying to cancel a shipped order', () => {
      const order = orderFacade.placeOrder('CUST-001', sampleItems);
      expect(order).not.toBeNull();
      
      orderFacade.processOrder(order!.getId());
      orderFacade.shipOrder(order!.getId());
      const result = orderFacade.cancelOrder(order!.getId());
      
      expect(result).toBe(false);
    });

    it('should fail with non-existent order ID', () => {
      const result = orderFacade.cancelOrder('INVALID-ID');
      expect(result).toBe(false);
    });
  });

  describe('getOrderStatus', () => {
    it('should return status for existing order', () => {
      const order = orderFacade.placeOrder('CUST-001', sampleItems);
      expect(order).not.toBeNull();
      
      const status = orderFacade.getOrderStatus(order!.getId());
      
      expect(status).toBe('NEW');
    });

    it('should return null for non-existent order', () => {
      const status = orderFacade.getOrderStatus('INVALID-ID');
      expect(status).toBeNull();
    });

    it('should track status changes', () => {
      const order = orderFacade.placeOrder('CUST-001', sampleItems);
      expect(order).not.toBeNull();
      
      expect(orderFacade.getOrderStatus(order!.getId())).toBe('NEW');
      
      orderFacade.processOrder(order!.getId());
      expect(orderFacade.getOrderStatus(order!.getId())).toBe('PROCESSING');
      
      orderFacade.shipOrder(order!.getId());
      expect(orderFacade.getOrderStatus(order!.getId())).toBe('SHIPPED');
    });
  });

  describe('getOrderDetails', () => {
    it('should return order details for existing order', () => {
      const placedOrder = orderFacade.placeOrder('CUST-001', sampleItems);
      expect(placedOrder).not.toBeNull();
      
      const order = orderFacade.getOrderDetails(placedOrder!.getId());
      
      expect(order).not.toBeNull();
      expect(order?.getId()).toBe(placedOrder!.getId());
      expect(order?.getCustomerId()).toBe('CUST-001');
    });

    it('should return null for non-existent order', () => {
      const order = orderFacade.getOrderDetails('INVALID-ID');
      expect(order).toBeNull();
    });
  });

  describe('getCustomerOrders', () => {
    it('should return all orders for a customer', () => {
      orderFacade.placeOrder('CUST-001', sampleItems);
      orderFacade.placeOrder('CUST-001', sampleItems);
      orderFacade.placeOrder('CUST-002', sampleItems);
      
      const customerOrders = orderFacade.getCustomerOrders('CUST-001');
      
      expect(customerOrders.length).toBe(2);
      customerOrders.forEach(order => {
        expect(order.getCustomerId()).toBe('CUST-001');
      });
    });

    it('should return empty array for customer with no orders', () => {
      const customerOrders = orderFacade.getCustomerOrders('CUST-999');
      expect(customerOrders.length).toBe(0);
    });
  });

  describe('getEstimatedDelivery', () => {
    it('should return estimated delivery date for existing order', () => {
      const order = orderFacade.placeOrder('CUST-001', sampleItems);
      expect(order).not.toBeNull();
      
      const estimatedDate = orderFacade.getEstimatedDelivery(order!.getId());
      
      expect(estimatedDate).toBeInstanceOf(Date);
    });

    it('should return null for non-existent order', () => {
      const estimatedDate = orderFacade.getEstimatedDelivery('INVALID-ID');
      expect(estimatedDate).toBeNull();
    });
  });

  describe('Complete Order Lifecycle', () => {
    it('should handle complete order lifecycle from placement to delivery', () => {
      // Place order
      const order = orderFacade.placeOrder('CUST-001', sampleItems);
      expect(order).not.toBeNull();
      expect(order?.getStatus()).toBe('NEW');
      
      // Process order
      const processResult = orderFacade.processOrder(order!.getId());
      expect(processResult).toBe(true);
      expect(order?.getStatus()).toBe('PROCESSING');
      
      // Ship order
      const shipResult = orderFacade.shipOrder(order!.getId());
      expect(shipResult).toBe(true);
      expect(order?.getStatus()).toBe('SHIPPED');
      expect(order?.getTrackingNumber()).toBeDefined();
      
      // Deliver order
      const deliverResult = orderFacade.deliverOrder(order!.getId());
      expect(deliverResult).toBe(true);
      expect(order?.getStatus()).toBe('DELIVERED');
    });

    it('should handle order cancellation during processing', () => {
      // Place order
      const order = orderFacade.placeOrder('CUST-001', sampleItems);
      expect(order).not.toBeNull();
      
      // Process order
      orderFacade.processOrder(order!.getId());
      expect(order?.getStatus()).toBe('PROCESSING');
      
      // Cancel order
      const cancelResult = orderFacade.cancelOrder(order!.getId());
      expect(cancelResult).toBe(true);
      expect(order?.getStatus()).toBe('CANCELLED');
    });
  });
});

